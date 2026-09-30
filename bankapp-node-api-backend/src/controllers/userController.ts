import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import userService from "../services/userService";

interface UserBody {
  name?: string;
  email?: string;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "An unexpected error occurred";
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
  if (typeof name !== "string" || !name.trim() || typeof email !== "string" || !email.trim()) {
    return res.status(400).json({ error: "name and email are required" });
  }
  return res.status(201).json(await userService.addUser({ name: name.trim(), email: email.trim() }));
}

export async function editUser(req: Request<{ id: string }, unknown, UserBody>, res: Response) {
  const { name, email } = req.body;
  if (name === undefined && email === undefined) {
    return res.status(400).json({ error: "At least one of name or email is required" });
  }
  if ((name !== undefined && (typeof name !== "string" || !name.trim())) ||
      (email !== undefined && (typeof email !== "string" || !email.trim()))) {
    return res.status(400).json({ error: "name and email must be non-empty strings" });
  }

  try {
    return res.status(200).json(await userService.editUser(req.params.id, {
      ...(name !== undefined ? { name: name.trim() } : {}),
      ...(email !== undefined ? { email: email.trim() } : {})
    }));
  } catch (error) {
    return res.status(404).json({ error: getErrorMessage(error) });
  }
}

export async function deleteUser(req: Request<{ id: string }>, res: Response) {
  try {
    return res.status(200).json(await userService.deleteUser(req.params.id));
  } catch (error) {
    return res.status(404).json({ error: getErrorMessage(error) });
  }
}