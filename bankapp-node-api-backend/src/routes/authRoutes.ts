import express from "express";
import { requireAuth } from "../auth/passport";
import * as authController from "../controllers/authController";

const router = express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Sign up and receive a JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, username, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               username: { type: string }
 *               password: { type: string, minLength: 8 }
 *     responses:
 *       201:
 *         description: User created. Returns { token, user }.
 *       409:
 *         description: Username or email already in use.
 */
router.post("/register", authController.register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Log in with username and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: 'Logged in. Returns { token, user }; send the token as "Authorization: Bearer <token>".'
 *       401:
 *         description: Invalid credentials.
 */
router.post("/login", authController.login);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Get the signed-in user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Current user.
 *       401:
 *         description: Missing or invalid token.
 */
router.get("/me", requireAuth, authController.me);

export default router;
