import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { TransactionType } from "../models/transaction";
import accountService from "../services/accountService";

interface TransactionBody {
  accountId?: string;
  type?: string;
  amount?: number | string;
}

const TYPES: TransactionType[] = ["DEPOSIT", "WITHDRAW"];

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "An unexpected error occurred";
}

function statusFor(error: unknown): number {
  return /not found/i.test(getErrorMessage(error)) ? 404 : 400;
}

export async function getAllTransactions(_req: Request, res: Response) {
  return res.status(200).json(await accountService.getAllTransactions());
}

export async function createTransaction(req: Request<ParamsDictionary, unknown, TransactionBody>, res: Response) {
  const { accountId, type, amount } = req.body;
  if (typeof accountId !== "string" || !accountId.trim() || !TYPES.includes(type as TransactionType) || amount === undefined) {
    return res.status(400).json({ error: "accountId, type (DEPOSIT or WITHDRAW) and amount are required" });
  }
  try {
    return res.status(201).json(await accountService.createTransaction(accountId, type as TransactionType, amount));
  } catch (error) {
    return res.status(statusFor(error)).json({ error: getErrorMessage(error) });
  }
}

export async function editTransaction(req: Request<{ id: string }, unknown, TransactionBody>, res: Response) {
  const { type, amount } = req.body;
  if (type === undefined && amount === undefined) {
    return res.status(400).json({ error: "At least one of type or amount is required" });
  }
  if (type !== undefined && !TYPES.includes(type as TransactionType)) {
    return res.status(400).json({ error: "type must be DEPOSIT or WITHDRAW" });
  }
  try {
    return res.status(200).json(await accountService.editTransaction(req.params.id, {
      ...(type !== undefined ? { type: type as TransactionType } : {}),
      ...(amount !== undefined ? { amount } : {})
    }));
  } catch (error) {
    return res.status(statusFor(error)).json({ error: getErrorMessage(error) });
  }
}

export async function deleteTransaction(req: Request<{ id: string }>, res: Response) {
  try {
    return res.status(200).json(await accountService.deleteTransaction(req.params.id));
  } catch (error) {
    return res.status(statusFor(error)).json({ error: getErrorMessage(error) });
  }
}
