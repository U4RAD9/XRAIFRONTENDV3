import React, { useState, useEffect } from 'react';
import DashboardCards from '../components/dashboard/DashboardCards';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';

const mediaBaseURL = axiosInstance.defaults.baseURL.replace('/api', '/media');

function PatientDashboard() {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showReportsModal, setShowReportsModal] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'Report.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to opening in new tab if fetch fails (e.g., CORS)
      window.open(fileUrl, '_blank');
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      const userId = sessionStorage.getItem('UserID');
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const response = await axiosInstance.get(ENDPOINTS.PATIENT_BOOKINGS, {
          params: { user_id: userId }
        });
        if (response.data.Success) {
          setBookings(response.data.Bookings || []);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Filter bookings based on search query
  const filteredBookings = bookings.filter(booking => 
    (booking.patientName && booking.patientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (booking.location && booking.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (booking.technician && booking.technician.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto py-4 2xl:py-0 xl:py-0 md:py-0 lg:py-0">
      
      {/* Search and Toggle Bar */}
      <div className="flex justify-between items-center mb-6 flex-nowrap">
        {/* Left Side: Search */}
        <div className="relative flex-1 md:flex-none md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <i className="fas fa-search text-gray-400"></i>
          </span>
          <input 
            type="text" 
            placeholder="Search Bookings by Name, Phone, Location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#11A8A4]"
          />
        </div>

        {/* Right Side: Toggle Buttons */}
        <div className="flex items-center flex-shrink-0">
          <div className="hidden md:flex bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <button 
              onClick={() => setViewMode('table')}
              className={`cursor-pointer px-4 py-2 ${viewMode === 'table' ? 'bg-[#11A8A4] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              title="Table View"
            >
              <i className="fas fa-list"></i>
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`cursor-pointer px-4 py-2 border-l border-gray-300 ${viewMode === 'grid' ? 'bg-[#11A8A4] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              title="Grid View"
            >
              <i className="fas fa-th-large"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile View: Always Cards */}
      <div className="block md:hidden">
        <DashboardCards 
          bookings={filteredBookings} 
          onViewDetails={setSelectedBooking} 
          onViewReports={(reports) => {
            setSelectedReports(reports);
            setShowReportsModal(true);
          }}
        />
      </div>

      {/* Desktop View: Table or Cards based on toggle */}
      <div className="hidden md:block">
        {viewMode === 'table' ? (
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <table className="min-w-full bg-white whitespace-nowrap">
                <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 text-left font-bold border-b border-gray-200">Name</th>
                    <th className="py-3 px-4 text-left font-bold border-b border-gray-200">Services</th>
                    <th className="py-3 px-4 text-left font-bold border-b border-gray-200">Visit Date</th>
                    <th className="py-3 px-4 text-left font-bold border-b border-gray-200">Slot</th>
                    <th className="py-3 px-4 text-left font-bold border-b border-gray-200">Location</th>
                    <th className="py-3 px-4 text-left font-bold border-b border-gray-200">Technician</th>
                    <th className="py-3 px-4 text-left font-bold border-b border-gray-200">Total Price</th>
                    <th className="py-3 px-4 text-left font-bold border-b border-gray-200">Payment Status</th>
                    <th className="py-3 px-4 text-center font-bold border-b border-gray-200">Report</th>
                    <th className="py-3 px-4 text-center font-bold border-b border-gray-200">Track</th>
                    <th className="py-3 px-4 text-center font-bold border-b border-gray-200">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 divide-y divide-gray-100 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan="11" className="py-8 text-center text-gray-500">Loading bookings...</td>
                    </tr>
                  ) : filteredBookings.map((booking) => (
                    <tr key={booking.BookingID} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="py-3 px-4 text-left">{booking.patientName}</td>
                      <td className="py-3 px-4 text-left truncate max-w-xs" title={booking.services}>{booking.services}</td>
                      <td className="py-3 px-4 text-left">{booking.Date}</td>
                      <td className="py-3 px-4 text-left whitespace-nowrap">{booking.slot}</td>
                      <td className="py-3 px-4 text-left">{booking.location}</td>
                      <td className="py-3 px-4 text-left">{booking.technician}</td>
                      <td className="py-3 px-4 text-left text-gray-700 font-medium">₹{booking.Amount}</td>
                      <td className="py-3 px-4 text-left font-semibold text-[#11A8A4]">{booking.paymentStatus}</td>
                      <td className="py-3 px-4 text-center">
                        {booking.hasReport ? (
                          <button 
                            className="cursor-pointer bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded font-semibold transition-colors flex items-center justify-center mx-auto shadow-sm" 
                            title="View Reports"
                            onClick={() => {
                              setSelectedReports(booking.reports || []);
                              setShowReportsModal(true);
                            }}
                          >
                             View
                          </button>
                        ) : (
                          <button disabled className="text-red-500 cursor-not-allowed opacity-70" title="Report not uploaded">
                            <i className="fas fa-file-medical-alt text-xl"></i>
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button className="text-[#11A8A4] border border-[#11A8A4] rounded px-3 py-1 text-xs font-semibold hover:bg-[#11A8A4] hover:text-white transition-colors cursor-default" onClick={(e) => e.preventDefault()} title="Track your technician">
                          Track
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button 
                          onClick={() => setSelectedBooking(booking)}
                          className="text-[#11A8A4] hover:text-[#008ba3]" 
                          title="View Details"
                        >
                          <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!loading && filteredBookings.length === 0 && (
                    <tr>
                      <td colSpan="11" className="py-8 text-center text-gray-500">No active bookings found</td>
                    </tr>
                  )}
                </tbody>
          </table>
        </div>
      </div>
        ) : (
          <DashboardCards 
            bookings={filteredBookings} 
            onViewDetails={setSelectedBooking} 
            onViewReports={(reports) => {
              setSelectedReports(reports);
              setShowReportsModal(true);
            }} 
          />
        )}
      </div>

      {/* Reports Modal */}
      {showReportsModal && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4"
          onClick={() => setShowReportsModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-[#233560]">Reports</h2>
              <button onClick={() => setShowReportsModal(false)} className="text-gray-500 hover:text-gray-700">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-gray-50 flex flex-col gap-6 flex-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {selectedReports && selectedReports.length > 0 ? (
                selectedReports.map((report, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
                      <h3 className="font-bold text-[#233560] text-lg">{report.service}</h3>
                      <button 
                        onClick={() => handleDownload(`${mediaBaseURL}/${encodeURIComponent(report.filename)}`, `Report_${report.service}.pdf`)}
                        className="bg-[#11A8A4] hover:bg-[#008ba3] text-white px-4 py-1.5 rounded text-sm font-semibold transition-colors shadow-sm flex items-center cursor-pointer"
                      >
                        <i className="fas fa-download mr-2"></i> Download
                      </button>
                    </div>
                    <div className="h-[500px] w-full border border-gray-200 rounded overflow-auto">
                      <iframe 
                        src={`${mediaBaseURL}/${encodeURIComponent(report.filename)}#toolbar=0`} 
                        className="w-full h-full border-none bg-gray-100" 
                        title={`Report for ${report.service}`} 
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-12 text-lg">No reports available.</div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 bg-white flex justify-end gap-3">
              <button onClick={() => setShowReportsModal(false)} className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-100 transition-colors shadow-sm cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4">
          <div 
            className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative no-scrollbar"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            <style>{`
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center z-40 shadow-sm">
              <h2 className="text-2xl font-bold text-[#233560]">Booking Details</h2>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="text-gray-500 hover:text-gray-800 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-4 text-[#233560] border-b pb-2">Patient Detail</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                    <input readOnly value={selectedBooking.phoneNumber} className="w-full px-3 py-2 border rounded-lg bg-gray-50" type="text" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Patient Name</label>
                    <input readOnly value={selectedBooking.patientName} className="w-full px-3 py-2 border rounded-lg bg-gray-50" type="text" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Age (Yrs)</label>
                    <input readOnly value={selectedBooking.age} className="w-full px-3 py-2 border rounded-lg bg-gray-50" type="text" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
                    <input readOnly value={selectedBooking.gender} className="w-full px-3 py-2 border rounded-lg bg-gray-50" type="text" />
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-4 text-[#233560] border-b pb-2">Service Booking Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                    <input readOnly value={selectedBooking.location} className="w-full px-3 py-2 border rounded-lg bg-gray-50" type="text" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Visit Type</label>
                    <input readOnly value={selectedBooking.visitType} className="w-full px-3 py-2 border rounded-lg bg-gray-50" type="text" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Visit Date</label>
                    <input readOnly value={selectedBooking.Date || ''} className="w-full px-3 py-2 border rounded-lg bg-gray-50" type="text" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Slot</label>
                    <input readOnly value={selectedBooking.slot} className="w-full px-3 py-2 border rounded-lg bg-gray-50" type="text" />
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-4 text-[#233560] border-b pb-2">Services</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-2 px-4 text-left">Service Group</th>
                        <th className="py-2 px-4 text-left">Service</th>
                        <th className="py-2 px-4 text-left">Net Payable</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBooking.serviceDetails && selectedBooking.serviceDetails.length > 0 ? (
                        selectedBooking.serviceDetails.map((svc, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{svc.group}</td>
                            <td className="py-3 px-4 font-medium text-gray-800">{svc.name}</td>
                            <td className="py-3 px-4 font-bold text-green-600">₹{svc.price}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="py-4 text-center text-gray-500">No service details available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-4 text-[#233560] border-b pb-2">Payment Stats</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-2 px-4 text-left">Total Amount</th>
                        <th className="py-2 px-4 text-left">Payment Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-bold text-green-600">₹{selectedBooking.Amount || '0'}</td>
                        <td className="py-2 px-4 font-bold text-green-600">{selectedBooking.paymentStatus}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default PatientDashboard;

