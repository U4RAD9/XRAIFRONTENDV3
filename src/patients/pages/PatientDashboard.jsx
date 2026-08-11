import React, { useState } from 'react';

const staticBookings = [
  {
    id: 1,
    patientName: 'Nishant Kumar',
    phoneNumber: '9304786461',
    age: 25,
    gender: 'Male',
    location: 'Delhi Main Center',
    visitType: 'Home',
    visitDate: '2026-08-08',
    slot: 'Morning 10:00 AM - 11:00 AM',
    services: [
      { group: 'Group 2', name: 'Chest X-ray', price: 1500 },
      { group: 'Group 2', name: 'Abdominal X-ray', price: 1500 }
    ],
    reportUrl: '/dummy-report.pdf',
    paymentStatus: 'Done'
  },
  {
    id: 2,
    patientName: 'Nishant Kumar',
    phoneNumber: '9304786461',
    age: 25,
    gender: 'Male',
    location: 'Gurgaon Clinic',
    visitType: 'Home',
    visitDate: '2026-08-09',
    slot: 'Evening 04:00 PM - 05:00 PM',
    services: [
      { group: 'Group 1', name: 'Blood Testing', price: 1000 }
    ],
    reportUrl: '/dummy-report2.pdf',
    paymentStatus: 'Done'
  }
];

function PatientDashboard() {
  const [selectedBooking, setSelectedBooking] = useState(null);

  const calculateTotal = (services) => services.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="container mx-auto py-4">
      <h2 className="text-3xl font-bold text-[#233560] mb-8 text-center">Patient Dashboard</h2>
      
      <div className="bg-white shadow-xl rounded-lg overflow-hidden border-t-4 border-[#11A8A4]">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Name</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Service</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Visit Date</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Location</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Slot</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Payment</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700">Report</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {staticBookings.map((booking) => (
                <tr key={booking.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{booking.patientName}</td>
                  <td className="py-3 px-4 truncate max-w-xs">{booking.services.map(s => s.name).join(', ')}</td>
                  <td className="py-3 px-4">{booking.visitDate}</td>
                  <td className="py-3 px-4">{booking.location}</td>
                  <td className="py-3 px-4">{booking.slot}</td>
                  <td className="py-3 px-4 text-green-600 font-semibold">{booking.paymentStatus}</td>
                  <td className="py-3 px-4 text-center">
                    {booking.reportUrl ? (
                      <button className="text-blue-500 hover:text-blue-700" title="Download Report">
                        <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
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
              {staticBookings.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-4 text-center text-gray-500">No bookings found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
                    <input readOnly value={selectedBooking.visitDate} className="w-full px-3 py-2 border rounded-lg bg-gray-50" type="text" />
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
                      {selectedBooking.services.map((svc, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="py-2 px-4">{svc.group}</td>
                          <td className="py-2 px-4">{svc.name}</td>
                          <td className="py-2 px-4 font-bold text-green-600">₹{svc.price}</td>
                        </tr>
                      ))}
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
                        <td className="py-2 px-4 font-bold text-green-600">₹{calculateTotal(selectedBooking.services)}</td>
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

