import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';

function AdminOffersMaster() {
  const [offers, setOffers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [serviceGroups, setServiceGroups] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(null);
  
  const [formData, setFormData] = useState({
    offer_name: '',
    discount_percent: '',
    discount_type: 'ItemLevel',
    user_type: '',
    effective_date_from: '',
    effective_date_to: '',
    is_active: true
  });

  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedServiceGroups, setSelectedServiceGroups] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [oRes, locRes, sgRes, utRes] = await Promise.all([
        axiosInstance.get(ENDPOINTS.OFFER_MASTER),
        axiosInstance.get(ENDPOINTS.LOCATIONS),
        axiosInstance.get(ENDPOINTS.SERVICE_GROUPS),
        axiosInstance.get(ENDPOINTS.USER_TYPES)
      ]);
      
      setOffers(oRes.data);
      setLocations(locRes.data);
      setServiceGroups(sgRes.data);
      setUserTypes(utRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getUserTypeName = (id) => userTypes.find(ut => ut.user_type_id === id)?.user_type_name || id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        discount_percent: parseFloat(formData.discount_percent) || 0
      };
      
      if (!payload.effective_date_from) payload.effective_date_from = null;
      if (!payload.effective_date_to) payload.effective_date_to = null;
      if (!payload.user_type) payload.user_type = null;

      let savedOffer;
      if (currentOffer) {
        const res = await axiosInstance.put(`${ENDPOINTS.OFFER_MASTER}${currentOffer.offer_id}/`, payload);
        savedOffer = res.data;
        // First delete existing mappings
        await axiosInstance.get(`${ENDPOINTS.OFFER_LOCATIONS}?offer=${currentOffer.offer_id}`).then(async res => {
          for(const m of res.data) await axiosInstance.delete(`${ENDPOINTS.OFFER_LOCATIONS}${m.id}/`);
        });
        await axiosInstance.get(`${ENDPOINTS.OFFER_SERVICE_GROUPS}?offer=${currentOffer.offer_id}`).then(async res => {
          for(const m of res.data) await axiosInstance.delete(`${ENDPOINTS.OFFER_SERVICE_GROUPS}${m.id}/`);
        });
      } else {
        const res = await axiosInstance.post(ENDPOINTS.OFFER_MASTER, payload);
        savedOffer = res.data;
      }

      // Save new mappings
      for (const locId of selectedLocations) {
        await axiosInstance.post(ENDPOINTS.OFFER_LOCATIONS, { offer: savedOffer.offer_id, location: locId });
      }
      for (const sgId of selectedServiceGroups) {
        await axiosInstance.post(ENDPOINTS.OFFER_SERVICE_GROUPS, { offer: savedOffer.offer_id, service_group: sgId });
      }

      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving data');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await axiosInstance.delete(`${ENDPOINTS.OFFER_MASTER}${id}/`);
        fetchData();
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const openEditModal = async (offer) => {
    setCurrentOffer(offer);
    setFormData({
      offer_name: offer.offer_name,
      discount_percent: offer.discount_percent,
      discount_type: offer.discount_type,
      user_type: offer.user_type || '',
      effective_date_from: offer.effective_date_from || '',
      effective_date_to: offer.effective_date_to || '',
      is_active: offer.is_active
    });

    try {
      const [locRes, sgRes] = await Promise.all([
        axiosInstance.get(`${ENDPOINTS.OFFER_LOCATIONS}?offer=${offer.offer_id}`),
        axiosInstance.get(`${ENDPOINTS.OFFER_SERVICE_GROUPS}?offer=${offer.offer_id}`)
      ]);
      setSelectedLocations(locRes.data.map(m => m.location.toString()));
      setSelectedServiceGroups(sgRes.data.map(m => m.service_group.toString()));
    } catch (error) {
      console.error('Error fetching mappings', error);
    }
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Offers Master</h2>
        <button
          onClick={() => {
            setCurrentOffer(null);
            setFormData({ offer_name: '', discount_percent: '', discount_type: 'ItemLevel', user_type: '', effective_date_from: '', effective_date_to: '', is_active: true });
            setSelectedLocations([]);
            setSelectedServiceGroups([]);
            setShowModal(true);
          }}
          className="bg-[#00acc1] hover:bg-[#008ba3] text-white px-4 py-2 rounded shadow transition-colors duration-200"
        >
          Add New Offer
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offer Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid From</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {offers.map((offer) => (
                <tr key={offer.offer_id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{offer.offer_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">{offer.discount_percent}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{offer.discount_type === 'ItemLevel' ? 'Item Level' : 'Invoice Level'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getUserTypeName(offer.user_type) || 'All'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{offer.effective_date_from || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{offer.effective_date_to || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${offer.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {offer.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(offer)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(offer.offer_id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {offers.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No offers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl">
            <h3 className="text-xl font-bold mb-6 text-gray-800">{currentOffer ? 'Edit' : 'Add'} Offer</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Offer Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#00acc1]"
                    value={formData.offer_name}
                    onChange={(e) => setFormData({...formData, offer_name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#00acc1]"
                    value={formData.discount_percent}
                    onChange={(e) => setFormData({...formData, discount_percent: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Discount Type</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#00acc1]"
                    value={formData.discount_type}
                    onChange={(e) => setFormData({...formData, discount_type: e.target.value})}
                    required
                  >
                    <option value="ItemLevel">Item Level</option>
                    <option value="InvoiceLevel">Invoice Level</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Service Groups (Hold Ctrl/Cmd to multi-select)</label>
                  <select
                    multiple
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#00acc1] h-32"
                    value={selectedServiceGroups}
                    onChange={(e) => setSelectedServiceGroups(Array.from(e.target.selectedOptions, option => option.value))}
                  >
                    {serviceGroups.map(sg => (
                      <option key={sg.service_group_id} value={sg.service_group_id}>{sg.service_group_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Locations (Hold Ctrl/Cmd to multi-select)</label>
                  <select
                    multiple
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#00acc1] h-32"
                    value={selectedLocations}
                    onChange={(e) => setSelectedLocations(Array.from(e.target.selectedOptions, option => option.value))}
                  >
                    {locations.map(loc => (
                      <option key={loc.location_id} value={loc.location_id}>{loc.location_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">User Type</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#00acc1]"
                    value={formData.user_type}
                    onChange={(e) => setFormData({...formData, user_type: e.target.value})}
                  >
                    <option value="">-- All User Types --</option>
                    {userTypes.map(ut => (
                      <option key={ut.user_type_id} value={ut.user_type_id}>{ut.user_type_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Effective From</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#00acc1]"
                    value={formData.effective_date_from}
                    onChange={(e) => setFormData({...formData, effective_date_from: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Effective To</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#00acc1]"
                    value={formData.effective_date_to}
                    onChange={(e) => setFormData({...formData, effective_date_to: e.target.value})}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <span className="text-gray-700 font-bold">Active</span>
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-[#00acc1] rounded focus:ring-[#00acc1]"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  />
                </label>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded shadow transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#00acc1] hover:bg-[#008ba3] text-white px-6 py-2 rounded shadow transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOffersMaster;
