import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Package, Building, MapPin, Calendar, Phone, Target } from 'lucide-react';
import { softwareService } from '../../services/api';
import { Software, SoftwareFormData } from '../../types/software';
import MainLayout from '../../components/Layout/MainLayout';
import { formatDateForInput } from '../../utils/dateUtils';

const SoftwareForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SoftwareFormData>();

  useEffect(() => {
    if (id) {
      loadSoftware();
    }
  }, [id]);



  const loadSoftware = async () => {
    try {
      setLoading(true);
      const response = await softwareService.getById(id!);
      const software: Software = response.data;
      reset({
        name: software.name,
        general_objectives: software.general_objective,
        specific_objectives: software.specific_objectives,
        company: software.company_name,
        city: software.city,
        phone: software.phone || '',
        test_date: formatDateForInput(software.evaluation_date)
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar el software');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SoftwareFormData) => {
    try {
      setLoading(true);
      setError(null);

      if (id) {
        await softwareService.update(id, data);
      } else {
        await softwareService.create(data);
      }

      navigate('/software');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar el software');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-text-secondary">Cargando...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/software')}
              className="btn btn-outline !p-2"
              title="Volver a la lista"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-semibold text-text-primary">
                {id ? 'Editar Software' : 'Nuevo Software'}
              </h1>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="card mb-6">
              <div className="flex items-center gap-3 text-error">
                <Package className="w-5 h-5" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-medium text-text-primary mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Información General
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Nombre del Software
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Este campo es requerido' })}
                    className="form-input"
                    placeholder="Ingrese el nombre del software"
                  />
                  {errors.name && (
                    <p className="error-message">{errors.name.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Empresa
                  </label>
                  <input
                    type="text"
                    {...register('company', { required: 'Este campo es requerido' })}
                    className="form-input"
                    placeholder="Nombre de la empresa"
                  />
                  {errors.company && (
                    <p className="error-message">{errors.company.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Ciudad
                  </label>
                  <input
                    type="text"
                    {...register('city', { required: 'Este campo es requerido' })}
                    className="form-input"
                    placeholder="Ciudad donde se encuentra"
                  />
                  {errors.city && (
                    <p className="error-message">{errors.city.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Teléfono
                  </label>
                  <input
                    type="text"
                    {...register('phone')}
                    className="form-input"
                    placeholder="Número de contacto (opcional)"
                  />
                </div>

                <div className="form-group md:col-span-2">
                  <label className="form-label flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Fecha de Evaluación
                  </label>
                  <input
                    type="date"
                    {...register('test_date', { required: 'Este campo es requerido' })}
                    className="form-input"
                  />
                  {errors.test_date && (
                    <p className="error-message">{errors.test_date.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-medium text-text-primary mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Objetivos
              </h2>

              <div className="space-y-6">
                <div className="form-group">
                  <label className="form-label">Objetivo General</label>
                  <textarea
                    {...register('general_objectives', { required: 'Este campo es requerido' })}
                    rows={4}
                    className="form-input"
                    placeholder="Describa el objetivo general del software"
                  />
                  {errors.general_objectives && (
                    <p className="error-message">{errors.general_objectives.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Objetivos Específicos</label>
                  <textarea
                    {...register('specific_objectives', { required: 'Este campo es requerido' })}
                    rows={4}
                    className="form-input"
                    placeholder="Describa los objetivos específicos del software"
                  />
                  {errors.specific_objectives && (
                    <p className="error-message">{errors.specific_objectives.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/software')}
                className="btn btn-outline flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {loading ? 'Guardando...' : 'Guardar Software'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default SoftwareForm;