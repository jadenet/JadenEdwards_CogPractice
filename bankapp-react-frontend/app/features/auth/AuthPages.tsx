import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { homePathFor, useAuth } from "../../hooks/useAuth";
import type { User } from "../../types/bank";
import { fake, GenInput } from "../../components/FakeFields";

function useAuthForm(action: (data: FormData) => Promise<User>) {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const from = (location.state as { from?: string } | null)?.from;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const user = await action(new FormData(event.currentTarget));
      navigate(from ?? homePathFor(user), { replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return { error, busy, onSubmit };
}

function AuthCard({ eyebrow, heading, blurb, children }: { eyebrow: string; heading: string; blurb: string; children: ReactNode }) {
  return (
    <section className="card mx-auto grid max-w-4xl overflow-hidden border border-base-300 bg-base-100 md:grid-cols-2">
      <div className="bg-primary p-6 text-primary-content sm:p-8">
        <p className="text-sm text-primary-content/75">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold">{heading}</h2>
        <p className="mt-2 text-sm text-primary-content/80">{blurb}</p>
      </div>
      {children}
    </section>
  );
}

export function LoginPage() {
  const { login } = useAuth();
  const { error, busy, onSubmit } = useAuthForm((data) => login(String(data.get("username")), String(data.get("password"))));

  return (
    <AuthCard eyebrow="Welcome back" heading="Log in to ABC Bank." blurb="Sign in to see your balances, move money and review activity.">
      <form className="grid content-center gap-4 p-6 sm:p-8" onSubmit={onSubmit}>
        {error && <div role="alert" className="alert alert-error text-sm">{error}</div>}
        <div className="rounded border border-base-300 bg-base-200 p-3 text-sm">
          <p className="font-semibold">Example logins</p>
          <p>Username: <code>alex123</code> / Password: <code>password123</code></p>
          <p>Username: <code>admin</code> / Password: <code>admin</code></p>
        </div>
        <label className="grid gap-2 text-sm font-medium">Username<GenInput generate={fake.username} className="input input-bordered w-full" name="username" autoComplete="username" required /></label>
        <label className="grid gap-2 text-sm font-medium">Password<GenInput generate={fake.password} className="input input-bordered w-full" name="password" type="password" autoComplete="current-password" required /></label>
        <button className="btn btn-primary" disabled={busy}>{busy ? "Logging in…" : "Log in"}</button>
        <p className="text-center text-sm text-base-content/70">New to ABC Bank? <Link className="link link-primary" to="/signup">Sign up</Link></p>
      </form>
    </AuthCard>
  );
}

export function SignupPage() {
  const { register } = useAuth();
  const { error, busy, onSubmit } = useAuthForm((data) => register({
    name: String(data.get("name")),
    email: String(data.get("email")),
    username: String(data.get("username")),
    password: String(data.get("password")),
  }));

  return (
    <AuthCard eyebrow="People first" heading="Open your ABC Bank profile." blurb="Create a login, then open your first account in a couple of clicks.">
      <form className="grid content-center gap-4 p-6 sm:p-8" onSubmit={onSubmit}>
        {error && <div role="alert" className="alert alert-error text-sm">{error}</div>}
        <label className="grid gap-2 text-sm font-medium">Full name<GenInput generate={fake.name} className="input input-bordered w-full" name="name" autoComplete="name" placeholder="e.g. Alex Morgan" required /></label>
        <label className="grid gap-2 text-sm font-medium">Email address<GenInput generate={fake.email} className="input input-bordered w-full" name="email" type="email" autoComplete="email" placeholder="alex@example.com" required /></label>
        <label className="grid gap-2 text-sm font-medium">Username<GenInput generate={fake.username} className="input input-bordered w-full" name="username" autoComplete="username" pattern="[a-zA-Z0-9_.\-]{3,30}" title="3-30 letters, numbers, dots, dashes or underscores" required /></label>
        <label className="grid gap-2 text-sm font-medium">Password<GenInput generate={fake.password} className="input input-bordered w-full" name="password" type="password" autoComplete="new-password" minLength={8} required /></label>
        <button className="btn btn-primary" disabled={busy}>{busy ? "Creating…" : "Sign up"}</button>
        <p className="text-center text-sm text-base-content/70">Already have a login? <Link className="link link-primary" to="/login">Log in</Link></p>
      </form>
    </AuthCard>
  );
}
