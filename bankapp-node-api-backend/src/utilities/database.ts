import mongoose from "mongoose";

export default async function connectDatabase(): Promise<void> {
  const connectionString = process.env.MONGODB_URI;
  if (!connectionString) {
    throw new Error("MONGODB_URI is not set. Add your MongoDB Atlas URI to the backend .env file.");
  }

  await mongoose.connect(connectionString, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
  });
  console.log("Connected to MongoDB Atlas");
}