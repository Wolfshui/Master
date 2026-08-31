
import { useState } from 'react';

import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function SetupPage() {
  const [displayName, setDisplayName] = useState('Platform Owner');
  const [email, setEmail] = useState('owner@example.com');

  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-950">Bootstrap the first owner</h2>
        <p className="text-sm text-slate-600">
          This step seeds the initial protected owner account and should only succeed on an empty installation.
        </p>
      </header>
      <div className="space-y-4">
        <Input label="Display name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
        <Input label="Email address" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <Input label="Password" type="password" hint="Use a long passphrase; owner credentials are break-glass access." />
        <Button className="w-full">Create owner account</Button>
      </div>
    </section>
  );
}
