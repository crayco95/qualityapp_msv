import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layers, Plus, Edit, Trash2, ArrowLeft, Target, Settings } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import Modal from '../components/Modal/Modal';
import SubcategoryForm from '../components/SubcategoryForm/SubcategoryForm';
import { subcategoryService, parameterService } from '../services/api';
import { Subcategory, SubcategoryFormData, SubcategoryUpdateData, Parameter } from '../types/standard';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/dateUtils';

const SubcategoryManagement: React.FC = () => {
  const { parameterId } = useParams<{ parameterId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [parameter, setParameter] = useState<Parameter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const canManageSubcategories = user?.role === 'admin';

  useEffect(() => {
    if (parameterId) {
      loadParameter();
      loadSubcategories();
    }
  }, [parameterId]);

  const loadParameter = async () => {
    try {
      const response = await parameterService.getById(parameterId!);
      setParameter(response.data);
    } catch (err) {
      console.error('Error loading parameter:', err);
      setError('Error al cargar el parámetro');
    }
  };

  const loadSubcategories = async () => {
    try {
      setLoading(true);
      const response = await subcategoryService.getByParameter(parameterId!);
      // El backend devuelve directamente un array, no un objeto con subcategories
      setSubcategories(response.data || []);
    } catch (err) {
      console.error('Error loading subcategories:', err);
      setError('Error al cargar las subcategorías');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingSubcategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSubcategory(null);
  };

  const handleCreateSubcategory = async (data: SubcategoryFormData) => {
    try {
      setFormLoading(true);
      await subcategoryService.create({
        ...data,
        parameter_id: parseInt(parameterId!)
      });
      await loadSubcategories();
      closeModal();
    } catch (err: any) {
      console.error('Error creating subcategory:', err);
      throw new Error(err.response?.data?.error || 'Error al crear la subcategoría');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateSubcategory = async (data: SubcategoryUpdateData) => {
    if (!editingSubcategory) return;

    try {
      setFormLoading(true);
      await subcategoryService.update(editingSubcategory.id.toString(), data);
      await loadSubcategories();
      closeModal();
    } catch (err: any) {
      console.error('Error updating subcategory:', err);
      throw new Error(err.response?.data?.error || 'Error al actualizar la subcategoría');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteSubcategory = async (subcategoryId: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta subcategoría?')) {
      return;
    }

    try {
      await subcategoryService.delete(subcategoryId.toString());
      await loadSubcategories();
    } catch (err: any) {
      console.error('Error deleting subcategory:', err);
      setError(err.response?.data?.error || 'Error al eliminar la subcategoría');
    }
  };

  const goBackToParameters = () => {
    if (parameter?.standard_id) {
      navigate(`/standards/${parameter.standard_id}/parameters`);
    } else {
      navigate('/standards');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-secondary">Cargando subcategorías...</p>
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
            <button
              onClick={goBackToParameters}
              className="btn btn-outline btn-sm"
              title="Volver a parámetros"
            >
              <ArrowLeft size={16} className="mr-2" />
              Volver
            </button>
            <Layers className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                Subcategorías de {parameter?.name || 'Parámetro'}
              </h1>
              <p className="text-text-secondary">
                Gestiona las subcategorías de evaluación del parámetro
              </p>
            </div>
          </div>
          {canManageSubcategories && (
            <button
              onClick={openCreateModal}
              className="btn btn-primary"
            >
              <Plus size={18} className="mr-2" />
              Nueva Subcategoría
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Subcategories Grid */}
        {subcategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subcategories.map((subcategory) => (
              <div key={subcategory.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <Layers className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">{subcategory.name}</h3>
                      <p className="text-sm text-text-secondary">
                        ID: {subcategory.id}
                      </p>
                    </div>
                  </div>
                  <span className="badge badge-success">Activa</span>
                </div>

                <p className="text-text-secondary text-sm mb-4 line-clamp-3">
                  {subcategory.description}
                </p>

                <div className="text-xs text-text-tertiary mb-4">
                  Creada: {subcategory.date_create ? formatDate(subcategory.date_create) : 'No disponible'}
                </div>

                {canManageSubcategories && (
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(subcategory)}
                      className="btn btn-outline btn-sm"
                      title="Editar subcategoría"
                    >
                      <Edit size={16} className="mr-1" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteSubcategory(subcategory.id)}
                      className="btn btn-outline btn-sm text-red-600 hover:text-red-700"
                      title="Eliminar subcategoría"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Layers className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-secondary mb-2">No hay subcategorías registradas</h3>
            <p className="text-text-tertiary mb-6">
              Comienza agregando la primera subcategoría de evaluación para este parámetro
            </p>
            {canManageSubcategories && (
              <button
                onClick={openCreateModal}
                className="btn btn-primary"
              >
                <Plus size={18} className="mr-2" />
                Agregar Subcategoría
              </button>
            )}
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingSubcategory ? 'Editar Subcategoría' : 'Nueva Subcategoría'}
          size="md"
        >
          <SubcategoryForm
            subcategory={editingSubcategory}
            parameterId={parseInt(parameterId!)}
            onSubmit={editingSubcategory ? handleUpdateSubcategory : handleCreateSubcategory}
            onCancel={closeModal}
            loading={formLoading}
            isEdit={!!editingSubcategory}
          />
        </Modal>
      </div>
    </MainLayout>
  );
};

export default SubcategoryManagement;
