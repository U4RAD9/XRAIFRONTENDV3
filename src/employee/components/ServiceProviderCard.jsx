import React from 'react';

const ServiceProviderCard = ({ provider, onView, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
      <div className="p-4 flex-1 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-[#11A8A4] bg-gray-100 flex-shrink-0">
          {provider.image ? (
            <img src={provider.image} alt={provider.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              <i className="fas fa-user text-3xl"></i>
            </div>
          )}
        </div>
        <h3 className="font-bold text-lg text-[#233560] mb-1">{provider.name}</h3>
        <p className="text-sm font-semibold text-[#11A8A4] mb-3">{provider.designation}</p>
        
        <div className="w-full grid grid-cols-2 gap-2 text-left text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
          <div><span className="font-semibold">Age:</span> {provider.age}</div>
          <div><span className="font-semibold">Gender:</span> {provider.gender}</div>
          <div><span className="font-semibold">Exp:</span> {provider.experience}</div>
          <div className="truncate"><span className="font-semibold">Ph:</span> {provider.contact}</div>
        </div>
        
      </div>
      
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
        <div className="flex items-center">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={provider.active}
                onChange={() => onToggleStatus(provider.id, !provider.active)} 
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${provider.active ? 'bg-[#11A8A4]' : 'bg-gray-300'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${provider.active ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span className={`ml-2 text-xs font-semibold ${provider.active ? 'text-green-600' : 'text-gray-500'}`}>
              {provider.active ? 'Active' : 'Inactive'}
            </span>
          </label>
        </div>
        
        <div className="flex gap-2">
          <button onClick={() => onView(provider)} className="text-[#11A8A4] hover:text-[#008ba3] p-1 transition-colors" title="View Profile">
            <i className="fas fa-eye"></i>
          </button>
          <button onClick={() => onEdit(provider)} className="text-blue-500 hover:text-blue-700 p-1 transition-colors" title="Edit">
            <i className="fas fa-edit"></i>
          </button>
          <button onClick={() => onDelete(provider.id)} className="text-red-500 hover:text-red-700 p-1 transition-colors" title="Delete">
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderCard;
