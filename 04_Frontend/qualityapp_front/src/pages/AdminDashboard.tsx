import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MainLayout from '../components/Layout/MainLayout';
import { Users, Package, ClipboardCheck, FileText, TrendingUp, BarChart3 } from 'lucide-react';
import { userService, softwareService, standardService, assessmentService } from '../services/api';
import '../styles/Dashboard.css';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSoftware: 0,
    totalStandards: 0,
    totalEvaluations: 0,
    pendingEvaluations: 0,
    completedEvaluations: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);

        // Fetch statistics from API with proper error handling
        const results = await Promise.allSettled([
          userService.getAll(),
          softwareService.getAll(),
          standardService.getAll(),
          assessmentService.getAll()
        ]);

        // Extract data safely and handle different response structures
        const usersResult = results[0];
        const softwareResult = results[1];
        const standardsResult = results[2];
        const assessmentsResult = results[3];

        let totalUsers = 0;
        let totalSoftware = 0;
        let totalStandards = 0;
        let totalEvaluations = 0;
        let pendingEvals = 0;
        let completedEvals = 0;

        // Handle users data
        if (usersResult.status === 'fulfilled') {
          const usersData = usersResult.value.data;
          totalUsers = usersData?.users ? usersData.users.length : 0;
        }

        // Handle software data
        if (softwareResult.status === 'fulfilled') {
          const softwareData = softwareResult.value.data;
          totalSoftware = softwareData?.softwares ? softwareData.softwares.length : 0;
        }

        // Handle standards data
        if (standardsResult.status === 'fulfilled') {
          const standardsData = standardsResult.value.data;
          totalStandards = standardsData?.standards ? standardsData.standards.length : 0;
        }

        // Handle assessments data
        if (assessmentsResult.status === 'fulfilled') {
          const assessmentsData = assessmentsResult.value.data;
          if (Array.isArray(assessmentsData)) {
            totalEvaluations = assessmentsData.length;
            // Count evaluations by status (for now, we'll consider evaluations with score as completed)
            completedEvals = assessmentsData.filter(assessment => assessment.score !== null && assessment.score !== undefined).length;
            pendingEvals = totalEvaluations - completedEvals;
          }
        }

        setStats({
          totalUsers,
          totalSoftware,
          totalStandards,
          totalEvaluations,
          pendingEvaluations: pendingEvals,
          completedEvaluations: completedEvals
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set default values on error
        setStats({
          totalUsers: 0,
          totalSoftware: 0,
          totalStandards: 0,
          totalEvaluations: 0,
          pendingEvaluations: 0,
          completedEvaluations: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (!user || user.role !== 'admin') {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to view this page.</p>
      </div>
    );
  }

  return (
    <MainLayout title="Panel de Administración">
      <div className="dashboard">
        <div className="dashboard-welcome">
          <h2>¡Bienvenido de nuevo, {user.name}!</h2>
          <p>Aquí tienes un resumen de tu plataforma de evaluación de calidad de software.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon users">
              <Users size={24} />
            </div>
            <div className="stat-details">
              <h3>Total Usuarios</h3>
              {isLoading ? (
                <div className="stat-loading"></div>
              ) : (
                <p className="stat-value">{stats.totalUsers}</p>
              )}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon software">
              <Package size={24} />
            </div>
            <div className="stat-details">
              <h3>Software Registrado</h3>
              {isLoading ? (
                <div className="stat-loading"></div>
              ) : (
                <p className="stat-value">{stats.totalSoftware}</p>
              )}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon standards">
              <ClipboardCheck size={24} />
            </div>
            <div className="stat-details">
              <h3>Normas de Calidad</h3>
              {isLoading ? (
                <div className="stat-loading"></div>
              ) : (
                <p className="stat-value">{stats.totalStandards}</p>
              )}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon evaluations">
              <FileText size={24} />
            </div>
            <div className="stat-details">
              <h3>Total Evaluaciones</h3>
              {isLoading ? (
                <div className="stat-loading"></div>
              ) : (
                <p className="stat-value">{stats.totalEvaluations}</p>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-charts">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Progreso de Evaluaciones</h3>
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="legend-color pending"></span>
                  Pendientes
                </span>
                <span className="legend-item">
                  <span className="legend-color completed"></span>
                  Completadas
                </span>
              </div>
            </div>
            <div className="chart-placeholder">
              <div className="chart-icon">
                <BarChart3 size={48} />
              </div>
              <p>Las estadísticas de evaluación aparecerán aquí</p>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>Tendencias de Evaluación</h3>
            </div>
            <div className="chart-placeholder">
              <div className="chart-icon">
                <TrendingUp size={48} />
              </div>
              <p>Los datos de tendencias aparecerán aquí</p>
            </div>
          </div>
        </div>

        <div className="recent-activity">
          <h3>Actividad Reciente</h3>
          <div className="activity-list">
            {isLoading ? (
              <div className="activity-loading">Cargando actividades recientes...</div>
            ) : (
              <div className="empty-activity">
                <p>No hay actividades recientes para mostrar</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;