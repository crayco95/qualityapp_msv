import React, { useEffect, useState } from 'react';
import { Users, Plus, Edit, Trash2, Shield, Mail, Calendar } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import Modal from '../components/Modal/Modal';
import UserForm from '../components/UserForm/UserForm';
import { userService } from '../services/api';
import { User, UserFormData, UserUpdateData, USER_ROLES, ROLE_COLORS } from '../types/user';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/dateUtils';

const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();
      setUsers(response.data.users);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (data: UserFormData) => {
    try {
      setFormLoading(true);
      await userService.create(data);
      await loadUsers();
      setIsModalOpen(false);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear usuario');
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateUser = async (data: UserUpdateData) => {
    if (!editingUser) return;

    try {
      setFormLoading(true);
      await userService.update(editingUser.id.toString(), data);
      await loadUsers();
      setIsModalOpen(false);
      setEditingUser(null);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar usuario');
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('¿Está seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await userService.delete(userId.toString());
      await loadUsers();
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al eliminar usuario');
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
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

  if (loading) {
    return (
      <MainLayout title="Gestión de Usuarios">
        <div className="p-6">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-text-secondary">Cargando usuarios...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Gestión de Usuarios">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-semibold text-text-primary">Gestión de Usuarios</h1>
          </div>
          <button
            onClick={openCreateModal}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Nuevo Usuario
          </button>
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

        {/* Users Table */}
        <div className="card">
          {users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-secondary mb-2">No hay usuarios registrados</h3>
              <p className="text-text-tertiary mb-6">Comienza creando el primer usuario del sistema</p>
              <button
                onClick={openCreateModal}
                className="btn btn-primary"
              >
                <Plus size={18} className="mr-2" />
                Crear Usuario
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-text-secondary">Usuario</th>
                    <th className="text-left py-3 px-4 font-medium text-text-secondary">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-text-secondary">Rol</th>
                    <th className="text-center py-3 px-4 font-medium text-text-secondary">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-background-lighter transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-4">
                          <div className="user-avatar">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div className="user-info">
                            <p className="user-name">{user.nombre}</p>
                            <p className="user-id">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-text-tertiary" />
                          <span className="text-text-secondary">{user.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                          {USER_ROLES[user.role]}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="btn btn-outline btn-sm flex items-center gap-1 hover:!bg-secondary/20 hover:!border-secondary hover:!text-secondary"
                            title="Editar usuario"
                          >
                            <Edit size={14} />
                          </button>
                          {currentUser?.id !== user.id && (
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="btn btn-outline btn-sm flex items-center gap-1 hover:!bg-error/20 hover:!border-error hover:!text-error"
                              title="Eliminar usuario"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
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
          title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
          size="md"
        >
          <UserForm
            user={editingUser}
            onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
            onCancel={closeModal}
            loading={formLoading}
            isEdit={!!editingUser}
          />
        </Modal>
      </div>
    </MainLayout>
  );
};

export default UserManagement;