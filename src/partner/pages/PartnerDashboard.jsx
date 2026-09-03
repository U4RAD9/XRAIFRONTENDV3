import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';
import Modal from '../../employee/components/Modal';
import PatientCard from '../../employee/components/PatientCard';

function PartnerDashboard() {
  const [viewMode, setViewMode] = useState('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPatient, setNewPatient] = useState({
    name: '', age: '', weight: '', gender: '', height: '', bp: '', address: '', pin: '', email: '', alternateMobile: '', comment: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(ENDPOINTS.PATIENTS);
      let mapped = response.data.map(p => ({
        id: p.patient_id,
        patientName: p.patient_name,
        patient_name: p.patient_name,
        age: p.age || 'N/A',
        weight: p.weight || 'N/A',
        gender: p.gender || 'N/A',
        address: p.address || 'N/A',
        contactNo: p.alternate_mobile_number || 'N/A',
        alternate_mobile_number: p.alternate_mobile_number || 'N/A',
        email: p.email_id || 'N/A',
        pin: p.pin_code || 'N/A',
        height: p.height || 'N/A',
        bp: p.bp || 'N/A',
        comment: p.comment || 'N/A',
        ...p
      }));
      
      if (mapped.length === 0) {
        // No patients found for this partner
        mapped = [];
      }
      setPatients(mapped);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatientSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        patient_name: newPatient.name,
        age: newPatient.age,
        weight: newPatient.weight,
        gender: newPatient.gender,
        height: newPatient.height,
        bp: newPatient.bp,
        address: newPatient.address,
        pin: newPatient.pin,
        email: newPatient.email,
        alternate_mobile_number: newPatient.alternateMobile,
        comment: newPatient.comment
      };
      await axiosInstance.post(ENDPOINTS.PATIENTS, payload);
      alert('Patient saved!');
      setShowAddModal(false);
      setNewPatient({ name: '', age: '', weight: '', gender: '', height: '', bp: '', address: '', pin: '', email: '', alternateMobile: '', comment: '' });
      fetchPatients();
    } catch (err) {
      console.error("Error saving patient:", err);
      alert("Failed to save patient.");
    }
  };

  const columns = [
    { key: 'sno', label: 'S#' },
    { key: 'patientName', label: 'Name' },
    { key: 'age', label: 'Age' },
    { key: 'bp', label: 'BP' },
    { key: 'weight', label: 'Weight' },
    { key: 'height', label: 'Height' },
    { key: 'gender', label: 'Gender' },
    { key: 'address', label: 'Address' },
    { key: 'pin', label: 'Pin' },
    { key: 'email', label: 'Email' },
    { key: 'contactNo', label: 'Alternate Mobile Number' },
    { key: 'comment', label: 'Comment' }
  ];

  const filteredPatients = patients.filter(p => 
    p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.contactNo.includes(searchQuery) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='w-full'>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        {/* Left Side: Search */}
        <div className="relative w-full sm:w-64">
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
        
        {/* Right Side: Action Buttons and Toggle */}
        <div className="flex flex-wrap justify-end gap-3 w-full sm:w-auto">
          <div className="hidden md:flex bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <button 
              onClick={() => setViewMode('table')}
              className={`cursor-pointer px-3 py-2 ${viewMode === 'table' ? 'bg-gray-100 text-[#00acc1]' : 'text-gray-500 hover:bg-gray-50'}`}
              title="Table View"
            >
              <i className="fas fa-list"></i>
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`cursor-pointer px-3 py-2 border-l border-gray-300 ${viewMode === 'grid' ? 'bg-gray-100 text-[#00acc1]' : 'text-gray-500 hover:bg-gray-50'}`}
              title="Grid View"
            >
              <i className="fas fa-th-large"></i>
            </button>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="cursor-pointer bg-[#00acc1] hover:bg-[#008ba3] text-white font-semibold py-2 px-4 rounded-lg flex items-center shadow-sm transition-colors"
          >
            <i className="fas fa-plus mr-2"></i> Add Patient
          </button>
        </div>
      </div>

      {/* TABLE VIEW (Hidden on Mobile, Visible on Desktop if viewMode === 'table') */}
      <div className={`bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden hidden ${viewMode === 'table' ? 'md:block' : ''}`}>
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
                  <th className="py-3 px-4 text-center font-bold border-b border-gray-200">Book Slot</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 divide-y divide-gray-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="py-8 text-center text-gray-500">
                      Loading patients...
                    </td>
                  </tr>
                ) : filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="py-8 text-center text-gray-500">
                      No patients found.
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient, index) => (
                    <tr key={patient.id} className="hover:bg-[#11A8A4]/5 transition-colors duration-150">
                      <td className="py-3 px-4 text-center">{index + 1}</td>
                      <td className="py-3 px-4 text-center">{patient.patientName}</td>
                      <td className="py-3 px-4 text-center">{patient.age}</td>
                      <td className="py-3 px-4 text-center">{patient.bp}</td>
                      <td className="py-3 px-4 text-center">{patient.weight}</td>
                      <td className="py-3 px-4 text-center">{patient.height}</td>
                      <td className="py-3 px-4 text-center">{patient.gender}</td>
                      <td className="py-3 px-4 text-left">{patient.address}</td>
                      <td className="py-3 px-4 text-center">{patient.pin}</td>
                      <td className="py-3 px-4 text-left">{patient.email}</td>
                      <td className="py-3 px-4 text-center">{patient.contactNo}</td>
                      <td className="py-3 px-4 text-left">{patient.comment}</td>
                      <td className="py-3 px-4 text-center">
                        <button 
                          onClick={() => navigate('/partner/make-booking', { state: { patient } })}
                          className="cursor-pointer bg-[#00acc1] hover:bg-[#008ba3] text-white font-semibold py-1.5 px-4 rounded text-sm shadow-sm transition-colors"
                        >
                          Book Slot
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>


      {/* GRID VIEW (Visible on Mobile Always, Visible on Desktop if viewMode === 'grid') */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${viewMode === 'table' ? 'md:hidden' : ''}`}>
          {loading ? (
            <div className="col-span-full py-8 text-center text-gray-500">Loading patients...</div>
          ) : filteredPatients.length === 0 ? (
            <div className="col-span-full py-8 text-center text-gray-500">No patients found.</div>
          ) : (
            filteredPatients.map(patient => (
              <PatientCard 
                key={patient.id} 
                patient={patient} 
                onBookSlot={(p) => navigate('/partner/make-booking', { state: { patient: p } })} 
              />
            ))
          )}
        </div>

      {/* Add Patient Modal */}
      <Modal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        title="Add New Patient"
        maxWidth="max-w-4xl"
      >
        <form onSubmit={handleAddPatientSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Row 1 */}
                <div>
                  <label className="block text-sm font-semibold text-[#1f2937] mb-1">Patient Name <span className="text-red-500">*</span></label>
                  <input type="text" required value={newPatient.name} onChange={(e) => setNewPatient({...newPatient, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1]" placeholder="Patient Name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1f2937] mb-1">Age <span className="text-red-500">*</span></label>
                  <input type="number" required value={newPatient.age} onChange={(e) => setNewPatient({...newPatient, age: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1]" placeholder="Age (Yrs.)" />
                </div>

                {/* Row 2 */}
                <div>
                  <label className="block text-sm font-semibold text-[#1f2937] mb-1">Weight</label>
                  <input type="text" value={newPatient.weight} onChange={(e) => setNewPatient({...newPatient, weight: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1]" placeholder="Weight(kgs.)" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1f2937] mb-1">Gender <span className="text-red-500">*</span></label>
                  <select required value={newPatient.gender} onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1] bg-white">
                    <option value="">-- Select Gender --</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {/* Row 3 */}
                <div>
                  <label className="block text-sm font-semibold text-[#1f2937] mb-1">Height</label>
                  <input type="text" value={newPatient.height} onChange={(e) => setNewPatient({...newPatient, height: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1]" placeholder="Height(Cm.)" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1f2937] mb-1">BP</label>
                  <input type="text" value={newPatient.bp} onChange={(e) => setNewPatient({...newPatient, bp: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1]" placeholder="BP" />
                </div>

                {/* Row 4 */}
                <div>
                  <label className="block text-sm font-semibold text-[#1f2937] mb-1">Address</label>
                  <input type="text" value={newPatient.address} onChange={(e) => setNewPatient({...newPatient, address: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1]" placeholder="Address" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1f2937] mb-1">Pin <span className="text-red-500">*</span></label>
                  <input type="text" required value={newPatient.pin} onChange={(e) => setNewPatient({...newPatient, pin: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1]" placeholder="PIN" />
                </div>

                {/* Row 5 */}
                <div>
                  <label className="block text-sm font-semibold text-[#1f2937] mb-1">Email</label>
                  <input type="email" value={newPatient.email} onChange={(e) => setNewPatient({...newPatient, email: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1]" placeholder="Email" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1f2937] mb-1">Alternate mobile number <span className="text-red-500">*</span></label>
                  <input type="text" required value={newPatient.alternateMobile} onChange={(e) => setNewPatient({...newPatient, alternateMobile: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1]" placeholder="Alternat Mobile Number" />
                </div>
              </div>

              {/* Row 6 (Full Width) */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#1f2937] mb-1">Comment</label>
                <textarea rows="4" value={newPatient.comment} onChange={(e) => setNewPatient({...newPatient, comment: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1] resize-none" placeholder="Comments"></textarea>
              </div>

          </div>
          <div className="px-6 py-5 border-t border-gray-100 flex justify-end gap-4 flex-shrink-0 bg-gray-50">
            <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2 border border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-[#00acc1] hover:bg-[#0097a7] text-white font-semibold rounded-lg shadow transition-colors cursor-pointer">
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default PartnerDashboard;

