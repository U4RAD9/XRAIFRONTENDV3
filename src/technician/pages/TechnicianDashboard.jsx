import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';

const mediaBaseURL = axiosInstance.defaults.baseURL.replace('/api', '/media');

function TechnicianDashboard() {
  const navigate = useNavigate();
  const [globalSearch, setGlobalSearch] = useState('');
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ pending: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [showFilesModal, setShowFilesModal] = useState(false);
  const [selectedBookingForFiles, setSelectedBookingForFiles] = useState(null);
  const [selectedBookingServices, setSelectedBookingServices] = useState([]);
  const [selectedBookingPrescription, setSelectedBookingPrescription] = useState(null);

  useEffect(() => {
    fetchTechnicianData();
  }, []);

  const handleViewFiles = async (booking) => {
    setSelectedBookingForFiles(booking);
    setShowFilesModal(true);
    setSelectedBookingServices([]);
    setSelectedBookingPrescription(null);
    try {
      const response = await axiosInstance.get(`${ENDPOINTS.BOOKING_DETAILS}/${booking.id}`);
      if (response.data.Success) {
        setSelectedBookingServices(response.data.Booking.services || []);
        setSelectedBookingPrescription(response.data.Booking.prescriptionFile);
      }
    } catch (error) {
      console.error("Error fetching booking details for files:", error);
    }
  };

  const handleFileUpload = async (e, type, id) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      let endpoint = '';
      if (type === 'Prescription') {
        endpoint = `${ENDPOINTS.UPLOAD_PRESCRIPTION}/${id}`;
      } else {
        endpoint = `${ENDPOINTS.UPLOAD_FILE}/${id}`;
      }

      const response = await axiosInstance.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.Success) {
        alert(`${type} file uploaded successfully`);
        handleViewFiles(selectedBookingForFiles);
        fetchTechnicianData();
      } else {
        alert(response.data.Message || 'Upload failed');
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert('Error uploading file');
    }
  };

  const handleUpdateTestStatus = async (id) => {
    try {
      const response = await axiosInstance.post(`${ENDPOINTS.UPDATE_BOOKING_STATUS}/${id}`, {});
      if (response.data.Success) {
        alert('Test status updated to Completed!');
        fetchTechnicianData();
      } else {
        alert(response.data.Message || 'Failed to update test status');
      }
    } catch (error) {
      console.error("Error updating test status:", error);
      alert('Error updating test status');
    }
  };

  const handleUpdatePaymentStatus = async (id) => {
    try {
      const response = await axiosInstance.post(`${ENDPOINTS.UPDATE_PAYMENT_STATUS}/${id}`, {});
      if (response.data.Success) {
        alert('Payment status updated to Paid!');
        fetchTechnicianData();
      } else {
        alert(response.data.Message || 'Failed to update payment status');
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert('Error updating payment status');
    }
  };

  const fetchTechnicianData = async () => {
    try {
      setLoading(true);
      const technicianId = sessionStorage.getItem('UserID');
      const response = await axiosInstance.get(`${ENDPOINTS.TECHNICIAN_BOOKINGS}?technician_id=${technicianId}`);
      if (response.data.Success) {
        setBookings(response.data.result.Bookings);
        setStats({
          pending: response.data.result.PendingCases,
          completed: response.data.result.CompletedCases
        });
      }
    } catch (error) {
      console.error("Error fetching technician data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGlobalSearch = (e) => {
    setGlobalSearch(e.target.value);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesGlobal = Object.values(booking).some(val => 
      String(val).toLowerCase().includes(globalSearch.toLowerCase())
    );
    return matchesGlobal;
  });

  const columns = [
    { key: 'patientId', label: 'PATIENT ID' },
    { key: 'phoneNo', label: 'PHONE NO.' },
    { key: 'patientName', label: 'PATIENT NAME' },
    { key: 'refNo', label: 'REF NO' },
    { key: 'bookingDate', label: 'BOOKING DATE' },
    { key: 'slot', label: 'SLOT' },
    { key: 'paymentMethod', label: 'PAYMENT METHOD' },
    { key: 'paymentStatus', label: 'PAYMENT STATUS' },
    { key: 'technician', label: 'TECHNICIAN' },
    { key: 'remarks', label: 'REMARKS' },
    { key: 'testStatus', label: 'TEST STATUS' },
    { key: 'files', label: 'FILES' },
    { key: 'tracking', label: 'TRACKING' },
    { key: 'actions', label: 'ACTIONS' },
    { key: 'collectPayment', label: 'COLLECT PAYMENT' }
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-full text-[#233560] font-bold text-xl">Loading...</div>;
  }

  return (
    <div className='w-full'>
      {/* Search Bar */}
      <div className="bg-gray-50  mb-6 rounded-xl flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <input 
            type="text" 
            placeholder="Search cases..." 
            value={globalSearch}
            onChange={handleGlobalSearch}
            className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00acc1] bg-white shadow-sm"
          />
          <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-1 px-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-500 text-xl">
              <i className="fas fa-clipboard-list"></i>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Cases</p>
              <h2 className="text-xl font-bold text-gray-800">{stats.pending}</h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-1 px-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500 text-xl">
              <i className="fas fa-check-circle"></i>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Completed</p>
              <h2 className="text-xl font-bold text-gray-800">{stats.completed}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-md rounded-2xl border border-gray-100 overflow-hidden">
        {/* <div className="px-6 py-5 border-b border-gray-100 bg-white">
          <h3 className="text-xl font-bold text-[#233560]">Allotted Cases</h3>
        </div> */}
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full bg-white whitespace-nowrap text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-wider">
              <tr>
                {columns.map(col => (
                  <th key={col.key} className="py-4 px-6 text-left border-b border-gray-200">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-8 text-center text-gray-500 font-medium">
                    No cases assigned to you.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-blue-50/50 transition-colors duration-150">
                    <td className="py-4 px-6 font-semibold text-[#233560]">{booking.patientId}</td>
                    <td className="py-4 px-6">{booking.phoneNo}</td>
                    <td className="py-4 px-6 font-medium text-gray-900">{booking.patientName}</td>
                    <td className="py-4 px-6 text-gray-500">{booking.refNo}</td>
                    <td className="py-4 px-6">{booking.bookingDate}</td>
                    <td className="py-4 px-6 text-gray-600">{booking.slot}</td>
                    <td className="py-4 px-6">{booking.paymentMethod}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium">{booking.technician}</td>
                    <td className="py-4 px-6 text-gray-500">{booking.remarks}</td>
                    <td className="py-4 px-6">
                      {booking.status === 'Completed' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          completed
                        </span>
                      ) : (
                        <button 
                          onClick={() => handleUpdateTestStatus(booking.id)}
                          className="px-3 py-1 rounded-xl text-xs font-bold bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors flex flex-col items-center justify-center leading-tight mx-auto"
                        >
                          <span>pending</span>
                          <span className="text-[10px] font-normal tracking-tight">(click to complete)</span>
                        </button>
                      )}
                    </td>
                    <td className="py-4 px-6 text-[#00acc1]">
                      {booking.files > 0 ? (
                        <div onClick={() => handleViewFiles(booking)} className="flex items-center gap-1 cursor-pointer hover:underline">
                          <i className="fas fa-paperclip"></i> {booking.files}
                        </div>
                      ) : (
                        <div onClick={() => handleViewFiles(booking)} className="flex items-center gap-1 cursor-pointer hover:underline">
                          <i className="fas fa-paperclip"></i> Add
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <button className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded font-bold text-xs transition-colors flex items-center gap-1">
                        <i className="fas fa-map-marker-alt"></i> Track
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <button 
                        onClick={() => navigate(`/technician/edit-booking/${booking.id}`)}
                        className="text-blue-600 hover:text-blue-800 font-bold text-sm transition-colors uppercase tracking-wide cursor-pointer"
                      >
                        Edit
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      {booking.paymentStatus !== 'Paid' ? (
                        <button 
                          onClick={() => handleUpdatePaymentStatus(booking.id)}
                          className="bg-[#00acc1] hover:bg-[#0097a7] text-white px-4 py-2 rounded font-bold text-xs transition-colors shadow-sm w-full text-center"
                        >
                          Collect
                        </button>
                      ) : (
                        <span className="text-green-600 font-bold text-sm w-full text-center block">Collected</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Files Modal */}
      {showFilesModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50" onClick={() => setShowFilesModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col my-4" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 flex flex-col overflow-y-auto custom-scrollbar">
              <h2 className="text-2xl font-bold text-[#233560] mb-4">Files</h2>
              
              {/* Prescription Section */}
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  {selectedBookingPrescription ? (
                    <div className="flex items-center gap-4">
                      <a href={`${mediaBaseURL}/${selectedBookingPrescription}`} target="_blank" rel="noreferrer" className="bg-[#ffca28] hover:bg-[#ffc107] text-white font-bold py-2 px-6 rounded uppercase shadow-sm inline-block">
                        View Prescription
                      </a>
                      <label className="cursor-pointer border border-[#00acc1] text-[#00acc1] px-4 py-2 rounded-md hover:bg-cyan-50 font-bold text-sm uppercase">
                        Change Prescription
                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'Prescription', selectedBookingForFiles.id)} />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer bg-[#00acc1] text-white px-6 py-2 rounded-md hover:bg-[#0097a7] font-bold uppercase shadow-sm">
                      Upload Prescription
                      <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'Prescription', selectedBookingForFiles.id)} />
                    </label>
                  )}
                </div>
              </div>

              {/* Service Files Section */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#233560] mb-2">Service Files</h3>
                <div className="border border-gray-200 rounded min-h-[192px] w-full bg-gray-50 flex flex-col gap-4 p-4 overflow-y-auto">
                  {selectedBookingServices.length > 0 ? selectedBookingServices.map(svc => (
                     <div key={svc.id} className="w-full">
                       <div className="flex justify-between items-center mb-2">
                         <span className="font-bold text-[#233560]">{svc.service}</span>
                         <label className="cursor-pointer border border-[#00acc1] text-[#00acc1] px-3 py-1 rounded hover:bg-cyan-50 font-bold text-xs uppercase">
                           {svc.serviceFile ? 'Update Service File' : 'Upload Service File'}
                           <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'Service', svc.id)} />
                         </label>
                       </div>
                       {svc.serviceFile ? (
                         <div className="h-[400px] border rounded overflow-hidden relative">
                            <iframe src={`${mediaBaseURL}/${encodeURIComponent(svc.serviceFile)}?t=${new Date().getTime()}`} className="w-full h-full border-none" title={`Service File ${svc.service}`} />
                         </div>
                       ) : (
                         <div className="text-gray-400 font-medium text-sm p-4 border rounded border-dashed text-center">No service file for {svc.service}</div>
                       )}
                     </div>
                  )) : <div className="text-gray-400 font-medium text-sm flex items-center justify-center h-full">Loading services...</div>}
                </div>
              </div>

              {/* Report Files Section */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#233560] mb-2">Report Files</h3>
                <div className="border border-gray-200 rounded min-h-[192px] w-full bg-gray-50 flex flex-col gap-4 p-4 overflow-y-auto">
                  {selectedBookingServices.length > 0 ? selectedBookingServices.map(svc => (
                     <div key={svc.id} className="w-full">
                       <div className="flex justify-between items-center mb-2">
                         <span className="font-bold text-[#233560]">{svc.service}</span>
                         <label className="cursor-pointer border border-[#00acc1] text-[#00acc1] px-3 py-1 rounded hover:bg-cyan-50 font-bold text-xs uppercase">
                           {svc.reportFile ? 'Update Report File' : 'Upload Report File'}
                           <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'Report', svc.id)} />
                         </label>
                       </div>
                       {svc.reportFile ? (
                         <div className="h-[400px] border rounded overflow-hidden relative">
                            <iframe src={`${mediaBaseURL}/${encodeURIComponent(svc.reportFile)}?t=${new Date().getTime()}`} className="w-full h-full border-none" title={`Report File ${svc.service}`} />
                         </div>
                       ) : (
                         <div className="text-gray-400 font-medium text-sm p-4 border rounded border-dashed text-center">No report file for {svc.service}</div>
                       )}
                     </div>
                  )) : <div className="text-gray-400 font-medium text-sm flex items-center justify-center h-full">Loading services...</div>}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => setShowFilesModal(false)} 
                  className="px-6 py-2 border border-gray-300 text-[#233560] font-bold rounded hover:bg-gray-50 transition-colors uppercase shadow-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default TechnicianDashboard;
