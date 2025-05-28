import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Briefcase, Shield, Save, X } from 'lucide-react';
import { ParticipantFormData, ParticipantUpdateData } from '../../types/participant';
import { userService } from '../../services/api';

interface ParticipantFormProps {
  participant?: any; // Participante existente para edición
  softwareId?: number; // ID del software al que se agregará el participante
  onSubmit: (data: ParticipantFormData | ParticipantUpdateData) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  isEdit?: boolean;
}

const ParticipantForm: React.FC<ParticipantFormProps> = ({
  participant,
  softwareId,
  onSubmit,
  onCancel,
  loading,
  isEdit = false
}) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<ParticipantFormData>();

  const selectedUserId = watch('usr_id');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (isEdit && participant) {
      reset({
        soft_id: participant.soft_id,
        usr_id: participant.usr_id,
        name: participant.name,
        position: participant.position
      });
    } else if (softwareId) {
      reset({
        soft_id: softwareId,
        usr_id: 0,
        name: '',
        position: ''
      });
    }
  }, [participant, softwareId, isEdit, reset]);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await userService.getAll();
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleFormSubmit = async (data: ParticipantFormData) => {
    if (isEdit) {
      // En edición, solo enviar campos modificables
      const updateData: ParticipantUpdateData = {
        name: data.name,
        position: data.position
      };
      await onSubmit(updateData);
    } else {
      await onSubmit(data);
    }
  };

  // Actualizar nombre automáticamente cuando se selecciona un usuario
  useEffect(() => {
    if (selectedUserId && !isEdit) {
      const selectedUser = users.find(user => user.id === parseInt(selectedUserId.toString()));
      if (selectedUser) {
        reset(prev => ({
          ...prev,
          name: selectedUser.nombre
        }));
      }
    }
  }, [selectedUserId, users, isEdit, reset]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Usuario (solo en creación) */}
      {!isEdit && (
        <div className="form-group">
          <label className="form-label flex items-center gap-2">
            <User className="w-4 h-4" />
            Usuario
          </label>
          <select
            {...register('usr_id', {
              required: 'Seleccione un usuario',
              valueAsNumber: true
            })}
            className="form-input"
            disabled={loadingUsers}
          >
            <option value="">
              {loadingUsers ? 'Cargando usuarios...' : 'Seleccione un usuario'}
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.nombre} ({user.email})
              </option>
            ))}
          </select>
          {errors.usr_id && (
            <p className="error-message">{errors.usr_id.message}</p>
          )}
        </div>
      )}

      {/* Nombre del participante */}
      <div className="form-group">
        <label className="form-label flex items-center gap-2">
          <User className="w-4 h-4" />
          Nombre del participante
        </label>
        <input
          type="text"
          {...register('name', {
            required: 'El nombre es requerido',
            minLength: {
              value: 2,
              message: 'El nombre debe tener al menos 2 caracteres'
            }
          })}
          className="form-input"
          placeholder="Nombre completo del participante"
        />
        {errors.name && (
          <p className="error-message">{errors.name.message}</p>
        )}
      </div>

      {/* Cargo/Posición */}
      <div className="form-group">
        <label className="form-label flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          Cargo o posición
        </label>
        <input
          type="text"
          {...register('position', {
            required: 'El cargo es requerido',
            minLength: {
              value: 2,
              message: 'El cargo debe tener al menos 2 caracteres'
            }
          })}
          className="form-input"
          placeholder="Ej: Desarrollador Senior, Analista de Calidad"
        />
        {errors.position && (
          <p className="error-message">{errors.position.message}</p>
        )}
      </div>

      {/* Información sobre roles */}
      <div className="bg-background-lighter rounded-lg p-4">
        <h4 className="text-sm font-medium text-text-secondary mb-2">Información sobre roles:</h4>
        <p className="text-xs text-text-tertiary">
          El rol del participante se determina automáticamente según el rol del usuario en el sistema:
        </p>
        <ul className="text-xs text-text-tertiary space-y-1 mt-2">
          <li><strong>Administrador:</strong> Acceso completo al sistema</li>
          <li><strong>Evaluador (Tester):</strong> Puede realizar evaluaciones y generar reportes</li>
          <li><strong>Usuario:</strong> Participa en el proceso pero no evalúa</li>
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
          {loading ? 'Guardando...' : (isEdit ? 'Actualizar Participante' : 'Agregar Participante')}
        </button>
      </div>
    </form>
  );
};

export default ParticipantForm;
