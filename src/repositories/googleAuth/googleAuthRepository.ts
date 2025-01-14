import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import UserRepository from "../user/userRepository";

import { IUser } from "../../models/userModel";
import {
  GoogleAuthPayload,
  GoogleAuthResponse,
} from "../../models/googleAuthModel";
import { Http_Status_Codes } from "../../constants/httpStatusCodes";

class GoogleAuthRepository {
  private client: OAuth2Client;
  private userRepository: UserRepository;

  constructor(clientId: string, userRepository: UserRepository) {
    this.client = new OAuth2Client(clientId);
    this.userRepository = userRepository;
  }

  async verifyGoogleToken(token: string): Promise<GoogleAuthPayload> {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: this.client._clientId,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error("Invalid Google token");
    }

    return {
      email: payload.email!,
      name: payload.name!,
      googleId: payload.sub!,
      photoUrl: payload.picture!,
    };
  }

  async handleGoogleLogin(token: string): Promise<GoogleAuthResponse> {
    try {
      const payload = await this.verifyGoogleToken(token);
  
      let user = await this.userRepository.findUserByEmail(payload.email);
  
      if (!user) {
        // If user does not exist, create a new user
        user = await this.userRepository.saveUser({
          email: payload.email,
          firstName: payload.name?.split(" ")[0],
          lastName: payload.name?.split(" ")[1] || "",
          googleId: payload.googleId,
          profile_picture: payload.photoUrl,
          is_verified: true,
          authProvider: "google", // Mark as verified since Google handles verification
        });
      }
  
      if (!user._id) {
        throw new Error("User ID is missing after saving.");
      }
  
      const jwtToken = this.generateJwt(user);
  
      return {
        success: true,
        token: jwtToken,
        user: payload,
        statusCode: Http_Status_Codes.OK,
        message: "Login successful",
      };
    } catch (error) {
        console.log(error)
      return {
        success: false,
        token: "",
        user: {} as GoogleAuthPayload,
        statusCode:Http_Status_Codes.INTERNAL_SERVER_ERROR,
        message: `Login failed `,
      };
    }
  }
  

  private generateJwt(user: IUser): string {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.firstName + " " + user.lastName,
      },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1h" }
    );
  }
}

export default GoogleAuthRepository;
