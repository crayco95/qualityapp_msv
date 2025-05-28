import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import { classificationService } from '../services/api';
import { toast } from 'react-toastify';

interface Classification {
  id: number;
  range_min: number;
  range_max: number;
  level: string;
  date_create?: string;
  date_update?: string;
}

const ClassificationManagement: React.FC = () => {
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClassification, setEditingClassification] = useState<Classification | null>(null);
  const [formData, setFormData] = useState({
    range_min: '',
    range_max: '',
    level: ''
  });

  useEffect(() => {
    loadClassifications();
  }, []);

  const loadClassifications = async () => {
    try {
      setLoading(true);
      const response = await classificationService.getAll();
      setClassifications(response.data || []);
    } catch (error) {
      console.error('Error loading classifications:', error);
      toast.error('Error al cargar las clasificaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = {
        range_min: parseInt(formData.range_min),
        range_max: parseInt(formData.range_max),
        level: formData.level
      };

      if (editingClassification) {
        await classificationService.update(editingClassification.id.toString(), data);
        toast.success('Clasificación actualizada exitosamente');
      } else {
        await classificationService.create(data);
        toast.success('Clasificación creada exitosamente');
      }

      setShowModal(false);
      setEditingClassification(null);
      setFormData({ range_min: '', range_max: '', level: '' });
      loadClassifications();
    } catch (error) {
      console.error('Error saving classification:', error);
      toast.error('Error al guardar la clasificación');
    }
  };

  const handleEdit = (classification: Classification) => {
    setEditingClassification(classification);
    setFormData({
      range_min: classification.range_min.toString(),
      range_max: classification.range_max.toString(),
      level: classification.level
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta clasificación?')) {
      try {
        await classificationService.delete(id.toString());
        toast.success('Clasificación eliminada exitosamente');
        loadClassifications();
      } catch (error) {
        console.error('Error deleting classification:', error);
        toast.error('Error al eliminar la clasificación');
      }
    }
  };

  const resetForm = () => {
    setFormData({ range_min: '', range_max: '', level: '' });
    setEditingClassification(null);
    setShowModal(false);
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'excelente': return 'bg-green-100 text-green-800';
      case 'bueno': return 'bg-blue-100 text-blue-800';
      case 'regular': return 'bg-yellow-100 text-yellow-800';
      case 'deficiente': return 'bg-orange-100 text-orange-800';
      case 'muy deficiente': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout title="Gestión de Clasificaciones">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Clasificaciones de Calidad</h1>
            <p className="text-text-secondary">Gestiona los rangos de clasificación para las evaluaciones</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            <Plus size={20} className="mr-2" />
            Nueva Clasificación
          </button>
        </div>

        {/* Classifications Table */}
        <div className="bg-background-light rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-lighter">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Rango
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Nivel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Fecha Creación
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-text-secondary">
                      Cargando clasificaciones...
                    </td>
                  </tr>
                ) : classifications.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-text-secondary">
                      No hay clasificaciones registradas
                    </td>
                  </tr>
                ) : (
                  classifications.map((classification) => (
                    <tr key={classification.id} className="hover:bg-background-lighter">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-text-primary">
                          {classification.range_min} - {classification.range_max}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(classification.level)}`}>
                          {classification.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {classification.date_create ? new Date(classification.date_create).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(classification)}
                            className="text-primary hover:text-primary-dark"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(classification.id)}
                            className="text-error hover:text-error-dark"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-background-light rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                {editingClassification ? 'Editar Clasificación' : 'Nueva Clasificación'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Rango Mínimo
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.range_min}
                    onChange={(e) => setFormData({ ...formData, range_min: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Rango Máximo
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.range_max}
                    onChange={(e) => setFormData({ ...formData, range_max: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Nivel
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="form-input"
                    required
                  >
                    <option value="">Seleccionar nivel</option>
                    <option value="Muy Deficiente">Muy Deficiente</option>
                    <option value="Deficiente">Deficiente</option>
                    <option value="Regular">Regular</option>
                    <option value="Bueno">Bueno</option>
                    <option value="Excelente">Excelente</option>
                  </select>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn btn-outline"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editingClassification ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ClassificationManagement;
