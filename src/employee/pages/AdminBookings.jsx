import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';

const mediaBaseURL = axiosInstance.defaults.baseURL.replace('/api', '/media');

function AdminBookings() {
  const navigate = useNavigate();
  const [globalSearch, setGlobalSearch] = useState('');
  const [showFilesModal, setShowFilesModal] = useState(false);
  const [selectedBookingForFiles, setSelectedBookingForFiles] = useState(null);
  const [selectedBookingServices, setSelectedBookingServices] = useState([]);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  const [columnFilters, setColumnFilters] = useState({
    patientId: '',
    phoneNo: '',
    patientName: '',
    refNo: '',
    bookingDate: '',
    slot: '',
    paymentMethod: '',
    paymentStatus: '',
    technician: '',
    remarks: ''
  });

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ALL_BOOKINGS);
      if (response.data.Success) {
        setBookings(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleToggleActiveClick = (e) => {
    const id = Number(e.currentTarget.dataset.id);
    setBookings(bookings.map(booking => 
      booking.id === id ? { ...booking, isActive: !booking.isActive } : booking
    ));
  };

  const handleGlobalSearch = (e) => {
    setGlobalSearch(e.target.value);
  };

  const handleViewFiles = async (booking) => {
    setSelectedBookingForFiles(booking);
    setShowFilesModal(true);
    setSelectedBookingServices([]); // Reset while loading
    setPrescriptionFile(null);
    setImageFile(null);
    try {
      const response = await axiosInstance.get(`${ENDPOINTS.BOOKING_DETAILS}/${booking.id}`);
      if (response.data.Success) {
        setSelectedBookingServices(response.data.Booking.services || []);
        setPrescriptionFile(response.data.Booking.prescriptionFile || null);
        setImageFile(response.data.Booking.imageFile || null);
      }
    } catch (error) {
      console.error("Error fetching booking details for files:", error);
    }
  };

  const handleColumnFilterChange = (e, column) => {
    setColumnFilters({
      ...columnFilters,
      [column]: e.target.value
    });
  };

  const filteredBookings = bookings.filter(booking => {
    // Global search
    const matchesGlobal = Object.values(booking).some(val => 
      String(val).toLowerCase().includes(globalSearch.toLowerCase())
    );

    // Column filters
    const matchesColumns = Object.keys(columnFilters).every(key => {
      if (!columnFilters[key]) return true;
      return String(booking[key]).toLowerCase().includes(columnFilters[key].toLowerCase());
    });

    return matchesGlobal && matchesColumns;
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
    { key: 'remarks', label: 'REMARKS' }
  ];

  return (
    <div className='w-full'>
      {/* Top Row with Global Search */}
      <div className="flex justify-start items-center mb-6">
        <div className="relative w-64">
          <input 
            type="text" 
            placeholder="Search bookings..." 
            value={globalSearch}
            onChange={handleGlobalSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#00acc1]"
          />
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full bg-white whitespace-nowrap">
            <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
              {/* Header Row 1: Labels */}
              <tr>
                {columns.map(col => (
                  <th key={col.key} className="py-3 px-4 text-center font-bold border-b border-gray-200">
                    {col.label}
                  </th>
                ))}
                <th className="py-3 px-4 text-center font-bold border-b border-gray-200">Files</th>
                <th className="py-3 px-4 text-center font-bold border-b border-gray-200">Actions</th>
                <th className="py-3 px-4 text-center font-bold border-b border-gray-200">Trackings</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y divide-gray-100 text-sm">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 2} className="py-8 text-center text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filteredBookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="py-3 px-4 text-center">{booking.patientId}</td>
                    <td className="py-3 px-4 text-center">{booking.phoneNo}</td>
                    <td className="py-3 px-4 text-center">{booking.patientName}</td>
                    <td className="py-3 px-4 text-center">{booking.refNo}</td>
                    <td className="py-3 px-4 text-center">{booking.bookingDate}</td>
                    <td className="py-3 px-4 text-center">{booking.slot}</td>
                    <td className="py-3 px-4 text-center">{booking.paymentMethod}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">{booking.technician}</td>
                    <td className="py-3 px-4 text-center">{booking.remarks}</td>
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => handleViewFiles(booking)}
                        className="cursor-pointer text-blue-500 hover:text-blue-700 mx-1" 
                        title="View Files"
                      >
                        <i className="fas fa-file-alt"></i>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button 
                        data-id={booking.id}
                        onClick={handleToggleActiveClick}
                        className={`${booking.isActive ? 'cursor pointer text-green-500 hover:text-green-700' : 'cursor-pointer text-gray-500 hover:text-gray-700'} mx-1`} 
                        title={booking.isActive ? "Active" : "Inactive"}
                      >
                        <i className={`fas ${booking.isActive ? 'fa-check-circle' : 'fa-ban'}`}></i>
                      </button>
                      <button 
                        onClick={() => navigate(`/admin/bookings/edit/${booking.id}`)}
                        className="cursor-pointer text-[#00acc1] hover:text-[#008ba3] mx-1" 
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="cursor-pointer text-blue-500 hover:text-blue-700 mx-1" title="Invoice">
                        <i className="fas fa-file-invoice-dollar"></i>
                      </button>
                    </td>
                    <td>
                      See Tracking
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
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col my-4" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 flex flex-col overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <h2 className="text-2xl font-bold text-[#233560] mb-4">Files</h2>
              
              <div className="mb-6">
                <button 
                  onClick={() => {
                    if (prescriptionFile) {
                      const files = prescriptionFile.split(',').filter(Boolean);
                      if (files.length > 0) window.open(`${mediaBaseURL}/${files[0]}`, '_blank');
                      else alert("No prescription file uploaded.");
                    } else {
                      alert("No prescription file uploaded.");
                    }
                  }}
                  className="bg-[#ffca28] hover:bg-[#ffc107] text-white font-bold py-2 px-6 rounded uppercase shadow-sm mb-4"
                >
                  View Prescription
                </button>

                {prescriptionFile && (
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-[#233560] mb-2">Prescription</h3>
                    <div className="flex flex-col gap-4">
                      {prescriptionFile.split(',').filter(Boolean).map((file, idx) => (
                        <div key={idx} className="h-[300px] border rounded overflow-hidden relative">
                          <iframe src={`${mediaBaseURL}/${encodeURIComponent(file)}`} className="w-full h-full border-none" title={`Prescription File ${idx+1}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#233560] mb-2">Service Files</h3>
                <div className="border border-gray-200 rounded min-h-[192px] w-full bg-gray-50 flex flex-col gap-4 p-4 overflow-y-auto">
                  {selectedBookingServices.length > 0 ? selectedBookingServices.map(svc => (
                     <div key={svc.id} className="w-full">
                       {svc.serviceFiles && svc.serviceFiles.length > 0 ? (
                         <div className="flex flex-col gap-4">
                           {svc.serviceFiles.map((file, idx) => (
                             <div key={`svc-${svc.id}-${idx}`} className="h-[300px] border rounded overflow-hidden relative">
                                <div className="absolute top-0 left-0 bg-[#233560] text-white text-xs px-2 py-1 font-bold z-10 rounded-br">{svc.bodyPart || svc.service} {idx > 0 ? `(${idx + 1})` : ''}</div>
                                <iframe src={`${mediaBaseURL}/${encodeURIComponent(file)}?t=${new Date().getTime()}`} className="w-full h-full border-none" title={`Service File ${svc.bodyPart || svc.service} ${idx}`} />
                             </div>
                           ))}
                         </div>
                       ) : (
                         <div className="text-gray-400 font-medium text-sm p-4 border rounded border-dashed text-center">No service file for {svc.bodyPart || svc.service}</div>
                       )}
                     </div>
                  )) : <div className="text-gray-400 font-medium text-sm flex items-center justify-center h-full">Loading services...</div>}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#233560] mb-2">Report Files</h3>
                <div className="border border-gray-200 rounded min-h-[192px] w-full bg-gray-50 flex flex-col gap-4 p-4 overflow-y-auto">
                  {selectedBookingServices.length > 0 ? selectedBookingServices.map(svc => (
                     <div key={svc.id} className="w-full">
                       {svc.reportFiles && svc.reportFiles.length > 0 ? (
                         <div className="flex flex-col gap-4">
                           {svc.reportFiles.map((file, idx) => (
                             <div key={`rep-${svc.id}-${idx}`} className="h-[300px] border rounded overflow-hidden relative">
                                <div className="absolute top-0 left-0 bg-[#233560] text-white text-xs px-2 py-1 font-bold z-10 rounded-br">{svc.bodyPart || svc.service} {idx > 0 ? `(${idx + 1})` : ''}</div>
                                <iframe src={`${mediaBaseURL}/${encodeURIComponent(file)}?t=${new Date().getTime()}`} className="w-full h-full border-none" title={`Report File ${svc.bodyPart || svc.service} ${idx}`} />
                             </div>
                           ))}
                         </div>
                       ) : (
                         <div className="text-gray-400 font-medium text-sm p-4 border rounded border-dashed text-center">No report file for {svc.bodyPart || svc.service}</div>
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

export default AdminBookings;
