'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DATable from './DATable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function AdminDashboard() {
  const router = useRouter();
  const [daUsers, setDaUsers] = useState<DAUser[]>([]);
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch all DA users (admin can see all)
      const daResponse = await fetch('/api/da-users?global=true', {
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
    localStorage.removeItem('isAdmin');
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

  const filteredUsers = daUsers.filter(user =>
    Object.values(user).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Prepare chart data
  const regionData = daUsers.reduce((acc: any, da) => {
    const region = da.region || 'Unknown';
    if (!acc[region]) {
      acc[region] = { region, total: 0, count: 0 };
    }
    acc[region].total += da.total_collected_data || 0;
    acc[region].count += 1;
    return acc;
  }, {});

  const regionChartData = Object.values(regionData).slice(0, 10);

  const statusData = daUsers.reduce((acc: any, da) => {
    const status = da.status || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(statusData).map(([name, value]) => ({
    name,
    value: value as number,
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
              <h1 className="text-2xl font-bold text-gray-900">Cropin Grow System - Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Administrator View - All Data</p>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        {kpis && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-500 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Total DA Users</p>
                  <p className="text-3xl font-bold mt-2">{kpis.globalTotalDAs}</p>
                </div>
                <div className="text-4xl opacity-80">👥</div>
              </div>
            </div>
            <div className="bg-green-500 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Total Data Collected</p>
                  <p className="text-3xl font-bold mt-2">{kpis.globalTotalData.toLocaleString()}</p>
                </div>
                <div className="text-4xl opacity-80">📊</div>
              </div>
            </div>
            <div className="bg-purple-500 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Total Woreda Reps</p>
                  <p className="text-3xl font-bold mt-2">{daUsers.length > 0 ? new Set(daUsers.map(d => d.reporting_manager_mobile)).size : 0}</p>
                </div>
                <div className="text-4xl opacity-80">🌍</div>
              </div>
            </div>
            <div className="bg-orange-500 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Avg Data per DA</p>
                  <p className="text-3xl font-bold mt-2">{kpis.globalTotalDAs > 0 ? Math.round(kpis.globalTotalData / kpis.globalTotalDAs).toLocaleString() : 0}</p>
                </div>
                <div className="text-4xl opacity-80">📈</div>
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Data by Region (Top 10)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#3B82F6" name="Total Data" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* All DA Users Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-4">All Development Agents</h2>
            <input
              type="text"
              placeholder="Search all DA users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <DATable
            daUsers={filteredUsers}
            onUpdate={handleUpdate}
            isEditable={true}
          />
        </div>
      </main>
    </div>
  );
}

