import React from 'react';

const PatientCard = ({ patient, onBookSlot }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      <div className="text-sm text-gray-700 space-y-2 mb-4">
        <p><span className="font-semibold text-gray-900">Name :</span> {patient.patient_name}</p>
        <p><span className="font-semibold text-gray-900">Age:</span> {patient.age} <span className="font-semibold text-gray-900 ml-2">BP:</span> {patient.bp}</p>
        <p><span className="font-semibold text-gray-900">Weight:</span> {patient.weight} <span className="font-semibold text-gray-900 ml-2">Height:</span> {patient.height}</p>
        <p><span className="font-semibold text-gray-900">Gender :</span> {patient.gender}</p>
        <p><span className="font-semibold text-gray-900">Address :</span> {patient.address}</p>
        <p><span className="font-semibold text-gray-900">Pin :</span> {patient.pin}</p>
        <p><span className="font-semibold text-gray-900">Email :</span> {patient.email}</p>
        <p><span className="font-semibold text-gray-900">Aleternat Mobile No. :</span> {patient.alternate_mobile_number}</p>
        <p><span className="font-semibold text-gray-900">Comment :</span> {patient.comment}</p>
      </div>
      <div className="mt-auto pt-4 border-t border-gray-100 text-center">
        <button 
          onClick={() => onBookSlot(patient)}
          className="cursor-pointer bg-[#00acc1] hover:bg-[#008ba3] text-white font-semibold py-2 px-4 rounded w-full transition-colors"
        >
          Book Your Slot
        </button>
      </div>
    </div>
  );
};

export default PatientCard;
