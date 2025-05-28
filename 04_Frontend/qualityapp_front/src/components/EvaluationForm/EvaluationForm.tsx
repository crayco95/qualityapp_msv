import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ClipboardCheck, Save, X, AlertCircle } from 'lucide-react';
import { Assessment, AssessmentFormData, Software, Standard, Parameter } from '../../types/standard';
import { parameterService } from '../../services/api';

interface EvaluationFormProps {
  evaluation?: Assessment | null;
  softwares: Software[];
  standards: Standard[];
  preselectedSoftware?: Software | null;
  onSubmit: (data: AssessmentFormData | Partial<AssessmentFormData>) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  isEdit?: boolean;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({
  evaluation,
  softwares,
  standards,
  preselectedSoftware,
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
  } = useForm<AssessmentFormData>();

  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [loadingParameters, setLoadingParameters] = useState(false);

  const selectedSoftware = watch('software_id');
  const selectedStandard = watch('standard_id');
  const selectedParameter = watch('param_id');

  // Cargar parámetros cuando se seleccione un estándar
  useEffect(() => {
    const loadParameters = async () => {
      if (selectedStandard) {
        try {
          setLoadingParameters(true);
          console.log('Loading parameters for standard:', selectedStandard);
          const response = await parameterService.getByStandard(selectedStandard.toString());
          console.log('Parameters response:', response.data);
          setParameters(response.data.parameters || []);
        } catch (error) {
          console.error('Error loading parameters:', error);
          setParameters([]);
        } finally {
          setLoadingParameters(false);
        }
      } else {
        setParameters([]);
      }
    };

    loadParameters();
  }, [selectedStandard]);

  // Debug: Log de datos recibidos
  useEffect(() => {
    console.log('EvaluationForm - Datos recibidos:', {
      softwares: softwares.length,
      standards: standards.length,
      parameters: parameters.length,
      evaluation,
      preselectedSoftware,
      isEdit
    });
  }, [softwares, standards, parameters, evaluation, preselectedSoftware, isEdit]);

  useEffect(() => {
    if (isEdit && evaluation) {
      reset({
        software_id: evaluation.software_id,
        standard_id: evaluation.standard_id,
        param_id: evaluation.param_id,
        status: evaluation.status || 'pending',
        score: evaluation.score || undefined
      });
    } else {
      // Si hay software preseleccionado, usarlo
      const defaultSoftwareId = preselectedSoftware ? preselectedSoftware.id : undefined;
      reset({
        software_id: defaultSoftwareId,
        standard_id: undefined,
        param_id: undefined,
        status: 'pending',
        score: undefined
      });
    }
  }, [evaluation, preselectedSoftware, isEdit, reset]);

  const handleFormSubmit = async (data: AssessmentFormData) => {
    try {
      const formData = {
        software_id: Number(data.software_id),
        standard_id: Number(data.standard_id),
        param_id: Number(data.param_id),
        score: data.score ? Number(data.score) : undefined
        // Nota: status no se envía al backend ya que no está implementado en la BD
      };

      if (isEdit) {
        // Para edición, solo enviar campos que pueden cambiar
        const updateData = {
          score: formData.score
        };
        await onSubmit(updateData);
      } else {
        await onSubmit(formData);
      }
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const getSelectedSoftware = () => {
    return softwares.find(s => s.id === Number(selectedSoftware));
  };

  const getSelectedStandard = () => {
    return standards.find(s => s.id === Number(selectedStandard));
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="p-2 bg-primary/10 rounded-lg">
          <ClipboardCheck className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {isEdit ? 'Editar Evaluación' : 'Nueva Evaluación'}
          </h3>
          <p className="text-sm text-text-secondary">
            {isEdit ? 'Modifica los datos de la evaluación' : 'Completa la información de la nueva evaluación'}
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Software */}
        <div className="form-group">
          <label htmlFor="software_id" className="form-label">
            Software a Evaluar *
          </label>
          <select
            id="software_id"
            {...register('software_id', {
              required: 'Debe seleccionar un software'
            })}
            className={`form-input ${errors.software_id ? 'error' : ''}`}
            disabled={loading || isEdit || !!preselectedSoftware} // No permitir cambiar si está preseleccionado
          >
            <option value="">Seleccione un software</option>
            {softwares.length > 0 ? (
              softwares.map((software) => (
                <option key={software.id} value={software.id}>
                  {software.name} - {software.company_name}
                </option>
              ))
            ) : (
              <option disabled>No hay software disponible</option>
            )}
          </select>
          {errors.software_id && (
            <p className="error-message">
              <AlertCircle size={14} className="inline mr-1" />
              {errors.software_id.message}
            </p>
          )}
          {preselectedSoftware && (
            <div className="mt-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-primary font-medium">
                ✓ Software preseleccionado: {preselectedSoftware.name}
              </p>
            </div>
          )}
          {selectedSoftware && getSelectedSoftware() && (
            <div className="mt-2 p-3 bg-background-lighter rounded-lg">
              <p className="text-sm text-text-secondary">
                <strong>Empresa:</strong> {getSelectedSoftware()?.company_name}
              </p>
              <p className="text-sm text-text-secondary">
                <strong>Ciudad:</strong> {getSelectedSoftware()?.city}
              </p>
            </div>
          )}
        </div>

        {/* Norma */}
        <div className="form-group">
          <label htmlFor="standard_id" className="form-label">
            Norma de Evaluación *
          </label>
          <select
            id="standard_id"
            {...register('standard_id', {
              required: 'Debe seleccionar una norma'
            })}
            className={`form-input ${errors.standard_id ? 'error' : ''}`}
            disabled={loading || isEdit} // No permitir cambiar norma en edición
          >
            <option value="">Seleccione una norma</option>
            {standards.length > 0 ? (
              standards.filter(s => s.status).map((standard) => (
                <option key={standard.id} value={standard.id}>
                  {standard.name} - Versión {standard.version}
                </option>
              ))
            ) : (
              <option disabled>No hay normas disponibles</option>
            )}
          </select>
          {errors.standard_id && (
            <p className="error-message">
              <AlertCircle size={14} className="inline mr-1" />
              {errors.standard_id.message}
            </p>
          )}
          {selectedStandard && getSelectedStandard() && (
            <div className="mt-2 p-3 bg-background-lighter rounded-lg">
              <p className="text-sm text-text-secondary">
                <strong>Descripción:</strong> {getSelectedStandard()?.description}
              </p>
            </div>
          )}
        </div>

        {/* Parámetro */}
        <div className="form-group">
          <label htmlFor="param_id" className="form-label">
            Parámetro a Evaluar *
          </label>
          <select
            id="param_id"
            {...register('param_id', {
              required: 'Debe seleccionar un parámetro'
            })}
            className={`form-input ${errors.param_id ? 'error' : ''}`}
            disabled={loading || isEdit || !selectedStandard || loadingParameters}
          >
            <option value="">
              {!selectedStandard
                ? 'Primero seleccione una norma'
                : loadingParameters
                  ? 'Cargando parámetros...'
                  : 'Seleccione un parámetro'
              }
            </option>
            {parameters.length > 0 ? (
              parameters.filter(p => p.status).map((parameter) => (
                <option key={parameter.id} value={parameter.id}>
                  {parameter.name} (Peso: {parameter.weight})
                </option>
              ))
            ) : selectedStandard && !loadingParameters ? (
              <option disabled>No hay parámetros disponibles para esta norma</option>
            ) : null}
          </select>
          {errors.param_id && (
            <p className="error-message">
              <AlertCircle size={14} className="inline mr-1" />
              {errors.param_id.message}
            </p>
          )}
          {selectedParameter && parameters.find(p => p.id === Number(selectedParameter)) && (
            <div className="mt-2 p-3 bg-background-lighter rounded-lg">
              <p className="text-sm text-text-secondary">
                <strong>Descripción:</strong> {parameters.find(p => p.id === Number(selectedParameter))?.description}
              </p>
            </div>
          )}
        </div>

        {/* Estado - Comentado temporalmente hasta implementar en BD */}
        {/*
        <div className="form-group">
          <label htmlFor="status" className="form-label">
            Estado de la Evaluación *
          </label>
          <select
            id="status"
            {...register('status', {
              required: 'Debe seleccionar un estado'
            })}
            className={`form-input ${errors.status ? 'error' : ''}`}
            disabled={loading}
          >
            <option value="pending">Pendiente</option>
            <option value="in_progress">En Progreso</option>
            <option value="completed">Completada</option>
          </select>
          {errors.status && (
            <p className="error-message">
              <AlertCircle size={14} className="inline mr-1" />
              {errors.status.message}
            </p>
          )}
        </div>
        */}

        {/* Puntuación */}
        <div className="form-group">
          <label htmlFor="score" className="form-label">
            Puntuación (0 - 100)
          </label>
          <input
            type="number"
            id="score"
            step="0.01"
            min="0"
            max="100"
            {...register('score', {
              min: {
                value: 0,
                message: 'La puntuación debe ser mayor o igual a 0'
              },
              max: {
                value: 100,
                message: 'La puntuación debe ser menor o igual a 100'
              }
            })}
            className={`form-input ${errors.score ? 'error' : ''}`}
            placeholder="85.50"
            disabled={loading}
          />
          {errors.score && (
            <p className="error-message">
              <AlertCircle size={14} className="inline mr-1" />
              {errors.score.message}
            </p>
          )}
          <p className="text-xs text-text-tertiary mt-1">
            La puntuación se calcula automáticamente durante la evaluación. Puede ajustarla manualmente si es necesario.
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
              {isEdit ? 'Actualizar' : 'Crear'} Evaluación
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default EvaluationForm;
