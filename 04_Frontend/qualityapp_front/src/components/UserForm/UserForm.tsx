import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, Shield, Save, X } from 'lucide-react';
import { UserFormData, UserUpdateData, USER_ROLES } from '../../types/user';

interface UserFormDataWithConfirm extends UserFormData {
  confirmPassword?: string;
}

interface UserFormProps {
  user?: any; // Usuario existente para edición
  onSubmit: (data: UserFormData | UserUpdateData) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  isEdit?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
  loading,
  isEdit = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<UserFormDataWithConfirm>();

  const password = watch('password');

  useEffect(() => {
    if (isEdit && user) {
      reset({
        nombre: user.nombre,
        email: user.email,
        rol: user.role,
        password: '' // No prellenar contraseña en edición
      });
    }
  }, [user, isEdit, reset]);

  const handleFormSubmit = async (data: UserFormDataWithConfirm) => {
    if (isEdit) {
      // En edición, solo enviar password si se proporcionó
      const updateData: UserUpdateData = {
        nombre: data.nombre,
        email: data.email,
        rol: data.rol,
        ...(data.password && { password: data.password })
      };
      await onSubmit(updateData);
    } else {
      await onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Nombre */}
      <div className="form-group">
        <label className="form-label flex items-center gap-2">
          <User className="w-4 h-4" />
          Nombre completo
        </label>
        <input
          type="text"
          {...register('nombre', {
            required: 'El nombre es requerido',
            minLength: {
              value: 2,
              message: 'El nombre debe tener al menos 2 caracteres'
            }
          })}
          className="form-input"
          placeholder="Ingrese el nombre completo"
        />
        {errors.nombre && (
          <p className="error-message">{errors.nombre.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="form-group">
        <label className="form-label flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Correo electrónico
        </label>
        <input
          type="email"
          {...register('email', {
            required: 'El email es requerido',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Formato de email inválido'
            }
          })}
          className="form-input"
          placeholder="usuario@ejemplo.com"
        />
        {errors.email && (
          <p className="error-message">{errors.email.message}</p>
        )}
      </div>

      {/* Contraseña */}
      <div className="form-group">
        <label className="form-label flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Contraseña {isEdit && <span className="text-text-tertiary">(dejar vacío para mantener actual)</span>}
        </label>
        <input
          type="password"
          {...register('password', {
            required: !isEdit ? 'La contraseña es requerida' : false,
            minLength: {
              value: 6,
              message: 'La contraseña debe tener al menos 6 caracteres'
            }
          })}
          className="form-input"
          placeholder={isEdit ? "Nueva contraseña (opcional)" : "Ingrese la contraseña"}
        />
        {errors.password && (
          <p className="error-message">{errors.password.message}</p>
        )}
      </div>

      {/* Confirmar contraseña */}
      {!isEdit && (
        <div className="form-group">
          <label className="form-label flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Confirmar contraseña
          </label>
          <input
            type="password"
            {...register('confirmPassword', {
              required: 'Confirme la contraseña',
              validate: (value) => value === password || 'Las contraseñas no coinciden'
            })}
            className="form-input"
            placeholder="Confirme la contraseña"
          />
          {errors.confirmPassword && (
            <p className="error-message">{errors.confirmPassword.message}</p>
          )}
        </div>
      )}

      {/* Rol */}
      <div className="form-group">
        <label className="form-label flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Rol del usuario
        </label>
        <select
          {...register('rol', { required: 'Seleccione un rol' })}
          className="form-input"
        >
          <option value="">Seleccione un rol</option>
          {Object.entries(USER_ROLES).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        {errors.rol && (
          <p className="error-message">{errors.rol.message}</p>
        )}
      </div>

      {/* Descripción de roles */}
      <div className="bg-background-lighter rounded-lg p-4">
        <h4 className="text-sm font-medium text-text-secondary mb-2">Descripción de roles:</h4>
        <ul className="text-xs text-text-tertiary space-y-1">
          <li><strong>Administrador:</strong> Acceso completo al sistema</li>
          <li><strong>Evaluador:</strong> Puede gestionar software y evaluaciones</li>
          <li><strong>Usuario:</strong> Acceso de solo lectura</li>
        </ul>
      </div>

      {/* Botones */}
      <div className="flex items-center justify-end gap-4 pt-8">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline flex items-center gap-2"
          disabled={loading}
        >
          <X size={16} />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          {loading ? 'Guardando...' : (isEdit ? 'Actualizar Usuario' : 'Crear Usuario')}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
