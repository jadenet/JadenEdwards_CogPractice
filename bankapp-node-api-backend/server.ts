import "dotenv/config";
import app from "./src/app";
import connectDatabase from "./src/utilities/database";
import userService from "./src/services/userService";

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDatabase();
  await userService.ensureAdminUser();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
  });
}

void startServer().catch(error => {
  console.error("Failed to start server:", error);
  process.exitCode = 1;
});