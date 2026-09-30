import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { apiRequest } from "../lib/api";
import type { Account, Page, Transaction, User } from "../types/bank";

export function useBanking() {
  const [page, setPage] = useState<Page>("home");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [account, setAccount] = useState<Account | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [userId, setUserId] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingAccount, setEditingAccount] = useState(false);

  useEffect(() => {
    void loadUsers();
  }, []);

  async function run<T>(action: () => Promise<T>, success?: (result: T) => void, message?: string) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await action();
      success?.(result);
      if (message) setNotice(message);
      return result;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again.");
      return undefined;
    } finally {
      setBusy(false);
    }
  }

  async function loadUsers() {
    await run(() => apiRequest<User[]>("/users"), setUsers);
  }

  function rememberAccount(next: Account) {
    setAccount(next);
    setAccounts((current) => [next, ...current.filter((item) => item.accountId !== next.accountId)]);
  }

  async function selectUser(user: User) {
    setSelectedUser(user);
    setAccount(null);
    setTransactions([]);
    const result = await run(
      () => apiRequest<Account[]>(`/accounts/user/${encodeURIComponent(user.user_id)}`),
      setAccounts,
    );
    if (result) setPage("accounts");
  }

  async function selectAccount(id: string) {
    if (!selectedUser) return setError("Choose a profile before opening an account.");
    const found = await run(() => apiRequest<Account>(`/accounts/${encodeURIComponent(id)}`), rememberAccount, "Account loaded.");
    if (found) setPage("account-details");
  }

  async function findUser(id = userId) {
    if (!id.trim()) return setError("Enter a user ID to continue.");
    const found = await run(() => apiRequest<User>(`/users/${encodeURIComponent(id.trim())}`), setEditingUser, "User found.");
    if (found) setPage("users");
  }

  async function loadTransactions() {
    if (!account) return setError("Open an account to view its activity.");
    const result = await run(() => apiRequest<Transaction[]>(`/accounts/${encodeURIComponent(account.accountId)}/transactions`), setTransactions);
    if (result) setPage("transactions");
  }

  async function submitUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const body = { name: String(data.get("name")), email: String(data.get("email")) };
    const selected = editingUser;
    const path = selected ? `/users/${encodeURIComponent(selected.user_id)}` : "/users";
    const result = await run(
      () => apiRequest<User>(path, { method: selected ? "PUT" : "POST", body: JSON.stringify(body) }),
      (user) => {
        setUsers((current) => selected ? current.map((item) => item.user_id === user.user_id ? user : item) : [user, ...current]);
        if (selected?.user_id === selectedUser?.user_id) setSelectedUser(user);
        setEditingUser(null);
        if (!selected) {
          setSelectedUser(user);
          setAccounts([]);
          setAccount(null);
          setPage("accounts");
        }
      },
      selected ? "User details updated." : "User created successfully.",
    );
    if (result) form.reset();
  }

  async function deleteUser(user: User) {
    if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return;
    await run(() => apiRequest<User>(`/users/${encodeURIComponent(user.user_id)}`, { method: "DELETE" }), () => {
      setUsers((current) => current.filter((item) => item.user_id !== user.user_id));
      setEditingUser(null);
      if (selectedUser?.user_id === user.user_id) {
        setSelectedUser(null);
        setAccounts([]);
        setAccount(null);
        setTransactions([]);
        setPage("users");
      }
    }, "User deleted.");
  }

  async function submitAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedUser) return setError("Choose a profile before opening an account.");
    const form = event.currentTarget;
    const data = new FormData(form);
    const body = {
      userId: selectedUser.user_id,
      accountType: String(data.get("accountType")),
      balance: Number(data.get("balance") || 0),
    };
    const result = await run(() => apiRequest<Account>("/accounts", { method: "POST", body: JSON.stringify(body) }), (created) => {
      rememberAccount(created);
      setPage("account-details");
    }, "Your new account is ready.");
    if (result) form.reset();
  }

  async function saveAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!account) return;
    const data = new FormData(event.currentTarget);
    const userId = String(data.get("userId") || "");
    const accountType = String(data.get("accountType") || "");
    if (!userId && !accountType) return setError("Choose an account owner or enter a new account type.");
    const body = { ...(userId ? { userId } : {}), ...(accountType ? { accountType } : {}) };
    const updated = await run(() => apiRequest<Account>(`/accounts/${encodeURIComponent(account.accountId)}`, { method: "PUT", body: JSON.stringify(body) }), rememberAccount, "Account details updated.");
    if (updated) setEditingAccount(false);
  }

  async function deleteAccount() {
    if (!account || !window.confirm("Delete this account and its transaction history? This cannot be undone.")) return;
    await run(() => apiRequest<Account>(`/accounts/${encodeURIComponent(account.accountId)}`, { method: "DELETE" }), () => {
      setAccounts((current) => current.filter((item) => item.accountId !== account.accountId));
      setAccount(null);
      setPage("accounts");
    }, "Account deleted.");
  }

  async function moveMoney(event: FormEvent<HTMLFormElement>, direction: "deposit" | "withdraw") {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const amount = Number(data.get("amount"));
    if (!account) return setError("Open an account before moving money.");
    const updated = await run(() => apiRequest<Account>(`/accounts/${encodeURIComponent(account.accountId)}/${direction}`, { method: "POST", body: JSON.stringify({ amount }) }), rememberAccount, direction === "deposit" ? "Deposit complete." : "Withdrawal complete.");
    if (updated) form.reset();
  }

  function dismissAlert() {
    setNotice("");
    setError("");
  }

  return {
    page,
    setPage,
    users,
    selectedUser,
    accounts,
    account,
    notice,
    error,
    busy,
    userId,
    setUserId,
    transactions,
    editingUser,
    setEditingUser,
    editingAccount,
    setEditingAccount,
    loadUsers,
    selectUser,
    selectAccount,
    findUser,
    loadTransactions,
    submitUser,
    deleteUser,
    submitAccount,
    saveAccount,
    deleteAccount,
    moveMoney,
    dismissAlert,
  };
}
