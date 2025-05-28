import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Layers, Save, X, AlertCircle } from 'lucide-react';
import { Subcategory, SubcategoryFormData, SubcategoryUpdateData } from '../../types/standard';

interface SubcategoryFormProps {
  subcategory?: Subcategory | null;
  parameterId: number;
  onSubmit: (data: SubcategoryFormData | SubcategoryUpdateData) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  isEdit?: boolean;
}

const SubcategoryForm: React.FC<SubcategoryFormProps> = ({
  subcategory,
  parameterId,
  onSubmit,
  onCancel,
  loading,
  isEdit = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SubcategoryFormData>();

  useEffect(() => {
    if (isEdit && subcategory) {
      reset({
        parameter_id: subcategory.param_id, // Usar param_id del backend
        name: subcategory.name,
        description: subcategory.description
      });
    } else {
      reset({
        parameter_id: parameterId,
        name: '',
        description: ''
      });
    }
  }, [subcategory, parameterId, isEdit, reset]);

  const handleFormSubmit = async (data: SubcategoryFormData) => {
    try {
      const formData = {
        parameter_id: data.parameter_id,
        name: data.name,
        description: data.description
      };

      if (isEdit) {
        // Para edición, solo enviar campos que pueden cambiar
        const updateData: SubcategoryUpdateData = {
          name: formData.name,
          description: formData.description
        };
        await onSubmit(updateData);
      } else {
        await onSubmit(formData);
      }
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-2 bg-secondary/10 rounded-lg">
          <Layers className="w-6 h-6 text-secondary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {isEdit ? 'Editar Subcategoría' : 'Nueva Subcategoría'}
          </h3>
          <p className="text-sm text-text-secondary">
            {isEdit ? 'Modifica los datos de la subcategoría' : 'Completa la información de la nueva subcategoría'}
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Nombre */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Nombre de la Subcategoría *
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
            placeholder="Ej: Adecuación Funcional, Precisión, Interoperabilidad"
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
            placeholder="Describe qué aspectos específicos evalúa esta subcategoría..."
            disabled={loading}
          />
          {errors.description && (
            <p className="error-message">
              <AlertCircle size={14} className="inline mr-1" />
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Nota temporal */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Nota:</strong> Los campos de peso y estado serán implementados en una versión futura.
            Por ahora, las subcategorías se crean con valores por defecto.
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
              {isEdit ? 'Actualizar' : 'Crear'} Subcategoría
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default SubcategoryForm;
