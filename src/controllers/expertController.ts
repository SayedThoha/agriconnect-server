import { Request, Response } from "express";
import { Http_Status_Codes } from "../constants/httpStatusCodes";
import ExpertServices from "../services/expertService";

class ExpertController{

constructor(private expertService:ExpertServices){}

expertRegistration = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("expert registration backend");
        
        const missingFields = this.expertService.validateRegistrationData(req.body);
        
        if (missingFields.length > 0) {
            res.status(Http_Status_Codes.BAD_REQUEST).json({
                error: `Missing required fields: ${missingFields.join(", ")}`
            });
            return;
        }

        const result = await this.expertService.registerExpert(req.body);
        console.log(result);
        
        if (!result.status) {
            res.status(Http_Status_Codes.BAD_REQUEST).json({ message: result.message });
            return;
        }

        res.status(Http_Status_Codes.CREATED).json({ message: result.message });
    } catch (error) {
        console.log("error due to expert registration:", error);
        res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({ 
            message: "Internal Server Error" 
        });
    }
}

getSpecialisation = async (req: Request, res: Response): Promise<void> => {
    try {
        const specialisation = await this.expertService.getSpecialisations();
        res.status(Http_Status_Codes.OK).json({ specialisation });
    } catch (error) {
        console.log(error);
        res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({ 
            message: "Internal Server Error" 
        });
    }
}

 async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      // Validate required fields
      const requiredFields = ["email"];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        res.status(Http_Status_Codes.BAD_REQUEST).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
        return;
      }

      const { email } = req.body;
      const result = await this.expertService.resendOtp(email);

      res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      console.log(error);

      res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }


   async verifyOtp(req: Request, res: Response): Promise<void> {
      try {
          // Validate required fields
          const requiredFields = ["email", "otp"];
          const missingFields = requiredFields.filter(field => !req.body[field]);
          
          if (missingFields.length > 0) {
              res.status(Http_Status_Codes.BAD_REQUEST).json({
                  success: false,
                  message: `Missing required fields: ${missingFields.join(", ")}`
              });
              return;
          }
  
          const { email, otp, role, new_email } = req.body;
          
          const result = await this.expertService.verifyOtp(
              email,
              otp,
              role,
              new_email
          );
  
          res.status(result.statusCode).json({
              success: result.success,
              message: result.message
          });
      } catch (error) {
          console.log(error);
          
          res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
              success: false,
              message: "Internal server error"
          });
      }
  }


  async login(req: Request, res: Response): Promise<void> {
      try {
        console.log("entering the login in admin")
          // Validate required fields
          const requiredFields = ["email", "password"];
          const missingFields = requiredFields.filter(field => !req.body[field]);
          
          if (missingFields.length > 0) {
              res.status(Http_Status_Codes.BAD_REQUEST).json({
                  success: false,
                  message: `Missing required fields: ${missingFields.join(", ")}`
              });
              return;
          }
  
          const { email, password } = req.body;
          const result = await this.expertService.loginExpert(email, password);
  
          res.status(result.statusCode).json({
              success: result.success,
              message: result.message,
              ...(result.accessToken && { accessToken: result.accessToken }),
              ...(result.accessedUser && { accessedUser: result.accessedUser }),
              ...(result.email && { email: result.email })
          });
      } catch (error) {
          console.log(error);
          
          res.status(Http_Status_Codes.INTERNAL_SERVER_ERROR).json({
              success: false,
              message: "Internal server error"
          });
      }
  }

}

export default ExpertController