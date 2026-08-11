import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';

function Locations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({ location_name: '', is_active: true });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(ENDPOINTS.LOCATIONS);
      setLocations(res.data);
    } catch (err) {
      console.error('Error fetching locations', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axiosInstance.put(`${ENDPOINTS.LOCATIONS}${currentLocation.location_id}/`, currentLocation);
      } else {
        await axiosInstance.post(ENDPOINTS.LOCATIONS, currentLocation);
      }
      setShowModal(false);
      fetchLocations();
    } catch (err) {
      console.error('Error saving location', err);
      alert('Failed to save location.');
    }
  };

  const handleEdit = (loc) => {
    setCurrentLocation(loc);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      try {
        await axiosInstance.delete(`${ENDPOINTS.LOCATIONS}${id}/`);
        fetchLocations();
      } catch (err) {
        console.error('Error deleting location', err);
        alert('Failed to delete location.');
      }
    }
  };

  const openNewModal = () => {
    setCurrentLocation({ location_name: '', is_active: true });
    setIsEditing(false);
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Locations Master</h2>
        <button onClick={openNewModal} className="bg-[#00acc1] hover:bg-[#008ba3] text-white px-4 py-2 rounded shadow transition-colors duration-200 flex items-center">
          <i className="fas fa-plus mr-2"></i> Add Location
        </button>
      </div>
      
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
            <tr>
              <th className="py-4 px-6 text-left font-bold w-24">ID</th>
              <th className="py-4 px-6 text-left font-bold">Location Name</th>
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
            ) : locations.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-12 text-center text-gray-500 font-semibold">No locations found.</td>
              </tr>
            ) : (
              locations.map((loc) => (
                <tr key={loc.location_id} className="hover:bg-blue-50/50 transition duration-150">
                  <td className="py-4 px-6 font-semibold text-[#00acc1]">#{loc.location_id}</td>
                  <td className="py-4 px-6 font-bold text-gray-800">{loc.location_name}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${loc.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {loc.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => handleEdit(loc)} className="text-blue-600 hover:text-blue-900 transition-colors">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDelete(loc.location_id)} className="text-red-600 hover:text-red-900 transition-colors">
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
              <h3 className="text-lg font-bold text-gray-800">{isEditing ? 'Edit Location' : 'Add New Location'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Location Name</label>
                <input 
                  type="text" 
                  required
                  value={currentLocation.location_name}
                  onChange={(e) => setCurrentLocation({...currentLocation, location_name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1] focus:ring-1 focus:ring-[#00acc1]"
                  placeholder="e.g. New Delhi Clinic"
                />
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={currentLocation.is_active}
                  onChange={(e) => setCurrentLocation({...currentLocation, is_active: e.target.checked})}
                  className="mr-2 h-4 w-4 text-[#00acc1] focus:ring-[#00acc1] border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">Is Active</label>
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

export default Locations;
