import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Save, CheckCircle, AlertCircle } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import { softwareService, standardService, parameterService, assessmentService, classificationService } from '../services/api';
import { toast } from 'react-toastify';

interface Software {
  id: number;
  name: string;
  company_name: string;
  city: string;
}

interface Standard {
  id: number;
  name: string;
  version: string;
  description: string;
}

interface Parameter {
  id: number;
  name: string;
  description: string;
  weight: number;
  parent_id?: number;
}

interface Classification {
  id: number;
  range_min: number;
  range_max: number;
  level: string;
}

interface EvaluationData {
  software_id: number;
  standard_id: number;
  param_id: number;
  score: number;
  classification_id?: number;
}

const EvaluationProcess: React.FC = () => {
  const { softwareId, standardId } = useParams<{ softwareId: string; standardId: string }>();
  const navigate = useNavigate();
  
  const [software, setSoftware] = useState<Software | null>(null);
  const [standard, setStandard] = useState<Standard | null>(null);
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [currentParameterIndex, setCurrentParameterIndex] = useState(0);
  const [evaluations, setEvaluations] = useState<Map<number, EvaluationData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (softwareId && standardId) {
      loadData();
    }
  }, [softwareId, standardId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [softwareRes, standardRes, parametersRes, classificationsRes] = await Promise.all([
        softwareService.getById(softwareId!),
        standardService.getById(standardId!),
        parameterService.getByStandard(standardId!),
        classificationService.getAll()
      ]);

      setSoftware(softwareRes.data);
      setStandard(standardRes.data);
      setParameters(parametersRes.data.parameters || []);
      setClassifications(classificationsRes.data || []);
    } catch (error) {
      console.error('Error loading evaluation data:', error);
      toast.error('Error al cargar los datos de evaluación');
      navigate('/evaluations');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentParameter = () => parameters[currentParameterIndex];

  const getClassificationForScore = (score: number): Classification | undefined => {
    return classifications.find(c => score >= c.range_min && score <= c.range_max);
  };

  const handleScoreChange = (score: number) => {
    const currentParam = getCurrentParameter();
    if (!currentParam) return;

    const classification = getClassificationForScore(score);
    
    const evaluationData: EvaluationData = {
      software_id: parseInt(softwareId!),
      standard_id: parseInt(standardId!),
      param_id: currentParam.id,
      score,
      classification_id: classification?.id
    };

    setEvaluations(prev => new Map(prev.set(currentParam.id, evaluationData)));
  };

  const getCurrentEvaluation = () => {
    const currentParam = getCurrentParameter();
    return currentParam ? evaluations.get(currentParam.id) : undefined;
  };

  const canGoNext = () => currentParameterIndex < parameters.length - 1;
  const canGoPrevious = () => currentParameterIndex > 0;
  const isLastParameter = () => currentParameterIndex === parameters.length - 1;

  const handleNext = () => {
    if (canGoNext()) {
      setCurrentParameterIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious()) {
      setCurrentParameterIndex(prev => prev - 1);
    }
  };

  const saveCurrentEvaluation = async () => {
    const currentEvaluation = getCurrentEvaluation();
    if (!currentEvaluation) {
      toast.error('Por favor, asigna una puntuación antes de guardar');
      return;
    }

    try {
      setSaving(true);
      await assessmentService.create(currentEvaluation);
      toast.success('Evaluación guardada exitosamente');
      
      if (isLastParameter()) {
        toast.success('¡Evaluación completa finalizada!');
        navigate('/evaluations');
      } else {
        handleNext();
      }
    } catch (error) {
      console.error('Error saving evaluation:', error);
      toast.error('Error al guardar la evaluación');
    } finally {
      setSaving(false);
    }
  };

  const saveAllEvaluations = async () => {
    if (evaluations.size === 0) {
      toast.error('No hay evaluaciones para guardar');
      return;
    }

    try {
      setSaving(true);
      const promises = Array.from(evaluations.values()).map(evaluation => 
        assessmentService.create(evaluation)
      );
      
      await Promise.all(promises);
      toast.success('Todas las evaluaciones guardadas exitosamente');
      navigate('/evaluations');
    } catch (error) {
      console.error('Error saving evaluations:', error);
      toast.error('Error al guardar las evaluaciones');
    } finally {
      setSaving(false);
    }
  };

  const getProgressPercentage = () => {
    return ((currentParameterIndex + 1) / parameters.length) * 100;
  };

  const getEvaluatedCount = () => evaluations.size;

  if (loading) {
    return (
      <MainLayout title="Proceso de Evaluación">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-secondary">Cargando datos de evaluación...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!software || !standard || parameters.length === 0) {
    return (
      <MainLayout title="Proceso de Evaluación">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-error mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            No se pudieron cargar los datos
          </h2>
          <p className="text-text-secondary mb-4">
            Verifica que el software y estándar seleccionados sean válidos
          </p>
          <button
            onClick={() => navigate('/evaluations')}
            className="btn btn-primary"
          >
            Volver a Evaluaciones
          </button>
        </div>
      </MainLayout>
    );
  }

  const currentParam = getCurrentParameter();
  const currentEvaluation = getCurrentEvaluation();
  const currentClassification = currentEvaluation?.score ? getClassificationForScore(currentEvaluation.score) : undefined;

  return (
    <MainLayout title="Proceso de Evaluación">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-background-light rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Proceso de Evaluación</h1>
              <p className="text-text-secondary">
                {software.name} - {standard.name} v{standard.version}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-secondary">Progreso</p>
              <p className="text-lg font-semibold text-primary">
                {currentParameterIndex + 1} de {parameters.length}
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-background-lighter rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-text-tertiary mt-2">
            <span>Evaluaciones completadas: {getEvaluatedCount()}</span>
            <span>{getProgressPercentage().toFixed(1)}% completado</span>
          </div>
        </div>

        {/* Current Parameter Evaluation */}
        <div className="bg-background-light rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              {currentParam.name}
            </h2>
            <p className="text-text-secondary mb-4">
              {currentParam.description}
            </p>
            <div className="text-sm text-text-tertiary">
              Peso: {(currentParam.weight * 100).toFixed(1)}%
            </div>
          </div>

          {/* Score Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Puntuación (0-100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={currentEvaluation?.score || ''}
              onChange={(e) => handleScoreChange(parseFloat(e.target.value) || 0)}
              className="form-input w-full"
              placeholder="Ingresa la puntuación"
            />
          </div>

          {/* Classification Display */}
          {currentClassification && (
            <div className="mb-6 p-4 bg-background-lighter rounded-lg">
              <h3 className="text-sm font-medium text-text-primary mb-2">Clasificación</h3>
              <div className="flex items-center gap-2">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  currentClassification.level === 'Excelente' ? 'bg-green-100 text-green-800' :
                  currentClassification.level === 'Bueno' ? 'bg-blue-100 text-blue-800' :
                  currentClassification.level === 'Regular' ? 'bg-yellow-100 text-yellow-800' :
                  currentClassification.level === 'Deficiente' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentClassification.level}
                </span>
                <span className="text-sm text-text-secondary">
                  ({currentClassification.range_min} - {currentClassification.range_max})
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={!canGoPrevious()}
            className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} className="mr-2" />
            Anterior
          </button>

          <div className="flex gap-3">
            <button
              onClick={saveCurrentEvaluation}
              disabled={!currentEvaluation?.score || saving}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={20} className="mr-2" />
                  {isLastParameter() ? 'Finalizar' : 'Guardar y Continuar'}
                </>
              )}
            </button>

            {evaluations.size > 0 && (
              <button
                onClick={saveAllEvaluations}
                disabled={saving}
                className="btn btn-secondary"
              >
                <CheckCircle size={20} className="mr-2" />
                Guardar Todo
              </button>
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={!canGoNext()}
            className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
            <ChevronRight size={20} className="ml-2" />
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default EvaluationProcess;
