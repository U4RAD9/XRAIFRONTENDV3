import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';
import Modal from '../components/Modal';

function AdminOffersMaster() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEditOffer, setSelectedEditOffer] = useState(null);

  const [apiServiceGroups, setApiServiceGroups] = useState([]);
  const [apiLocations, setApiLocations] = useState([]);
  const [apiUserTypes, setApiUserTypes] = useState([]);
  const [apiOffers, setApiOffers] = useState([]);

  const [formData, setFormData] = useState({
    offerName: '',
    discount: '',
    discountType: 'Item Level',
    serviceGroup: [],
    location: [],
    userType: [],
    effectiveFrom: '',
    effectiveTo: '',
    isActive: true
  });

  const fetchOffers = async () => {
    try {
      const res = await axiosInstance.get(ENDPOINTS.OFFER_MASTER);
      setApiOffers(res.data);
    } catch (err) {
      console.error("Error fetching offers:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupsRes, locsRes, userTypesRes] = await Promise.all([
          axiosInstance.get(ENDPOINTS.SERVICE_GROUPS).catch(() => ({ data: [] })),
          axiosInstance.get(ENDPOINTS.LOCATIONS).catch(() => ({ data: [] })),
          axiosInstance.get(ENDPOINTS.USER_TYPES).catch(() => ({ data: [] }))
        ]);
        setApiServiceGroups(groupsRes.data.filter(x => x.is_active !== false));
        setApiLocations(locsRes.data.filter(x => x.is_active !== false));
        setApiUserTypes(userTypesRes.data.filter(x => x.is_active !== false));
      } catch (err) {
        console.error("Error fetching master data:", err);
      }
    };
    fetchData();
    fetchOffers();
  }, []);

  useEffect(() => {
    if (showAddModal) {
      if (selectedEditOffer) {
        setFormData({
          offerName: selectedEditOffer.offer_name || '',
          discount: selectedEditOffer.discount || '',
          discountType: selectedEditOffer.discount_type || 'Item Level',
          serviceGroup: selectedEditOffer.service_group || [],
          location: selectedEditOffer.location || [],
          userType: selectedEditOffer.user_type || [],
          effectiveFrom: selectedEditOffer.effective_from || '',
          effectiveTo: selectedEditOffer.effective_to || '',
          isActive: selectedEditOffer.is_active !== false
        });
      } else {
        setFormData({
          offerName: '',
          discount: '',
          discountType: 'Item Level',
          serviceGroup: [],
          location: [],
          userType: [],
          effectiveFrom: '',
          effectiveTo: '',
          isActive: true
        });
      }
    }
  }, [showAddModal, selectedEditOffer]);

  const handleChange = (e) => {
    const { name, value, type, checked, options } = e.target;
    
    if (type === 'select-multiple') {
      const selectedValues = Array.from(options).filter(opt => opt.selected).map(opt => parseInt(opt.value));
      setFormData(prev => ({
        ...prev,
        [name]: selectedValues
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSave = async () => {
    if (!formData.offerName || !formData.discount) {
      alert("Please fill required fields (Name, Discount)");
      return;
    }

    const payload = {
      offer_name: formData.offerName,
      discount: formData.discount,
      discount_type: formData.discountType,
      service_group: formData.serviceGroup,
      location: formData.location,
      user_type: formData.userType,
      effective_from: formData.effectiveFrom || null,
      effective_to: formData.effectiveTo || null,
      is_active: formData.isActive
    };

    try {
      if (selectedEditOffer) {
        await axiosInstance.put(`${ENDPOINTS.OFFER_MASTER}${selectedEditOffer.id}/`, payload);
      } else {
        await axiosInstance.post(ENDPOINTS.OFFER_MASTER, payload);
      }
      setShowAddModal(false);
      fetchOffers();
    } catch (err) {
      console.error("Error saving offer:", err);
      alert("Failed to save offer");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      try {
        await axiosInstance.delete(`${ENDPOINTS.OFFER_MASTER}${id}/`);
        fetchOffers();
      } catch (err) {
        console.error("Error deleting offer:", err);
        alert("Failed to delete offer");
      }
    }
  };

  const columns = [
    { key: 'offer_name', label: 'OFFER NAME' },
    { key: 'discount', label: 'DISCOUNT' },
    { key: 'effective_from', label: 'EFFECTIVE FROM' },
    { key: 'effective_to', label: 'EFFECTIVE TO' },
    { key: 'service_group_name', label: 'SERVICE GROUP' },
    { key: 'location_name', label: 'LOCATION' },
    { key: 'user_type_name', label: 'USER TYPE' },
    { key: 'is_active', label: 'STATUS' }
  ];

  const filteredOffers = apiOffers.filter(o => 
    o.offer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.location_name?.toLowerCase().includes(searchQuery.toLowerCase())
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
            placeholder="Search Offers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#00acc1]"
          />
        </div>

        {/* Right Side: Add Button */}
        <button 
          onClick={() => { setSelectedEditOffer(null); setShowAddModal(true); }}
          className="cursor-pointer bg-[#00acc1] hover:bg-[#008ba3] text-white font-semibold py-2 px-4 rounded-lg flex items-center shadow-sm transition-colors"
        >
          <i className="fas fa-plus mr-2"></i> Add New
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
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
              {filteredOffers.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="py-8 text-center text-gray-500">
                    No offers found.
                  </td>
                </tr>
              ) : (
                filteredOffers.map(offer => (
                  <tr key={offer.id} className="hover:bg-blue-50 transition-colors duration-150">
                    {columns.map(col => (
                      <td key={col.key} className="py-3 px-4 text-center">
                        {col.key === 'is_active' ? (
                          <input 
                            type="checkbox" 
                            checked={offer.is_active} 
                            readOnly 
                            className="cursor-not-allowed w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                        ) : (
                          offer[col.key]
                        )}
                      </td>
                    ))}
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => { setSelectedEditOffer(offer); setShowAddModal(true); }}
                        className="cursor-pointer text-[#00acc1] hover:text-[#008ba3] mx-1" 
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDelete(offer.id)} className="cursor-pointer text-red-500 hover:text-red-700 mx-1" title="Delete">
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

      {/* Add / Edit Modal */}
      <Modal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        title={selectedEditOffer ? 'Edit Offer' : 'Add New Offer'}
        maxWidth="max-w-3xl"
      >
        <div className="px-8 py-6 overflow-y-auto [scrollbar-width:none]">
              <div className="grid grid-cols-3 gap-x-6 gap-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#35435e] mb-2">Offer Name</label>
                  <input 
                    type="text" 
                    name="offerName"
                    placeholder="Enter Offer Name"
                    value={formData.offerName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-[#35435e]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#35435e] mb-2">Discount (%)</label>
                  <input 
                    type="text" 
                    name="discount"
                    placeholder="Enter Discount"
                    value={formData.discount}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-[#35435e]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#35435e] mb-2">Discount Type</label>
                  <div className="relative">
                    <select 
                      name="discountType"
                      value={formData.discountType}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-[#35435e] appearance-none bg-white"
                    >
                      <option value="Item Level">Item Level</option>
                      <option value="Invoice Level">Invoice Level</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <i className="fas fa-chevron-down text-xs"></i>
                    </div>
                  </div>
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-bold text-[#35435e] mb-2">Service Group</label>
                  <div className="relative">
                    <select 
                      name="serviceGroup"
                      value={formData.serviceGroup}
                      onChange={handleChange}
                      multiple
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-[#35435e] bg-white min-h-[100px]"
                    >
                      {apiServiceGroups.map(group => {
                        const groupId = group.id || group.service_group_id || group._id;
                        return (
                          <option key={groupId} value={groupId}>
                            {group.service_group_name || group.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-bold text-[#35435e] mb-2">Locations</label>
                  <div className="relative">
                    <select 
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      multiple
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-[#35435e] bg-white min-h-[100px]"
                    >
                      {apiLocations.map(loc => {
                        const locId = loc.id || loc.location_id || loc._id;
                        return (
                          <option key={locId} value={locId}>
                            {loc.location_name || loc.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-bold text-[#35435e] mb-2">User Type</label>
                  <div className="relative">
                    <select 
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                      multiple
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-[#35435e] bg-white min-h-[100px]"
                    >
                      {apiUserTypes.map(ut => {
                        const utId = ut.id || ut.user_type_id || ut._id;
                        return (
                          <option key={utId} value={utId}>
                            {ut.user_type || ut.user_type_name || ut.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                
                <div className="col-span-1">
                  <label className="block text-sm font-bold text-[#35435e] mb-2">Effective From</label>
                  <input 
                    type="date" 
                    name="effectiveFrom"
                    value={formData.effectiveFrom}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-[#35435e] uppercase"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-[#35435e] mb-2">Effective To</label>
                  <input 
                    type="date" 
                    name="effectiveTo"
                    value={formData.effectiveTo}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:border-[#35435e] uppercase"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#35435e]"></div>
                  <span className="ml-3 text-sm font-medium text-[#35435e]">Active</span>
                </label>
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

export default AdminOffersMaster;
