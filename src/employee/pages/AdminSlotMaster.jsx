import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminSlotMaster() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentSlot, setCurrentSlot] = useState({ slot_name: '', is_active: true, order_no: 0 });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/slot-master/');
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
        await axios.put(`http://127.0.0.1:8000/api/slot-master/${currentSlot.slot_id}/`, currentSlot);
        alert('Slot updated successfully');
      } else {
        await axios.post('http://127.0.0.1:8000/api/slot-master/', currentSlot);
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
        await axios.delete(`http://127.0.0.1:8000/api/slot-master/${id}/`);
        fetchSlots();
      } catch (err) {
        console.error('Error deleting slot', err);
        alert('Failed to delete slot.');
      }
    }
  };

  const openNewModal = () => {
    setCurrentSlot({ slot_name: '', is_active: true, order_no: 0 });
    setIsEditing(false);
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">List of Slots</h2>
        <button onClick={openNewModal} className="bg-[#00acc1] hover:bg-[#008ba3] text-white px-4 py-2 rounded shadow transition-colors duration-200 flex items-center">
          <i className="fas fa-plus mr-2"></i> Add Slot
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
            <tr>
              <th className="py-4 px-6 text-center font-bold">Slot Name</th>
              <th className="py-4 px-6 text-center font-bold">Active</th>
              <th className="py-4 px-6 text-center font-bold w-48" colSpan="3">Actions</th>
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
              slots.map((slot) => (
                <tr key={slot.slot_id} className="hover:bg-blue-50/50 transition duration-150">
                  <td className="py-4 px-6 text-center font-bold text-gray-800">{slot.slot_name}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 text-xs font-bold ${slot.is_active ? 'text-gray-800' : 'text-gray-400'}`}>
                      {slot.is_active ? 'True' : 'False'}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <button onClick={() => handleEdit(slot)} className="text-xs font-bold btn btn-dark bg-gray-800 text-white px-3 py-1 rounded transition-colors hover:bg-gray-700">
                      Edit
                    </button>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <button onClick={() => handleEdit(slot)} className="text-xs font-bold btn btn-warning bg-yellow-500 text-white px-3 py-1 rounded transition-colors hover:bg-yellow-600">
                      Details
                    </button>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <button onClick={() => handleDelete(slot.slot_id)} className="text-xs font-bold btn btn-danger bg-red-600 text-white px-3 py-1 rounded transition-colors hover:bg-red-700">
                      Delete
                    </button>
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
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h4 className="text-xl font-bold text-gray-800">{isEditing ? 'Update Slot' : 'Add Slot'}</h4>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6">
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

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Order Number (Optional)</label>
                <input 
                  type="number" 
                  value={currentSlot.order_no}
                  onChange={(e) => setCurrentSlot({...currentSlot, order_no: e.target.value})}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#00acc1]"
                  placeholder="0"
                />
              </div>
              
              <div className="flex mt-6">
                <button type="submit" className="px-4 py-2 bg-[#00acc1] hover:bg-[#0097a7] text-white font-semibold rounded transition-colors">
                  Save
                </button>
              </div>
            </form>
            <div className="px-6 py-3 border-t border-gray-100 flex justify-end">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 rounded transition-colors">
                  Close
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default AdminSlotMaster;
