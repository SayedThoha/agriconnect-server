import { Request, Response, NextFunction } from "express";
import { Expert } from "../models/expertModel";
import { verifyToken } from "../utils/token";

interface ExpertRequest extends Request {
  expertId?: string;
}


export const expertAuth = async (
  req: ExpertRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("expert-Bearer")) {
    res.status(401).json({ message: "Unauthorized" });
    return; 
  }

  const token = authHeader.split(" ")[1];


  try {
    
    const decoded = await verifyToken(token);
    
    if (decoded && typeof decoded === "object" && "data" in decoded) {
      req.expertId = decoded.data as string; 
      next();
    } else {
      res.status(401).json({ message: "Unauthorized: Invalid token payload" });
    }
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export const checkExpertBlocked = async (
  req: ExpertRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { expertId } = req; 
    if (!expertId) {
      res.status(400).json({ message: "Expert ID is missing" });
      return; 
    }

    const expert = await Expert.findById(expertId);
    if (expert && expert.blocked) {
      res.status(403).json({ message: "Expert is blocked" });
      return; 
    }

    next(); 
  } catch (error) {
    console.error("Error in checkExpertBlocked middleware:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
