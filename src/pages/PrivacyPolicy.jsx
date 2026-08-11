import React from 'react';
import { Link } from 'react-router-dom';

function PrivacyPolicy() {
  return (
    <div className="bg-[#f2faff] min-h-screen pb-12">
      {/* Breadcrumb section */}
      <div className="py-4 mb-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-2xl font-bold text-[#233560]">Privacy Policy</h1>
            <div className="text-sm font-semibold text-gray-500 mt-2 md:mt-0">
              <Link to="/" className="text-blue-600 hover:underline">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700">Privacy Policy</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="bg-white p-8 md:p-12 rounded-xl shadow-md max-w-4xl mx-auto space-y-12">
          
          {/* Privacy Policy Section */}
          <div>
            <h1 className="text-3xl font-bold text-[#0094ff] mb-8 border-b pb-4">Privacy Policy</h1>
            <div className="space-y-8 text-gray-700 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-[#0094ff] mb-3">Introduction</h2>
                <p>At XraiDigital, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#0094ff] mb-3">Data Collection</h2>
                <p>We collect personal information such as your name, address, contact number, and medical history to provide and improve our services. This information is collected when you book a service through our website or customer service.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#0094ff] mb-3">Use of Data</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Your personal data will be used for scheduling services and delivering healthcare services at your home.</li>
                  <li>We may use your contact details to send you reminders, notifications, or promotional offers related to XraiDigital.</li>
                  <li>Your medical data will be shared with healthcare professionals as needed for diagnostic purposes.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#0094ff] mb-3">Data Protection</h2>
                <p>We implement reasonable security measures to protect your personal and medical data from unauthorized access, loss, or misuse. However, no online system can guarantee complete security.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#0094ff] mb-3">Sharing of Data</h2>
                <p>We will only share your personal information with third parties, such as healthcare professionals or labs, to deliver the services you have requested. We do not sell or disclose your data to third parties for marketing purposes.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#0094ff] mb-3">Cookies</h2>
                <p>Our website uses cookies to improve your user experience. You can disable cookies through your browser settings, although this may affect website functionality.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#0094ff] mb-3">Changes to Policy</h2>
                <p>We reserve the right to update this privacy policy. Any changes will be posted on our website, and by continuing to use our services, you agree to the updated terms.</p>
              </section>
            </div>
          </div>

          {/* Refund and Cancellation Policy Section */}
          <div>
            <h1 className="text-3xl font-bold text-[#0094ff] mb-8 border-b pb-4">Refund and Cancellation Policy</h1>
            <div className="space-y-8 text-gray-700 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-[#0094ff] mb-3">Cancellation Policy</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Service Cancellation by You:</strong> You may cancel your service booking up to 4 hours before the scheduled time at no cost. Cancellations made within 4 hours of the service time will incur a 50% cancellation fee.</li>
                  <li><strong>Service Cancellation by XraiDigital:</strong> We reserve the right to cancel or reschedule appointments in case of unforeseen circumstances, such as technician unavailability or equipment failure. In such cases, you will be entitled to a full refund or a rescheduled appointment at no extra charge.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#0094ff] mb-3">Refund Policy</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Full Refund:</strong> If you cancel the service at least 4 hours in advance, you will receive a full refund if payment was made in advance.</li>
                  <li><strong>Partial Refund:</strong> Cancellations made within 4 hours of the scheduled appointment time will result in a 50% refund.</li>
                  <li><strong>No Refund:</strong> Once the service is initiated (i.e., the technician arrives at your location), no refunds will be issued, except in cases where XraiDigital is responsible for service failures.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#0094ff] mb-3">Refund Processing</h2>
                <p>Refunds will be processed within 5-7 business days and credited back to the payment method used during the booking.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-[#0094ff] mb-3">Rescheduling Policy</h2>
                <p>You may reschedule your service up to 4 hours before the scheduled time without any additional charges. Rescheduling within 4 hours of the appointment will incur a 25% fee of the total service cost.</p>
              </section>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
