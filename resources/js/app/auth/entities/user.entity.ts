export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  roles?: string[];
  permissions?: string[];
  // Otros campos que puedas necesitar
} 