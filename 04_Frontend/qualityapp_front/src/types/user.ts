export interface User {
  id: number;
  nombre: string;
  email: string;
  role: 'admin' | 'user' | 'tester';
}

export interface UserFormData {
  nombre: string;
  email: string;
  password: string;
  rol: 'admin' | 'user' | 'tester';
}

export interface UserUpdateData {
  nombre: string;
  email: string;
  password?: string; // Opcional para actualización
  rol: 'admin' | 'user' | 'tester';
}

export const USER_ROLES = {
  admin: 'Administrador',
  user: 'Usuario',
  tester: 'Evaluador'
} as const;

export const ROLE_COLORS = {
  admin: 'error',
  user: 'success', 
  tester: 'warning'
} as const;
