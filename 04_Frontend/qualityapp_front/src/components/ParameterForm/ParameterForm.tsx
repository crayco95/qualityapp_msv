import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Target, Save, X, AlertCircle } from 'lucide-react';
import { Parameter, ParameterFormData, ParameterUpdateData } from '../../types/standard';

interface ParameterFormProps {
  parameter?: Parameter | null;
  standardId: number;
  availableParents: Parameter[];
  onSubmit: (data: ParameterFormData | ParameterUpdateData) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  isEdit?: boolean;
}

const ParameterForm: React.FC<ParameterFormProps> = ({
  parameter,
  standardId,
  availableParents,
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
  } = useForm<ParameterFormData>();

  const parentId = watch('parent_id');

  useEffect(() => {
    if (isEdit && parameter) {
      reset({
        standard_id: parameter.standard_id,
        name: parameter.name,
        description: parameter.description,
        weight: parameter.weight,
        parent_id: parameter.parent_id || undefined,
        status: parameter.status
      });
    } else {
      reset({
        standard_id: standardId,
        name: '',
        description: '',
        weight: 0,
        parent_id: undefined,
        status: true
      });
    }
  }, [parameter, standardId, isEdit, reset]);

  const handleFormSubmit = async (data: ParameterFormData) => {
    try {
      // Convertir parent_id vacío a undefined
      const formData = {
        ...data,
        parent_id: data.parent_id || undefined,
        weight: Number(data.weight)
      };

      if (isEdit) {
        // Para edición, solo enviar campos que pueden cambiar
        const updateData: ParameterUpdateData = {
          name: formData.name,
          description: formData.description,
          weight: formData.weight,
          status: formData.status
        };
        await onSubmit(updateData);
      } else {
        await onSubmit(formData);
      }
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  // Filtrar padres disponibles para evitar referencias circulares
  const getAvailableParents = () => {
    if (!isEdit) return availableParents;
    
    // En edición, excluir el parámetro actual y sus descendientes
    return availableParents.filter(p => {
      // No puede ser padre de sí mismo
      if (p.id === parameter?.id) return false;
      
      // No puede ser padre si ya es hijo del parámetro actual
      if (p.parent_id === parameter?.id) return false;
      
      return true;
    });
  };

  const filteredParents = getAvailableParents();

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Target className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {isEdit ? 'Editar Parámetro' : 'Nuevo Parámetro'}
          </h3>
          <p className="text-sm text-text-secondary">
            {isEdit ? 'Modifica los datos del parámetro' : 'Completa la información del nuevo parámetro'}
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Nombre */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Nombre del Parámetro *
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
            placeholder="Ej: Funcionalidad, Usabilidad, Rendimiento"
            disabled={loading}
          />
          {errors.name && (
            <p className="error-message">
              <AlertCircle size={14} className="inline mr-1" />
              {errors.name.message}
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
            placeholder="Describe qué evalúa este parámetro y su importancia..."
            disabled={loading}
          />
          {errors.description && (
            <p className="error-message">
              <AlertCircle size={14} className="inline mr-1" />
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Peso */}
        <div className="form-group">
          <label htmlFor="weight" className="form-label">
            Peso (0.0 - 1.0) *
          </label>
          <input
            type="number"
            id="weight"
            step="0.01"
            min="0"
            max="1"
            {...register('weight', {
              required: 'El peso es requerido',
              min: {
                value: 0,
                message: 'El peso debe ser mayor o igual a 0'
              },
              max: {
                value: 1,
                message: 'El peso debe ser menor o igual a 1'
              },
              valueAsNumber: true
            })}
            className={`form-input ${errors.weight ? 'error' : ''}`}
            placeholder="0.25"
            disabled={loading}
          />
          {errors.weight && (
            <p className="error-message">
              <AlertCircle size={14} className="inline mr-1" />
              {errors.weight.message}
            </p>
          )}
          <p className="text-xs text-text-tertiary mt-1">
            El peso representa la importancia relativa de este parámetro (ej: 0.25 = 25%)
          </p>
        </div>

        {/* Parámetro Padre */}
        <div className="form-group">
          <label htmlFor="parent_id" className="form-label">
            Parámetro Padre (Opcional)
          </label>
          <select
            id="parent_id"
            {...register('parent_id', {
              valueAsNumber: true
            })}
            className="form-input"
            disabled={loading}
          >
            <option value="">Sin parámetro padre (Parámetro principal)</option>
            {filteredParents.map((parent) => (
              <option key={parent.id} value={parent.id}>
                {parent.name} (Peso: {(parent.weight * 100).toFixed(1)}%)
              </option>
            ))}
          </select>
          <p className="text-xs text-text-tertiary mt-1">
            Los subparámetros heredan la estructura jerárquica de evaluación
          </p>
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
              Parámetro activo
            </span>
          </label>
          <p className="text-xs text-text-tertiary mt-1">
            Los parámetros inactivos no se incluirán en las evaluaciones
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
              {isEdit ? 'Actualizar' : 'Crear'} Parámetro
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ParameterForm;
