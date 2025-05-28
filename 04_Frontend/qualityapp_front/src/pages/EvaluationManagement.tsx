import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ClipboardCheck, Plus, Eye, Edit, Trash2, Download, FileText, Package, Target } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import Modal from '../components/Modal/Modal';
import EvaluationForm from '../components/EvaluationForm/EvaluationForm';
import { assessmentService, softwareService, standardService, reportService } from '../services/api';
import { Assessment, AssessmentFormData, Software, Standard } from '../types/standard';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/dateUtils';

const EvaluationManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [evaluations, setEvaluations] = useState<Assessment[]>([]);
  const [softwares, setSoftwares] = useState<Software[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState<Assessment | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [preselectedSoftware, setPreselectedSoftware] = useState<Software | null>(null);

  const canManageEvaluations = user?.role === 'admin' || user?.role === 'tester';

  useEffect(() => {
    loadData();
  }, []);

  // Manejar software preseleccionado desde navegación
  useEffect(() => {
    if (location.state?.preselectedSoftware) {
      setPreselectedSoftware(location.state.preselectedSoftware);
      if (location.state?.openCreateModal) {
        setIsModalOpen(true);
      }
      // Limpiar el state para evitar que se mantenga en navegaciones futuras
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Cargar evaluaciones (puede fallar si no hay endpoint)
      let evaluationsData = [];
      try {
        const evaluationsRes = await assessmentService.getAll();
        evaluationsData = evaluationsRes.data || [];
      } catch (evalErr) {
        console.warn('No se pudieron cargar las evaluaciones:', evalErr);
      }

      // Cargar software y normas
      const [softwaresRes, standardsRes] = await Promise.all([
        softwareService.getAll(),
        standardService.getAll()
      ]);

      setEvaluations(evaluationsData);

      // Verificar la estructura de respuesta del API
      const softwareData = softwaresRes.data?.softwares || [];
      const standardData = standardsRes.data?.standards || [];

      setSoftwares(softwareData);
      setStandards(standardData);

      console.log('Datos cargados:', {
        evaluations: evaluationsData.length,
        softwares: softwareData.length,
        standards: standardData.length,
        softwareRaw: softwaresRes.data,
        standardRaw: standardsRes.data
      });

    } catch (err) {
      console.error('Error loading data:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingEvaluation(null);
    setIsModalOpen(true);
  };

  const openEditModal = (evaluation: Assessment) => {
    setEditingEvaluation(evaluation);
    setPreselectedSoftware(null); // Limpiar preselección al editar
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEvaluation(null);
    setPreselectedSoftware(null); // Limpiar preselección al cerrar
  };

  const handleCreateEvaluation = async (data: AssessmentFormData) => {
    try {
      setFormLoading(true);
      await assessmentService.create(data);
      await loadData();
      closeModal();
    } catch (err: any) {
      console.error('Error creating evaluation:', err);
      throw new Error(err.response?.data?.error || 'Error al crear la evaluación');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateEvaluation = async (data: Partial<AssessmentFormData>) => {
    if (!editingEvaluation) return;

    try {
      setFormLoading(true);
      await assessmentService.update(editingEvaluation.id.toString(), data);
      await loadData();
      closeModal();
    } catch (err: any) {
      console.error('Error updating evaluation:', err);
      throw new Error(err.response?.data?.error || 'Error al actualizar la evaluación');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteEvaluation = async (evaluationId: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta evaluación?')) {
      return;
    }

    try {
      await assessmentService.delete(evaluationId.toString());
      await loadData();
    } catch (err: any) {
      console.error('Error deleting evaluation:', err);
      setError(err.response?.data?.error || 'Error al eliminar la evaluación');
    }
  };

  const handleDownloadReport = async (evaluationId: number) => {
    try {
      const response = await reportService.getAssessmentReport(evaluationId.toString());
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `evaluacion_${evaluationId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Error downloading report:', err);
      setError('Error al descargar el reporte');
    }
  };

  const getSoftwareName = (softwareId: number) => {
    const software = softwares.find(s => s.id === softwareId);
    return software?.name || 'Software no encontrado';
  };

  const getStandardName = (standardId: number) => {
    const standard = standards.find(s => s.id === standardId);
    return standard?.name || 'Norma no encontrada';
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'in_progress':
        return 'badge-warning';
      case 'pending':
        return 'badge-secondary';
      default:
        return 'badge-secondary';
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completada';
      case 'in_progress':
        return 'En Progreso';
      case 'pending':
        return 'Pendiente';
      default:
        return 'Desconocido';
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-secondary">Cargando evaluaciones...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ClipboardCheck className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Gestión de Evaluaciones</h1>
              <p className="text-text-secondary">Administra las evaluaciones de calidad del software</p>
            </div>
          </div>
          {canManageEvaluations && (
            <button
              onClick={openCreateModal}
              className="btn btn-primary"
            >
              <Plus size={18} className="mr-2" />
              Nueva Evaluación
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Evaluations Grid */}
        {evaluations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {evaluations.map((evaluation) => (
              <div key={evaluation.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <ClipboardCheck className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">
                        Evaluación #{evaluation.id}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {getSoftwareName(evaluation.software_id)}
                      </p>
                    </div>
                  </div>
                  <span className={`badge ${getStatusBadgeClass(evaluation.status)}`}>
                    {getStatusDisplay(evaluation.status)}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Package className="w-4 h-4 text-text-tertiary" />
                    <span className="text-text-secondary">
                      {getSoftwareName(evaluation.software_id)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Target className="w-4 h-4 text-text-tertiary" />
                    <span className="text-text-secondary">
                      {getStandardName(evaluation.standard_id)}
                    </span>
                  </div>

                  {evaluation.score !== undefined && (
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-text-tertiary">Puntuación:</span>
                      <span className="font-semibold text-primary">
                        {(evaluation.score * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-text-tertiary mb-4">
                  Creada: {evaluation.date_create ? formatDate(evaluation.date_create) : 'No disponible'}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => navigate(`/evaluations/${evaluation.id}`)}
                    className="btn btn-outline btn-sm"
                  >
                    <Eye size={16} className="mr-2" />
                    Ver Detalles
                  </button>

                  <div className="flex items-center gap-2">
                    {evaluation.status === 'completed' && (
                      <button
                        onClick={() => handleDownloadReport(evaluation.id)}
                        className="btn btn-outline btn-sm"
                        title="Descargar reporte"
                      >
                        <Download size={16} className="mr-1" />
                        PDF
                      </button>
                    )}

                    {canManageEvaluations && (
                      <>
                        <button
                          onClick={() => openEditModal(evaluation)}
                          className="btn btn-outline btn-sm"
                          title="Editar evaluación"
                        >
                          <Edit size={16} className="mr-1" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteEvaluation(evaluation.id)}
                          className="btn btn-outline btn-sm text-red-600 hover:text-red-700"
                          title="Eliminar evaluación"
                        >
                          <Trash2 size={16} className="mr-1" />
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ClipboardCheck className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-secondary mb-2">No hay evaluaciones registradas</h3>
            <p className="text-text-tertiary mb-6">
              Comienza creando la primera evaluación de calidad
            </p>
            {canManageEvaluations && (
              <button
                onClick={openCreateModal}
                className="btn btn-primary"
              >
                <Plus size={18} className="mr-2" />
                Crear Evaluación
              </button>
            )}
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingEvaluation ? 'Editar Evaluación' : 'Nueva Evaluación'}
          size="md"
        >
          <EvaluationForm
            evaluation={editingEvaluation}
            softwares={softwares}
            standards={standards}
            preselectedSoftware={preselectedSoftware}
            onSubmit={editingEvaluation ? handleUpdateEvaluation : handleCreateEvaluation}
            onCancel={closeModal}
            loading={formLoading}
            isEdit={!!editingEvaluation}
          />
        </Modal>
      </div>
    </MainLayout>
  );
};

export default EvaluationManagement;