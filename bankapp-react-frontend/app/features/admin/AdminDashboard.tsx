import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  createAccount,
  createTransaction,
  createUser,
  deleteAccount,
  deleteTransaction,
  deleteUser,
  listAllAccounts,
  listAllTransactions,
  listUsers,
  updateAccount,
  updateTransaction,
  updateUser,
} from "../../lib/bankingApi";
import type { Account, AdminTransaction, Transaction, User } from "../../types/bank";
import { fake, GenInput, GenSelect } from "../../components/FakeFields";
import { Toast } from "../../components/Layout";

type Tab = "users" | "accounts" | "transactions";
type Editing<T> = { mode: "create" } | { mode: "edit"; item: T } | null;

const money = (value: number) => `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const shortId = (id: string) => `…${id.slice(-6)}`;

export function AdminDashboard({ currentUserId }: { currentUserId: string }) {
  const [tab, setTab] = useState<Tab>("users");
  const [users, setUsers] = useState<User[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const [editingUser, setEditingUser] = useState<Editing<User>>(null);
  const [editingAccount, setEditingAccount] = useState<Editing<Account>>(null);
  const [editingTxn, setEditingTxn] = useState<Editing<AdminTransaction>>(null);

  async function refresh() {
    const [nextUsers, nextAccounts, nextTransactions] = await Promise.all([listUsers(), listAllAccounts(), listAllTransactions()]);
    setUsers(nextUsers);
    setAccounts(nextAccounts);
    setTransactions(nextTransactions);
  }

  async function run(action: () => Promise<unknown>, message?: string) {
    setBusy(true);
    setStatus(null);
    try {
      await action();
      await refresh();
      if (message) setStatus({ message, isError: false });
      return true;
    } catch (cause) {
      setStatus({ message: cause instanceof Error ? cause.message : "Something went wrong.", isError: true });
      return false;
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { void run(async () => undefined); }, []);

  const ownerName = (userId: string) => users.find((user) => user.user_id === userId)?.name ?? "Unknown";
  const accountLabel = (accountId: string) => {
    const account = accounts.find((item) => item.accountId === accountId);
    return account ? `${account.userName} · ${account.accountType ?? "Account"} ${shortId(accountId)}` : shortId(accountId);
  };

  async function submitUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") || "");
    const body = {
      name: String(data.get("name")),
      email: String(data.get("email")),
      username: String(data.get("username")),
      role: String(data.get("role")) as User["role"],
      ...(password ? { password } : {}),
    };
    const editing = editingUser;
    const ok = await run(
      () => editing?.mode === "edit" ? updateUser(editing.item.user_id, body) : createUser(body),
      editing?.mode === "edit" ? "User updated." : "User created.",
    );
    if (ok) setEditingUser(null);
  }

  async function submitAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userId = String(data.get("userId"));
    const accountType = String(data.get("accountType"));
    const editing = editingAccount;
    const ok = await run(
      () => editing?.mode === "edit"
        ? updateAccount(editing.item.accountId, { userId, accountType })
        : createAccount({ userId, accountType, balance: Number(data.get("balance") || 0) }),
      editing?.mode === "edit" ? "Account updated." : "Account created.",
    );
    if (ok) setEditingAccount(null);
  }

  async function submitTransaction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const type = String(data.get("type")) as Transaction["type"];
    const amount = Number(data.get("amount"));
    const editing = editingTxn;
    const ok = await run(
      () => editing?.mode === "edit"
        ? updateTransaction(editing.item.transactionId, { type, amount })
        : createTransaction({ accountId: String(data.get("accountId")), type, amount }),
      editing?.mode === "edit" ? "Transaction updated and balance adjusted." : "Transaction recorded.",
    );
    if (ok) setEditingTxn(null);
  }

  function confirmDelete(label: string, action: () => Promise<unknown>, message: string) {
    if (window.confirm(`Delete ${label}? This cannot be undone.`)) void run(action, message);
  }

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "users", label: "Users", count: users.length },
    { id: "accounts", label: "Accounts", count: accounts.length },
    { id: "transactions", label: "Transactions", count: transactions.length },
  ];

  return (
    <section className="grid gap-4" aria-busy={busy}>
      <div className="grid gap-3 sm:grid-cols-3">
        {tabs.map((item) => (
          <button key={item.id} className={`card border p-4 text-left transition-colors ${tab === item.id ? "border-primary bg-primary text-primary-content" : "border-base-300 bg-base-100 hover:bg-base-200"}`} onClick={() => setTab(item.id)}>
            <span className="text-xs opacity-75">{item.label}</span>
            <strong className="mt-1 text-2xl">{item.count}</strong>
          </button>
        ))}
      </div>

      {status && <Toast key={status.message} message={status.message} isError={status.isError} onDismiss={() => setStatus(null)} />}

      {tab === "users" && (
        <Panel title="All users" onAdd={() => setEditingUser({ mode: "create" })}>
          {editingUser && (
            <form key={editingUser.mode === "edit" ? editingUser.item.user_id : "new"} className="grid gap-3 border-b border-base-300 bg-base-200/60 p-4 sm:grid-cols-2 lg:grid-cols-3" onSubmit={submitUser}>
              <Field label="Full name"><GenInput generate={fake.name} className="input input-bordered w-full" name="name" defaultValue={editingUser.mode === "edit" ? editingUser.item.name : ""} required /></Field>
              <Field label="Email"><GenInput generate={fake.email} className="input input-bordered w-full" name="email" type="email" defaultValue={editingUser.mode === "edit" ? editingUser.item.email : ""} required /></Field>
              <Field label="Username"><GenInput generate={fake.username} className="input input-bordered w-full" name="username" defaultValue={editingUser.mode === "edit" ? editingUser.item.username ?? "" : ""} required /></Field>
              <Field label={editingUser.mode === "edit" ? "New password (optional)" : "Password"}><GenInput generate={fake.password} className="input input-bordered w-full" name="password" type="password" autoComplete="new-password" minLength={5} required={editingUser.mode === "create"} /></Field>
              <Field label="Role"><GenSelect className="select select-bordered w-full" name="role" defaultValue={editingUser.mode === "edit" ? editingUser.item.role ?? "user" : "user"}><option value="user">User</option><option value="admin">Admin</option></GenSelect></Field>
              <FormActions busy={busy} onCancel={() => setEditingUser(null)} />
            </form>
          )}
          <Table headers={["Name", "Username", "Email", "Role", ""]}>
            {users.map((user) => (
              <tr key={user.user_id} className="hover">
                <td className="font-medium">{user.name}</td>
                <td>{user.username ?? <span className="text-base-content/50">—</span>}</td>
                <td>{user.email}</td>
                <td><span className={`badge ${user.role === "admin" ? "badge-primary" : "badge-outline"}`}>{user.role ?? "user"}</span></td>
                <td><RowActions
                  onEdit={() => setEditingUser({ mode: "edit", item: user })}
                  onDelete={user.user_id === currentUserId ? undefined : () => confirmDelete(user.name, () => deleteUser(user.user_id), "User and their accounts deleted.")}
                /></td>
              </tr>
            ))}
          </Table>
        </Panel>
      )}

      {tab === "accounts" && (
        <Panel title="All accounts" onAdd={() => setEditingAccount({ mode: "create" })}>
          {editingAccount && (
            <form key={editingAccount.mode === "edit" ? editingAccount.item.accountId : "new"} className="grid gap-3 border-b border-base-300 bg-base-200/60 p-4 sm:grid-cols-2 lg:grid-cols-3" onSubmit={submitAccount}>
              <Field label="Owner"><GenSelect className="select select-bordered w-full" name="userId" defaultValue={editingAccount.mode === "edit" ? editingAccount.item.userId : ""} required><option value="" disabled>Choose a user</option>{users.map((user) => <option key={user.user_id} value={user.user_id}>{user.name}</option>)}</GenSelect></Field>
              <Field label="Account type"><GenInput generate={fake.accountType} className="input input-bordered w-full" name="accountType" defaultValue={editingAccount.mode === "edit" ? editingAccount.item.accountType ?? "" : ""} required /></Field>
              {editingAccount.mode === "create" && <Field label="Opening balance"><GenInput generate={fake.balance} className="input input-bordered w-full" name="balance" type="number" min="0" step="0.01" defaultValue="0" /></Field>}
              <FormActions busy={busy} onCancel={() => setEditingAccount(null)} />
            </form>
          )}
          <Table headers={["Account", "Owner", "Type", "Balance", ""]}>
            {accounts.map((account) => (
              <tr key={account.accountId} className="hover">
                <td className="font-mono text-xs">{account.accountId}</td>
                <td>{account.userName}</td>
                <td>{account.accountType ?? "—"}</td>
                <td className="font-medium">{money(account.balance)}</td>
                <td><RowActions
                  onEdit={() => setEditingAccount({ mode: "edit", item: account })}
                  onDelete={() => confirmDelete(`account ${shortId(account.accountId)}`, () => deleteAccount(account.accountId), "Account deleted.")}
                /></td>
              </tr>
            ))}
          </Table>
        </Panel>
      )}

      {tab === "transactions" && (
        <Panel title="All transactions" onAdd={() => setEditingTxn({ mode: "create" })}>
          {editingTxn && (
            <form key={editingTxn.mode === "edit" ? editingTxn.item.transactionId : "new"} className="grid gap-3 border-b border-base-300 bg-base-200/60 p-4 sm:grid-cols-2 lg:grid-cols-3" onSubmit={submitTransaction}>
              {editingTxn.mode === "create"
                ? <Field label="Account"><GenSelect className="select select-bordered w-full" name="accountId" defaultValue="" required><option value="" disabled>Choose an account</option>{accounts.map((account) => <option key={account.accountId} value={account.accountId}>{accountLabel(account.accountId)}</option>)}</GenSelect></Field>
                : <Field label="Account"><input className="input input-bordered w-full" value={accountLabel(editingTxn.item.accountId)} disabled /></Field>}
              <Field label="Type"><GenSelect className="select select-bordered w-full" name="type" defaultValue={editingTxn.mode === "edit" ? editingTxn.item.type : "DEPOSIT"}><option value="DEPOSIT">Deposit</option><option value="WITHDRAW">Withdraw</option></GenSelect></Field>
              <Field label="Amount"><GenInput generate={fake.amount} className="input input-bordered w-full" name="amount" type="number" min="0.01" step="0.01" defaultValue={editingTxn.mode === "edit" ? editingTxn.item.amount : ""} required /></Field>
              <FormActions busy={busy} onCancel={() => setEditingTxn(null)} />
            </form>
          )}
          <Table headers={["Date", "Account", "Owner", "Type", "Amount", ""]}>
            {transactions.map((txn) => (
              <tr key={txn.transactionId} className="hover">
                <td className="whitespace-nowrap text-xs">{new Date(txn.date).toLocaleString()}</td>
                <td className="font-mono text-xs">{shortId(txn.accountId)}</td>
                <td>{ownerName(accounts.find((account) => account.accountId === txn.accountId)?.userId ?? "")}</td>
                <td><span className={`badge ${txn.type === "DEPOSIT" ? "badge-success" : "badge-warning"}`}>{txn.type}</span></td>
                <td className="font-medium">{money(txn.amount)}</td>
                <td><RowActions
                  onEdit={() => setEditingTxn({ mode: "edit", item: txn })}
                  onDelete={() => confirmDelete("this transaction", () => deleteTransaction(txn.transactionId), "Transaction deleted and balance reversed.")}
                /></td>
              </tr>
            ))}
          </Table>
        </Panel>
      )}
    </section>
  );
}

function Panel({ title, onAdd, children }: { title: string; onAdd: () => void; children: ReactNode }) {
  return (
    <div className="card overflow-hidden border border-base-300 bg-base-100">
      <div className="flex items-center justify-between gap-3 border-b border-base-300 p-4">
        <h2 className="font-semibold">{title}</h2>
        <button className="btn btn-primary btn-sm" onClick={onAdd}>＋ Add</button>
      </div>
      {children}
    </div>
  );
}

function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-sm">
        <thead><tr>{headers.map((header, index) => <th key={index}>{header || <span className="sr-only">Actions</span>}</th>)}</tr></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-1 text-sm font-medium">{label}{children}</label>;
}

function FormActions({ busy, onCancel }: { busy: boolean; onCancel: () => void }) {
  return (
    <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-3">
      <button className="btn btn-primary" disabled={busy}>{busy ? "Saving…" : "Save"}</button>
      <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
    </div>
  );
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete?: () => void }) {
  return (
    <div className="flex justify-end gap-2">
      <button className="btn btn-ghost btn-sm" onClick={onEdit}>Edit</button>
      {onDelete && <button className="btn btn-error btn-outline btn-sm" onClick={onDelete}>Delete</button>}
    </div>
  );
}
