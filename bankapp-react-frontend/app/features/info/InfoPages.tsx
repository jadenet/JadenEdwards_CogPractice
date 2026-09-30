import { API_BASE } from "../../lib/api";
import type { Page } from "../../types/bank";
import { ApiRow } from "../../components/BankUi";
import { Alert } from "../../components/ui/alert";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";

export function AboutPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <section className="max-w-3xl">
      <p className="text-sm text-muted-foreground">A good banking partner</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Big on the things that matter.</h2>
      <p className="mt-4 max-w-xl text-muted-foreground">ABC Bank makes everyday money management feel a little more human. Create profiles, open accounts, and move money with clear, straightforward tools.</p>
      <div className="my-6 grid gap-3 sm:grid-cols-3">{["People at the center", "Simple by design", "Your money, your call"].map((fact, index) => <Card key={fact} className="p-4"><strong className="text-lg">0{index + 1}</strong><p className="mt-1 text-sm text-muted-foreground">{fact}</p></Card>)}</div>
      <Button onClick={() => onNavigate("users")}>Choose a profile ↗</Button>
    </section>
  );
}

export function ContactPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <Card className="p-6 sm:p-8"><p className="text-sm text-muted-foreground">Real people, real help</p><h2 className="mt-2 text-3xl font-semibold">Let's talk money.</h2><p className="mt-3 text-sm text-muted-foreground">Questions about an account or need a hand finding your way around? We're here for you.</p><a className="mt-5 inline-flex font-medium text-primary underline-offset-4 hover:underline" href="mailto:hello@abcbank.example">hello@abcbank.example ↗</a><p className="mt-2 text-xs text-muted-foreground">Mon–Fri, 8am–6pm · Sat, 9am–1pm</p></Card>
      <Card className="flex flex-col items-start justify-center bg-secondary p-6 sm:p-8"><p className="text-lg font-medium">“Good support should feel like a conversation, not a maze.”</p><p className="mt-3 text-xs text-muted-foreground">THE ABC BANK PROMISE</p><Button className="mt-5" variant="outline" onClick={() => onNavigate("data")}>Explore the data page ↗</Button></Card>
    </section>
  );
}

export function DataPage({ onNavigate, onTestConnection }: { onNavigate: (page: Page) => void; onTestConnection: () => void }) {
  return (
    <Card className="p-5 sm:p-6">
      <div><p className="text-sm text-muted-foreground">Connected to your bank</p><h2 className="mt-1 text-2xl font-semibold">Useful API endpoints</h2><p className="mt-1 text-sm text-muted-foreground">Every action below talks directly to the ABC Bank backend.</p></div>
      <Alert className="my-5 items-center"><span className="size-2 rounded-full bg-green-600" /><span className="flex-1 text-sm">API connection · <span className="text-muted-foreground">{API_BASE}</span></span><Button variant="outline" size="sm" onClick={onTestConnection}>Test connection ↻</Button></Alert>
      <div>
        <ApiRow method="GET" path="/users" description="List all users" onClick={() => onNavigate("users")} />
        <ApiRow method="POST" path="/users" description="Create a user profile" onClick={() => onNavigate("create-user")} />
        <ApiRow method="GET · PUT · DELETE" path="/users/:id" description="Find, update, or remove a user" onClick={() => onNavigate("users")} />
        <ApiRow method="GET" path="/accounts/user/:userId" description="List accounts for a profile" />
        <ApiRow method="POST" path="/accounts" description="Open an account for a profile" />
        <ApiRow method="GET · PUT · DELETE" path="/accounts/:id" description="Read, update, or close an account" />
        <ApiRow method="POST" path="/accounts/:id/deposit" description="Deposit money" />
        <ApiRow method="POST" path="/accounts/:id/withdraw" description="Withdraw money" />
        <ApiRow method="GET" path="/accounts/:id/transactions" description="View transaction history" />
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Choose a profile to view and manage its accounts.</p>
    </Card>
  );
}
