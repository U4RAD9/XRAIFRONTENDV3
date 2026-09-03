import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';

const mediaBaseURL = axiosInstance.defaults.baseURL.replace('/api', '/media');

function PartnerBooking() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('table');
  const [globalSearch, setGlobalSearch] = useState('');
  const [showFilesModal, setShowFilesModal] = useState(false);
  const [selectedBookingForFiles, setSelectedBookingForFiles] = useState(null);
  const [selectedBookingServices, setSelectedBookingServices] = useState([]);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Assuming ALL_BOOKINGS returns the bookings relevant to the logged-in partner based on token
      const response = await axiosInstance.get(ENDPOINTS.ALL_BOOKINGS);
      let data = response.data.result;
      if (!data || data.length === 0) {
        data = [];
      }
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
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

  const filteredBookings = bookings.filter(booking => {
    // Global search
    return Object.values(booking).some(val => 
      String(val).toLowerCase().includes(globalSearch.toLowerCase())
    );
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
  ];

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
            placeholder="Search Bookings..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#00acc1]"
          />
        </div>

        {/* Right Side: Action Buttons and Toggle (Hidden on Mobile) */}
        <div className="hidden md:flex flex-wrap justify-end gap-3 w-full sm:w-auto">
          <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
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
        </div>
      </div>

      {/* TABLE VIEW (Hidden on Mobile, Visible on Desktop if viewMode === 'table') */}
      <div className={`bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden hidden ${viewMode === 'table' ? 'md:block' : ''}`}>
        <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="min-w-full bg-white whitespace-nowrap">
            <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
              <tr>
                {columns.map(col => (
                  <th key={col.key} className="py-3 px-4 text-center font-bold border-b border-gray-200">
                    {col.label}
                  </th>
                ))}
                <th className="py-3 px-4 text-center font-bold border-b border-gray-200">FILES</th>
                <th className="py-3 px-4 text-center font-bold border-b border-gray-200">ACTION</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 2} className="py-8 text-center text-gray-500">
                    Loading bookings...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 2} className="py-8 text-center text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filteredBookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-[#11A8A4]/5 transition-colors duration-150">
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
                        onClick={() => navigate(`/partner/bookings/edit/${booking.id}`)}
                        className="cursor-pointer text-blue-500 hover:text-blue-700 mx-1" 
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i> Edit
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
          <div className="col-span-full py-8 text-center text-gray-500">Loading bookings...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="col-span-full py-8 text-center text-gray-500">No bookings found.</div>
        ) : (
          filteredBookings.map(booking => (
            <div key={booking.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-2">
                <div>
                  <h3 className="font-bold text-[#233560]">{booking.patientName}</h3>
                  <p className="text-xs text-gray-500">ID: {booking.patientId} | Ref: {booking.refNo}</p>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                  booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {booking.paymentStatus}
                </span>
              </div>
              
              <div className="text-sm text-gray-700 space-y-2 mb-4">
                <p className="flex items-center"><i className="fas fa-phone w-5 text-[#11A8A4]"></i> {booking.phoneNo}</p>
                <p className="flex items-center"><i className="fas fa-calendar-alt w-5 text-[#11A8A4]"></i> {booking.bookingDate}</p>
                <p className="flex items-center"><i className="fas fa-clock w-5 text-[#11A8A4]"></i> {booking.slot}</p>
                <p className="flex items-center"><i className="fas fa-credit-card w-5 text-[#11A8A4]"></i> {booking.paymentMethod}</p>
                <p className="flex items-center"><i className="fas fa-user-md w-5 text-[#11A8A4]"></i> {booking.technician || 'Not Assigned'}</p>
              </div>

              <div className="mt-auto pt-3 border-t border-gray-100 flex gap-2">
                <button 
                  onClick={() => handleViewFiles(booking)}
                  className="flex-1 cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-2 px-3 rounded text-sm transition-colors text-center"
                >
                  <i className="fas fa-file-alt mr-1"></i> Files
                </button>
                <button 
                  onClick={() => navigate(`/partner/bookings/edit/${booking.id}`)}
                  className="flex-1 cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-2 px-3 rounded text-sm transition-colors text-center"
                >
                  <i className="fas fa-edit mr-1"></i> Edit
                </button>
              </div>
            </div>
          ))
        )}
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
                
                {imageFile && (
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-[#233560] mb-2">Image</h3>
                    <div className="flex flex-col gap-4">
                      {imageFile.split(',').filter(Boolean).map((file, idx) => (
                        <div key={idx} className="h-[300px] border rounded overflow-hidden relative">
                          <iframe src={`${mediaBaseURL}/${encodeURIComponent(file)}`} className="w-full h-full border-none" title={`Image File ${idx+1}`} />
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
                  className="px-6 py-2 border border-gray-300 text-[#233560] font-bold rounded hover:bg-gray-50 transition-colors uppercase shadow-sm cursor-pointer"
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

export default PartnerBooking;
