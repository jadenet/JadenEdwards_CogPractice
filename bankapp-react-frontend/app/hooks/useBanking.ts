import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router";
import {
  createAccount as createAccountRequest,
  createUser as createUserRequest,
  deleteAccount as deleteAccountRequest,
  deleteUser as deleteUserRequest,
  getAccount,
  getUser,
  listAccountsForUser,
  listTransactions,
  listUsers,
  moveMoney as moveMoneyRequest,
  updateAccount as updateAccountRequest,
  updateUser as updateUserRequest,
} from "../lib/bankingApi";
import type { Account, Transaction, User } from "../types/bank";

type PendingDeletion =
  | { kind: "user"; user: User }
  | { kind: "account"; accountId: string; userId: string };

export function useBanking() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [account, setAccount] = useState<Account | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [pendingOperations, setPendingOperations] = useState(0);
  const busy = pendingOperations > 0;
  const [userId, setUserId] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingAccount, setEditingAccount] = useState(false);
  const [pendingDeletion, setPendingDeletion] = useState<PendingDeletion | null>(null);
  const confirmation = pendingDeletion?.kind === "user"
    ? { title: `Delete ${pendingDeletion.user.name}?`, description: "This profile will be permanently removed.", confirmLabel: "Delete profile" }
    : pendingDeletion
      ? { title: "Close this account?", description: "This account and its transaction history will be permanently deleted.", confirmLabel: "Close account" }
      : null;

  useEffect(() => {
    void loadUsers();
  }, []);

  async function run<T>(action: () => Promise<T>, success?: (result: T) => void, message?: string) {
    setPendingOperations((current) => current + 1);
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
      setPendingOperations((current) => current - 1);
    }
  }

  async function loadUsers() {
    await run(listUsers, setUsers);
  }

  // Called from routes so a refreshed URL reloads its data.
  async function openUser(id: string) {
    if (selectedUser?.user_id === id) return;
    setAccount(null);
    setTransactions([]);
    await run(
      () => Promise.all([
        getUser(id),
        listAccountsForUser(id),
      ]),
      ([user, userAccounts]) => {
        setSelectedUser(user);
        setAccounts(userAccounts);
      },
    );
  }

  async function openAccount(id: string) {
    if (account?.accountId === id) return;
    setTransactions([]);
    await run(() => getAccount(id), rememberAccount);
  }

  async function loadTransactions(id: string) {
    await run(() => listTransactions(id), setTransactions);
  }

  async function findUser(id = userId) {
    if (!id.trim()) return setError("Enter a user ID to continue.");
    await run(() => getUser(id.trim()), setEditingUser, "User found.");
  }

  async function submitUser(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const body = { name: String(data.get("name")), email: String(data.get("email")) };
    const selected = editingUser;
    const result = await run(
      () => selected ? updateUserRequest(selected.user_id, body) : createUserRequest(body),
      (user) => {
        setUsers((current) => selected ? current.map((item) => item.user_id === user.user_id ? user : item) : [user, ...current]);
        if (selected?.user_id === selectedUser?.user_id) setSelectedUser(user);
        setEditingUser(null);
        if (!selected) {
          setSelectedUser(user);
          setAccounts([]);
          setAccount(null);
          navigate(`/users/${user.user_id}/accounts`);
        }
      },
      selected ? "User details updated." : "User created successfully.",
    );
    if (result) form.reset();
  }

  function deleteUser(user: User) {
    setPendingDeletion({ kind: "user", user });
  }

  function rememberAccount(next: Account) {
    setAccount(next);
    setAccounts((current) => [next, ...current.filter((item) => item.accountId !== next.accountId)]);
  }

  async function submitAccount(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedUser) return setError("Choose a profile before opening an account.");
    const form = event.currentTarget;
    const data = new FormData(form);
    const body = {
      userId: selectedUser.user_id,
      accountType: String(data.get("accountType")),
      balance: Number(data.get("balance") || 0),
    };
    const result = await run(() => createAccountRequest(body), (created) => {
      rememberAccount(created);
      navigate(`/accounts/${created.accountId}`);
    }, "Your new account is ready.");
    if (result) form.reset();
  }

  async function saveAccount(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!account) return;
    const data = new FormData(event.currentTarget);
    const userId = String(data.get("userId") || "");
    const accountType = String(data.get("accountType") || "");
    if (!userId && !accountType) return setError("Choose an account owner or enter a new account type.");
    const body = { ...(userId ? { userId } : {}), ...(accountType ? { accountType } : {}) };
    const updated = await run(() => updateAccountRequest(account.accountId, body), rememberAccount, "Account details updated.");
    if (updated) setEditingAccount(false);
  }

  function deleteAccount() {
    if (!account) return;
    setPendingDeletion({ kind: "account", accountId: account.accountId, userId: account.userId });
  }

  async function confirmDelete() {
    const pending = pendingDeletion;
    if (!pending) return;
    setPendingDeletion(null);

    if (pending.kind === "user") {
      const { user } = pending;
      await run(() => deleteUserRequest(user.user_id), () => {
        setUsers((current) => current.filter((item) => item.user_id !== user.user_id));
        setEditingUser(null);
        if (selectedUser?.user_id === user.user_id) {
          setSelectedUser(null);
          setAccounts([]);
          setAccount(null);
          setTransactions([]);
        }
        navigate("/users");
      }, "User deleted.");
      return;
    }

    await run(() => deleteAccountRequest(pending.accountId), () => {
      setAccounts((current) => current.filter((item) => item.accountId !== pending.accountId));
      setAccount(null);
      navigate(`/users/${pending.userId}/accounts`);
    }, "Account deleted.");
  }

  function cancelDelete() {
    setPendingDeletion(null);
  }

  async function moveMoney(event: SubmitEvent<HTMLFormElement>, direction: "deposit" | "withdraw") {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const amount = Number(data.get("amount"));
    if (!account) return setError("Open an account before moving money.");
    const updated = await run(() => moveMoneyRequest(account.accountId, direction, amount), rememberAccount, direction === "deposit" ? "Deposit complete." : "Withdrawal complete.");
    if (updated) {
      form.reset();
      navigate(`/accounts/${account.accountId}`);
    }
  }

  function dismissAlert() {
    setNotice("");
    setError("");
  }

  return {
    users,
    selectedUser,
    accounts,
    account,
    notice,
    error,
    busy,
    confirmation,
    userId,
    setUserId,
    transactions,
    editingUser,
    setEditingUser,
    editingAccount,
    setEditingAccount,
    loadUsers,
    openUser,
    openAccount,
    findUser,
    loadTransactions,
    submitUser,
    deleteUser,
    confirmDelete,
    cancelDelete,
    submitAccount,
    saveAccount,
    deleteAccount,
    moveMoney,
    dismissAlert,
  };
}
