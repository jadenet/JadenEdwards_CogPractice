import path from "node:path";
import swaggerJsdoc from "swagger-jsdoc";

const routeFiles = ["*.ts", "*.js"].map(extension =>
  path.join(__dirname, "routes", extension).replace(/\\/g, "/")
);

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bank App API",
      version: "1.0.0",
      description: "API documentation for bank account and user operations.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        ErrorResponse: {
          type: "object",
          required: ["error"],
          properties: {
            error: { type: "string", example: "User not found" },
          },
        },
        AccountRequest: {
          type: "object",
          required: ["userId", "accountType"],
          properties: {
            userId: { type: "integer", example: 1 },
            accountType: { type: "string", example: "CHECKING" },
            balance: { type: "number", format: "float", default: 0, example: 100 },
          },
        },
        UpdateAccountRequest: {
          type: "object",
          minProperties: 1,
          properties: {
            userId: { type: "integer", example: 1 },
            accountType: { type: "string", minLength: 1, example: "SAVINGS" },
          },
        },
        AmountRequest: {
          type: "object",
          required: ["amount"],
          properties: {
            amount: { type: "number", format: "float", minimum: 0, exclusiveMinimum: true, example: 25.5 },
          },
        },
        AccountResponse: {
          type: "object",
          required: ["accountId", "userName", "balance"],
          properties: {
            accountId: { type: "integer", example: 1 },
            userName: { type: "string", example: "Alex Ray" },
            balance: { type: "number", format: "float", example: 125.5 },
          },
        },
        Transaction: {
          type: "object",
          required: ["type", "amount", "date"],
          properties: {
            type: { type: "string", enum: ["DEPOSIT", "WITHDRAW"] },
            amount: { type: "number", format: "float", example: 25.5 },
            date: { type: "string", format: "date", example: "2026-09-29" },
          },
        },
        User: {
          type: "object",
          required: ["user_id", "name", "email", "created_at"],
          properties: {
            user_id: { type: "integer", example: 1 },
            name: { type: "string", example: "Alex Ray" },
            email: { type: "string", format: "email", example: "alex@example.com" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        CreateUserRequest: {
          type: "object",
          required: ["name", "email"],
          properties: {
            name: { type: "string", example: "Alex Ray" },
            email: { type: "string", format: "email", example: "alex@example.com" },
          },
        },
        UpdateUserRequest: {
          type: "object",
          minProperties: 1,
          properties: {
            name: { type: "string", example: "Alex Ray" },
            email: { type: "string", format: "email", example: "alex@example.com" },
          },
        },
      },
    },
  },
  apis: routeFiles,
});

export default swaggerSpec;