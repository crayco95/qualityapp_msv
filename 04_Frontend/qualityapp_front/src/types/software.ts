export interface Software {
  id: number;
  name: string;
  general_objective: string;
  specific_objectives: string;
  company_name: string;
  city: string;
  phone: string;
  evaluation_date: string;
  date_create?: string;
  date_update?: string;
}

export interface SoftwareFormData {
  name: string;
  general_objectives: string;
  specific_objectives: string;
  company: string;
  city: string;
  phone: string;
  test_date: string;
}