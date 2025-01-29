import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Middleware for admin token authentication
const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("admin-Bearer")) {
    const token = authHeader.split(" ")[1]; // token from header
    const secret = process.env.JWT_SECRET || "default_secret";

    console.log("Token received:", token);
    console.log("JWT_SECRET during verification:", secret);
    try {
      jwt.verify(token, secret, (err, admin) => {
        if (err || !admin) {
          console.error("Error during token verification:", err);
          return res.status(401).json({ message: "Unauthorized" });
        }

        if (typeof admin === "object" && "adminId" in admin) {
          req.adminId = admin.adminId as string;
          next();
        } else {
          res.status(401).json({ message: "Unauthorized" });
        }
      });
    } catch (error) {
      console.error("JWT verification error:", error);
      res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};


export default adminAuth;