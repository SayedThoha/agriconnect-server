import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}`, {});
    console.warn("MongoDB connected...");
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Error: ${err.message}`);
    } else {
      console.error("An unknown error occurred");
    }
    process.exit(1);
  }
};
export default connectDB;
