import React from 'react';
import MainLayout from '../components/Layout/MainLayout';

const SoftwareManagement: React.FC = () => {
  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Software Management</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Software management content will be implemented here.</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default SoftwareManagement;