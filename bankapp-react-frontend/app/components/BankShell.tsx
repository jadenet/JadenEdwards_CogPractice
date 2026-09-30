import type { ReactNode } from "react";
import type { Account, Page } from "../types/bank";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";

const primaryLinks: { id: Page; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
  { id: "data", label: "Data" },
];

const pageTitles: Record<Page, string> = {
  home: "Your money, in good company.",
  users: "People & profiles",
  "create-user": "Create a user",
  accounts: "Your accounts",
  "create-account": "Open an account",
  "account-details": "Account details",
  deposit: "Add money",
  withdraw: "Move money out",
  transactions: "Account activity",
  about: "A bank for real life",
  contact: "Here when you need us",
  data: "Your banking data",
};

type BankShellProps = {
  page: Page;
  account: Account | null;
  notice: string;
  error: string;
  onNavigate: (page: Page) => void;
  onDismissAlert: () => void;
  children: ReactNode;
};

export function BankShell({ page, account, notice, error, onNavigate, onDismissAlert, children }: BankShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <button className="flex items-center gap-2 text-left" onClick={() => onNavigate("home")} aria-label="ABC Bank home">
            <span className="flex h-9 items-center rounded-md bg-primary px-2 text-xs font-semibold tracking-[0.2em] text-primary-foreground">ABC</span>
            <span className="font-semibold">Bank</span>
          </button>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {primaryLinks.map((link) => <Button key={link.id} variant="ghost" size="sm" className={page === link.id ? "bg-muted" : ""} onClick={() => onNavigate(link.id)}>{link.label}</Button>)}
          </nav>
          <Button size="sm" onClick={() => onNavigate("users")}>Sign in / Sign up <span aria-hidden="true">↗</span></Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl">
        <main className="min-w-0 px-4 py-6 sm:px-6 lg:py-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{page === "home" ? new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : `ABC Bank / ${page.replaceAll("-", " ")}`}</p>
              <h1 className="text-2xl font-semibold tracking-tight">{pageTitles[page]}</h1>
            </div>
            {account && <Button variant="outline" size="sm" onClick={() => onNavigate("account-details")}>Account · {account.accountId.slice(-6)} ↗</Button>}
          </div>

          {(notice || error) && <Alert variant={error ? "destructive" : "default"}><span aria-hidden="true">{error ? "!" : "✓"}</span><AlertDescription className="flex-1">{error || notice}</AlertDescription><Button variant="ghost" size="icon" className="-my-2 size-8" onClick={onDismissAlert} aria-label="Dismiss">×</Button></Alert>}

          <div className="mt-5">{children}</div>
          <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t py-5 text-xs text-muted-foreground">
            <button className="font-semibold text-foreground" onClick={() => onNavigate("home")}>ABC BANK</button>
            <span>Everyday banking, made simple.</span>
            <div className="flex gap-3">{(["about", "contact", "data"] as Page[]).map((item) => <button key={item} onClick={() => onNavigate(item)} className="capitalize hover:text-foreground">{item}</button>)}</div>
          </footer>
        </main>
      </div>
    </div>
  );
}
