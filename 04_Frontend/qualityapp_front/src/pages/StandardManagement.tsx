import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, Edit, Trash2, Settings, ChevronRight, FileText, Target } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import Modal from '../components/Modal/Modal';
import StandardForm from '../components/StandardForm/StandardForm';
import { standardService } from '../services/api';
import { Standard, StandardFormData, StandardUpdateData, STANDARD_STATUS_DISPLAY, STANDARD_STATUS_COLORS } from '../types/standard';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/dateUtils';

const StandardManagement: React.FC = () => {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStandard, setEditingStandard] = useState<Standard | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadStandards();
  }, []);

  const loadStandards = async () => {
    try {
      setLoading(true);
      const response = await standardService.getAll();
      setStandards(response.data.standards || []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar normas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStandard = async (data: StandardFormData) => {
    try {
      setFormLoading(true);
      await standardService.create(data);
      await loadStandards();
      setIsModalOpen(false);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear norma');
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateStandard = async (data: StandardUpdateData) => {
    if (!editingStandard) return;

    try {
      setFormLoading(true);
      await standardService.update(editingStandard.id.toString(), data);
      await loadStandards();
      setIsModalOpen(false);
      setEditingStandard(null);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar norma');
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteStandard = async (standardId: number) => {
    if (!window.confirm('¿Está seguro de eliminar esta norma? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await standardService.delete(standardId.toString());
      await loadStandards();
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al eliminar norma');
    }
  };

  const openCreateModal = () => {
    setEditingStandard(null);
    setIsModalOpen(true);
  };

  const openEditModal = (standard: Standard) => {
    setEditingStandard(standard);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStandard(null);
  };

  const getStatusBadgeClass = (status: boolean) => {
    return STANDARD_STATUS_COLORS[status];
  };

  const canManageStandards = user?.role === 'admin';

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-text-secondary">Cargando normas...</p>
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
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Gestión de Normas</h1>
              <p className="text-text-secondary">Administra las normas de evaluación de calidad</p>
            </div>
          </div>
          {canManageStandards && (
            <button
              onClick={openCreateModal}
              className="btn btn-primary"
            >
              <Plus size={18} className="mr-2" />
              Nueva Norma
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Standards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {standards.map((standard) => (
            <div key={standard.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">{standard.name}</h3>
                    <p className="text-sm text-text-secondary">Versión {standard.version}</p>
                  </div>
                </div>
                <span className={`badge ${getStatusBadgeClass(standard.status)}`}>
                  {STANDARD_STATUS_DISPLAY[standard.status]}
                </span>
              </div>

              <p className="text-text-secondary text-sm mb-4 line-clamp-3">
                {standard.description}
              </p>

              <div className="text-xs text-text-tertiary mb-4">
                Creada: {standard.date_create ? formatDate(standard.date_create) : 'No disponible'}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigate(`/standards/${standard.id}/parameters`)}
                  className="btn btn-outline btn-sm"
                >
                  <Target size={16} className="mr-2" />
                  Parámetros
                </button>

                {canManageStandards && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(standard)}
                      className="btn btn-outline btn-sm"
                      title="Editar norma"
                    >
                      <Edit size={16} className="mr-1" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteStandard(standard.id)}
                      className="btn btn-outline btn-sm text-red-600 hover:text-red-700"
                      title="Eliminar norma"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {standards.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-secondary mb-2">No hay normas registradas</h3>
            <p className="text-text-tertiary mb-6">
              Comienza agregando la primera norma de evaluación al sistema
            </p>
            {canManageStandards && (
              <button
                onClick={openCreateModal}
                className="btn btn-primary"
              >
                <Plus size={18} className="mr-2" />
                Agregar Norma
              </button>
            )}
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingStandard ? 'Editar Norma' : 'Nueva Norma'}
          size="md"
        >
          <StandardForm
            standard={editingStandard}
            onSubmit={editingStandard ? handleUpdateStandard : handleCreateStandard}
            onCancel={closeModal}
            loading={formLoading}
            isEdit={!!editingStandard}
          />
        </Modal>
      </div>
    </MainLayout>
  );
};

export default StandardManagement;
