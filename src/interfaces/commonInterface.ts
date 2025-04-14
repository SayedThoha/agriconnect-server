import mongoose from "mongoose";

export interface SearchUserRequest {
  data: string;
}


export interface ISlotData {
  expertId: mongoose.Types.ObjectId;
  time: Date;
  adminPaymentAmount: number;
  bookingAmount: number;
  booked: boolean;
  cancelled: boolean;
  created_time: Date;
}


export interface SlotUpdateData {
  _id: string;
  expertId: string;
  userId: string;
}



export interface PaymentRequest {
  consultation_fee: number;
}

export interface PaymentOrder {
  success: boolean;
  fee?: number|string;
  key_id?: string;
  order_id?: string;
  message?: string;
}

export interface FarmerBookingDetails {
  slotId: string;
  
        userId:string,
        expertId:string,
        farmer_details:object
        payment_method:string
  
}

export interface IPrescriptionInput {
  bookedSlot: string;
  issue: string;
  prescription: string;
}