import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Target, Plus, Edit, Trash2, ArrowLeft, FileText, Settings, ChevronRight, Layers } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import Modal from '../components/Modal/Modal';
import ParameterForm from '../components/ParameterForm/ParameterForm';
import { parameterService, standardService } from '../services/api';
import { Parameter, ParameterFormData, ParameterUpdateData } from '../types/standard';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/dateUtils';

const ParameterManagement: React.FC = () => {
  const { standardId } = useParams<{ standardId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [standard, setStandard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParameter, setEditingParameter] = useState<Parameter | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const canManageParameters = user?.role === 'admin';

  useEffect(() => {
    if (standardId) {
      loadStandard();
      loadParameters();
    }
  }, [standardId]);

  const loadStandard = async () => {
    try {
      const response = await standardService.getById(standardId!);
      setStandard(response.data);
    } catch (err) {
      console.error('Error loading standard:', err);
      setError('Error al cargar la norma');
    }
  };

  const loadParameters = async () => {
    try {
      setLoading(true);
      const response = await parameterService.getByStandard(standardId!);
      setParameters(response.data.parameters || []);
    } catch (err) {
      console.error('Error loading parameters:', err);
      setError('Error al cargar los parámetros');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingParameter(null);
    setIsModalOpen(true);
  };

  const openEditModal = (parameter: Parameter) => {
    setEditingParameter(parameter);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingParameter(null);
  };

  const handleCreateParameter = async (data: ParameterFormData) => {
    try {
      setFormLoading(true);
      await parameterService.create({
        ...data,
        standard_id: parseInt(standardId!)
      });
      await loadParameters();
      closeModal();
    } catch (err: any) {
      console.error('Error creating parameter:', err);
      throw new Error(err.response?.data?.error || 'Error al crear el parámetro');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateParameter = async (data: ParameterUpdateData) => {
    if (!editingParameter) return;

    try {
      setFormLoading(true);
      await parameterService.update(editingParameter.id.toString(), data);
      await loadParameters();
      closeModal();
    } catch (err: any) {
      console.error('Error updating parameter:', err);
      throw new Error(err.response?.data?.error || 'Error al actualizar el parámetro');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteParameter = async (parameterId: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este parámetro?')) {
      return;
    }

    try {
      await parameterService.delete(parameterId.toString());
      await loadParameters();
    } catch (err: any) {
      console.error('Error deleting parameter:', err);
      setError(err.response?.data?.error || 'Error al eliminar el parámetro');
    }
  };

  // Organizar parámetros en estructura jerárquica
  const organizeParameters = (params: Parameter[]) => {
    const rootParams = params.filter(p => !p.parent_id);
    const childParams = params.filter(p => p.parent_id);

    const addChildren = (param: Parameter): Parameter & { children?: Parameter[] } => {
      const children = childParams.filter(c => c.parent_id === param.id);
      return {
        ...param,
        children: children.length > 0 ? children.map(addChildren) : undefined
      };
    };

    return rootParams.map(addChildren);
  };

  const renderParameter = (param: Parameter & { children?: Parameter[] }, level = 0) => {
    const hasChildren = param.children && param.children.length > 0;

    return (
      <div key={param.id} className={`${level > 0 ? 'ml-8' : ''}`}>
        <div className="card mb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className={`p-2 bg-primary/10 rounded-lg ${level > 0 ? 'bg-secondary/10' : ''}`}>
                <Target className={`w-5 h-5 ${level > 0 ? 'text-secondary' : 'text-primary'}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-text-primary">{param.name}</h3>
                  <span className="text-sm text-text-tertiary">
                    Peso: {(param.weight * 100).toFixed(1)}%
                  </span>
                  {param.status ? (
                    <span className="badge badge-success">Activo</span>
                  ) : (
                    <span className="badge badge-error">Inactivo</span>
                  )}
                </div>
                <p className="text-sm text-text-secondary mb-2">{param.description}</p>
                <div className="text-xs text-text-tertiary">
                  Creado: {param.date_create ? formatDate(param.date_create) : 'No disponible'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/parameters/${param.id}/subcategories`)}
                className="btn btn-outline btn-sm"
                title="Ver subcategorías"
              >
                <Layers size={16} className="mr-1" />
                Subcategorías
              </button>

              {canManageParameters && (
                <>
                  <button
                    onClick={() => openEditModal(param)}
                    className="btn btn-outline btn-sm"
                    title="Editar parámetro"
                  >
                    <Edit size={16} className="mr-1" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteParameter(param.id)}
                    className="btn btn-outline btn-sm text-red-600 hover:text-red-700"
                    title="Eliminar parámetro"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Eliminar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Renderizar hijos */}
        {hasChildren && (
          <div className="ml-4">
            {param.children!.map(child => renderParameter(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-secondary">Cargando parámetros...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const organizedParameters = organizeParameters(parameters);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/standards')}
              className="btn btn-outline btn-sm"
              title="Volver a normas"
            >
              <ArrowLeft size={16} className="mr-2" />
              Volver
            </button>
            <Target className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                Parámetros de {standard?.name || 'Norma'}
              </h1>
              <p className="text-text-secondary">
                Gestiona los parámetros de evaluación de la norma
              </p>
            </div>
          </div>
          {canManageParameters && (
            <button
              onClick={openCreateModal}
              className="btn btn-primary"
            >
              <Plus size={18} className="mr-2" />
              Nuevo Parámetro
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Parameters List */}
        {organizedParameters.length > 0 ? (
          <div>
            {organizedParameters.map(param => renderParameter(param))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-secondary mb-2">No hay parámetros registrados</h3>
            <p className="text-text-tertiary mb-6">
              Comienza agregando el primer parámetro de evaluación para esta norma
            </p>
            {canManageParameters && (
              <button
                onClick={openCreateModal}
                className="btn btn-primary"
              >
                <Plus size={18} className="mr-2" />
                Agregar Parámetro
              </button>
            )}
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingParameter ? 'Editar Parámetro' : 'Nuevo Parámetro'}
          size="md"
        >
          <ParameterForm
            parameter={editingParameter}
            standardId={parseInt(standardId!)}
            availableParents={parameters.filter(p => p.id !== editingParameter?.id)}
            onSubmit={editingParameter ? handleUpdateParameter : handleCreateParameter}
            onCancel={closeModal}
            loading={formLoading}
            isEdit={!!editingParameter}
          />
        </Modal>
      </div>
    </MainLayout>
  );
};

export default ParameterManagement;
