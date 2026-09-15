import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';
import Pagination from '../../components/Pagination';

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    PendingBookings: 0,
    ConfirmedBookings: 0,
    BookingInProgress: 0,
    BookingPerformed: 0,
    ReportFilesUploaded: 0,
    ServiceFilesUploaded: 0
  });
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // Date state initialized to empty to show all-time stats by default
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    fetchStats();
  }, [fromDate, toDate]);

  useEffect(() => {
    fetchBookings();
  }, [fromDate, toDate, currentPage, debouncedSearch]);

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get(`${ENDPOINTS.DASHBOARD_STATS}?FromDate=${fromDate}&ToDate=${toDate}`);
      if (res.data.Success) {
        setStats(res.data.result);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
    }
  };

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await axiosInstance.get(ENDPOINTS.ALL_BOOKINGS, {
        params: { page: currentPage, search: debouncedSearch, date: fromDate } // date can be passed if supported by backend
      });
      const data = res.data.results || res.data.result || res.data;
      if (res.data.total_pages) {
        setTotalPages(res.data.total_pages);
      } else {
        setTotalPages(1);
      }
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch admin bookings', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleViewDetails = async (id) => {
    setShowDetailsModal(true);
    setLoadingDetails(true);
    setSelectedBookingDetails(null);
    try {
      const response = await axiosInstance.get(`${ENDPOINTS.BOOKING_DETAILS}/${id}`);
      if (response.data.Success) {
        setSelectedBookingDetails(response.data.Booking);
      } else {
        alert("Failed to fetch details.");
        setShowDetailsModal(false);
      }
    } catch (err) {
      console.error('Failed to fetch details:', err);
      alert("Error fetching details.");
      setShowDetailsModal(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  // The filtering is now handled server-side

  return (
    <div className="space-y-6">
      
      {/* Date Filters */}
      <div className="flex justify-end gap-4 mb-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">From Date</label>
          <input 
            type="date" 
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00acc1]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">To Date</label>
          <input 
            type="date" 
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00acc1]"
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Booking Pending</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.PendingBookings}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
            <i className="fas fa-clock"></i>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Confirmed</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.ConfirmedBookings}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            <i className="fas fa-check-circle"></i>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">In Progress</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.BookingInProgress}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
            <i className="fas fa-spinner"></i>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Performed</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.BookingPerformed}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
            <i className="fas fa-clipboard-check"></i>
          </div>
        </div>

      </div>

      {/* Bookings Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">All Bookings (SlotBookingMaster)</h2>
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="Search by name, ID, or phone..." 
              className="pl-10 pr-4 py-2 rounded-lg w-72 border border-gray-300 focus:outline-none focus:border-[#00acc1] focus:ring-1 focus:ring-[#00acc1] transition-all bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6 text-left font-bold">ID</th>
                <th className="py-4 px-6 text-left font-bold">Date/Time</th>
                <th className="py-4 px-6 text-left font-bold">Patient Details</th>
                <th className="py-4 px-6 text-left font-bold">Location</th>
                <th className="py-4 px-6 text-left font-bold">Payment</th>
                <th className="py-4 px-6 text-left font-bold">Technician</th>
                <th className="py-4 px-6 text-left font-bold">Status</th>
                <th className="py-4 px-6 text-center font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y divide-gray-100">
              {loadingBookings ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-500 font-semibold">
                    <i className="fas fa-spinner fa-spin mr-2"></i> Loading data...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-500 font-semibold">No bookings found.</td>
                </tr>
              ) : (
                bookings.map((booking, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/50 transition duration-150">
                    <td className="py-4 px-6 font-semibold text-[#00acc1]">#{booking.id}</td>
                    <td className="py-4 px-6 text-sm">{booking.date} {booking.time}</td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-800">{booking.patientName}</div>
                      <div className="text-xs text-gray-500 mt-1"><i className="fas fa-phone-alt mr-1"></i> {booking.phoneNo}</div>
                    </td>
                    <td className="py-4 px-6 text-sm">{booking.address || 'N/A'}</td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-800">₹{booking.amount}</div>
                      <div className="text-xs text-gray-500 mt-1">{booking.paymentMethod}</div>
                    </td>
                    <td className="py-4 px-6 font-semibold">{booking.technician}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        booking.status === 'Booked' ? 'bg-blue-100 text-blue-700' : 
                        booking.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {booking.status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleViewDetails(booking.id)}
                          className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded text-sm font-semibold transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex justify-center bg-gray-50/50">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={() => setShowDetailsModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 flex flex-col overflow-y-auto">
              <h2 className="text-2xl font-bold text-[#233560] mb-4">Booking Details</h2>
              {loadingDetails ? (
                <div className="py-12 text-center text-gray-500 font-semibold">
                  <i className="fas fa-spinner fa-spin mr-2"></i> Loading details...
                </div>
              ) : selectedBookingDetails ? (
                <div className="space-y-6">
                  {/* Patient Info */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2"><i className="fas fa-user-injured text-blue-500 mr-2"></i>Patient Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><span className="text-sm text-gray-500 font-semibold">Name:</span> <span className="font-bold text-gray-800">{selectedBookingDetails.patient.patientName}</span></div>
                      <div><span className="text-sm text-gray-500 font-semibold">Phone:</span> <span className="text-gray-800">{selectedBookingDetails.patient.phoneNo}</span></div>
                      <div><span className="text-sm text-gray-500 font-semibold">Age/Gender:</span> <span className="text-gray-800">{selectedBookingDetails.patient.age} / {selectedBookingDetails.patient.gender}</span></div>
                      <div><span className="text-sm text-gray-500 font-semibold">Email:</span> <span className="text-gray-800">{selectedBookingDetails.patient.email}</span></div>
                      <div className="md:col-span-2"><span className="text-sm text-gray-500 font-semibold">Address:</span> <span className="text-gray-800">{selectedBookingDetails.patient.address}</span></div>
                    </div>
                  </div>

                  {/* Booking Info */}
                  <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                    <h3 className="text-lg font-bold text-[#233560] mb-3 border-b border-blue-100 pb-2"><i className="fas fa-calendar-check text-blue-500 mr-2"></i>Booking Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><span className="text-sm text-gray-500 font-semibold">ID:</span> <span className="font-bold text-[#00acc1]">#{selectedBookingDetails.id}</span></div>
                      <div><span className="text-sm text-gray-500 font-semibold">Date & Slot:</span> <span className="text-gray-800">{selectedBookingDetails.visit_date} ({selectedBookingDetails.slot_name})</span></div>
                      <div><span className="text-sm text-gray-500 font-semibold">Location:</span> <span className="text-gray-800">{selectedBookingDetails.location_name}</span></div>
                      <div><span className="text-sm text-gray-500 font-semibold">Payment:</span> <span className="text-gray-800">{selectedBookingDetails.payment_mode}</span></div>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2"><i className="fas fa-stethoscope text-blue-500 mr-2"></i>Services</h3>
                    {selectedBookingDetails.services && selectedBookingDetails.services.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="text-gray-500 uppercase font-semibold">
                            <tr>
                              <th className="pb-2">Group</th>
                              <th className="pb-2">Service</th>
                              <th className="pb-2 text-right">Price</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 text-gray-800">
                            {selectedBookingDetails.services.map((svc, index) => (
                              <tr key={index}>
                                <td className="py-2">{svc.service}</td>
                                <td className="py-2 font-medium">{svc.bodyPart}</td>
                                <td className="py-2 text-right font-bold text-green-600">₹{svc.netPayable}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="mt-4 flex flex-col items-end text-sm">
                           <div className="flex justify-between w-48 text-gray-600 mb-1">
                             <span>Subtotal:</span>
                             <span className="font-semibold">₹{parseFloat(selectedBookingDetails.gross_amount || selectedBookingDetails.services.reduce((acc, svc) => acc + (parseFloat(svc.netPayable) || 0), 0)).toFixed(2)}</span>
                           </div>
                           
                           {/* Calculate discount if gross_amount is greater than amount */}
                           {(selectedBookingDetails.gross_amount && selectedBookingDetails.amount && parseFloat(selectedBookingDetails.gross_amount) > parseFloat(selectedBookingDetails.amount)) ? (
                             <div className="flex justify-between w-48 text-green-600 mb-1">
                               <span>Discount {selectedBookingDetails.offer_name || selectedBookingDetails.coupon_code ? `(${selectedBookingDetails.offer_name || selectedBookingDetails.coupon_code})` : ''}:</span>
                               <span className="font-semibold">-₹{(parseFloat(selectedBookingDetails.gross_amount) - parseFloat(selectedBookingDetails.amount)).toFixed(2)}</span>
                             </div>
                           ) : ((selectedBookingDetails.coupon_code || selectedBookingDetails.discount_amount || selectedBookingDetails.discount > 0) && (
                             <div className="flex justify-between w-48 text-green-600 mb-1">
                               <span>Discount {selectedBookingDetails.coupon_code ? `(${selectedBookingDetails.coupon_code})` : ''}:</span>
                               <span className="font-semibold">-₹{parseFloat(selectedBookingDetails.discount_amount || selectedBookingDetails.discount || 0).toFixed(2)}</span>
                             </div>
                           ))}

                           <div className="flex justify-between w-48 text-gray-800 font-bold border-t border-gray-200 pt-2 mt-1">
                             <span>Final Price:</span>
                             <span className="text-[#00acc1] text-lg">₹{parseFloat(selectedBookingDetails.amount || selectedBookingDetails.gross_amount || selectedBookingDetails.services.reduce((acc, svc) => acc + (parseFloat(svc.netPayable) || 0), 0)).toFixed(2)}</span>
                           </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No services listed.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-red-500 font-semibold">Failed to load details.</div>
              )}
              
              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => setShowDetailsModal(false)} 
                  className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded hover:bg-gray-200 transition-colors uppercase cursor-pointer"
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

export default AdminDashboard;
