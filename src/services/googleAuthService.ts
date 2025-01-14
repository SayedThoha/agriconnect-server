import { Http_Status_Codes } from "../constants/httpStatusCodes";
import {
  GoogleAuthPayload,
  GoogleAuthResponse,
} from "../models/googleAuthModel";
import GoogleAuthRepository from "../repositories/googleAuth/googleAuthRepository";

class GoogleAuthService {
    
  constructor(private googleAuthRepository: GoogleAuthRepository) {}

  async loginWithGoogle(token: string): Promise<GoogleAuthResponse> {
    try {
      // Delegate to repository
      const response = await this.googleAuthRepository.handleGoogleLogin(token);
      return response;
    } catch (error) {
      //   throw new Error(`Google login failed: ${error.message}`);
      console.log(error);
      return {
        success: false,
        token: "",
        user: {} as GoogleAuthPayload,
        statusCode: Http_Status_Codes.INTERNAL_SERVER_ERROR,
        message: "Internal server error",
      };
    }
  }
}

export default GoogleAuthService;
