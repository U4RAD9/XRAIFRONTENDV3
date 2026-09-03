import React from 'react';

const ServiceProviderProfile = ({ provider, onClose }) => {
  if (!provider) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden relative animate-in fade-in zoom-in duration-200" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-gray-700 transition-colors cursor-pointer"
        >
          <i className="fas fa-times text-xl"></i>
        </button>

        {/* Top Header Background and Logo */}
        <div className="relative pt-6 px-8 flex justify-center items-start z-10 bg-[#f7fdf7]">
          {/* Faint green cross shape in background */}
          <div className="absolute inset-0 flex justify-center items-center opacity-30 pointer-events-none">
            <div className="w-64 h-24 bg-[#c8e6c9] rounded-3xl absolute top-32"></div>
            <div className="w-24 h-64 bg-[#c8e6c9] rounded-3xl absolute top-12"></div>
          </div>
          
          <div className="flex flex-col items-center">
            {/* Logo placeholder, using text for now if image isn't available, but we try to match style */}
            <div className="flex items-center gap-2 mb-2 z-10">
              <div className="flex flex-col">
                <img 
                  src="/Content/xriprofilelogo.png" 
                  alt="xrai profile logo" 
                  className='h-[60px] w-[280px]'
                />
              </div>
            </div>
            
            {/* Profile Image */}
            <div className="relative w-56 h-56 mt-4 z-10">
              {provider.image ? (
                <img src={provider.image} alt={provider.name} className="w-full h-full object-cover rounded-t-full rounded-b-lg shadow-lg border-4 border-white" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 rounded-t-full rounded-b-lg border-4 border-white">
                  <i className="fas fa-user text-6xl"></i>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* The Wave Graphic */}
        <div className="relative w-full h-24 -mt-16 z-20 pointer-events-none">
          <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
             <path fill="#00a79d" fillOpacity="1" d="M0,192L48,208C96,224,192,256,288,250.7C384,245,480,203,576,197.3C672,192,768,224,864,213.3C960,203,1056,149,1152,144C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        {/* Profile Info Section */}
        <div className="px-8 pb-8 pt-4 bg-[#fcfcfc] relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-4 mb-6 text-center">
            
            <div className="flex flex-col md:col-span-1 text-left md:text-center">
              <span className="text-[16px] text-black font-semibold">Name: {provider.name}</span>
            </div>
            <div className="flex flex-col md:col-span-1 text-center">
              <span className="text-[16px] text-black font-semibold">Age: {provider.age}</span>
            </div>
            <div className="flex flex-col md:col-span-1 text-right md:text-center">
              <span className="text-[16px] text-black font-semibold">Gender: {provider.gender}</span>
            </div>

            <div className="flex flex-col md:col-span-1 text-left md:text-center">
              <span className="text-[16px] text-black font-semibold">Experience: {provider.experience}</span>
            </div>
            <div className="flex flex-col md:col-span-1 text-center">
              <span className="text-[16px] text-black font-semibold">Designation: {provider.designation}</span>
            </div>
            <div className="flex flex-col md:col-span-1 text-right md:text-center">
              <span className="text-[16px] text-black font-semibold">Ph: {provider.contact}</span>
            </div>
            
          </div>

          <div className="relative mt-10 border-2 border-[#81c784] rounded-xl p-4 text-center">
             <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#00a79d] text-white px-8 py-1 rounded-full text-lg font-semibold shadow-md">
               About
             </div>
             <p className="mt-2 text-xl font-bold text-black tracking-wide">
               {provider.about || "Dream big work hard stay focused"}
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ServiceProviderProfile;
