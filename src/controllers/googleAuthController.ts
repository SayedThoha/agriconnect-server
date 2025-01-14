import { Request, Response } from "express";
import GoogleAuthService from "../services/googleAuthService";
import { Http_Status_Codes } from "../constants/httpStatusCodes";

class GoogleAuthController {
  private googleAuthService: GoogleAuthService;

  constructor(googleAuthService: GoogleAuthService) {
    this.googleAuthService = googleAuthService;
  }

  async login(req: Request, res: Response): Promise<void> {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({
        success: false,
        statusCode: Http_Status_Codes.BAD_REQUEST,
        message: "Google token is required",
        token: "",
        user: {},
      });
      return;
    }

    try {
      const response = await this.googleAuthService.loginWithGoogle(token);
      res.status(response.statusCode).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        statusCode: Http_Status_Codes.INTERNAL_SERVER_ERROR,
        message: `Server error }`,
        token: "",
        user: {},
      });
    }
  }
}

export default GoogleAuthController;
