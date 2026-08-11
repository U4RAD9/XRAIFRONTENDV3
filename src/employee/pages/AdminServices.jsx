import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';

function Services() {
  const [services, setServices] = useState([]);
  const [serviceGroups, setServiceGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentService, setCurrentService] = useState({ service_name: '', service_group: '', is_active: true });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchServicesAndGroups();
  }, []);

  const fetchServicesAndGroups = async () => {
    setLoading(true);
    try {
      const [servicesRes, groupsRes] = await Promise.all([
        axiosInstance.get(ENDPOINTS.SERVICES),
        axiosInstance.get(ENDPOINTS.SERVICE_GROUPS)
      ]);
      setServices(servicesRes.data);
      setServiceGroups(groupsRes.data);
    } catch (err) {
      console.error('Error fetching services or groups', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axiosInstance.put(`${ENDPOINTS.SERVICES}${currentService.service_id}/`, currentService);
      } else {
        await axiosInstance.post(ENDPOINTS.SERVICES, currentService);
      }
      setShowModal(false);
      fetchServicesAndGroups(); // Re-fetch to update list
    } catch (err) {
      console.error('Error saving service', err);
      alert('Failed to save service.');
    }
  };

  const handleEdit = (service) => {
    setCurrentService(service);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axiosInstance.delete(`${ENDPOINTS.SERVICES}${id}/`);
        fetchServicesAndGroups();
      } catch (err) {
        console.error('Error deleting service', err);
        alert('Failed to delete service.');
      }
    }
  };

  const openNewModal = () => {
    setCurrentService({ service_name: '', service_group: '', is_active: true });
    setIsEditing(false);
    setShowModal(true);
  };

  // Helper to display group name
  const getGroupName = (groupId) => {
    const group = serviceGroups.find(g => g.service_group_id === groupId);
    return group ? group.service_group_name : 'Unknown';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Services Master</h2>
        <button onClick={openNewModal} className="bg-[#00acc1] hover:bg-[#008ba3] text-white px-4 py-2 rounded shadow transition-colors duration-200 flex items-center">
          <i className="fas fa-plus mr-2"></i> Add Service
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
            <tr>
              <th className="py-4 px-6 text-left font-bold w-24">ID</th>
              <th className="py-4 px-6 text-left font-bold">Service Name</th>
              <th className="py-4 px-6 text-left font-bold">Service Group</th>
              <th className="py-4 px-6 text-left font-bold w-32">Status</th>
              <th className="py-4 px-6 text-center font-bold w-48">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-gray-500 font-semibold">
                  <i className="fas fa-spinner fa-spin mr-2"></i> Loading...
                </td>
              </tr>
            ) : services.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-gray-500 font-semibold">No services found.</td>
              </tr>
            ) : (
              services.map((svc) => (
                <tr key={svc.service_id} className="hover:bg-blue-50/50 transition duration-150">
                  <td className="py-4 px-6 font-semibold text-[#00acc1]">#{svc.service_id}</td>
                  <td className="py-4 px-6 font-bold text-gray-800">{svc.service_name}</td>
                  <td className="py-4 px-6 text-gray-600">{getGroupName(svc.service_group)}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${svc.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {svc.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => handleEdit(svc)} className="text-blue-600 hover:text-blue-900 transition-colors">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDelete(svc.service_id)} className="text-red-600 hover:text-red-900 transition-colors">
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
              <h3 className="text-lg font-bold text-gray-800">{isEditing ? 'Edit Service' : 'Add New Service'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Service Name</label>
                <input 
                  type="text" 
                  required
                  value={currentService.service_name}
                  onChange={(e) => setCurrentService({...currentService, service_name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1] focus:ring-1 focus:ring-[#00acc1]"
                  placeholder="e.g. Complete Blood Count"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Service Group</label>
                <select
                  required
                  value={currentService.service_group}
                  onChange={(e) => setCurrentService({...currentService, service_group: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1] focus:ring-1 focus:ring-[#00acc1]"
                >
                  <option value="">Select a Service Group...</option>
                  {serviceGroups.map(group => (
                    <option key={group.service_group_id} value={group.service_group_id}>
                      {group.service_group_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center mt-4">
                <input 
                  type="checkbox" 
                  id="isActiveService"
                  checked={currentService.is_active}
                  onChange={(e) => setCurrentService({...currentService, is_active: e.target.checked})}
                  className="mr-2 h-4 w-4 text-[#00acc1] focus:ring-[#00acc1] border-gray-300 rounded"
                />
                <label htmlFor="isActiveService" className="text-sm font-semibold text-gray-700">Is Active</label>
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

export default Services;
