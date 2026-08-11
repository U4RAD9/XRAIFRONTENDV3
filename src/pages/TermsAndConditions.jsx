import React from 'react';
import { Link } from 'react-router-dom';

function TermsAndConditions() {
  return (
    <div className="min-h-screen pb-12">
      {/* Breadcrumb section */}
      <div className="px-6 py-4 mb-6">
        <div className="container mx-auto px-2">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-2xl font-bold text-[#233560]">Terms and Conditions</h1>
            <div className="text-sm font-semibold text-gray-500 mt-2 md:mt-0">
              <Link to="/" className="text-blue-600 hover:underline">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700">Terms and Conditions</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="bg-white p-8 md:p-12 rounded-xl shadow-md max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#0094ff] text-center mb-8 border-b pb-4">Terms and Conditions</h1>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-[#0094ff] mb-3">Introduction</h2>
              <p>Welcome to XraiDigital. By using our healthcare services, you agree to comply with the following terms and conditions. Please read them carefully.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0094ff] mb-3">Services</h2>
              <p>XraiDigital offers home-based healthcare services, including X-rays, ECG, Holter monitoring, PFT (Pulmonary Function Test), and sample collection. These services are provided by certified healthcare professionals at your home.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0094ff] mb-3">User Responsibilities</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>You must provide accurate personal and medical information when booking a service.</li>
                <li>You are responsible for ensuring the safety and cleanliness of your home for our technicians to perform the healthcare service.</li>
                <li>You agree not to misuse or provide false information when booking a service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0094ff] mb-3">Booking and Payment</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>All services must be booked via our website or by contacting our customer service.</li>
                <li>Payments can be made in advance through our website or directly at your home after the service is provided. We accept cash, credit/debit cards, and UPI for home payments.</li>
                <li>Once a booking is confirmed, you will receive a confirmation message via email or SMS.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0094ff] mb-3">Limitation of Liability</h2>
              <p>XraiDigital is not liable for any indirect or unforeseen damages. While we strive to ensure the highest quality of service, healthcare outcomes can vary, and XraiDigital cannot guarantee specific diagnostic results.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0094ff] mb-3">Termination</h2>
              <p>We reserve the right to refuse or terminate services if we suspect any misuse or violation of these terms and conditions.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0094ff] mb-3">Amendments</h2>
              <p>XraiDigital reserves the right to modify these terms at any time. Any updates will be reflected on our website, and your continued use of our services will signify your acceptance of the revised terms.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;
