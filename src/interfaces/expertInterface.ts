export interface ExpertRegistrationDTO {
    firstName: string;
    lastName: string;
    email: string;
    contactno: number;
    profile_picture:string;
    specialisation: string;
    current_working_address: string;
    experience: string;
    consultation_fee: number;
    identity_proof_type: string;
    identity_proof: string;
    expert_licence: string;
    qualification_certificate: string[];
    experience_certificate: string[];
    password: string;
}


export interface OtpVerificationResult {
    success: boolean;
    statusCode: number;
    message: string;
  }


  export interface SlotServiceResponse<T = void> {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T;
  }


  