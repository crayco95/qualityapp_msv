export interface Standard {
  id: number;
  name: string;
  description: string;
  version: string;
  status: boolean;
  date_create?: string;
  date_update?: string;
}

export interface StandardFormData {
  name: string;
  description: string;
  version: string;
  status?: boolean;
}

export interface StandardUpdateData {
  name?: string;
  description?: string;
  version?: string;
  status?: boolean;
}

export interface Parameter {
  id: number;
  standard_id: number;
  name: string;
  description: string;
  weight: number;
  parent_id?: number;
  status: boolean;
  date_create?: string;
  date_update?: string;
  children?: Parameter[];
  level?: number;
  standard_name?: string;
  parent_name?: string;
}

export interface ParameterFormData {
  standard_id: number;
  name: string;
  description: string;
  weight: number;
  parent_id?: number;
  status?: boolean;
}

export interface ParameterUpdateData {
  name?: string;
  description?: string;
  weight?: number;
  status?: boolean;
}

export interface Subcategory {
  id: number;
  param_id: number; // El backend devuelve param_id, no parameter_id
  name: string;
  description: string;
  // weight y status serán implementados en el futuro
  weight?: number;
  status?: boolean;
  date_create?: string;
  date_update?: string;
}

export interface SubcategoryFormData {
  parameter_id: number;
  name: string;
  description: string;
  // weight y status serán implementados en el futuro
  weight?: number;
  status?: boolean;
}

export interface SubcategoryUpdateData {
  name?: string;
  description?: string;
  // weight y status serán implementados en el futuro
  weight?: number;
  status?: boolean;
}

export interface Assessment {
  id: number;
  software_id: number;
  standard_id: number;
  param_id: number;
  status: 'pending' | 'in_progress' | 'completed';
  score?: number;
  date_create?: string;
  date_update?: string;
}

export interface AssessmentFormData {
  software_id: number | string;
  standard_id: number | string;
  param_id: number | string;
  status?: 'pending' | 'in_progress' | 'completed'; // Opcional hasta implementar en BD
  score?: number | string;
}

export interface Classification {
  id: number;
  name: string;
  description: string;
  min_score: number;
  max_score: number;
  color: string;
  date_create?: string;
  date_update?: string;
}

export interface Result {
  id: number;
  assessment_id: number;
  parameter_id: number;
  subcategory_id?: number;
  score: number;
  comments?: string;
  date_create?: string;
  date_update?: string;
}



// Constantes para el estado de las normas
export const STANDARD_STATUS = {
  ACTIVE: true,
  INACTIVE: false
} as const;

export const STANDARD_STATUS_DISPLAY = {
  [STANDARD_STATUS.ACTIVE]: 'Activa',
  [STANDARD_STATUS.INACTIVE]: 'Inactiva'
} as const;

export const STANDARD_STATUS_COLORS = {
  [STANDARD_STATUS.ACTIVE]: 'bg-green-100 text-green-800',
  [STANDARD_STATUS.INACTIVE]: 'bg-red-100 text-red-800'
} as const;
