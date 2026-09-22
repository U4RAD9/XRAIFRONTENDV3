import React from 'react';
import { useNavigate } from 'react-router-dom';

function TechnicianBookingCard({ booking, onUpdateTestStatus, onViewFiles, onUpdatePaymentStatus, onToggleTrack, isActiveTracking }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full overflow-hidden relative">
      {/* Top Banner (Status & ID) */}
      <div className="bg-[#233560] text-white py-2 px-3 flex justify-between items-center text-xs">
        <span className="font-bold tracking-wide">ID: {booking.patientId}</span>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            booking.paymentStatus === 'Paid' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
          }`}>
            {booking.paymentStatus}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-grow flex flex-col gap-3">
        
        {/* Patient Details */}
        <div>
          <h3 className="font-bold text-gray-900 text-base leading-tight mb-1">{booking.patientName}</h3>
          <div className="text-gray-500 text-xs flex flex-col gap-1">
            <p><i className="fas fa-phone-alt w-4 text-center"></i> {booking.phoneNo}</p>
            <p className="truncate"><i className="fas fa-file-alt w-4 text-center"></i> Ref: {booking.refNo || 'N/A'}</p>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Booking Details */}
        <div className="grid grid-cols-2 gap-y-2 text-xs">
          <div>
            <p className="text-gray-400 font-medium">Date</p>
            <p className="font-semibold text-gray-700">{booking.bookingDate.split(' ')[0]}</p>
          </div>
          <div>
            <p className="text-gray-400 font-medium">Slot</p>
            <p className="font-semibold text-gray-700">{booking.slot}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-400 font-medium">Remarks</p>
            <p className="font-semibold text-gray-700 truncate">{booking.remarks || 'None'}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 border-t border-gray-100">
        <button 
          onClick={() => onViewFiles(booking)}
          className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white border border-gray-200 rounded text-[#00acc1] hover:bg-cyan-50 font-semibold text-xs transition-colors cursor-pointer"
        >
          <i className="fas fa-paperclip"></i>
          {booking.files > 0 ? `${booking.files} Files` : 'Add Files'}
        </button>

        <button 
          onClick={onToggleTrack}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 border rounded font-semibold text-xs transition-colors cursor-pointer ${
            isActiveTracking ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white border-gray-200 text-blue-600 hover:bg-blue-50'
          }`}
        >
          <i className={`fas ${isActiveTracking ? 'fa-spinner fa-spin' : 'fa-map-marker-alt'}`}></i> 
          {isActiveTracking ? 'Tracking Active' : 'Start Tracking'}
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
