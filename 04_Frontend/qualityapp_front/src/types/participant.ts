export interface Participant {
  id: number;
  name: string;
  position: string;
  soft_id: number;
  usr_id: number;
  signature?: string;
  date_create?: string;
  user_name?: string;
  user_email?: string;
  user_role?: 'admin' | 'user' | 'tester'; // Rol del usuario desde au_users
  software_name?: string;
}

export interface ParticipantFormData {
  soft_id: number;
  usr_id: number;
  name: string;
  position: string;
  signature?: string;
}

export interface ParticipantUpdateData {
  name?: string;
  position?: string;
  signature?: string;
}

// Mapeo de roles de usuario para mostrar en la interfaz
export const USER_ROLES_DISPLAY = {
  admin: 'Administrador',
  user: 'Usuario',
  tester: 'Evaluador'
} as const;

export const USER_ROLE_COLORS = {
  admin: 'error',
  user: 'success',
  tester: 'warning'
} as const;
