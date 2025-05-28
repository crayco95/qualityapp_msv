import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Building,
  MapPin,
  Calendar,
  Phone,
  Target,
  FileText,
  Activity
} from 'lucide-react';
import { softwareService } from '../../services/api';
import { Software } from '../../types/software';
import { useAuth } from '../../contexts/AuthContext';
import MainLayout from '../../components/Layout/MainLayout';
import { formatDate } from '../../utils/dateUtils';

const SoftwareDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [software, setSoftware] = useState<Software | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadSoftware();
    }
  }, [id]);

  const loadSoftware = async () => {
    try {
      setLoading(true);
      const response = await softwareService.getById(id!);
      setSoftware(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar el software');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Está seguro de eliminar este software? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await softwareService.delete(id!);
      navigate('/software');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al eliminar el software');
    }
  };

  const handleCreateEvaluation = () => {
    // Navegar a evaluaciones con el software preseleccionado
    navigate('/evaluations', {
      state: {
        preselectedSoftware: software,
        openCreateModal: true
      }
    });
  };

  const handleViewEvaluations = () => {
    // Navegar a evaluaciones filtradas por este software
    navigate('/evaluations', {
      state: {
        filterBySoftware: software?.id
      }
    });
  };



  if (loading) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-text-secondary">Cargando software...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !software) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="card">
            <div className="flex items-center gap-3 text-error">
              <Package className="w-5 h-5" />
              <p>{error || 'Software no encontrado'}</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/software')}
                className="btn btn-outline !p-2"
                title="Volver a la lista"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-text-primary">{software.name}</h1>
                  <p className="text-text-tertiary">Detalles del software</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/software/${id}/edit`)}
                className="btn btn-outline flex items-center gap-2 hover:!bg-secondary/20 hover:!border-secondary hover:!text-secondary"
              >
                <Edit size={16} />
                Editar
              </button>
              {(user?.role === 'admin' || user?.role === 'tester') && (
                <button
                  onClick={handleDelete}
                  className="btn btn-danger flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              )}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info Card */}
              <div className="card">
                <h2 className="text-lg font-medium text-text-primary mb-6 flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" />
                  Información General
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-text-tertiary">Nombre del Software</label>
                    <p className="text-text-primary font-medium mt-1">{software.name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-text-tertiary">Empresa</label>
                    <p className="text-text-primary font-medium mt-1">{software.company_name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-text-tertiary">Ciudad</label>
                    <p className="text-text-primary font-medium mt-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-text-tertiary" />
                      {software.city}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-text-tertiary">Fecha de Evaluación</label>
                    <p className="text-text-primary font-medium mt-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-text-tertiary" />
                      {formatDate(software.evaluation_date)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Objectives Card */}
              <div className="card">
                <h2 className="text-lg font-medium text-text-primary mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Objetivos
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-text-tertiary">Objetivo General</label>
                    <div className="mt-2 p-4 bg-background-lighter rounded-lg">
                      <p className="text-text-secondary leading-relaxed">{software.general_objective}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-text-tertiary">Objetivos Específicos</label>
                    <div className="mt-2 p-4 bg-background-lighter rounded-lg">
                      <p className="text-text-secondary leading-relaxed">{software.specific_objectives}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status Card */}
              <div className="card">
                <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Estado
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Estado</span>
                    <span className="badge badge-success">Activo</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Evaluaciones</span>
                    <span className="text-text-primary font-medium">0</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Última actualización</span>
                    <span className="text-text-primary font-medium">Hoy</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Acciones Rápidas
                </h3>

                <div className="space-y-3">
                  <button
                    onClick={handleViewEvaluations}
                    className="w-full btn btn-outline flex items-center justify-start gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Ver Evaluaciones
                  </button>

                  <button
                    onClick={handleCreateEvaluation}
                    className="w-full btn btn-outline flex items-center justify-start gap-2 hover:!bg-primary/20 hover:!border-primary hover:!text-primary"
                  >
                    <Activity className="w-4 h-4" />
                    Nueva Evaluación
                  </button>

                  <button className="w-full btn btn-outline flex items-center justify-start gap-2 hover:!bg-secondary/20 hover:!border-secondary hover:!text-secondary">
                    <FileText className="w-4 h-4" />
                    Generar Reporte
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SoftwareDetail;
