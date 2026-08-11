import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';

function ServiceGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentGroup, setCurrentGroup] = useState({ service_group_name: '', is_active: true });
  const [isEditing, setIsEditing] = useState(false);

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
        <h2 className="text-2xl font-semibold text-gray-800">Service Group Master</h2>
        <button onClick={openNewModal} className="bg-[#00acc1] hover:bg-[#008ba3] text-white px-4 py-2 rounded shadow transition-colors duration-200 flex items-center">
          <i className="fas fa-plus mr-2"></i> Add Service Group
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
            <tr>
              <th className="py-4 px-6 text-left font-bold w-24">ID</th>
              <th className="py-4 px-6 text-left font-bold">Service Group Name</th>
              <th className="py-4 px-6 text-left font-bold w-32">Status</th>
              <th className="py-4 px-6 text-center font-bold w-48">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="4" className="py-12 text-center text-gray-500 font-semibold">
                  <i className="fas fa-spinner fa-spin mr-2"></i> Loading...
                </td>
              </tr>
            ) : groups.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-12 text-center text-gray-500 font-semibold">No service groups found.</td>
              </tr>
            ) : (
              groups.map((group) => (
                <tr key={group.service_group_id} className="hover:bg-blue-50/50 transition duration-150">
                  <td className="py-4 px-6 font-semibold text-[#00acc1]">#{group.service_group_id}</td>
                  <td className="py-4 px-6 font-bold text-gray-800">{group.service_group_name}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${group.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {group.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => handleEdit(group)} className="text-blue-600 hover:text-blue-900 transition-colors">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDelete(group.service_group_id)} className="text-red-600 hover:text-red-900 transition-colors">
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">{isEditing ? 'Edit Service Group' : 'Add New Service Group'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
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
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#00acc1] hover:bg-[#0097a7] text-white font-semibold rounded-lg transition-colors">
                  {isEditing ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default ServiceGroups;
