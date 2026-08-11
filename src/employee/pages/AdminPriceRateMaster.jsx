import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';

function AdminPriceRateMaster() {
  const [priceRates, setPriceRates] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceGroups, setServiceGroups] = useState([]);
  const [visitTypes, setVisitTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [currentRate, setCurrentRate] = useState(null);
  
  const [formData, setFormData] = useState({
    location: '',
    service: '',
    service_group: '',
    visit_type: '',
    effective_from_date: '',
    effective_to_date: '',
    price: ''
  });

  const [locationPrices, setLocationPrices] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prRes, sRes, sgRes, vtRes, locRes] = await Promise.all([
        axiosInstance.get(ENDPOINTS.PRICE_RATE_MASTER),
        axiosInstance.get(ENDPOINTS.SERVICES),
        axiosInstance.get(ENDPOINTS.SERVICE_GROUPS),
        axiosInstance.get(ENDPOINTS.VISIT_TYPE_MASTER),
        axiosInstance.get(ENDPOINTS.LOCATIONS)
      ]);
      setPriceRates(prRes.data);
      setServices(sRes.data);
      setServiceGroups(sgRes.data);
      setVisitTypes(vtRes.data);
      setLocations(locRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getServiceName = (id) => services.find(s => s.service_id === id)?.service_name || id;
  const getServiceGroupName = (id) => serviceGroups.find(sg => sg.service_group_id === id)?.service_group_name || id;
  const getVisitTypeName = (id) => visitTypes.find(vt => vt.visit_type_id === id)?.visit_type_name || id;
  const getLocationName = (id) => locations.find(l => l.location_id === id)?.location_name || id;

  const handleServiceChange = (e) => {
    const serviceId = e.target.value;
    const selectedService = services.find(s => s.service_id.toString() === serviceId);
    setFormData({
      ...formData,
      service: serviceId,
      service_group: selectedService ? selectedService.service_group : ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price) || 0
      };
      
      // Convert empty dates to null for Django datefield
      if (!payload.effective_from_date) payload.effective_from_date = null;
      if (!payload.effective_to_date) payload.effective_to_date = null;
      if (!payload.location) payload.location = null;

      if (currentRate) {
        await axiosInstance.put(`${ENDPOINTS.PRICE_RATE_MASTER}${currentRate.price_rate_id}/`, payload);
      } else {
        await axiosInstance.post(ENDPOINTS.PRICE_RATE_MASTER, payload);
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving data');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this price rate?')) {
      try {
        await axiosInstance.delete(`${ENDPOINTS.PRICE_RATE_MASTER}${id}/`);
        fetchData();
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const openLocationModal = async (rate) => {
    setCurrentRate(rate);
    try {
      const res = await axiosInstance.get(`${ENDPOINTS.PRICE_RATE_MASTER_LOCATIONS}?price_rate=${rate.price_rate_id}`);
      const existingMappings = res.data;
      
      // Build a row for every active location
      const locPrices = locations.filter(l => l.is_active).map(loc => {
        const mapping = existingMappings.find(m => m.location === loc.location_id);
        return {
          location_id: loc.location_id,
          location_name: loc.location_name,
          mapping_id: mapping ? mapping.id : null,
          price: mapping ? mapping.price : ''
        };
      });
      setLocationPrices(locPrices);
      setShowLocationModal(true);
    } catch (error) {
      console.error('Error fetching location prices:', error);
    }
  };

  const saveLocationPrices = async () => {
    try {
      for (const locPrice of locationPrices) {
        const priceVal = parseFloat(locPrice.price);
        if (locPrice.mapping_id) {
          if (locPrice.price === '') {
            // Delete if cleared
            await axiosInstance.delete(`${ENDPOINTS.PRICE_RATE_MASTER_LOCATIONS}${locPrice.mapping_id}/`);
          } else {
            // Update
            await axiosInstance.put(`${ENDPOINTS.PRICE_RATE_MASTER_LOCATIONS}${locPrice.mapping_id}/`, {
              price_rate: currentRate.price_rate_id,
              location: locPrice.location_id,
              price: priceVal
            });
          }
        } else if (locPrice.price !== '') {
          // Create new
          await axiosInstance.post(ENDPOINTS.PRICE_RATE_MASTER_LOCATIONS, {
            price_rate: currentRate.price_rate_id,
            location: locPrice.location_id,
            price: priceVal
          });
        }
      }
      setShowLocationModal(false);
      alert('Location prices saved successfully');
    } catch (error) {
      console.error('Error saving location prices:', error);
      alert('Error saving location prices');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Price Rate Master</h2>
        <button
          onClick={() => {
            setCurrentRate(null);
            setFormData({ location: '', service: '', service_group: '', visit_type: '', effective_from_date: '', effective_to_date: '', price: '' });
            setShowModal(true);
          }}
          className="bg-[#00acc1] hover:bg-[#008ba3] text-white px-4 py-2 rounded shadow transition-colors duration-200"
        >
          Add New Price Rate
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid From</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {priceRates.map((rate) => (
                <tr key={rate.price_rate_id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rate.location ? getLocationName(rate.location) : 'All Locations'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getServiceName(rate.service)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getServiceGroupName(rate.service_group)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getVisitTypeName(rate.visit_type)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rate.effective_from_date || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rate.effective_to_date || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">₹{rate.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openLocationModal(rate)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Price List
                    </button>
                    <button
                      onClick={() => {
                        setCurrentRate(rate);
                        setFormData({
                          location: rate.location || '',
                          service: rate.service,
                          service_group: rate.service_group,
                          visit_type: rate.visit_type,
                          effective_from_date: rate.effective_from_date || '',
                          effective_to_date: rate.effective_to_date || '',
                          price: rate.price
                        });
                        setShowModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(rate.price_rate_id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {priceRates.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No price rates found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-6 text-gray-800">{currentRate ? 'Edit' : 'Add'} Price Rate</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#00acc1]"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  >
                    <option value="">-- All Locations (Base) --</option>
                    {locations.filter(l => l.is_active).map(loc => (
                      <option key={loc.location_id} value={loc.location_id}>{loc.location_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Service</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#00acc1]"
                    value={formData.service}
                    onChange={handleServiceChange}
                    required
                  >
                    <option value="">-- Select Service --</option>
                    {services.map(s => (
                      <option key={s.service_id} value={s.service_id}>{s.service_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Service Group</label>
                  <input
                    type="text"
                    readOnly
                    className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                    value={getServiceGroupName(formData.service_group)}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Visit Type</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#00acc1]"
                    value={formData.visit_type}
                    onChange={(e) => setFormData({...formData, visit_type: e.target.value})}
                    required
                  >
                    <option value="">-- Select Visit Type --</option>
                    {visitTypes.map(vt => (
                      <option key={vt.visit_type_id} value={vt.visit_type_id}>{vt.visit_type_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Base Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#00acc1]"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Effective From</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#00acc1]"
                    value={formData.effective_from_date}
                    onChange={(e) => setFormData({...formData, effective_from_date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Effective To</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#00acc1]"
                    value={formData.effective_to_date}
                    onChange={(e) => setFormData({...formData, effective_to_date: e.target.value})}
                  />
                </div>
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

      {showLocationModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Location Wise Price List</h3>
            <p className="text-sm text-gray-600 mb-6">Set specific price overrides for locations. Leave blank to use the base price.</p>
            
            <div className="max-h-96 overflow-y-auto mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (₹)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {locationPrices.map((lp, index) => (
                    <tr key={lp.location_id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{lp.location_name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder={currentRate.price}
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:border-[#00acc1]"
                          value={lp.price}
                          onChange={(e) => {
                            const newLocPrices = [...locationPrices];
                            newLocPrices[index].price = e.target.value;
                            setLocationPrices(newLocPrices);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded shadow transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveLocationPrices}
                className="bg-[#00acc1] hover:bg-[#008ba3] text-white px-6 py-2 rounded shadow transition-colors"
              >
                Save Prices
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPriceRateMaster;
