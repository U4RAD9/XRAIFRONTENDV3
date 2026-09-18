import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../components/Modal';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';
import Pagination from '../../components/Pagination';

function AdminPatients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editFormData, setEditFormData] = useState({});
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    fetchPatients();
  }, [currentPage, debouncedSearch]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(ENDPOINTS.PATIENTS, {
        params: { page: currentPage, search: debouncedSearch }
      });
      
      const data = response.data.results || response.data;
      if (response.data.total_pages) {
        setTotalPages(response.data.total_pages);
      } else {
        setTotalPages(1);
      }

      const mapped = (Array.isArray(data) ? data : []).map(p => ({
        id: p.patient_id,
        patientName: p.patient_name,
        age: p.age || 'N/A',
        weight: p.weight || 'N/A',
        gender: p.gender || 'N/A',
        address: p.address || 'N/A',
        contactNo: p.alternate_mobile_number || 'N/A',
        email: p.email || 'N/A',
        pin: p.pin || 'N/A',
        refNo: `REF-${p.patient_id}`,
        height: p.height || 'N/A',
        bmi: p.bmi || 'N/A',
        bp: p.bp || 'N/A'
      }));
      setPatients(mapped);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (patient) => {
    setSelectedPatient(patient);
    setEditFormData({
      patientName: patient.patientName === 'N/A' ? '' : patient.patientName,
      age: patient.age === 'N/A' ? '' : patient.age,
      weight: patient.weight === 'N/A' ? '' : patient.weight,
      gender: patient.gender === 'N/A' ? '' : patient.gender,
      height: patient.height === 'N/A' ? '' : patient.height,
      bp: patient.bp === 'N/A' ? '' : patient.bp,
      address: patient.address === 'N/A' ? '' : patient.address,
      pin: patient.pin === 'N/A' ? '' : patient.pin,
      email: patient.email === 'N/A' ? '' : patient.email,
      contactNo: patient.contactNo === 'N/A' ? '' : patient.contactNo,
    });
    setShowEditModal(true);
  };

  const handleUpdatePatient = async () => {
    try {
      setUpdating(true);
      const payload = {
        patient_name: editFormData.patientName,
        age: editFormData.age,
        weight: editFormData.weight,
        gender: editFormData.gender,
        // height: editFormData.height,
        // bp: editFormData.bp,
        address: editFormData.address,
        pin: editFormData.pin,
        email: editFormData.email,
        alternate_mobile_number: editFormData.contactNo,
      };
      await axiosInstance.patch(`${ENDPOINTS.PATIENTS}${selectedPatient.id}/`, payload);
      setShowEditModal(false);
      fetchPatients();
    } catch (error) {
      console.error("Error updating patient:", error);
      alert("Failed to update patient details.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeletePatient = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
      try {
        await axiosInstance.delete(`${ENDPOINTS.PATIENTS}${patientId}/`);
        fetchPatients();
      } catch (error) {
        console.error("Error deleting patient:", error);
        alert("Failed to delete patient. They might be associated with existing bookings.");
      }
    }
  };

  const columns = [
    { key: 'patientName', label: 'PATIENT NAME' },
    { key: 'age', label: 'AGE' },
    { key: 'weight', label: 'WEIGHT' },
    { key: 'gender', label: 'GENDER' },
    { key: 'address', label: 'ADDRESS' },
    { key: 'contactNo', label: 'CONTACT NO' },
    { key: 'email', label: 'EMAIL' },
    { key: 'pin', label: 'PIN' },
    { key: 'refNo', label: 'REF NO' },
    // { key: 'height', label: 'HEIGHT' },
    { key: 'bmi', label: 'BMI' }
    // { key: 'bp', label: 'BP' }
  ];

  const filteredPatients = patients;

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
            placeholder="Search Patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#00acc1]"
          />
        </div>
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
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="py-8 text-center text-gray-500">
                    No patients found.
                  </td>
                </tr>
              ) : (
                filteredPatients.map(patient => (
                  <tr key={patient.id} className="hover:bg-blue-50 transition-colors duration-150">
                    {columns.map(col => (
                      <td key={col.key} className={`py-3 px-4 ${col.key === 'address' ? 'text-left' : 'text-center'}`}>
                        {patient[col.key]}
                      </td>
                    ))}
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => handleEditClick(patient)}
                        className="cursor-pointer text-[#00acc1] hover:text-[#008ba3] mx-1" 
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        onClick={() => handleDeletePatient(patient.id)}
                        className="cursor-pointer text-red-500 hover:text-red-700 mx-1" 
                        title="Delete"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={(page) => setCurrentPage(page)} 
        />
      </div>

      {/* Edit Patient Modal */}
      {selectedPatient && (
      <Modal 
        isOpen={showEditModal && !!selectedPatient} 
        onClose={() => setShowEditModal(false)}
        title="Update Patient Details"
        maxWidth="max-w-3xl"
      >
        <div className="px-8 py-6 overflow-y-auto [scrollbar-width:none]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-[15px] font-bold text-[#35435e] mb-2">Patient Name</label>
                  <input 
                    type="text" 
                    value={editFormData.patientName || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, patientName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#35435e]"
                  />
                </div>
                <div>
                  <label className="block text-[15px] font-bold text-[#35435e] mb-2">Age</label>
                  <input 
                    type="text" 
                    value={editFormData.age || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, age: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#35435e]"
                  />
                </div>
                
                <div>
                  <label className="block text-[15px] font-bold text-[#35435e] mb-2">Weight</label>
                  <input 
                    type="text" 
                    value={editFormData.weight || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, weight: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#35435e]"
                  />
                </div>
                <div>
                  <label className="block text-[15px] font-bold text-[#35435e] mb-2">Gender</label>
                  <input 
                    type="text" 
                    value={editFormData.gender || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#35435e]"
                  />
                </div>

                {/* Height and BP removed per request */}
                {/* 
                <div>
                  <label className="block text-[15px] font-bold text-[#35435e] mb-2">Height</label>
                  <input 
                    type="text" 
                    value={editFormData.height || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, height: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#35435e]"
                  />
                </div>
                <div>
                  <label className="block text-[15px] font-bold text-[#35435e] mb-2">BP</label>
                  <input 
                    type="text" 
                    value={editFormData.bp || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, bp: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#35435e]"
                  />
                </div> 
                */}

                <div>
                  <label className="block text-[15px] font-bold text-[#35435e] mb-2">Address</label>
                  <input 
                    type="text"
                    value={editFormData.address || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#35435e]"
                  />
                </div>
                <div>
                  <label className="block text-[15px] font-bold text-[#35435e] mb-2">Pin</label>
                  <input 
                    type="password" 
                    value={editFormData.pin || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, pin: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#35435e]"
                  />
                </div>

                <div>
                  <label className="block text-[15px] font-bold text-[#35435e] mb-2">Email</label>
                  <input 
                    type="text" 
                    value={editFormData.email || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#35435e]"
                  />
                </div>
                <div>
                  <label className="block text-[15px] font-bold text-[#35435e] mb-2">Alternate Number</label>
                  <input 
                    type="text" 
                    value={editFormData.contactNo || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, contactNo: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#35435e]"
                  />
                </div>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-gray-100 flex justify-end gap-4 flex-shrink-0 bg-gray-50">
              <button 
                onClick={() => setShowEditModal(false)}
                disabled={updating}
                className="cursor-pointer px-6 py-2.5 border border-gray-200 text-[#5a6a85] font-bold rounded shadow-sm hover:bg-gray-50 transition-colors bg-white uppercase disabled:opacity-50"
              >
                CLOSE
              </button>
              <button 
                onClick={handleUpdatePatient}
                disabled={updating}
                className="cursor-pointer px-6 py-2.5 bg-[#2a8bf2] text-white font-bold rounded shadow-sm hover:bg-[#1a7ae1] transition-colors uppercase disabled:opacity-50"
              >
                {updating ? 'UPDATING...' : 'UPDATE'}
              </button>
            </div>
      </Modal>
      )}
    </div>
  );
}

export default AdminPatients;
