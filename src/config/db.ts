// import mongoose from "mongoose";

// const connectDB = async (): Promise<void> => {
//   try {
//     await mongoose.connect(process.env.MONGODB_COMPASS, {
     
//     });
//     console.log("Database connection established successfully.");
//   } catch (error) {
//     console.error("Failed to connect to the database:", error);
//     process.exit(1); 
//   }
// };

// export default connectDB;

import mongoose from 'mongoose';

const connectDB = async ():Promise<void> => {
  try {
    // console.log("Connecting to MongoDB at:", process.env.MONGODB_COMPASS);
    await mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}`, {
   

    });
    console.log('MongoDB connected...');
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Error: ${err.message}`);
    } else {
      console.error('An unknown error occurred');
    }
    process.exit(1);
  }
};

export default connectDB;