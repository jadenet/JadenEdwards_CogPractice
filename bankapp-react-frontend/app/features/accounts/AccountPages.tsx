import type { FormEvent } from "react";
import type { Account, User } from "../../types/bank";
import { fake, GenInput } from "../../components/FakeFields";

export type AccountPageProps = {
  account: Account | null;
  busy: boolean;
  editingAccount: boolean;
  setEditingAccount: (value: boolean) => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
  onDelete: () => void;
  onBack: () => void;
  onDeposit: () => void;
  onWithdraw: () => void;
  onTransactions: () => void;
};

export function AccountListPage({ accounts, user, onSelect, onCreate }: { accounts: Account[]; user: User; onSelect: (id: string) => void; onCreate: () => void }) {
  return (
    <section className="card overflow-hidden border border-base-300 bg-base-100">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-base-300 p-4 sm:p-5">
        <div><p className="text-sm text-muted-foreground">Accounts for {user.name}</p><span className="mt-1 block text-xs text-muted-foreground">{accounts.length} {accounts.length === 1 ? "account" : "accounts"}</span></div>
        <button className="btn btn-primary" onClick={onCreate} aria-label={`Open an account for ${user.name}`}>＋ Open account</button>
      </div>
      {accounts.length > 0 ? (
        <div className="p-5">{accounts.map((account, index) => <button className="btn btn-ghost h-auto min-h-0 w-full justify-start rounded-none border-t py-4 text-left text-sm font-normal" key={account.accountId} onClick={() => onSelect(account.accountId)}><span className="text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span><span className="flex-1">Account ending {account.accountId.slice(-6)}</span><span className="font-medium">${Number(account.balance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span><span aria-hidden="true">↗</span></button>)}
        </div>
      ) : <div className="flex min-h-52 flex-col items-center justify-center gap-2 p-6 text-center"><h3 className="text-base font-semibold">No accounts yet</h3><p className="max-w-sm text-sm text-muted-foreground">Open an account for {user.name} to get started.</p><button className="btn btn-outline" onClick={onCreate}>Open an account</button></div>}
    </section>
  );
}

export function AccountCreatePage({ user, busy, onSubmit }: { user: User; busy: boolean; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <section className="card grid overflow-hidden border border-base-300 bg-base-100 md:grid-cols-2">
      <div className="bg-secondary p-5 sm:p-6"><p className="text-sm text-muted-foreground">New account for {user.name}</p><h2 className="mt-2 text-2xl font-semibold">A fresh start.</h2><p className="mt-2 text-sm text-muted-foreground">Choose an account type and opening balance.</p></div>
      <form className="grid content-center gap-4 p-5 sm:p-6" onSubmit={onSubmit}>
        <label className="grid gap-2 text-sm font-medium">Account type<GenInput generate={fake.accountType} className="input input-bordered w-full" name="accountType" placeholder="e.g. Everyday, Savings" required /></label>
        <label className="grid gap-2 text-sm font-medium">Opening balance<GenInput generate={fake.balance} className="input input-bordered w-full" name="balance" type="number" min="0" step="0.01" defaultValue="0" /></label>
        <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-muted-foreground">Owned by {user.name}.</span><button className="btn btn-primary" disabled={busy}>{busy ? "Opening…" : "Open account"} ↗</button></div>
      </form>
    </section>
  );
}

export function AccountDetailsPage({ account, editingAccount, setEditingAccount, onSave, onDelete, onBack, onDeposit, onWithdraw, onTransactions, busy }: AccountPageProps) {
  return (
    <section className="mx-auto max-w-3xl">
      <button className="btn btn-ghost btn-sm mb-3" onClick={onBack}>← Back to accounts</button>
      <div className="card overflow-hidden border border-base-300 bg-base-100">
        <div className="bg-primary p-5 text-primary-content sm:p-6">
          <div className="flex items-center justify-between"><span className="text-xs font-medium text-primary-content/75">{account?.accountType || "Bank account"}</span><button className="btn btn-ghost btn-square btn-sm text-primary-content hover:text-primary" onClick={() => setEditingAccount(!editingAccount)} aria-label="Edit account">✎</button></div>
          <div className="mt-5 text-xs text-primary-content/75">Available balance</div>
          <div className="mt-1 text-4xl font-semibold">${account ? Number(account.balance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"}</div>
          <div className="mt-4 flex justify-between gap-4 text-sm"><span>{account?.userName || "No account selected"}</span><span>••• {account?.accountId.slice(-6) || "------"}</span></div>
        </div>
      </div>
      {account && <>
        <div className="my-3 grid grid-cols-3 gap-2">
          <button className="btn btn-primary btn-sm flex-col sm:btn-md" onClick={onDeposit}>＋ Deposit</button>
          <button className="btn btn-outline btn-sm flex-col sm:btn-md" onClick={onWithdraw}>↗ Withdraw</button>
          <button className="btn btn-outline btn-sm flex-col sm:btn-md" onClick={onTransactions}>↻ Activity</button>
        </div>
        <div className="card flex-row flex-wrap items-center gap-5 border border-base-300 bg-base-100 p-4 text-sm"><div><p className="text-xs text-muted-foreground">Account holder</p><strong>{account.userName}</strong></div><div className="min-w-0 flex-1"><p className="text-xs text-muted-foreground">Account ID</p><strong className="break-all font-mono text-xs">{account.accountId}</strong></div><button className="btn btn-error btn-sm" onClick={onDelete}>Close account</button></div>
      </>}
      {editingAccount && account && <AccountEditForm busy={busy} onSave={onSave} onClose={() => setEditingAccount(false)} />}
    </section>
  );
}

function AccountEditForm({ busy, onSave, onClose }: { busy: boolean; onSave: AccountPageProps["onSave"]; onClose: () => void }) {
  return (
    <div className="card mt-3 border border-base-300 bg-base-100 p-4 sm:p-5">
      <form className="grid gap-4" onSubmit={onSave}>
        <div className="flex items-center justify-between"><strong>Update account</strong><button type="button" className="btn btn-ghost btn-square btn-sm" onClick={onClose} aria-label="Close">×</button></div>
        <label className="grid gap-2 text-sm font-medium">New account type<GenInput generate={fake.accountType} className="input input-bordered w-full" name="accountType" placeholder="Leave blank to keep current" /></label>
        <button className="btn btn-primary justify-self-start" disabled={busy}>Save account</button>
      </form>
    </div>
  );
}
