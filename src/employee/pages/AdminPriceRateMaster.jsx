import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';
import Modal from '../components/Modal';

function AdminPriceRateMaster() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEditRate, setSelectedEditRate] = useState(null);
  const [showPriceListModal, setShowPriceListModal] = useState(false);
  const [selectedRate, setSelectedRate] = useState(null);

  const [apiServices, setApiServices] = useState([]);
  const [apiServiceGroups, setApiServiceGroups] = useState([]);
  const [apiVisitTypes, setApiVisitTypes] = useState([]);
  const [apiLocations, setApiLocations] = useState([]);
  const [apiRates, setApiRates] = useState([]);

  const [locationPrices, setLocationPrices] = useState({});
  const [existingLocationPriceIds, setExistingLocationPriceIds] = useState({});

  const [formData, setFormData] = useState({
    service: '',
    serviceGroup: '',
    visitType: '',
    price: '',
    validFrom: '',
    validTo: ''
  });

  const fetchRates = async () => {
    try {
      const res = await axiosInstance.get(ENDPOINTS.PRICE_RATE_MASTER);
      setApiRates(res.data);
    } catch (err) {
      console.error("Error fetching rates:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, groupsRes, visitTypesRes, locationsRes] = await Promise.all([
          axiosInstance.get(ENDPOINTS.SERVICES).catch(() => ({ data: [] })),
          axiosInstance.get(ENDPOINTS.SERVICE_GROUPS).catch(() => ({ data: [] })),
          axiosInstance.get(ENDPOINTS.VISIT_TYPE_MASTER).catch(() => ({ data: [] })),
          axiosInstance.get(ENDPOINTS.LOCATIONS).catch(() => ({ data: [] }))
        ]);
        setApiServices(servicesRes.data.filter(x => x.is_active !== false));
        setApiServiceGroups(groupsRes.data.filter(x => x.is_active !== false));
        setApiVisitTypes(visitTypesRes.data.filter(x => x.is_active !== false));
        setApiLocations(locationsRes.data.filter(x => x.is_active !== false));
      } catch (err) {
        console.error("Error fetching master data:", err);
      }
    };
    fetchData();
    fetchRates();
  }, []);

  useEffect(() => {
    if (showAddModal) {
      if (selectedEditRate) {
        setFormData({
          service: selectedEditRate.service_name || '',
          serviceGroup: selectedEditRate.service_group_name || '',
          visitType: selectedEditRate.visit_type || '',
          price: selectedEditRate.price || '',
          validFrom: selectedEditRate.valid_from || '',
          validTo: selectedEditRate.valid_to || ''
        });
      } else {
        setFormData({
          service: '', serviceGroup: '', visitType: '', price: '', validFrom: '', validTo: ''
        });
      }
    }
  }, [showAddModal, selectedEditRate]);

  useEffect(() => {
    if (showPriceListModal && selectedRate) {
      axiosInstance.get(ENDPOINTS.PRICE_RATE_MASTER_LOCATIONS)
        .then(res => {
          const pricesMap = {};
          const idsMap = {};
          const existing = res.data.filter(x => x.price_rate_master === selectedRate.id);
          existing.forEach(item => {
            pricesMap[item.location] = item.custom_price;
            idsMap[item.location] = item.id;
          });
          setLocationPrices(pricesMap);
          setExistingLocationPriceIds(idsMap);
        })
        .catch(err => console.error("Error fetching location prices:", err));
    }
  }, [showPriceListModal, selectedRate]);

  const handleLocationPriceChange = (locationId, value) => {
    setLocationPrices(prev => ({ ...prev, [locationId]: value }));
  };

  const handleSaveLocationPrices = async () => {
    try {
      const promises = Object.entries(locationPrices).map(([locationId, price]) => {
        const existingId = existingLocationPriceIds[locationId];
        const payload = {
          price_rate_master: selectedRate.id,
          location: parseInt(locationId),
          custom_price: price
        };
        
        if (existingId) {
          if (!price || price.toString().trim() === '') {
            return axiosInstance.delete(`${ENDPOINTS.PRICE_RATE_MASTER_LOCATIONS}${existingId}/`);
          } else {
            return axiosInstance.put(`${ENDPOINTS.PRICE_RATE_MASTER_LOCATIONS}${existingId}/`, payload);
          }
        } else {
          if (price && price.toString().trim() !== '') {
            return axiosInstance.post(ENDPOINTS.PRICE_RATE_MASTER_LOCATIONS, payload);
          }
        }
        return Promise.resolve();
      });
      
      await Promise.all(promises.filter(Boolean));
      setShowPriceListModal(false);
      alert("Location prices saved successfully!");
    } catch (err) {
      console.error("Error saving location prices:", err);
      alert("Failed to save location prices");
    }
  };

  const handleServiceChange = (e) => {
    const serviceName = e.target.value;
    const svc = apiServices.find(s => s.service_name === serviceName);
    let groupName = formData.serviceGroup;
    if (svc) {
      const group = apiServiceGroups.find(g => g.service_group_id === svc.service_group);
      if (group) groupName = group.service_group_name;
    }
    setFormData({ ...formData, service: serviceName, serviceGroup: groupName });
  };
  
  const handleSave = async () => {
    if (!formData.service || !formData.visitType || !formData.price) {
      alert("Please fill all required fields");
      return;
    }
    
    const svc = apiServices.find(s => s.service_name === formData.service);
    if (!svc) {
      alert("Invalid service selected");
      return;
    }
    
    const payload = {
      service: svc.service_id,
      visit_type: formData.visitType,
      price: formData.price,
      valid_from: formData.validFrom || null,
      valid_to: formData.validTo || null
    };

    try {
      if (selectedEditRate) {
        await axiosInstance.put(`${ENDPOINTS.PRICE_RATE_MASTER}${selectedEditRate.id}/`, payload);
      } else {
        await axiosInstance.post(ENDPOINTS.PRICE_RATE_MASTER, payload);
      }
      setShowAddModal(false);
      fetchRates();
    } catch (err) {
      console.error("Error saving rate:", err);
      alert("Failed to save rate");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this rate?")) {
      try {
        await axiosInstance.delete(`${ENDPOINTS.PRICE_RATE_MASTER}${id}/`);
        fetchRates();
      } catch (err) {
        console.error("Error deleting rate:", err);
        alert("Failed to delete rate");
      }
    }
  };

  const columns = [
    { key: 'service_group_name', label: 'SERVICE GROUP' },
    { key: 'service_name', label: 'SERVICE' },
    { key: 'visit_type', label: 'VISIT TYPE' },
    { key: 'valid_from', label: 'VALID FROM' },
    { key: 'valid_to', label: 'VALID TO' },
    { key: 'price', label: 'BASE PRICE' },
    { key: 'priceList', label: 'PRICE LIST' }
  ];

  const filteredRates = apiRates.filter(r => 
    r.service_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.service_group_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='w-full'>
      <div className="flex justify-between items-center mb-6">
        {/* Left Side: Search */}
        <div className="relative w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <i className="fas fa-search text-gray-400"></i>
          </span>
          <input 
            type="text" 
            placeholder="Search Rates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#00acc1]"
          />
        </div>

        {/* Right Side: Add Button */}
        <button 
          onClick={() => { setSelectedEditRate(null); setShowAddModal(true); }}
          className="cursor-pointer bg-[#00acc1] hover:bg-[#008ba3] text-white font-semibold py-2 px-4 rounded-lg flex items-center shadow-sm transition-colors"
        >
          <i className="fas fa-plus mr-2"></i> Add New
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
        {/* Horizontal scroll without visible scrollbar */}
        <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="min-w-full bg-white whitespace-nowrap">
            <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
              <tr>
                {columns.map(col => (
                  <th key={col.key} className="py-3 px-4 text-center font-bold border-b border-gray-200">
                    {col.label}
                  </th>
                ))}
                <th className="py-3 px-4 text-center font-bold border-b border-gray-200">ACTION</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y divide-gray-100 text-sm">
              {filteredRates.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="py-8 text-center text-gray-500">
                    No rates found.
                  </td>
                </tr>
              ) : (
                filteredRates.map(rate => (
                  <tr key={rate.id} className="hover:bg-blue-50 transition-colors duration-150">
                    {columns.map(col => (
                      <td key={col.key} className="py-3 px-4 text-center">
                        {col.key === 'priceList' ? (
                          <button 
                            onClick={() => { setSelectedRate(rate); setShowPriceListModal(true); }}
                            className="cursor-pointer px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-colors shadow-sm bg-teal-100 text-teal-700 hover:bg-teal-200 border border-teal-200"
                          >
                            Price List
                          </button>
                        ) : col.key === 'price' ? (
                          `₹ ${rate.price}`
                        ) : (
                          rate[col.key] || '-'
                        )}
                      </td>
                    ))}
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => { setSelectedEditRate(rate); setShowAddModal(true); }}
                        className="cursor-pointer text-[#00acc1] hover:text-[#008ba3] mx-1" 
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDelete(rate.id)} className="cursor-pointer text-red-500 hover:text-red-700 mx-1" title="Delete">
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Price List Modal */}
      <Modal 
        isOpen={showPriceListModal && !!selectedRate} 
        onClose={() => setShowPriceListModal(false)}
        title={selectedRate ? `Location Pricing - ${selectedRate.service_name}` : 'Location Pricing'}
        maxWidth="max-w-lg"
      >
        <div className="px-6 py-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 text-sm font-semibold text-gray-600 w-1/2">Location</th>
                    <th className="py-2 text-sm font-semibold text-gray-600 w-1/2">Custom Price (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {apiLocations.map(loc => {
                    const locId = loc.id || loc.location_id || loc._id;
                    return (
                      <tr key={locId} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 pr-4 text-[15px] text-gray-700 font-medium">{loc.location_name || loc.name}</td>
                        <td className="py-3">
                          <input 
                            type="text" 
                            placeholder="Base Price"
                            value={locationPrices[locId] || ''}
                            onChange={(e) => handleLocationPriceChange(locId, e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[15px] focus:outline-none focus:border-[#35435e]"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-5 border-t border-gray-100 flex justify-end gap-4 flex-shrink-0 bg-gray-50">
              <button 
                onClick={() => setShowPriceListModal(false)}
                className="cursor-pointer px-6 py-2 border border-gray-200 text-[#5a6a85] font-bold rounded shadow-sm hover:bg-gray-50 transition-colors bg-white uppercase"
              >
                Close
              </button>
              <button 
                onClick={handleSaveLocationPrices}
                className="cursor-pointer px-6 py-2 bg-[#2a8bf2] text-white font-bold rounded shadow-sm hover:bg-[#1a7ae1] transition-colors uppercase"
              >
                Save Changes
              </button>
            </div>
      </Modal>

      {/* Add New Rate Modal */}
      <Modal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        title={selectedEditRate ? 'Edit Rate' : 'Add New Rate'}
        maxWidth="max-w-2xl"
      >
        <div className="px-8 py-6 overflow-y-auto [scrollbar-width:none]">
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#35435e] mb-2">Service Name</label>
                  <div className="relative">
                    <select 
                      value={formData.service}
                      onChange={handleServiceChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:border-[#35435e] appearance-none bg-white"
                    >
                      <option value="">-Select-</option>
                      {apiServices.map(svc => (
                        <option key={svc.service_id} value={svc.service_name}>{svc.service_name}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <i className="fas fa-chevron-down text-xs"></i>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#35435e] mb-2">Service Group</label>
                  <input 
                    type="text" 
                    value={formData.serviceGroup}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:border-[#35435e] bg-gray-50 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#35435e] mb-2">Visit Type</label>
                  <div className="relative">
                    <select 
                      value={formData.visitType}
                      onChange={(e) => setFormData({...formData, visitType: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:border-[#35435e] appearance-none bg-white"
                    >
                      <option value="">-Select-</option>
                      <option value="Home">Home</option>
                      <option value="Camp">Camp</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <i className="fas fa-chevron-down text-xs"></i>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#35435e] mb-2">Price</label>
                  <input 
                    type="text" 
                    placeholder="Enter Price"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:border-[#35435e]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#35435e] mb-2">Effective From</label>
                  <input 
                    type="date" 
                    value={formData.validFrom}
                    onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:border-[#35435e] uppercase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#35435e] mb-2">Effective To</label>
                  <input 
                    type="date" 
                    value={formData.validTo}
                    onChange={(e) => setFormData({...formData, validTo: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:border-[#35435e] uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-5 border-t border-gray-100 flex justify-end gap-4 flex-shrink-0 bg-gray-50">
              <button 
                onClick={() => setShowAddModal(false)}
                className="cursor-pointer px-6 py-2 border border-gray-200 text-[#5a6a85] font-bold rounded shadow-sm hover:bg-gray-50 transition-colors bg-white uppercase"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="cursor-pointer px-6 py-2 bg-[#2a8bf2] text-white font-bold rounded shadow-sm hover:bg-[#1a7ae1] transition-colors uppercase"
              >
                Save
              </button>
            </div>
      </Modal>
    </div>
  );
}

export default AdminPriceRateMaster;
