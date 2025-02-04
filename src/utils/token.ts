/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { Types } from "mongoose";
config();

export const generateAccessToken = (
  payload: Types.ObjectId | undefined | string
) => {
  const token = jwt.sign({ data: payload }, `${process.env.JWT_SECRET}`, {
    expiresIn: "5m",
  });
  return token;
};

export const generateRefreshToken = (
  payload: Types.ObjectId | undefined | string
) => {
  const token = jwt.sign({ data: payload }, `${process.env.JWT_SECRET}`, {
    expiresIn: "48h",
  });
  return token;
};

export const verifyToken = (token: string): any => {
  try {
    const secret = `${process.env.JWT_SECRET}`;
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error: any) {
    console.log("Error while jwt token verification", error);

    return null;
  }
};

export const verifyRefreshToken = (token: string): any => {
  try {
    const secret = `${process.env.JWT_SECRET}`;
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    console.log(error as Error);
    return error;
  }
};
