import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Package, Calendar, Building, MapPin, Phone, Eye } from 'lucide-react';
import { softwareService } from '../../services/api';
import { Software } from '../../types/software';
import { useAuth } from '../../contexts/AuthContext';
import MainLayout from '../../components/Layout/MainLayout';
import { formatDate } from '../../utils/dateUtils';

const SoftwareList: React.FC = () => {
  const [softwares, setSoftwares] = useState<Software[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadSoftwares();
  }, []);

  const loadSoftwares = async () => {
    try {
      const response = await softwareService.getAll();
      setSoftwares(response.data.softwares);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar la lista de software');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este software?')) return;

    try {
      await softwareService.delete(id.toString());
      setSoftwares(softwares.filter(sw => sw.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al eliminar el software');
    }
  };



  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-secondary">Cargando software...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="card">
          <div className="flex items-center gap-3 text-error">
            <Package className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Package className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-semibold text-text-primary">Gestión de Software</h1>
          </div>
          {(user?.role === 'admin' || user?.role === 'tester') && (
            <button
              onClick={() => navigate('/software/new')}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus size={18} className="mr-2" />
              Nuevo Software
            </button>
          )}
        </div>

        {/* Software Grid */}
        {softwares.length === 0 ? (
          <div className="card text-center py-12">
            <Package className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-secondary mb-2">No hay software registrado</h3>
            <p className="text-text-tertiary mb-6">Comienza registrando tu primer software para evaluación</p>
            {(user?.role === 'admin' || user?.role === 'tester') && (
              <button
                onClick={() => navigate('/software/new')}
                className="btn btn-primary"
              >
                <Plus size={18} className="mr-2" />
                Registrar Software
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {softwares.map((software) => (
              <div key={software.id} className="card hover:shadow-lg transition-all duration-200 group">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                        {software.name}
                      </h3>
                      <p className="text-sm text-text-tertiary">Software</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigate(`/software/${software.id}`)}
                      className="btn btn-outline !p-2 !text-xs"
                      title="Ver detalles"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => navigate(`/software/${software.id}/edit`)}
                      className="btn btn-outline !p-2 !text-xs hover:!bg-secondary/20 hover:!border-secondary hover:!text-secondary"
                      title="Editar"
                    >
                      <Edit size={14} />
                    </button>
                    {(user?.role === 'admin' || user?.role === 'tester') && (
                      <button
                        onClick={() => handleDelete(software.id)}
                        className="btn btn-outline !p-2 !text-xs hover:!bg-error/20 hover:!border-error hover:!text-error"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Building className="w-4 h-4 text-text-tertiary" />
                    <span className="text-text-secondary">{software.company_name}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-text-tertiary" />
                    <span className="text-text-secondary">{software.city}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-text-tertiary" />
                    <span className="text-text-secondary">
                      {formatDate(software.evaluation_date)}
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="badge badge-success">Activo</span>
                    <button
                      onClick={() => navigate(`/software/${software.id}`)}
                      className="btn btn-outline btn-sm flex items-center gap-2 hover:!bg-primary/20 hover:!border-primary hover:!text-primary"
                    >
                      Ver detalles
                      <Eye size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <MainLayout title="Gestión de Software">
      <div className="p-6">
        {renderContent()}
      </div>
    </MainLayout>
  );
};

export default SoftwareList;