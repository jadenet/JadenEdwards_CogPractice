import express from "express";
import { requireAdmin } from "../auth/passport";
import * as transactionController from "../controllers/transactionController";

const router = express.Router();
router.use(requireAdmin);

/**
 * @openapi
 * /api/transactions:
 *   get:
 *     summary: List all transactions (admin)
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: All transactions, newest first.
 *   post:
 *     summary: Record a transaction and update the account balance (admin)
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [accountId, type, amount]
 *             properties:
 *               accountId: { type: string }
 *               type: { type: string, enum: [DEPOSIT, WITHDRAW] }
 *               amount: { type: number }
 *     responses:
 *       201:
 *         description: Transaction created.
 */
router.get("/", transactionController.getAllTransactions);
router.post("/", transactionController.createTransaction);

/**
 * @openapi
 * /api/transactions/{id}:
 *   put:
 *     summary: Edit a transaction and rebalance its account (admin)
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type: { type: string, enum: [DEPOSIT, WITHDRAW] }
 *               amount: { type: number }
 *     responses:
 *       200:
 *         description: Transaction updated.
 *   delete:
 *     summary: Delete a transaction and reverse its effect on the balance (admin)
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Transaction deleted.
 */
router.put("/:id", transactionController.editTransaction);
router.delete("/:id", transactionController.deleteTransaction);

export default router;
