import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';
import Modal from '../components/Modal';

function ServiceGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentGroup, setCurrentGroup] = useState({ service_group_name: '', is_active: true });
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(ENDPOINTS.SERVICE_GROUPS);
      setGroups(res.data);
    } catch (err) {
      console.error('Error fetching service groups', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axiosInstance.put(`${ENDPOINTS.SERVICE_GROUPS}${currentGroup.service_group_id}/`, currentGroup);
      } else {
        await axiosInstance.post(ENDPOINTS.SERVICE_GROUPS, currentGroup);
      }
      setShowModal(false);
      fetchGroups();
    } catch (err) {
      console.error('Error saving service group', err);
      alert('Failed to save service group.');
    }
  };

  const handleEdit = (group) => {
    setCurrentGroup(group);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service group?")) {
      try {
        await axiosInstance.delete(`${ENDPOINTS.SERVICE_GROUPS}${id}/`);
        fetchGroups();
      } catch (err) {
        console.error('Error deleting service group', err);
        alert('Failed to delete service group.');
      }
    }
  };

  const openNewModal = () => {
    setCurrentGroup({ service_group_name: '', is_active: true });
    setIsEditing(false);
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <i className="fas fa-search text-gray-400"></i>
          </span>
          <input 
            type="text" 
            placeholder="Search Service Groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#00acc1]"
          />
        </div>
        <button onClick={openNewModal} className="bg-[#00acc1] hover:bg-[#008ba3] text-white px-4 py-2 rounded shadow transition-colors duration-200 flex items-center">
          <i className="fas fa-plus mr-2"></i> Add Service Group
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
            <tr>
              <th className="py-4 px-6 text-left font-bold">Service Group Name</th>
              <th className="py-4 px-6 text-left font-bold w-32">Status</th>
              <th className="py-4 px-6 text-center font-bold w-48">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="3" className="py-12 text-center text-gray-500 font-semibold">
                  <i className="fas fa-spinner fa-spin mr-2"></i> Loading...
                </td>
              </tr>
            ) : groups.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-12 text-center text-gray-500 font-semibold">No service groups found.</td>
              </tr>
            ) : (
              groups.filter(group => group.service_group_name.toLowerCase().includes(searchQuery.toLowerCase())).map((group) => (
                <tr key={group.service_group_id} className="hover:bg-blue-50/50 transition duration-150">
                  <td className="py-4 px-6 font-bold text-gray-800">{group.service_group_name}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${group.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {group.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => handleEdit(group)} className="cursor-pointer text-[#00acc1] hover:text-[#008ba3] transition-colors">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDelete(group.service_group_id)} className="cursor-pointer text-red-500 hover:text-red-700 transition-colors">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title={isEditing ? 'Edit Service Group' : 'Add New Service Group'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Service Group Name</label>
                <input 
                  type="text" 
                  required
                  value={currentGroup.service_group_name}
                  onChange={(e) => setCurrentGroup({...currentGroup, service_group_name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1] focus:ring-1 focus:ring-[#00acc1]"
                  placeholder="e.g. Blood Tests"
                />
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="isActiveGroup"
                  checked={currentGroup.is_active}
                  onChange={(e) => setCurrentGroup({...currentGroup, is_active: e.target.checked})}
                  className="mr-2 h-4 w-4 text-[#00acc1] focus:ring-[#00acc1] border-gray-300 rounded"
                />
                <label htmlFor="isActiveGroup" className="text-sm font-semibold text-gray-700">Is Active</label>
              </div>
          </div>
          <div className="px-6 py-5 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0 bg-gray-50">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors cursor-pointer border border-gray-200 bg-white">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-[#00acc1] hover:bg-[#0097a7] text-white font-semibold rounded-lg transition-colors cursor-pointer shadow-sm">
              {isEditing ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
    </div>
  );
}

export default ServiceGroups;
