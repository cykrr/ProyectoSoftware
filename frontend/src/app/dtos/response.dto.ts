export interface LoginResponseDto {
  success: boolean;
  token?: string;
  uid?: string;
  role: string;
  message?: string;
}
