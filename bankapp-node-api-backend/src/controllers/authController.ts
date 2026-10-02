import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { signToken } from "../auth/passport";
import type { UserRecord } from "../models/user";
import userService from "../services/userService";

interface LoginBody {
  username?: unknown;
  password?: unknown;
}

interface RegisterBody {
  name?: unknown;
  email?: unknown;
  username?: unknown;
  password?: unknown;
}

const USERNAME_PATTERN = /^[a-zA-Z0-9_.-]{3,30}$/;

export function isDuplicateKeyError(error: unknown): boolean {
  return typeof error === "object" && error !== null && (error as { code?: number }).code === 11000;
}

export async function register(req: Request<ParamsDictionary, unknown, RegisterBody>, res: Response) {
  const { name, email, username, password } = req.body;
  if (typeof name !== "string" || !name.trim() || typeof email !== "string" || !email.trim()) {
    return res.status(400).json({ error: "name and email are required" });
  }
  if (typeof username !== "string" || !USERNAME_PATTERN.test(username.trim())) {
    return res.status(400).json({ error: "username must be 3-30 letters, numbers, dots, dashes or underscores" });
  }
  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ error: "password must be at least 8 characters" });
  }

  let user: UserRecord;
  try {
    user = await userService.addUser({ name: name.trim(), email: email.trim(), username: username.trim(), password, role: "user" });
  } catch (error) {
    if (isDuplicateKeyError(error)) return res.status(409).json({ error: "That username or email is already in use" });
    throw error;
  }

  return res.status(201).json({ token: signToken(user), user });
}

export async function login(req: Request<ParamsDictionary, unknown, LoginBody>, res: Response) {
  const { username, password } = req.body;
  if (typeof username !== "string" || typeof password !== "string" || !username.trim() || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }
  const user = await userService.authenticate(username, password);
  if (!user) return res.status(401).json({ error: "Invalid username or password" });
  return res.status(200).json({ token: signToken(user), user });
}

export function me(req: Request, res: Response) {
  return res.status(200).json(req.user);
}
