import React from 'react';

function DashboardCards({ bookings, onViewDetails, onViewReports }) {
  if (bookings.length === 0) {
    return <div className="text-center py-8 text-gray-500">No bookings found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {bookings.map(booking => (
        <div key={booking.BookingID} className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
          <div className="p-4 flex-1">
            <h3 className="font-bold text-lg text-[#233560] mb-2">{booking.patientName}</h3>
            <p className="text-sm text-gray-600 mb-1"><i className="fas fa-calendar-alt w-5 text-center text-[#11A8A4]"></i> {booking.Date}</p>
            <p className="text-sm text-gray-600 mb-1"><i className="fas fa-map-marker-alt w-5 text-center text-[#11A8A4]"></i> {booking.location}</p>
            <p className="text-sm text-gray-600 mb-1"><i className="fas fa-clock w-5 text-center text-[#11A8A4]"></i> {booking.slot}</p>
            <p className="text-sm text-gray-600 mb-1"><i className="fas fa-user-md w-5 text-center text-[#11A8A4]"></i> {booking.technician}</p>
            <div className="text-sm text-gray-600 mb-3 flex items-start">
              <i className="fas fa-stethoscope w-5 mt-1 text-center text-[#11A8A4]"></i> 
              <span className="flex-1 truncate" title={booking.services}>
                {booking.services}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2 text-sm border-t border-gray-100 pt-2">
               <span className={`px-2 py-1 rounded-full text-xs font-semibold ${booking.paymentStatus === 'Done' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                 {booking.paymentStatus}
               </span>
               <span className="font-bold text-gray-700">₹{booking.Amount}</span>
            </div>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 grid grid-cols-3 gap-2">
            {booking.hasReport ? (
              <button 
                title="View Reports"
                onClick={() => onViewReports(booking.reports || [])}
                className="col-span-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-1.5 px-2 rounded text-xs text-center shadow-sm transition-colors flex items-center justify-center cursor-pointer"
              >
                <i className="fas fa-eye mr-1"></i> View
              </button>
            ) : (
              <button 
                disabled
                className="col-span-1 border border-red-200 text-red-500 font-semibold py-1.5 px-2 rounded text-xs text-center cursor-not-allowed flex items-center justify-center opacity-70 bg-red-50"
                title="Report not uploaded"
              >
                <i className="fas fa-file-medical-alt mr-1"></i> No Report
              </button>
            )}
            <button 
              onClick={(e) => e.preventDefault()}
              className="col-span-1 border border-[#11A8A4] text-[#11A8A4] hover:bg-[#11A8A4] hover:text-white font-semibold py-1.5 px-2 rounded text-xs text-center shadow-sm transition-colors flex items-center justify-center cursor-default"
              title="Track your technician"
            >
              <i className="fas fa-map-marker-alt mr-1"></i> Track
            </button>
            <button 
              onClick={() => onViewDetails(booking)}
              className="col-span-1 bg-[#11A8A4] hover:bg-[#008ba3] text-white font-semibold py-1.5 px-2 rounded text-xs text-center shadow-sm transition-colors flex items-center justify-center cursor-pointer"
            >
              <i className="fas fa-eye mr-1"></i> View
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards;
