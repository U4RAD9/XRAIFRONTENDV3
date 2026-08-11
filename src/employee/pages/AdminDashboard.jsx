import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';

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
  
  // Date state initialized to today
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchStats();
    fetchBookings();
  }, [fromDate, toDate]);

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
      const res = await axiosInstance.get(ENDPOINTS.ALL_BOOKINGS);
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to fetch admin bookings', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.phone_number?.includes(searchTerm) ||
    b.slot_booking_id?.toString().includes(searchTerm)
  );

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Reports</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.ReportFilesUploaded}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
            <i className="fas fa-file-medical-alt"></i>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Service Files</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.ServiceFilesUploaded}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600">
            <i className="fas fa-file-upload"></i>
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
                <th className="py-4 px-6 text-left font-bold">Status</th>
                <th className="py-4 px-6 text-center font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y divide-gray-100">
              {loadingBookings ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500 font-semibold">
                    <i className="fas fa-spinner fa-spin mr-2"></i> Loading data...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500 font-semibold">No bookings found.</td>
                </tr>
              ) : (
                filteredBookings.map((booking, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/50 transition duration-150">
                    <td className="py-4 px-6 font-semibold text-[#00acc1]">#{booking.slot_booking_id}</td>
                    <td className="py-4 px-6 text-sm">{new Date(booking.slot_booking_datetime).toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-800">{booking.patient_name}</div>
                      <div className="text-xs text-gray-500 mt-1"><i className="fas fa-phone-alt mr-1"></i> {booking.phone_number}</div>
                    </td>
                    <td className="py-4 px-6 text-sm">{booking.location__location_name || 'N/A'}</td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-800">₹{booking.net_amount}</div>
                      <div className="text-xs text-gray-500 mt-1">{booking.payment_method}</div>
                    </td>
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
                        <button className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded text-sm font-semibold transition-colors">Details</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
