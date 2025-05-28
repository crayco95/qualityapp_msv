import React, { useEffect, useState } from 'react';
import { Users, Plus, Edit, Trash2, Shield, Package, User, Briefcase } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import Modal from '../components/Modal/Modal';
import ParticipantForm from '../components/ParticipantForm/ParticipantForm';
import { participantService, softwareService } from '../services/api';
import { Participant, ParticipantFormData, ParticipantUpdateData, USER_ROLES_DISPLAY, USER_ROLE_COLORS } from '../types/participant';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/dateUtils';

const ParticipantManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [software, setSoftware] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedSoftware, setSelectedSoftware] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedSoftware === 'all') {
      loadParticipants();
    } else {
      loadParticipantsBySoftware(selectedSoftware);
    }
  }, [selectedSoftware]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadParticipants(),
        loadSoftware()
      ]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const loadParticipants = async () => {
    try {
      const response = await participantService.getAll();
      setParticipants(response.data.participants || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar participantes');
    }
  };

  const loadParticipantsBySoftware = async (softwareId: string) => {
    try {
      const response = await participantService.getBySoftware(softwareId);
      setParticipants(response.data.participants || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar participantes');
    }
  };

  const loadSoftware = async () => {
    try {
      const response = await softwareService.getAll();
      setSoftware(response.data.softwares || []);
    } catch (err: any) {
      console.error('Error al cargar software:', err);
    }
  };

  const handleCreateParticipant = async (data: ParticipantFormData) => {
    try {
      setFormLoading(true);
      await participantService.create(data);
      if (selectedSoftware === 'all') {
        await loadParticipants();
      } else {
        await loadParticipantsBySoftware(selectedSoftware);
      }
      setIsModalOpen(false);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear participante');
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateParticipant = async (data: ParticipantUpdateData) => {
    if (!editingParticipant) return;

    try {
      setFormLoading(true);
      await participantService.update(editingParticipant.id.toString(), data);
      if (selectedSoftware === 'all') {
        await loadParticipants();
      } else {
        await loadParticipantsBySoftware(selectedSoftware);
      }
      setIsModalOpen(false);
      setEditingParticipant(null);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar participante');
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteParticipant = async (participantId: number) => {
    if (!window.confirm('¿Está seguro de eliminar este participante? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await participantService.delete(participantId.toString());
      if (selectedSoftware === 'all') {
        await loadParticipants();
      } else {
        await loadParticipantsBySoftware(selectedSoftware);
      }
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al eliminar participante');
    }
  };

  const openCreateModal = () => {
    setEditingParticipant(null);
    setIsModalOpen(true);
  };

  const openEditModal = (participant: Participant) => {
    setEditingParticipant(participant);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingParticipant(null);
    setError(null);
  };

  const getRoleBadgeClass = (role: string) => {
    const colorMap = {
      admin: 'badge-error',
      tester: 'badge-warning',
      user: 'badge-success'
    };
    return colorMap[role as keyof typeof colorMap] || 'badge-success';
  };

  const getSelectedSoftwareName = () => {
    if (selectedSoftware === 'all') return 'Todos los software';
    const soft = software.find(s => s.id.toString() === selectedSoftware);
    return soft ? soft.name : 'Software seleccionado';
  };

  if (loading) {
    return (
      <MainLayout title="Gestión de Participantes">
        <div className="p-6">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-text-secondary">Cargando participantes...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Gestión de Participantes">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-semibold text-text-primary">Gestión de Participantes</h1>
          </div>
          <button
            onClick={openCreateModal}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Nuevo Participante
          </button>
        </div>

        {/* Filtro por software */}
        <div className="card mb-6">
          <div className="flex items-center gap-4">
            <Package className="w-5 h-5 text-text-secondary" />
            <label className="text-sm font-medium text-text-secondary">Filtrar por software:</label>
            <select
              value={selectedSoftware}
              onChange={(e) => setSelectedSoftware(e.target.value)}
              className="form-input max-w-xs"
            >
              <option value="all">Todos los software</option>
              {software.map((soft) => (
                <option key={soft.id} value={soft.id.toString()}>
                  {soft.name}
                </option>
              ))}
            </select>
            <span className="text-sm text-text-tertiary">
              Mostrando participantes de: <strong>{getSelectedSoftwareName()}</strong>
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="card mb-6">
            <div className="flex items-center gap-3 text-error">
              <Users className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Participants Table */}
        <div className="card">
          {participants.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-secondary mb-2">
                No hay participantes registrados
              </h3>
              <p className="text-text-tertiary mb-6">
                {selectedSoftware === 'all'
                  ? 'Comienza agregando el primer participante al sistema'
                  : 'No hay participantes para el software seleccionado'
                }
              </p>
              <button
                onClick={openCreateModal}
                className="btn btn-primary"
              >
                <Plus size={18} className="mr-2" />
                Agregar Participante
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-text-secondary">Participante</th>
                    <th className="text-left py-3 px-4 font-medium text-text-secondary">Software</th>
                    <th className="text-left py-3 px-4 font-medium text-text-secondary">Cargo</th>
                    <th className="text-left py-3 px-4 font-medium text-text-secondary">Rol</th>
                    <th className="text-left py-3 px-4 font-medium text-text-secondary">Fecha</th>
                    <th className="text-center py-3 px-4 font-medium text-text-secondary">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant) => (
                    <tr key={participant.id} className="border-b border-border hover:bg-background-lighter transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-4">
                          <div className="user-avatar">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="user-info">
                            <p className="user-name">{participant.name}</p>
                            <p className="user-id">
                              {participant.user_email ? participant.user_email : `ID: ${participant.id}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-text-tertiary" />
                          <span className="text-text-secondary">
                            {participant.software_name || 'Software no disponible'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-text-tertiary" />
                          <span className="text-text-secondary">{participant.position}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`badge ${getRoleBadgeClass(participant.user_role || 'user')}`}>
                          {USER_ROLES_DISPLAY[participant.user_role as keyof typeof USER_ROLES_DISPLAY] || 'Usuario'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-text-secondary text-sm">
                          {participant.date_create ? formatDate(participant.date_create) : 'No disponible'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(participant)}
                            className="btn btn-outline btn-sm flex items-center gap-1 hover:!bg-secondary/20 hover:!border-secondary hover:!text-secondary"
                            title="Editar participante"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteParticipant(participant.id)}
                            className="btn btn-outline btn-sm flex items-center gap-1 hover:!bg-error/20 hover:!border-error hover:!text-error"
                            title="Eliminar participante"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingParticipant ? 'Editar Participante' : 'Nuevo Participante'}
          size="md"
        >
          <ParticipantForm
            participant={editingParticipant}
            softwareId={selectedSoftware !== 'all' ? parseInt(selectedSoftware) : undefined}
            onSubmit={editingParticipant ? handleUpdateParticipant : handleCreateParticipant}
            onCancel={closeModal}
            loading={formLoading}
            isEdit={!!editingParticipant}
          />
        </Modal>
      </div>
    </MainLayout>
  );
};

export default ParticipantManagement;
