import { apiRequest } from "./api";
import type { Account, AdminTransaction, AuthResponse, Transaction, User } from "../types/bank";

export type UserInput = Pick<User, "name" | "email"> & Partial<Pick<User, "username" | "role">> & { password?: string };

function sendJson<T>(path: string, method: "POST" | "PUT", body: unknown): Promise<T> {
  return apiRequest<T>(path, { method, body: JSON.stringify(body) });
}

export function login(username: string, password: string): Promise<AuthResponse> {
  return sendJson<AuthResponse>("/auth/login", "POST", { username, password });
}

export function register(body: { name: string; email: string; username: string; password: string }): Promise<AuthResponse> {
  return sendJson<AuthResponse>("/auth/register", "POST", body);
}

export function getCurrentUser(): Promise<User> {
  return apiRequest<User>("/auth/me");
}

export function listAllAccounts(): Promise<Account[]> {
  return apiRequest<Account[]>("/accounts");
}

export function listAllTransactions(): Promise<AdminTransaction[]> {
  return apiRequest<AdminTransaction[]>("/transactions");
}

export function createTransaction(body: { accountId: string; type: Transaction["type"]; amount: number }): Promise<AdminTransaction> {
  return sendJson<AdminTransaction>("/transactions", "POST", body);
}

export function updateTransaction(id: string, body: { type: Transaction["type"]; amount: number }): Promise<AdminTransaction> {
  return sendJson<AdminTransaction>(`/transactions/${encodeURIComponent(id)}`, "PUT", body);
}

export function deleteTransaction(id: string): Promise<AdminTransaction> {
  return apiRequest<AdminTransaction>(`/transactions/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export function listUsers(): Promise<User[]> {
  return apiRequest<User[]>("/users");
}

export function getUser(id: string): Promise<User> {
  return apiRequest<User>(`/users/${encodeURIComponent(id)}`);
}

export function createUser(body: UserInput): Promise<User> {
  return sendJson<User>("/users", "POST", body);
}

export function updateUser(id: string, body: Partial<UserInput>): Promise<User> {
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