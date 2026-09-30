import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import accountService from "../services/accountService";

interface CreateAccountBody {
  userId: string;
  accountType: string;
  balance: number
}

interface AmountBody {
  amount: number | string;
}

interface UpdateAccountBody {
  userId?: string;
  accountType?: string;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "An unexpected error occurred";
}

export async function getAccountsForUser(req: Request<{ userId: string }>, res: Response) {
  try {
    return res.status(200).json(await accountService.getAccountsForUser(req.params.userId));
  } catch (err) {
    return res.status(404).json({ error: getErrorMessage(err) });
  }
}

export async function createAccount(req: Request<ParamsDictionary, unknown, CreateAccountBody>, res: Response) {
  try {
    const { userId, accountType, balance } = req.body;
    if (!userId || !accountType) {
      return res.status(400).json({ error: "userId and accountType are required" });
    }
    const result = await accountService.createAccount(userId, accountType, balance);
    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};

export async function getAccount(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    const account = await accountService.getAccount(id);
    return res.status(200).json(account);
  } catch (err) {
    return res.status(404).json({ error: getErrorMessage(err) });
  }
};

export async function editAccount(req: Request<{ id: string }, unknown, UpdateAccountBody>, res: Response) {
  const { userId, accountType } = req.body;
  if (userId === undefined && accountType === undefined) {
    return res.status(400).json({ error: "At least one of userId or accountType is required" });
  }
  if (userId !== undefined && (typeof userId !== "string" || !userId.trim())) {
    return res.status(400).json({ error: "userId must be a non-empty ID string" });
  }
  if (accountType !== undefined && (typeof accountType !== "string" || !accountType.trim())) {
    return res.status(400).json({ error: "accountType must be a non-empty string" });
  }

  try {
    const updatedAccount = await accountService.editAccount(req.params.id, {
      ...(userId !== undefined ? { userId } : {}),
      ...(accountType !== undefined ? { accountType: accountType.trim() } : {}),
    });
    return res.status(200).json(updatedAccount);
  } catch (error) {
    return res.status(404).json({ error: getErrorMessage(error) });
  }
}

export async function deleteAccount(req: Request<{ id: string }>, res: Response) {
  try {
    return res.status(200).json(await accountService.deleteAccount(req.params.id));
  } catch (error) {
    return res.status(404).json({ error: getErrorMessage(error) });
  }
}

export async function deposit(req: Request<{ id: string }, unknown, AmountBody>, res: Response) {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const updatedAccount = await accountService.deposit(id, amount);
    return res.status(200).json(updatedAccount);
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};

export async function withdraw(req: Request<{ id: string }, unknown, AmountBody>, res: Response) {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const updatedAccount = await accountService.withdraw(id, amount);
    return res.status(200).json(updatedAccount);
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) });
  }
};

export async function getTransactions(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    const transactions = await accountService.getTransactions(id);
    return res.status(200).json(transactions);
  } catch (err) {
    return res.status(404).json({ error: getErrorMessage(err) });
  }
};