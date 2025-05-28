/**
 * Utilidades para el manejo de fechas en la aplicación
 */

/**
 * Formatea una fecha para mostrar en la interfaz de usuario
 * Maneja diferentes formatos que puede devolver PostgreSQL
 * @param dateString - Fecha en formato string
 * @returns Fecha formateada en español o mensaje de error
 */
export const formatDate = (dateString: string): string => {
  try {
    // Manejar diferentes formatos de fecha que puede devolver PostgreSQL
    let date: Date;
    
    if (dateString.includes('T')) {
      // Formato ISO: 2024-01-15T10:30:00.000Z
      date = new Date(dateString);
    } else if (dateString.includes('-')) {
      // Formato: 2024-01-15 o 2024-01-15 10:30:00
      date = new Date(dateString);
    } else {
      // Fallback para otros formatos
      date = new Date(dateString);
    }
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error al formatear fecha:', error, 'Fecha recibida:', dateString);
    return 'Fecha inválida';
  }
};

/**
 * Formatea una fecha para usar en inputs de tipo date (YYYY-MM-DD)
 * @param dateString - Fecha en formato string
 * @returns Fecha en formato YYYY-MM-DD o string vacío si es inválida
 */
export const formatDateForInput = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '';
    }
    // Convertir a formato YYYY-MM-DD para el input date
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error al formatear fecha para input:', error);
    return '';
  }
};

/**
 * Formatea una fecha con hora para mostrar en la interfaz
 * @param dateString - Fecha en formato string
 * @returns Fecha y hora formateada en español
 */
export const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error al formatear fecha y hora:', error);
    return 'Fecha inválida';
  }
};

/**
 * Formatea una fecha de forma corta (DD/MM/YYYY)
 * @param dateString - Fecha en formato string
 * @returns Fecha en formato corto
 */
export const formatDateShort = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    console.error('Error al formatear fecha corta:', error);
    return 'Fecha inválida';
  }
};

/**
 * Verifica si una fecha es válida
 * @param dateString - Fecha en formato string
 * @returns true si la fecha es válida, false en caso contrario
 */
export const isValidDate = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch (error) {
    return false;
  }
};

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD
 * @returns Fecha actual en formato para input date
 */
export const getCurrentDateForInput = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Calcula la diferencia en días entre dos fechas
 * @param date1 - Primera fecha
 * @param date2 - Segunda fecha
 * @returns Diferencia en días
 */
export const getDaysDifference = (date1: string, date2: string): number => {
  try {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return 0;
    }
    
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (error) {
    console.error('Error al calcular diferencia de días:', error);
    return 0;
  }
};
