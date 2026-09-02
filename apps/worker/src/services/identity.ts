/* eslint-disable */

import type { AuthenticatedSession, IdentityProvider, LoginInput, OwnerBootstrapInput, Session, User } from '@community-os/core-types';

import type { D1Database } from '../types';

interface UserRow {
  id: string;
  installation_id: string;
  email: string;
  display_name: string;
  status: string;
  is_owner: number;
  created_at: string;
  updated_at: string;
}

interface SessionRow {
  id: string;
  user_id: string;
  expires_at: string;
  created_at: string;
  last_seen_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

const encoder = new TextEncoder();
const DEFAULT_SESSION_TTL_HOURS = 12;
const PBKDF2_ITERATIONS = 210_000;

function toBase64(bytes: Uint8Array): string {
  let output = '';
  for (const byte of bytes) {
    output += String.fromCharCode(byte);
  }
  return btoa(output);
}

function fromBase64(value: string): Uint8Array {
  const raw = atob(value);
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

function addHours(date: Date, hours: number): string {
  const next = new Date(date);
  next.setHours(next.getHours() + hours);
  return next.toISOString();
}

export class IdentityService implements IdentityProvider {
  public constructor(private readonly db: D1Database) {}

  public async bootstrapOwner(input: OwnerBootstrapInput): Promise<User> {
    const existing = await this.db.prepare('SELECT COUNT(*) AS count FROM users').first<{ count: number | string }>();
    const count = Number(existing?.count ?? 0);
    if (count > 0) {
      throw new Error('Owner bootstrap has already been completed.');
    }

    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const passwordHash = await this.hashPassword(input.password);

    await this.db
      .prepare(
        `INSERT INTO users (id, installation_id, email, password_hash, display_name, status, is_owner, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 'active', 1, ?, ?)`,
      )
      .bind(id, input.installationId, input.email.toLowerCase(), passwordHash, input.displayName, now, now)
      .run();

    return {
      id,
      installationId: input.installationId,
      email: input.email.toLowerCase(),
      displayName: input.displayName,
      status: 'active',
      isOwner: true,
      roleIds: [],
      permissionKeys: [],
      createdAt: now,
      updatedAt: now,
    };
  }

  public async authenticate(input: LoginInput): Promise<AuthenticatedSession | null> {
    const userRow = await this.db
      .prepare(
        `SELECT id, installation_id, email, display_name, status, is_owner, created_at, updated_at
         FROM users WHERE installation_id = ? AND email = ?`,
      )
      .bind(input.installationId, input.email.toLowerCase())
      .first<UserRow>();

    if (!userRow) {
      return null;
    }

    const passwordRecord = await this.db
      .prepare('SELECT password_hash FROM users WHERE id = ?')
      .bind(userRow.id)
      .first<{ password_hash: string }>();

    if (!passwordRecord) {
      return null;
    }

    const valid = await this.verifyPassword(input.password, passwordRecord.password_hash);
    if (!valid) {
      return null;
    }

    const now = new Date();
    const sessionToken = crypto.randomUUID();
    const sessionId = crypto.randomUUID();
    const expiresAt = addHours(now, DEFAULT_SESSION_TTL_HOURS);
    const tokenHash = await this.digest(sessionToken);

    await this.db
      .prepare(
        `INSERT INTO sessions (id, user_id, installation_id, session_token_hash, expires_at, ip_address, user_agent, created_at, last_seen_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        sessionId,
        userRow.id,
        userRow.installation_id,
        tokenHash,
        expiresAt,
        input.ipAddress ?? null,
        input.userAgent ?? null,
        now.toISOString(),
        now.toISOString(),
      )
      .run();

    return {
      sessionToken,
      session: this.toSession(
        {
          id: sessionId,
          user_id: userRow.id,
          expires_at: expiresAt,
          created_at: now.toISOString(),
          last_seen_at: now.toISOString(),
          ip_address: input.ipAddress ?? null,
          user_agent: input.userAgent ?? null,
        },
        userRow.installation_id,
      ),
      user: this.toUser(userRow),
    };
  }

  public async getSession(sessionToken: string): Promise<AuthenticatedSession | null> {
    const tokenHash = await this.digest(sessionToken);
    const record = await this.db
      .prepare(
        `SELECT
           s.id AS session_id,
           s.user_id,
           s.installation_id,
           s.expires_at,
           s.created_at,
           s.last_seen_at,
           s.ip_address,
           s.user_agent,
           u.id,
           u.installation_id AS user_installation_id,
           u.email,
           u.display_name,
           u.status,
           u.is_owner,
           u.created_at AS user_created_at,
           u.updated_at AS user_updated_at
         FROM sessions s
         INNER JOIN users u ON u.id = s.user_id
         WHERE s.session_token_hash = ? AND s.revoked_at IS NULL`,
      )
      .bind(tokenHash)
      .first<{
        session_id: string;
        user_id: string;
        installation_id: string;
        expires_at: string;
        created_at: string;
        last_seen_at: string;
        ip_address: string | null;
        user_agent: string | null;
        id: string;
        user_installation_id: string;
        email: string;
        display_name: string;
        status: string;
        is_owner: number;
        user_created_at: string;
        user_updated_at: string;
      }>();

    if (!record || new Date(record.expires_at).getTime() <= Date.now()) {
      return null;
    }

    const lastSeenAt = new Date().toISOString();
    await this.db.prepare('UPDATE sessions SET last_seen_at = ? WHERE id = ?').bind(lastSeenAt, record.session_id).run();

    return {
      sessionToken,
      session: {
        id: record.session_id,
        installationId: record.installation_id,
        userId: record.user_id,
        expiresAt: record.expires_at,
        issuedAt: record.created_at,
        lastSeenAt,
        ipAddress: record.ip_address ?? undefined,
        userAgent: record.user_agent ?? undefined,
      },
      user: {
        id: record.id,
        installationId: record.user_installation_id,
        email: record.email,
        displayName: record.display_name,
        status: record.status === 'disabled' ? 'disabled' : 'active',
        isOwner: record.is_owner === 1,
        roleIds: [],
        permissionKeys: [],
        createdAt: record.user_created_at,
        updatedAt: record.user_updated_at,
      },
    };
  }

  public async invalidateSession(sessionToken: string): Promise<void> {
    const tokenHash = await this.digest(sessionToken);
    await this.db
      .prepare('UPDATE sessions SET revoked_at = ? WHERE session_token_hash = ? AND revoked_at IS NULL')
      .bind(new Date().toISOString(), tokenHash)
      .run();
  }

  private toUser(row: UserRow): User {
    return {
      id: row.id,
      installationId: row.installation_id,
      email: row.email,
      displayName: row.display_name,
      status: row.status === 'disabled' ? 'disabled' : 'active',
      isOwner: row.is_owner === 1,
      roleIds: [],
      permissionKeys: [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private toSession(row: SessionRow, installationId: string): Session {
    return {
      id: row.id,
      installationId,
      userId: row.user_id,
      expiresAt: row.expires_at,
      issuedAt: row.created_at,
      lastSeenAt: row.last_seen_at,
      ipAddress: row.ip_address ?? undefined,
      userAgent: row.user_agent ?? undefined,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt,
        iterations: PBKDF2_ITERATIONS,
        hash: 'SHA-256',
      },
      keyMaterial,
      256,
    );

    return `pbkdf2$${PBKDF2_ITERATIONS}$${toBase64(salt)}$${toBase64(new Uint8Array(derivedBits))}`;
  }

  private async verifyPassword(password: string, storedValue: string): Promise<boolean> {
    const [algorithm, iterationText, saltText, hashText] = storedValue.split('$');
    if (algorithm !== 'pbkdf2' || !iterationText || !saltText || !hashText) {
      return false;
    }

    const iterations = Number(iterationText);
    const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: fromBase64(saltText),
        iterations,
        hash: 'SHA-256',
      },
      keyMaterial,
      256,
    );

    const computed = toBase64(new Uint8Array(derivedBits));
    return computed === hashText;
  }

  private async digest(value: string): Promise<string> {
    const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
    return toBase64(new Uint8Array(digest));
  }
}
