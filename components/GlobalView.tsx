'use client';

import { useEffect, useState } from 'react';
import DATable from './DATable';

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

export default function GlobalView() {
  const [daUsers, setDaUsers] = useState<DAUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    region: '',
    zone: '',
    woreda: '',
  });
  const [filterOptions, setFilterOptions] = useState({
    regions: [] as string[],
    zones: [] as string[],
    woredas: [] as string[],
  });

  useEffect(() => {
    fetchFilters();
    fetchData();
  }, [filters]);

  const fetchFilters = async () => {
    try {
      const response = await fetch('/api/filters');
      if (response.ok) {
        const data = await response.json();
        setFilterOptions(data);
      }
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const params = new URLSearchParams({
        global: 'true',
        ...(filters.region && { region: filters.region }),
        ...(filters.zone && { zone: filters.zone }),
        ...(filters.woreda && { woreda: filters.woreda }),
      });

      const response = await fetch(`/api/da-users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDaUsers(data.daUsers || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: 'region' | 'zone' | 'woreda', value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [field]: value };
      // Reset dependent filters
      if (field === 'region') {
        newFilters.zone = '';
        newFilters.woreda = '';
      } else if (field === 'zone') {
        newFilters.woreda = '';
      }
      return newFilters;
    });
  };

  const handleUpdate = () => {
    // Global view is read-only
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Global View - All DA Users</h2>
        <p className="text-sm text-gray-600 mb-4">
          View all Development Agents across all Woreda Representatives. This view is read-only.
        </p>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Region
            </label>
            <select
              value={filters.region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Regions</option>
              {filterOptions.regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Zone
            </label>
            <select
              value={filters.zone}
              onChange={(e) => handleFilterChange('zone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Zones</option>
              {filterOptions.zones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Woreda
            </label>
            <select
              value={filters.woreda}
              onChange={(e) => handleFilterChange('woreda', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Woredas</option>
              {filterOptions.woredas.map((woreda) => (
                <option key={woreda} value={woreda}>
                  {woreda}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(filters.region || filters.zone || filters.woreda) && (
          <button
            onClick={() => setFilters({ region: '', zone: '', woreda: '' })}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Clear Filters
          </button>
        )}
      </div>

      <DATable
        daUsers={daUsers}
        onUpdate={handleUpdate}
        isEditable={false}
      />
    </div>
  );
}

