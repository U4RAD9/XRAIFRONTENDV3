import React from 'react';
import { Link } from 'react-router-dom';

function Pricing() {
  return (
    <div className="bg-[#f2faff] min-h-screen pb-12 font-sans text-[#2c77bb]">
      {/* Breadcrumb section */}
      <div className="py-4">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-2xl font-bold text-[#233560]">Service Pricing</h1>
            <div className="text-sm font-semibold text-gray-500 mt-2 md:mt-0">
              <Link to="/" className="text-blue-600 hover:underline">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700">Pricing</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4">
        <h1 className="text-center text-[#0094ff] text-3xl font-bold mb-10">Service Pricing</h1>

        <div className="bg-white border border-[#0094ff] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] p-5 mb-5 mx-4 md:mx-auto md:max-w-4xl flex flex-col sm:flex-row hover:scale-105 transition-transform duration-300">
          <img src="https://xraidigital.com/Content/images/services/x-ray.jpg" alt="X-ray Service" className="w-[150px] h-[150px] object-cover rounded-xl mx-auto sm:mx-0" />
          <div className="flex-1 mt-4 sm:mt-0 sm:ml-5 text-center sm:text-left flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-2">X-ray</h2>
            <p className="text-[#f36438] font-bold text-lg">Price: ₹2000 INR</p>
            <p className="text-[#999] text-sm mt-2"><Link to="/terms-and-conditions" className="hover:underline">*Terms and conditions apply</Link></p>
          </div>
        </div>

        <div className="bg-white border border-[#0094ff] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] p-5 mb-5 mx-4 md:mx-auto md:max-w-4xl flex flex-col sm:flex-row hover:scale-105 transition-transform duration-300">
          <img src="https://xraidigital.com/Content/images/services/ECG.jpg" alt="ECG Service" className="w-[150px] h-[150px] object-cover rounded-xl mx-auto sm:mx-0" />
          <div className="flex-1 mt-4 sm:mt-0 sm:ml-5 text-center sm:text-left flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-2">ECG</h2>
            <p className="text-[#f36438] font-bold text-lg">Price: ₹800 INR</p>
            <p className="text-[#999] text-sm mt-2"><Link to="/terms-and-conditions" className="hover:underline">*Terms and conditions apply</Link></p>
          </div>
        </div>

        <div className="bg-white border border-[#0094ff] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] p-5 mb-5 mx-4 md:mx-auto md:max-w-4xl flex flex-col sm:flex-row hover:scale-105 transition-transform duration-300">
          <img src="https://xraidigital.com/Content/images/services/xrai-holter.jpg" alt="Holter Service" className="w-[150px] h-[150px] object-cover rounded-xl mx-auto sm:mx-0" />
          <div className="flex-1 mt-4 sm:mt-0 sm:ml-5 text-center sm:text-left flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-2">Holter</h2>
            <p className="text-[#f36438] font-bold text-lg">Price: ₹2000 INR</p>
            <p className="text-[#999] text-sm mt-2"><Link to="/terms-and-conditions" className="hover:underline">*Terms and conditions apply</Link></p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Pricing;
