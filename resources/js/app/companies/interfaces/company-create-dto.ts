export interface CompanyCreateDto {
  name: string;
  address: string;
  tax_id: string; 
  phone: string; 
  email: string;
  type: string;
  city: string;
  province: string;
  postal_code: string;
  activity: string;
  exercise_rights_email: string; 
  website: string; 
  number_of_employees: number | null;
  external_hosting: boolean;
  data_sharing: boolean;
  international_transfers: boolean;
  mass_mailing: boolean;
  legal_name: string;
  user_id: number | null;
  dpd_id: number | null;
  country: string;
  registered_address: string;
}