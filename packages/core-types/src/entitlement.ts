
export type PurchaseType = 'free' | 'one_time' | 'subscription' | 'seat_based';

export interface LicenseKey {
  value: string;
  issuedAt: string;
  expiresAt?: string;
  signature: string;
}

export interface Entitlement {
  id: string;
  installationId: string;
  moduleId: string;
  purchaseType: PurchaseType;
  status: 'active' | 'expired' | 'revoked' | 'pending';
  seats?: number;
  validFrom: string;
  validUntil?: string;
  licenseKey?: LicenseKey;
}
