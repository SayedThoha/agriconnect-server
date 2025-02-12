import { Expert } from "../models/expertModel";
import { User } from "../models/userModel";


const findSenderModel = async (id: string) => {
  const user = await User.findById(id);
  if (user) {
    console.log("sender is from usercollection");
    return "User";
  }
  const expert = await Expert.findById(id);
  if (expert) {
    console.log("sender is from expertcollection");
    return "Expert";
  }
  return null;
};

export default findSenderModel;
