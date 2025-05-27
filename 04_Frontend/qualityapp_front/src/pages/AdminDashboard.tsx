import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MainLayout from '../components/Layout/MainLayout';
import { Users, Package, ClipboardCheck, FileText, TrendingUp, BarChart3 } from 'lucide-react';
import { userService, softwareService, standardService, evaluationService } from '../services/api';
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
        
        // Fetch statistics from API
        const [users, software, standards, evaluations] = await Promise.all([
          userService.getAll(),
          softwareService.getAll(),
          standardService.getAll(),
          evaluationService.getAll()
        ]);
        
        const pendingEvals = evaluations.data.filter((evaluation: any) => evaluation.status === 'pending').length;
        const completedEvals = evaluations.data.filter((evaluation: any) => evaluation.status === 'completed').length;
        
        setStats({
          totalUsers: users.data.length,
          totalSoftware: software.data.length,
          totalStandards: standards.data.length,
          totalEvaluations: evaluations.data.length,
          pendingEvaluations: pendingEvals,
          completedEvaluations: completedEvals
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
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
    <MainLayout title="Admin Dashboard">
      <div className="dashboard">
        <div className="dashboard-welcome">
          <h2>Welcome back, {user.name}!</h2>
          <p>Here's what's happening with your software quality evaluation platform.</p>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon users">
              <Users size={24} />
            </div>
            <div className="stat-details">
              <h3>Total Users</h3>
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
              <h3>Software Registered</h3>
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
              <h3>Quality Standards</h3>
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
              <h3>Total Evaluations</h3>
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
              <h3>Evaluation Progress</h3>
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="legend-color pending"></span>
                  Pending
                </span>
                <span className="legend-item">
                  <span className="legend-color completed"></span>
                  Completed
                </span>
              </div>
            </div>
            <div className="chart-placeholder">
              <div className="chart-icon">
                <BarChart3 size={48} />
              </div>
              <p>Evaluation statistics will appear here</p>
            </div>
          </div>
          
          <div className="chart-card">
            <div className="chart-header">
              <h3>Evaluation Trends</h3>
            </div>
            <div className="chart-placeholder">
              <div className="chart-icon">
                <TrendingUp size={48} />
              </div>
              <p>Trend data will appear here</p>
            </div>
          </div>
        </div>
        
        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {isLoading ? (
              <div className="activity-loading">Loading recent activities...</div>
            ) : (
              <div className="empty-activity">
                <p>No recent activities to display</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;