
import { useState } from 'react';

import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function LoginPage() {
  const [email, setEmail] = useState('owner@example.com');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const emailError = submitted && !email.includes('@') ? 'Enter a valid email address.' : undefined;
  const passwordError = submitted && password.length < 8 ? 'Password must be at least 8 characters.' : undefined;

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-950">Sign in</h2>
        <p className="text-sm text-slate-600">Use your owner or staff credentials to access the operations console.</p>
      </header>
      <Input
        autoComplete="email"
        error={emailError}
        hint="Owner setup is limited to the first successful bootstrap."
        label="Email address"
        name="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Input
        autoComplete="current-password"
        error={passwordError}
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button className="w-full" type="submit">
        Continue to dashboard
      </Button>
    </form>
  );
}
