
import express from "express";
import * as accountController from "../controllers/accountController";

const router = express.Router();

/**
 * @openapi
 * /api/accounts/user/{userId}:
 *   get:
 *     summary: List accounts for a user
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User profile identifier.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Accounts owned by the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/AccountResponse"
 *       404:
 *         description: User was not found.
 */
router.get("/user/:userId", accountController.getAccountsForUser);

/**
 * @openapi
 * /api/accounts:
 *   post:
 *     summary: Create an account
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AccountRequest"
 *     responses:
 *       201:
 *         description: Account created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AccountResponse"
 *       400:
 *         description: Required fields are missing or the user does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post("/", accountController.createAccount);

/**
 * @openapi
 * /api/accounts/{id}:
 *   get:
 *     summary: Get an account
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Account identifier.
 *         schema:
 *           type: string
 *         example: "1"
 *     responses:
 *       200:
 *         description: Account details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AccountResponse"
 *       404:
 *         description: Account was not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get("/:id", accountController.getAccount);

/**
 * @openapi
 * /api/accounts/{id}:
 *   put:
 *     summary: Update an account
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Account identifier.
 *         schema:
 *           type: string
 *         example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateAccountRequest"
 *     responses:
 *       200:
 *         description: Account updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AccountResponse"
 *       400:
 *         description: At least one valid account field is required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Account or requested owner was not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put("/:id", accountController.editAccount);

/**
 * @openapi
 * /api/accounts/{id}:
 *   delete:
 *     summary: Delete an account
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Account identifier.
 *         schema:
 *           type: string
 *         example: "1"
 *     responses:
 *       200:
 *         description: Deleted account. Its transaction history is also removed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AccountResponse"
 *       404:
 *         description: Account was not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.delete("/:id", accountController.deleteAccount);

/**
 * @openapi
 * /api/accounts/{id}/deposit:
 *   post:
 *     summary: Deposit money into an account
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Account identifier.
 *         schema:
 *           type: string
 *         example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AmountRequest"
 *     responses:
 *       200:
 *         description: Deposit recorded and account balance updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AccountResponse"
 *       400:
 *         description: Amount is invalid or the account does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post("/:id/deposit", accountController.deposit);

/**
 * @openapi
 * /api/accounts/{id}/withdraw:
 *   post:
 *     summary: Withdraw money from an account
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Account identifier.
 *         schema:
 *           type: string
 *         example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AmountRequest"
 *     responses:
 *       200:
 *         description: Withdrawal recorded and account balance updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AccountResponse"
 *       400:
 *         description: Amount is invalid, funds are insufficient, or the account does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post("/:id/withdraw", accountController.withdraw);

/**
 * @openapi
 * /api/accounts/{id}/transactions:
 *   get:
 *     summary: List an account's transactions
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Account identifier.
 *         schema:
 *           type: string
 *         example: "1"
 *     responses:
 *       200:
 *         description: Transaction history for the account.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Transaction"
 *       404:
 *         description: Account was not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get("/:id/transactions", accountController.getTransactions);

export default router;