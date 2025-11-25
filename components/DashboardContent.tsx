'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import KPICards from './KPICards';
import DATable from './DATable';
import GlobalView from './GlobalView';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DAUser {
  name: string;
  region: string;
  zone: string;
  woreda: string;
  kebele: string;
  contactnumber: string;
  reporting_manager_name: string;
  reporting_manager_mobile: string;
  language: string;
  total_collected_data: number;
  status: string;
}

interface KPIs {
  repTotalDAs: number;
  repTotalData: number;
  globalTotalDAs: number;
  globalTotalData: number;
}

export default function DashboardContent() {
  const router = useRouter();
  const [daUsers, setDaUsers] = useState<DAUser[]>([]);
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'global'>('dashboard');
  const [woredaRepName, setWoredaRepName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem('woredaRepName');
    const admin = localStorage.getItem('isAdmin') === 'true';
    if (name) setWoredaRepName(name);
    setIsAdmin(admin);
    if (admin) {
      router.push('/admin');
    } else {
      fetchData();
    }
  }, [router]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch DA users (only their own, not global)
      const daResponse = await fetch('/api/da-users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (daResponse.ok) {
        const daData = await daResponse.json();
        setDaUsers(daData.daUsers || []);
      }

      // Fetch KPIs
      const kpiResponse = await fetch('/api/kpis', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (kpiResponse.ok) {
        const kpiData = await kpiResponse.json();
        setKpis(kpiData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('woredaRepPhone');
    localStorage.removeItem('woredaRepName');
    router.push('/login');
  };

  const handleUpdate = async (contactnumber: string, field: 'total_collected_data' | 'status', value: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/da-users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          contactnumber,
          [field]: value,
        }),
      });

      if (response.ok) {
        // Refresh data
        fetchData();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update');
      }
    } catch (error) {
      console.error('Error updating:', error);
      alert('An error occurred while updating');
    }
  };

  // Prepare chart data
  const chartData = daUsers.map(da => ({
    name: da.name.length > 15 ? da.name.substring(0, 15) + '...' : da.name,
    'Data Collected': da.total_collected_data || 0,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cropin Grow System</h1>
              {woredaRepName && (
                <p className="text-sm text-gray-600">Welcome, {woredaRepName}</p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://forms.gle/YRGNNjeVnGJyUuZdA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>Support</span>
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs - Only show global view tab, but it's read-only for Woreda Reps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My DA Users
            </button>
            <button
              onClick={() => setActiveTab('global')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'global'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All DA Users (Read-Only)
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' ? (
          <>
            {/* KPI Cards */}
            {kpis && <KPICards kpis={kpis} />}

            {/* Chart */}
            {chartData.length > 0 && (
              <div className="mt-8 bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Data Collection Overview</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Data Collected" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* DA Users Table */}
            <div className="mt-8">
              <DATable
                daUsers={daUsers}
                onUpdate={handleUpdate}
                isEditable={true}
              />
            </div>
          </>
        ) : (
          <GlobalView />
        )}
      </main>
    </div>
  );
}

