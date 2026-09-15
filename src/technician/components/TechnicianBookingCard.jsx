import React from 'react';
import { useNavigate } from 'react-router-dom';

function TechnicianBookingCard({ 
  booking, 
  onUpdateTestStatus, 
  onViewFiles, 
  onUpdatePaymentStatus 
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="bg-blue-50/50 px-4 py-3 border-b border-gray-100 flex justify-between items-start">
        <div>
          <h3 className="font-bold text-[#233560] text-lg">{booking.patientName}</h3>
          <p className="text-xs text-gray-500 font-medium">ID: {booking.patientId} | Ref: {booking.refNo || 'N/A'}</p>
        </div>
        <div className="text-right">
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            booking.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {booking.status === 'Completed' ? 'Completed' : 'Pending'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="flex items-center text-sm">
          <i className="fas fa-phone-alt text-gray-400 w-6 text-center"></i>
          <span className="text-gray-700">{booking.phoneNo}</span>
        </div>
        
        <div className="flex items-center text-sm">
          <i className="fas fa-calendar-alt text-gray-400 w-6 text-center"></i>
          <span className="text-gray-700">{booking.bookingDate} <span className="text-gray-400 mx-1">|</span> {booking.slot}</span>
        </div>

        <div className="flex items-center text-sm">
          <i className="fas fa-credit-card text-gray-400 w-6 text-center"></i>
          <span className="text-gray-700">{booking.paymentMethod}</span>
          <span className={`ml-auto px-2 py-0.5 rounded text-xs font-bold ${
            booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'
          }`}>
            {booking.paymentStatus}
          </span>
        </div>

        {booking.remarks && (
          <div className="flex items-start text-sm bg-gray-50 p-2 rounded">
            <i className="fas fa-comment-alt text-gray-400 w-6 text-center mt-0.5"></i>
            <span className="text-gray-600 italic text-xs leading-tight">{booking.remarks}</span>
          </div>
        )}
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 border-t border-gray-100">
        <button 
          onClick={() => onViewFiles(booking)}
          className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white border border-gray-200 rounded text-[#00acc1] hover:bg-cyan-50 font-semibold text-xs transition-colors cursor-pointer"
        >
          <i className="fas fa-paperclip"></i>
          {booking.files > 0 ? `${booking.files} Files` : 'Add Files'}
        </button>

        <button 
          className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white border border-gray-200 rounded text-blue-600 hover:bg-blue-50 font-semibold text-xs transition-colors cursor-pointer"
        >
          <i className="fas fa-map-marker-alt"></i> Track
        </button>

        <button 
          onClick={() => navigate(`/technician/edit-booking/${booking.id}`)}
          className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white border border-gray-200 rounded text-gray-700 hover:bg-gray-100 font-semibold text-xs transition-colors cursor-pointer"
        >
          <i className="fas fa-edit"></i> Edit
        </button>

        {booking.paymentStatus !== 'Paid' ? (
          <button 
            onClick={() => onUpdatePaymentStatus(booking.id)}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#00acc1] hover:bg-[#0097a7] text-white rounded font-semibold text-xs transition-colors shadow-sm cursor-pointer"
          >
            Collect
          </button>
        ) : (
          <div className="flex items-center justify-center py-1.5 px-2 bg-green-50 text-green-700 rounded font-bold text-xs border border-green-100">
            Collected
          </div>
        )}
        
        {booking.status !== 'Completed' && (
          <button 
            onClick={() => onUpdateTestStatus(booking.id)}
            className="col-span-2 flex items-center justify-center gap-1.5 py-2 mt-1 bg-[#233560] hover:bg-[#1a2849] text-white rounded font-bold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <i className="fas fa-check-circle"></i> Mark as Completed
          </button>
        )}
      </div>
    </div>
  );
}

export default TechnicianBookingCard;
