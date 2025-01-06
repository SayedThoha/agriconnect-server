export interface IAdmin {
    _id: string;
    email: string;
    password: string;
    role: string;
    payOut: number;
  }
  
 export interface IAdminResponse {
    email: string;
    role: string;
    payOut: number;
  }
  
  export interface ILoginResult {
    success: boolean;
    status: number;
    message?: string;
    data?: {
      accessToken: string;
      accessedUser: IAdminResponse;
      message: string;
    };
  }