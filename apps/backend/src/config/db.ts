import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI as string;
  if (!uri) {
    console.error(
      "❌ MONGODB_URI is not defined. Please add it to your .env file (root or apps/backend). Example: MONGODB_URI=mongodb://localhost:27017/learningoo"
    );
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log("🗄️  Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
