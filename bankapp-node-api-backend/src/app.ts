import express from "express";
import accountRoutes from "./routes/accountRoutes";
import userRoutes from "./routes/userRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";

const app = express();
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/accounts", accountRoutes);
app.use("/api/users", userRoutes);

export default app;