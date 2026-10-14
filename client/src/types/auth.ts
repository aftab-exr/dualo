export type AuthMethod = "GOOGLE" | "EMAIL" | "PHONE";

export type AuthStep = 
  | "METHOD_SELECT" 
  | "EMAIL_INPUT" 
  | "PHONE_INPUT" 
  | "OTP_VERIFY" 
  | "PROFILE_SKILLS";

export interface AuthFormData {
  method: AuthMethod;
  email: string;
  phoneNumber: string;
  countryCode: string;
  otpCode: string;
  fullName: string;
  skillsOffered: string[];
  skillsWanted: string[];
  isPhoneVerified: boolean;
}