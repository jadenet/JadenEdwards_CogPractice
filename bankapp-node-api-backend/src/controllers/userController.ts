import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { isAdmin } from "../auth/passport";
import type { UserRole } from "../models/user";
import userService, { type UserInput } from "../services/userService";
import { isDuplicateKeyError } from "./authController";

interface UserBody {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  role?: string;
}

const ROLES: UserRole[] = ["user", "admin"];

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "An unexpected error occurred";
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

// Returns the admin-only fields from the body, or an error message if any are invalid.
function parseAdminFields({ username, password, role }: UserBody): Pick<UserInput, "username" | "password" | "role"> | string {
  if (username !== undefined && !isNonEmptyString(username)) return "username must be a non-empty string";
  if (password !== undefined && (typeof password !== "string" || password.length < 5)) return "password must be at least 5 characters";
  if (role !== undefined && !ROLES.includes(role as UserRole)) return "role must be 'user' or 'admin'";
  return {
    ...(username !== undefined ? { username: username.trim() } : {}),
    ...(password !== undefined ? { password } : {}),
    ...(role !== undefined ? { role: role as UserRole } : {})
  };
}

export async function getAllUsers(_req: Request, res: Response) {
  return res.status(200).json(await userService.getAllUsers());
}

export async function getUserById(req: Request<{ id: string }>, res: Response) {
  try {
    return res.status(200).json(await userService.getUserById(req.params.id));
  } catch (error) {
    return res.status(404).json({ error: getErrorMessage(error) });
  }
}

export async function addUser(req: Request<ParamsDictionary, unknown, UserBody>, res: Response) {
  const { name, email } = req.body;
  if (!isNonEmptyString(name) || !isNonEmptyString(email)) {
    return res.status(400).json({ error: "name and email are required" });
  }
  const adminFields = parseAdminFields(req.body);
  if (typeof adminFields === "string") return res.status(400).json({ error: adminFields });

  try {
    return res.status(201).json(await userService.addUser({ name: name.trim(), email: email.trim(), ...adminFields }));
  } catch (error) {
    if (isDuplicateKeyError(error)) return res.status(409).json({ error: "That username or email is already in use" });
    throw error;
  }
}

export async function editUser(req: Request<{ id: string }, unknown, UserBody>, res: Response) {
  const { name, email, username, password, role } = req.body;
  const changesAdminFields = username !== undefined || password !== undefined || role !== undefined;
  if (changesAdminFields && !isAdmin(req)) {
    return res.status(403).json({ error: "Only an admin can change username, password or role" });
  }
  if (name === undefined && email === undefined && !changesAdminFields) {
    return res.status(400).json({ error: "At least one field is required" });
  }
  if ((name !== undefined && !isNonEmptyString(name)) || (email !== undefined && !isNonEmptyString(email))) {
    return res.status(400).json({ error: "name and email must be non-empty strings" });
  }
  const adminFields = parseAdminFields(req.body);
  if (typeof adminFields === "string") return res.status(400).json({ error: adminFields });

  try {
    return res.status(200).json(await userService.editUser(req.params.id, {
      ...(name !== undefined ? { name: name.trim() } : {}),
      ...(email !== undefined ? { email: email.trim() } : {}),
      ...adminFields
    }));
  } catch (error) {
    if (isDuplicateKeyError(error)) return res.status(409).json({ error: "That username or email is already in use" });
    return res.status(404).json({ error: getErrorMessage(error) });
  }
}

export async function deleteUser(req: Request<{ id: string }>, res: Response) {
  if (req.params.id === req.user?.user_id) {
    return res.status(400).json({ error: "You cannot delete your own profile while signed in" });
  }
  try {
    return res.status(200).json(await userService.deleteUser(req.params.id));
  } catch (error) {
    return res.status(404).json({ error: getErrorMessage(error) });
  }
}