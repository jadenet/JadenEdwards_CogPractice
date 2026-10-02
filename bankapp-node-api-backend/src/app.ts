import express from "express";
import passport, { authenticateJwt } from "./auth/passport";
import accountRoutes from "./routes/accountRoutes";
import authRoutes from "./routes/authRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import userRoutes from "./routes/userRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
import connectDatabase from "./utilities/database";
import cors from "cors";


const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use("/api", authenticateJwt);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

app.use(cors({
  origin: 'https://d1gln353xtra0u.cloudfront.net/', // or '*'
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection error' });
  }
});
export default app;