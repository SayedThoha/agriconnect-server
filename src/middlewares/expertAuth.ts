import { Request, Response, NextFunction } from "express";
// import jwt, { JwtPayload } from "jsonwebtoken";
import { Expert } from "../models/expertModel";
import { verifyToken } from "../utils/token";

interface ExpertRequest extends Request {
  expertId?: string;
}

// expert token authentication middleware
export const expertAuth = async (
  req: ExpertRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("expert-Bearer")) {
    res.status(401).json({ message: "Unauthorized" });
    return; // Ensure no further processing
  }

  const token = authHeader.split(" ")[1];


  try {
    // const decoded = jwt.verify(token, secret) as JwtPayload;
    const decoded = await verifyToken(token);
    // Check if decoded has the expertId property
    if (decoded && typeof decoded === "object" && "data" in decoded) {
      req.expertId = decoded.data as string; // Explicitly cast to string
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
    const { expertId } = req; // Assuming the expertId is set by a previous middleware
    if (!expertId) {
      res.status(400).json({ message: "Expert ID is missing" });
      return; // Ensure no further processing
    }

    const expert = await Expert.findById(expertId);
    if (expert && expert.blocked) {
      res.status(403).json({ message: "Expert is blocked" });
      return; // Ensure no further processing
    }

    next(); // Proceed to the next middleware
  } catch (error) {
    console.error("Error in checkExpertBlocked middleware:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
