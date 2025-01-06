import { IAdmin } from "../../models/adminModel";

export interface IAdminRepository {
  findByEmail(email: string): Promise<IAdmin | null>;
  getUserCount(): Promise<number>;
  getExpertCount(): Promise<number>;
}
