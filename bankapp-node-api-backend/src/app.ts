import express from "express";
import passport, { authenticateJwt } from "./auth/passport";
import accountRoutes from "./routes/accountRoutes";
import authRoutes from "./routes/authRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import userRoutes from "./routes/userRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";

const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use("/api", authenticateJwt);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

export default app;