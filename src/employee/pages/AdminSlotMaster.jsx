import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';
import Modal from '../components/Modal';

function AdminSlotMaster() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentSlot, setCurrentSlot] = useState({ slot_name: '', is_active: true });
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(ENDPOINTS.SLOT_MASTER);
      setSlots(res.data);
    } catch (err) {
      console.error('Error fetching slots', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentSlot.slot_name) {
      alert("Please enter slot name.");
      return;
    }
    try {
      if (isEditing) {
        await axiosInstance.put(`${ENDPOINTS.SLOT_MASTER}${currentSlot.slot_id}/`, currentSlot);
        alert('Slot updated successfully');
      } else {
        await axiosInstance.post(ENDPOINTS.SLOT_MASTER, currentSlot);
        alert('Slot added successfully');
      }
      setShowModal(false);
      fetchSlots();
    } catch (err) {
      console.error('Error saving slot', err);
      alert('Failed to save slot.');
    }
  };

  const handleEdit = (slot) => {
    setCurrentSlot(slot);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this slot detail?")) {
      try {
        await axiosInstance.delete(`${ENDPOINTS.SLOT_MASTER}${id}/`);
        fetchSlots();
      } catch (err) {
        console.error('Error deleting slot', err);
        alert('Failed to delete slot.');
      }
    }
  };

  const openNewModal = () => {
    setCurrentSlot({ slot_name: '', is_active: true });
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
            placeholder="Search Slots..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#00acc1]"
          />
        </div>
        <button onClick={openNewModal} className="bg-[#00acc1] hover:bg-[#008ba3] text-white px-4 py-2 rounded shadow transition-colors duration-200 flex items-center">
          <i className="fas fa-plus mr-2"></i> Add Slot
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
            <tr>
              <th className="py-4 px-6 text-start font-bold">Slot Name</th>
              <th className="py-4 px-6 text-start font-bold">Active</th>
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
            ) : slots.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-gray-500 font-semibold">No slots found.</td>
              </tr>
            ) : (
              slots.filter(slot => slot.slot_name.toLowerCase().includes(searchQuery.toLowerCase())).map((slot) => (
                <tr key={slot.slot_id} className="hover:bg-blue-50/50 transition duration-150">
                  <td className="py-4 px-6 text-start font-bold text-gray-800">{slot.slot_name}</td>
                  <td className="py-4 px-6 text-start">
                    <span className={`px-3 py-1 text-xs font-bold ${slot.is_active ? 'text-gray-800' : 'text-gray-400'}`}>
                      {slot.is_active ? 'True' : 'False'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center gap-4">
                      <button onClick={() => handleEdit(slot)} className="cursor-pointer text-[#00acc1] hover:text-[#008ba3] transition-colors" title="Edit">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDelete(slot.slot_id)} className="cursor-pointer text-red-500 hover:text-red-700 transition-colors" title="Delete">
                        <i className="fas fa-trash-alt"></i>
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
        title={isEditing ? 'Update Slot' : 'Add Slot'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Slot Name</label>
                <input 
                  type="text" 
                  required
                  value={currentSlot.slot_name}
                  onChange={(e) => setCurrentSlot({...currentSlot, slot_name: e.target.value})}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#00acc1]"
                  placeholder="Enter Slot Name"
                />
              </div>
              
              <div className="flex items-center mb-6 pl-2">
                <input 
                  type="checkbox" 
                  id="isActiveSlot"
                  checked={currentSlot.is_active}
                  onChange={(e) => setCurrentSlot({...currentSlot, is_active: e.target.checked})}
                  className="mr-2 h-4 w-4 text-[#00acc1] focus:ring-[#00acc1] border-gray-300 rounded"
                />
                <label htmlFor="isActiveSlot" className="text-sm font-semibold text-gray-700">Active</label>
              </div>

              </div>
          <div className="px-6 py-5 border-t border-gray-100 flex justify-end gap-4 flex-shrink-0 bg-gray-50">
            <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
              Close
            </button>
            <button type="submit" className="px-6 py-2 bg-[#00acc1] hover:bg-[#0097a7] text-white font-semibold rounded-lg shadow transition-colors cursor-pointer">
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
    </div>
  );
}

export default AdminSlotMaster;
