
import { Types } from 'mongoose';
import { IUser } from "../models/userModel";

export interface IUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  otp: string;
  otp_update_time?: Date;
  is_verified?: boolean;
  role?: string;
  blocked?: string;
  created_time?: Date;
  wallet?: number;
  profile_picture?: string;
  
}

export interface LoginResponse {
    success: boolean;
    statusCode: number;
    message: string;
    accessToken?: string;
    refreshToken?:string;
    accessedUser?: Partial<IUser>;
    email?: string;
}

export interface AccessedUser {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
}




export interface OtpVerificationResult {
  success: boolean;
  statusCode: number;
  message: string;
}