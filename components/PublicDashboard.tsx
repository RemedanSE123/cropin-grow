'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface PublicStats {
  stats: {
    totalDAs: number;
    totalData: number;
    totalReps: number;
    activeDAs: number;
    inactiveDAs: number;
    pendingDAs: number;
    avgDataPerDA: number;
  };
  regionData: Array<{ region: string; da_count: number; total_data: number }>;
  zoneData: Array<{ zone: string; da_count: number; total_data: number }>;
  statusTrend: Array<{ status: string; count: number; total_data: number }>;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function PublicDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/public-stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load dashboard data</p>
        </div>
      </div>
    );
  }

  const pieData = [
    { name: 'Active', value: stats.stats.activeDAs },
    { name: 'Inactive', value: stats.stats.inactiveDAs },
    { name: 'Pending', value: stats.stats.pendingDAs },
  ].filter(item => item.value > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Cropin Grow System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://forms.gle/YRGNNjeVnGJyUuZdA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>Support</span>
              </a>
              <button
                onClick={handleLogin}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Login</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">System Overview</h2>
          <p className="text-gray-600">Real-time statistics and insights from all Development Agents</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total DA Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.stats.totalDAs.toLocaleString()}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Data Collected</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.stats.totalData.toLocaleString()}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Woreda Representatives</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.stats.totalReps.toLocaleString()}</p>
              </div>
              <div className="text-4xl">🌍</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Data per DA</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{Math.round(stats.stats.avgDataPerDA).toLocaleString()}</p>
              </div>
              <div className="text-4xl">📈</div>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 rounded-lg shadow p-6 border-l-4 border-green-500">
            <p className="text-sm font-medium text-green-600">Active DAs</p>
            <p className="text-3xl font-bold text-green-900 mt-2">{stats.stats.activeDAs.toLocaleString()}</p>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-6 border-l-4 border-red-500">
            <p className="text-sm font-medium text-red-600">Inactive DAs</p>
            <p className="text-3xl font-bold text-red-900 mt-2">{stats.stats.inactiveDAs.toLocaleString()}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <p className="text-sm font-medium text-yellow-600">Pending DAs</p>
            <p className="text-3xl font-bold text-yellow-900 mt-2">{stats.stats.pendingDAs.toLocaleString()}</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Region Data Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Data by Region (Top 10)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.regionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_data" fill="#3B82F6" name="Total Data" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">DA Status Distribution</h3>
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

        {/* Zone Data Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Data by Zone (Top 10)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.zoneData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="zone" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_data" fill="#10B981" name="Total Data" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}

