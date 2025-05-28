import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FileText, Save, X, AlertCircle } from 'lucide-react';
import { StandardFormData, StandardUpdateData, Standard } from '../../types/standard';

interface StandardFormProps {
  standard?: Standard; // Norma existente para edición
  onSubmit: (data: StandardFormData | StandardUpdateData) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  isEdit?: boolean;
}

const StandardForm: React.FC<StandardFormProps> = ({
  standard,
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
  } = useForm<StandardFormData>();

  useEffect(() => {
    if (isEdit && standard) {
      reset({
        name: standard.name,
        description: standard.description,
        version: standard.version,
        status: standard.status
      });
    } else {
      reset({
        name: '',
        description: '',
        version: '',
        status: true
      });
    }
  }, [standard, isEdit, reset]);

  const handleFormSubmit = async (data: StandardFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-2 bg-primary/10 rounded-lg">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {isEdit ? 'Editar Norma' : 'Nueva Norma'}
          </h3>
          <p className="text-sm text-text-secondary">
            {isEdit ? 'Modifica los datos de la norma' : 'Completa la información de la nueva norma'}
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Nombre */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Nombre de la Norma *
          </label>
          <input
            type="text"
            id="name"
            {...register('name', {
              required: 'El nombre es requerido',
              minLength: {
                value: 2,
                message: 'El nombre debe tener al menos 2 caracteres'
              },
              maxLength: {
                value: 100,
                message: 'El nombre no puede exceder 100 caracteres'
              }
            })}
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="Ej: ISO 25010"
            disabled={loading}
          />
          {errors.name && (
            <p className="error-message">
              <AlertCircle size={14} className="inline mr-1" />
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Versión */}
        <div className="form-group">
          <label htmlFor="version" className="form-label">
            Versión *
          </label>
          <input
            type="text"
            id="version"
            {...register('version', {
              required: 'La versión es requerida',
              maxLength: {
                value: 50,
                message: 'La versión no puede exceder 50 caracteres'
              }
            })}
            className={`form-input ${errors.version ? 'error' : ''}`}
            placeholder="Ej: 2011, v1.0, 2024"
            disabled={loading}
          />
          {errors.version && (
            <p className="error-message">
              <AlertCircle size={14} className="inline mr-1" />
              {errors.version.message}
            </p>
          )}
        </div>

        {/* Descripción */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Descripción *
          </label>
          <textarea
            id="description"
            rows={3}
            {...register('description', {
              required: 'La descripción es requerida',
              minLength: {
                value: 10,
                message: 'La descripción debe tener al menos 10 caracteres'
              }
            })}
            className={`form-input resize-none ${errors.description ? 'error' : ''}`}
            placeholder="Describe el propósito y alcance de esta norma de evaluación..."
            disabled={loading}
          />
          {errors.description && (
            <p className="error-message">
              <AlertCircle size={14} className="inline mr-1" />
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Estado */}
        <div className="form-group">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register('status')}
              className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2"
              disabled={loading}
            />
            <span className="form-label mb-0">
              Norma activa
            </span>
          </label>
          <p className="text-xs text-text-tertiary mt-1">
            Las normas inactivas no estarán disponibles para nuevas evaluaciones
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline"
          disabled={loading}
        >
          <X size={18} className="mr-2" />
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Guardando...
            </>
          ) : (
            <>
              <Save size={18} className="mr-2" />
              {isEdit ? 'Actualizar' : 'Crear'} Norma
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default StandardForm;
