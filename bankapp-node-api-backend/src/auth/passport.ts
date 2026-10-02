import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { randomBytes } from "node:crypto";
import type { UserRecord } from "../models/user";
import accountRepo from "../repositories/accountRepository";
import userRepo from "../repositories/userRepository";

declare global {
  namespace Express {
    interface User extends UserRecord {}
  }
}

const JWT_ALGORITHM = "HS256";
const JWT_EXPIRES_IN = "8h";
const jwtSecret = process.env.JWT_SECRET || randomBytes(32).toString("hex");
if (!process.env.JWT_SECRET) {
  console.warn("JWT_SECRET is not set; using a random secret. Tokens will be invalidated on restart.");
}

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
  algorithms: [JWT_ALGORITHM]
}, async (payload: { sub?: string }, done) => {
  try {
    // Re-load the user so deleted users and role changes take effect immediately.
    const user = payload.sub ? await userRepo.findById(payload.sub) : null;
    return done(null, user ?? false);
  } catch {
    return done(null, false);
  }
}));

export default passport;

export function signToken(user: UserRecord): string {
  return jwt.sign({ role: user.role }, jwtSecret, { subject: user.user_id, algorithm: JWT_ALGORITHM, expiresIn: JWT_EXPIRES_IN });
}

// Attaches req.user when a valid bearer token is present; route guards decide whether it's required.
export function authenticateJwt(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("jwt", { session: false }, (error: unknown, user: Express.User | false) => {
    if (error) return next(error);
    if (user) req.user = user;
    return next();
  })(req, res, next);
}

export function isAdmin(req: Request): boolean {
  return req.user?.role === "admin";
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.user) return next();
  return res.status(401).json({ error: "Please log in to continue" });
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: "Please log in to continue" });
  if (!isAdmin(req)) return res.status(403).json({ error: "Admin access required" });
  return next();
}

export function requireSelfOrAdmin(param: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Please log in to continue" });
    if (isAdmin(req) || req.params[param] === req.user.user_id) return next();
    return res.status(403).json({ error: "You do not have access to this profile" });
  };
}

export async function requireAccountAccess(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: "Please log in to continue" });
  if (isAdmin(req)) return next();
  try {
    const account = await accountRepo.findById(req.params.id);
    if (!account) return res.status(404).json({ error: "Account not found" });
    if (account.user_id !== req.user!.user_id) {
      return res.status(403).json({ error: "You do not have access to this account" });
    }
    return next();
  } catch {
    return res.status(404).json({ error: "Account not found" });
  }
}
