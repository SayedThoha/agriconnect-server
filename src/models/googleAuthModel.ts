// models/GoogleAuthModel.ts

export interface GoogleAuthPayload {
    email: string;
    name: string;
    googleId: string;
    photoUrl: string;
  }
  
  export interface GoogleAuthResponse {
    success:boolean;
    token: string;
    user: GoogleAuthPayload;
    statusCode:number;
    message:string;
  }
  