export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface UpdatePasswordDto {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateProfileDto {
  name: string;
  email: string;
} 