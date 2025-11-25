'use client';

import { useState } from 'react';

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

interface DATableProps {
  daUsers: DAUser[];
  onUpdate: (contactnumber: string, field: 'total_collected_data' | 'status', value: any) => void;
  isEditable: boolean;
}

export default function DATable({ daUsers, onUpdate, isEditable }: DATableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof DAUser | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [editingCell, setEditingCell] = useState<{ contactnumber: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleSort = (field: keyof DAUser) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedUsers = [...daUsers].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    return sortDirection === 'asc' 
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });

  const filteredUsers = sortedUsers.filter(user =>
    Object.values(user).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleEditStart = (contactnumber: string, field: string, currentValue: any) => {
    if (!isEditable || (field !== 'total_collected_data' && field !== 'status')) {
      return;
    }
    setEditingCell({ contactnumber, field });
    setEditValue(String(currentValue || ''));
  };

  const handleEditSave = () => {
    if (editingCell) {
      const value = editingCell.field === 'total_collected_data' 
        ? parseInt(editValue) || 0
        : editValue;
      onUpdate(editingCell.contactnumber, editingCell.field as 'total_collected_data' | 'status', value);
      setEditingCell(null);
      setEditValue('');
    }
  };

  const handleEditCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const SortIcon = ({ field }: { field: keyof DAUser }) => {
    if (sortField !== field) return <span className="text-gray-400">↕️</span>;
    return sortDirection === 'asc' ? <span>↑</span> : <span>↓</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search DA users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort('name')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Name <SortIcon field="name" />
              </th>
              <th
                onClick={() => handleSort('region')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Region <SortIcon field="region" />
              </th>
              <th
                onClick={() => handleSort('zone')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Zone <SortIcon field="zone" />
              </th>
              <th
                onClick={() => handleSort('woreda')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Woreda <SortIcon field="woreda" />
              </th>
              <th
                onClick={() => handleSort('kebele')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Kebele <SortIcon field="kebele" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reporting Manager
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Manager Mobile
              </th>
              <th
                onClick={() => handleSort('language')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Language <SortIcon field="language" />
              </th>
              <th
                onClick={() => handleSort('total_collected_data')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Total Data {isEditable && <span className="text-blue-500">(Editable)</span>}
                <SortIcon field="total_collected_data" />
              </th>
              <th
                onClick={() => handleSort('status')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Status {isEditable && <span className="text-blue-500">(Editable)</span>}
                <SortIcon field="status" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-6 py-4 text-center text-gray-500">
                  No DA users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.contactnumber} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.region}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.zone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.woreda}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.kebele}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.contactnumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.reporting_manager_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.reporting_manager_mobile}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.language}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      isEditable ? 'cursor-pointer hover:bg-blue-50' : ''
                    }`}
                    onClick={() => handleEditStart(user.contactnumber, 'total_collected_data', user.total_collected_data)}
                  >
                    {editingCell?.contactnumber === user.contactnumber && editingCell?.field === 'total_collected_data' ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleEditSave}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEditSave();
                            if (e.key === 'Escape') handleEditCancel();
                          }}
                          className="w-24 px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <span className={isEditable ? 'text-blue-600 font-medium' : ''}>
                        {user.total_collected_data || 0}
                      </span>
                    )}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      isEditable ? 'cursor-pointer hover:bg-blue-50' : ''
                    }`}
                    onClick={() => handleEditStart(user.contactnumber, 'status', user.status)}
                  >
                    {editingCell?.contactnumber === user.contactnumber && editingCell?.field === 'status' ? (
                      <div className="flex items-center space-x-2">
                        <select
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleEditSave}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEditSave();
                            if (e.key === 'Escape') handleEditCancel();
                          }}
                          className="px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </div>
                    ) : (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' :
                        user.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      } ${isEditable ? 'cursor-pointer' : ''}`}>
                        {user.status || 'N/A'}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600">
          Showing {filteredUsers.length} of {daUsers.length} DA users
        </p>
      </div>
    </div>
  );
}

