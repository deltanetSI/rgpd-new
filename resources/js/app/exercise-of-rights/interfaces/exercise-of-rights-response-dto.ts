
export interface ExerciseOfRightsResponseDto {
  id: number;
  organization_id: number;
  template_type: string;
  full_name: string;
  full_address: string;
  nif: string;
  download_url: string;
  city: string;
  date: string; 
  filepath: string | null;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  organization?: OrganizationDto;
}

export interface OrganizationDto {
  id: number;
  name: string;
}