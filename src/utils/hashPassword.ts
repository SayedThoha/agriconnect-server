import bcrypt from "bcrypt";


export const hashedPass = async (password: string): Promise<string> => {
try{
  console.log("password hashing")
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
} catch (error) {
  console.error('Password hashing error:', error);
  throw new Error('Failed to hash password');
}
};


export const comparePass=async(password:string,hashedPass:string):Promise<boolean>=>{
  try {
     return await bcrypt.compare(password,hashedPass)
     
  }catch (error) {
    console.error("Error comparing passwords:", error);
    throw new Error("Password comparison failed.");
}
}