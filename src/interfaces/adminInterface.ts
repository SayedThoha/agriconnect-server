import { ParsedQs } from 'qs';

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


  export interface DownloadRequest extends ParsedQs {
    expertId: string;
    name: string;
    index?:string;
  }

  export interface IExpertDocuments {
    _id: string;
    identity_proof: string;
    expert_licence: string;
    qualification_certificate: string[];
    experience_certificate: string[];
  }

  