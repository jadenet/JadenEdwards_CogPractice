import type { FormEvent } from "react";
import { EmptyState, Field } from "../../components/BankUi";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import type { Account, User } from "../../types/bank";

export type AccountPageProps = {
  account: Account | null;
  busy: boolean;
  editingAccount: boolean;
  setEditingAccount: (value: boolean) => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
  onDelete: () => void;
  onDeposit: () => void;
  onWithdraw: () => void;
  onTransactions: () => void;
};

export function AccountListPage({ accounts, user, onSelect, onCreate }: { accounts: Account[]; user: User; onSelect: (id: string) => void; onCreate: () => void }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
        <div><p className="text-sm text-muted-foreground">Accounts for {user.name}</p><span className="mt-1 block text-xs text-muted-foreground">{accounts.length} {accounts.length === 1 ? "account" : "accounts"}</span></div>
        <Button onClick={onCreate} aria-label={`Open an account for ${user.name}`}>＋ Open account</Button>
      </div>
      {accounts.length > 0 ? (
        <div className="p-5">{accounts.map((account, index) => <button className="flex w-full items-center gap-3 border-t py-4 text-left text-sm hover:bg-muted/40" key={account.accountId} onClick={() => onSelect(account.accountId)}><span className="text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span><span className="flex-1">Account ending {account.accountId.slice(-6)}</span><span className="font-medium">${Number(account.balance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span><span aria-hidden="true">↗</span></button>)}
        </div>
      ) : <EmptyState title="No accounts yet" detail={`Open an account for ${user.name} to get started.`} action="Open an account" onClick={onCreate} />}
    </Card>
  );
}

export function AccountCreatePage({ user, busy, onSubmit }: { user: User; busy: boolean; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <Card className="grid overflow-hidden md:grid-cols-2">
      <div className="bg-secondary p-6 md:p-8"><p className="text-sm text-muted-foreground">New account for {user.name}</p><h2 className="mt-2 text-2xl font-semibold">A fresh start.</h2><p className="mt-2 text-sm text-muted-foreground">Give this account a name and opening balance.</p></div>
      <form className="grid content-center gap-4 p-6 md:p-8" onSubmit={onSubmit}>
        <Field label="Account type" name="accountType" placeholder="e.g. Everyday, Savings" required />
        <Field label="Opening balance" name="balance" type="number" min="0" step="0.01" defaultValue="0" />
        <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-muted-foreground">Owned by {user.name}.</span><Button disabled={busy}>{busy ? "Opening…" : "Open account"} ↗</Button></div>
      </form>
    </Card>
  );
}

export function AccountDetailsPage({ account, editingAccount, setEditingAccount, onSave, onDelete, onDeposit, onWithdraw, onTransactions, busy }: AccountPageProps) {
  return (
    <section className="mx-auto max-w-3xl">
      <Card className="overflow-hidden">
        <div className="bg-primary p-6 text-primary-foreground">
          <div className="flex items-center justify-between"><span className="text-xs font-medium uppercase tracking-wide text-primary-foreground/70">ABC Everyday</span><Button variant="ghost" size="icon" className="text-primary-foreground hover:text-primary" onClick={() => setEditingAccount(!editingAccount)} aria-label="Edit account">✎</Button></div>
          <div className="mt-5 text-xs text-primary-foreground/70">Available balance</div>
          <div className="mt-1 text-4xl font-semibold">${account ? Number(account.balance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"}</div>
          <div className="mt-4 flex justify-between gap-4 text-sm"><span>{account?.userName || "No account selected"}</span><span>••• {account?.accountId.slice(-6) || "------"}</span></div>
        </div>
      </Card>
      {account && <>
        <div className="my-3 grid grid-cols-3 gap-2">
          <Button variant="outline" className="h-auto flex-col py-4" onClick={onDeposit}>＋<span>Deposit</span></Button>
          <Button variant="outline" className="h-auto flex-col py-4" onClick={onWithdraw}>↗<span>Withdraw</span></Button>
          <Button variant="outline" className="h-auto flex-col py-4" onClick={onTransactions}>↻<span>Activity</span></Button>
        </div>
        <Card className="flex flex-wrap items-center gap-5 p-4 text-sm"><div><p className="text-xs text-muted-foreground">Account holder</p><strong>{account.userName}</strong></div><div className="min-w-0 flex-1"><p className="text-xs text-muted-foreground">Account ID</p><strong className="break-all font-mono text-xs">{account.accountId}</strong></div><Button variant="destructive" size="sm" onClick={onDelete}>Close account</Button></Card>
      </>}
      {editingAccount && account && <AccountEditForm busy={busy} onSave={onSave} onClose={() => setEditingAccount(false)} />}
    </section>
  );
}

function AccountEditForm({ busy, onSave, onClose }: { busy: boolean; onSave: AccountPageProps["onSave"]; onClose: () => void }) {
  return (
    <Card className="mt-3 p-5">
      <form className="grid gap-4" onSubmit={onSave}>
        <div className="flex items-center justify-between"><strong>Update account</strong><Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close">×</Button></div>
        <Field label="New account type" name="accountType" placeholder="Leave blank to keep current" />
        <Button className="justify-self-start" disabled={busy}>Save account</Button>
      </form>
    </Card>
  );
}
