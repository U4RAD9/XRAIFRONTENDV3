import React, { useState } from 'react';
import Modal from '../components/Modal';
import ServiceProviderCard from '../components/ServiceProviderCard';
import ServiceProviderProfile from '../components/ServiceProviderProfile';

function AdminServiceProviders() {
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [showFormModal, setShowFormModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const [selectedProvider, setSelectedProvider] = useState(null);
  
  // Dummy Data removed
  const [providers, setProviders] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    designation: '',
    age: '',
    gender: 'Male',
    experience: '',
    contact: '',
    active: true,
    image: '',
    about: ''
  });

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProviders = providers.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClick = () => {
    setFormData({
      id: null,
      name: '',
      designation: '',
      age: '',
      gender: 'Male',
      experience: '',
      contact: '',
      active: true,
      image: '',
      about: ''
    });
    setShowFormModal(true);
  };

  const handleEditClick = (provider) => {
    setFormData({ ...provider });
    setShowFormModal(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this provider?')) {
      setProviders(providers.filter(p => p.id !== id));
    }
  };

  const handleToggleStatus = (id, newStatus) => {
    setProviders(providers.map(p => p.id === id ? { ...p, active: newStatus } : p));
  };

  const handleViewClick = (provider) => {
    setSelectedProvider(provider);
    setShowProfileModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.contact) {
      alert("Name and Contact are required");
      return;
    }

    if (formData.id) {
      // Update
      setProviders(providers.map(p => p.id === formData.id ? formData : p));
    } else {
      // Create
      setProviders([...providers, { ...formData, id: Date.now() }]);
    }
    setShowFormModal(false);
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/3">
            <input 
              type="text" 
              placeholder="Search providers..." 
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#11A8A4] text-sm"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button 
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 text-xl transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-gray-50 text-[#00acc1]' : 'text-gray-400 hover:bg-gray-50'}`}
                title="Table View"
              >
                <i className="fas fa-list-ul"></i>
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 border-l border-gray-200 text-xl transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-gray-50 text-[#00acc1]' : 'text-gray-400 hover:bg-gray-50'}`}
                title="Grid View"
              >
                <i className="fas fa-border-all"></i>
              </button>
            </div>
            
            <button 
              onClick={handleAddClick}
              className="bg-[#00acc1] hover:bg-[#0097a7] text-white px-5 py-2 rounded-lg text-[15px] font-bold transition-colors flex items-center shadow-sm cursor-pointer whitespace-nowrap"
            >
              <i className="fas fa-plus mr-2 text-lg"></i> Add New Technician
            </button>
          </div>
        </div>

        {/* Content Area */}
        {filteredProviders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500">No service providers found.</p>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-center">Image</th>
                    <th className="py-3 px-4 font-semibold">Name</th>
                    <th className="py-3 px-4 font-semibold">Designation</th>
                    <th className="py-3 px-4 font-semibold">Age</th>
                    <th className="py-3 px-4 font-semibold">Gender</th>
                    <th className="py-3 px-4 font-semibold">Experience</th>
                    <th className="py-3 px-4 font-semibold">Contact no.</th>
                    <th className="py-3 px-4 font-semibold text-center">Active</th>
                    <th className="py-3 px-4 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-gray-700">
                  {filteredProviders.map(provider => (
                    <tr key={provider.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-2 px-4 text-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 inline-block mx-auto">
                          {provider.image ? (
                            <img src={provider.image} alt={provider.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <i className="fas fa-user"></i>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">{provider.name}</td>
                      <td className="py-3 px-4">{provider.designation}</td>
                      <td className="py-3 px-4">{provider.age}</td>
                      <td className="py-3 px-4">{provider.gender}</td>
                      <td className="py-3 px-4">{provider.experience}</td>
                      <td className="py-3 px-4">{provider.contact}</td>
                      <td className="py-3 px-4 text-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              className="sr-only" 
                              checked={provider.active}
                              onChange={() => handleToggleStatus(provider.id, !provider.active)} 
                            />
                            <div className={`block w-10 h-6 rounded-full transition-colors ${provider.active ? 'bg-[#11A8A4]' : 'bg-gray-300'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${provider.active ? 'transform translate-x-4' : ''}`}></div>
                          </div>
                        </label>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => handleViewClick(provider)} className="cursor-pointer text-[#11A8A4] hover:text-[#008ba3] p-1 transition-colors" title="View Profile">
                            <i className="fas fa-eye text-lg"></i>
                          </button>
                          <button onClick={() => handleEditClick(provider)} className="cursor-pointer text-blue-500 hover:text-blue-700 p-1 transition-colors" title="Edit">
                            <i className="fas fa-edit text-lg"></i>
                          </button>
                          <button onClick={() => handleDeleteClick(provider.id)} className="cursor-pointer text-red-500 hover:text-red-700 p-1 transition-colors" title="Delete">
                            <i className="fas fa-trash-alt text-lg"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProviders.map(provider => (
              <ServiceProviderCard 
                key={provider.id} 
                provider={provider} 
                onView={handleViewClick}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}

      </div>

      {/* Add / Edit Form Modal */}
      <Modal 
        isOpen={showFormModal} 
        onClose={() => setShowFormModal(false)} 
        title={formData.id ? "Edit Technician" : "Add New Technician"}
        maxWidth="max-w-2xl"
      >
        <div className="p-6 bg-white overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#11A8A4]" placeholder="Enter full name" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Designation</label>
              <input type="text" name="designation" value={formData.designation} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#11A8A4]" placeholder="e.g. Radiographer" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Age</label>
              <input type="text" name="age" value={formData.age} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#11A8A4]" placeholder="e.g. 27 Years" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#11A8A4]">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Experience</label>
              <input type="text" name="experience" value={formData.experience} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#11A8A4]" placeholder="e.g. 1 Year" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Contact no.</label>
              <input type="text" name="contact" value={formData.contact} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#11A8A4]" placeholder="Enter phone number" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
              <input type="text" name="image" value={formData.image} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#11A8A4]" placeholder="Leave blank for default avatar" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">About</label>
              <textarea name="about" value={formData.about} onChange={handleFormChange} rows="2" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#11A8A4]" placeholder="Write a short bio..."></textarea>
            </div>

            <div className="md:col-span-2 mt-2">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" name="active" checked={formData.active} onChange={handleFormChange} className="w-4 h-4 text-[#11A8A4] rounded focus:ring-[#11A8A4]" />
                <span className="ml-2 text-sm text-gray-700 font-semibold">Active Profile</span>
              </label>
            </div>

          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
          <button onClick={() => setShowFormModal(false)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-colors shadow-sm cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSave} className="px-6 py-2 bg-[#233560] rounded-lg text-white text-sm font-semibold hover:bg-[#1a2849] transition-colors shadow-sm cursor-pointer">
            Save
          </button>
        </div>
      </Modal>

      {/* Profile View Modal */}
      {showProfileModal && (
        <ServiceProviderProfile 
          provider={selectedProvider} 
          onClose={() => setShowProfileModal(false)} 
        />
      )}

    </div>
  );
}

export default AdminServiceProviders;
