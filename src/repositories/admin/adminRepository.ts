import { Admin, IAdmin } from "../../models/adminModel";
import { Expert } from "../../models/expertModel";
import { User } from "../../models/userModel";
import { IAdminRepository } from "./IAdminRepository";

class AdminRepository implements IAdminRepository {
  constructor() {}

  async findByEmail(email: string): Promise<IAdmin | null> {
    return await Admin.findOne({ email });
  }

  async getUserCount(): Promise<number> {
    return await User.countDocuments({});
  }

  async getExpertCount(): Promise<number> {
    return await Expert.countDocuments({});
  }
}

export default AdminRepository;
