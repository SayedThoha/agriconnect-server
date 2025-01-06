import mongoose, { Document, Schema } from "mongoose";

export interface ISpecialisation extends Document {
  specialisation: string;
}

const specialisationSchema: Schema<ISpecialisation> = new mongoose.Schema({
  specialisation: {
    type: String,
    required: true,
  },
});

export const specialisation = mongoose.model(
  "Specialisation",
  specialisationSchema
);
