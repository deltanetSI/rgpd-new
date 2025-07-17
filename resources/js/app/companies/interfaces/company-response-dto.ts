
export interface CompanyResponseDto {
  id: string; 
  type: string;
  name: string;
  legal_name: string; 
  registered_address: string; 
  country: string; 
  postal_code: string; 
  tax_id: string; 
  city: string;
  address: string;
  province: string;
  phone: string;
  email: string;
  activity: string; 
  website: string | null;
  number_of_employees: number | null; 
  exercise_rights_email: string | null; 
  external_hosting: boolean; 
  data_sharing: boolean; 
  international_transfers: boolean; 
  mass_mailing: boolean;
  user_id: number | null;
  dpd_id: number | null;
  created_at?: string;
  updated_at?: string;
}