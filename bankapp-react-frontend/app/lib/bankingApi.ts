import { apiRequest } from "./api";
import type { Account, Transaction, User } from "../types/bank";

function sendJson<T>(path: string, method: "POST" | "PUT", body: unknown): Promise<T> {
  return apiRequest<T>(path, { method, body: JSON.stringify(body) });
}

export function listUsers(): Promise<User[]> {
  return apiRequest<User[]>("/users");
}

export function getUser(id: string): Promise<User> {
  return apiRequest<User>(`/users/${encodeURIComponent(id)}`);
}

export function createUser(body: Pick<User, "name" | "email">): Promise<User> {
  return sendJson<User>("/users", "POST", body);
}

export function updateUser(id: string, body: Pick<User, "name" | "email">): Promise<User> {
  return sendJson<User>(`/users/${encodeURIComponent(id)}`, "PUT", body);
}

export function deleteUser(id: string): Promise<User> {
  return apiRequest<User>(`/users/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export function listAccountsForUser(userId: string): Promise<Account[]> {
  return apiRequest<Account[]>(`/accounts/user/${encodeURIComponent(userId)}`);
}

export function getAccount(id: string): Promise<Account> {
  return apiRequest<Account>(`/accounts/${encodeURIComponent(id)}`);
}

export function createAccount(body: { userId: string; accountType: string; balance: number }): Promise<Account> {
  return sendJson<Account>("/accounts", "POST", body);
}

export function updateAccount(id: string, body: { userId?: string; accountType?: string }): Promise<Account> {
  return sendJson<Account>(`/accounts/${encodeURIComponent(id)}`, "PUT", body);
}

export function deleteAccount(id: string): Promise<Account> {
  return apiRequest<Account>(`/accounts/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export function moveMoney(id: string, direction: "deposit" | "withdraw", amount: number): Promise<Account> {
  return sendJson<Account>(`/accounts/${encodeURIComponent(id)}/${direction}`, "POST", { amount });
}

export function listTransactions(accountId: string): Promise<Transaction[]> {
  return apiRequest<Transaction[]>(`/accounts/${encodeURIComponent(accountId)}/transactions`);
}