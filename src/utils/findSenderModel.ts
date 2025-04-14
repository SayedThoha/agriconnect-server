import { Expert } from "../models/expertModel";
import { User } from "../models/userModel";

const findSenderModel = async (id: string) => {
  const user = await User.findById(id);
  if (user) {
    return "User";
  }
  const expert = await Expert.findById(id);
  if (expert) {
    return "Expert";
  }
  return null;
};

export default findSenderModel;
