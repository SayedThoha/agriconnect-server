import { Request, Response, NextFunction } from "express";
import { User } from "../models/userModel";
// import jwt, { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../utils/token";

interface UserRequest extends Request {
  userId?: string;
}

export const userAuth = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("user-Bearer")) {
    const token = authHeader.split(" ")[1]; // Getting token from the header
    
   
    try {
      // const decoded = jwt.verify(token, secret) as JwtPayload;
      const decoded =  await verifyToken(token);
      
      if (!decoded) {
        res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
        return;
      }
      // Check if decoded has the expertId property
      if (decoded && typeof decoded === "object" && "data" in decoded) {
        req.userId = decoded.data as string; // Explicitly cast to string
        next();
      } else {
        res
          .status(401)
          .json({ message: "Unauthorized: Invalid token payload" });
      }
    } catch (err) {
      console.error("JWT verification error:", err);
      res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  }
};

export const checkUserBlocked = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req;

    // Assuming the user ID is stored in req.user
    if (!userId) {
      res.status(400).json({ message: "User ID is missing" });
      return; // Ensure no further processing
    }
    const user = await User.findById(userId);

    if (user && user.blocked) {
      res.status(403).json({ message: "User is blocked" });
      return;
    }
    next();
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server Error" });
  }
};
