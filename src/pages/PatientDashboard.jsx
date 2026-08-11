import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function PatientDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/booking/patient_bookings');
        setBookings(res.data);
      } catch (err) {
        console.error('Failed to fetch patient bookings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#233560]">Patient Dashboard</h1>
        <Link to="/book-slot" className="bg-[#00acc1] hover:bg-[#008ba3] text-white px-4 py-2 rounded shadow font-bold">
          Book New Slot
        </Link>
      </div>
      
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">My Bookings</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="py-3 px-6 text-left font-medium">Booking ID</th>
                <th className="py-3 px-6 text-left font-medium">Date</th>
                <th className="py-3 px-6 text-left font-medium">Patient Name</th>
                <th className="py-3 px-6 text-left font-medium">Payment Mode</th>
                <th className="py-3 px-6 text-left font-medium">Net Amount</th>
                <th className="py-3 px-6 text-left font-medium">Status</th>
                <th className="py-3 px-6 text-center font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-4 text-center">Loading...</td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-4 text-center">No bookings found.</td>
                </tr>
              ) : (
                bookings.map((booking, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="py-3 px-6 font-semibold">#{booking.slot_booking_id}</td>
                    <td className="py-3 px-6">{new Date(booking.slot_booking_datetime).toLocaleString()}</td>
                    <td className="py-3 px-6">{booking.patient_name}</td>
                    <td className="py-3 px-6">{booking.payment_method}</td>
                    <td className="py-3 px-6 font-bold text-green-600">₹{booking.net_amount}</td>
                    <td className="py-3 px-6">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        booking.status === 'Booked' ? 'bg-blue-100 text-blue-800' : 
                        booking.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <button className="text-[#00acc1] hover:underline font-semibold mr-3">View Report</button>
                      {booking.payment_method === 'ONLINE' && booking.status !== 'Completed' && (
                        <button className="text-green-600 hover:underline font-semibold">Pay Now</button>
                      )}
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

export default PatientDashboard;
