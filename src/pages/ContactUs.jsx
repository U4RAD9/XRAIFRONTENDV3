import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState(''); // 'success' or 'error'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      // Mocking successful submission
      setStatus('success');
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="h-[auto]">
      {/* Breadcrumb section */}
      <div className="pt-1 pb-4">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-2xl font-bold text-[#233560]">Contact us</h1>
            <div className="text-sm font-semibold text-gray-500 mt-2 md:mt-0">
              <Link to="/" className="text-[#0F847E] hover:underline">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700">Contact us</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-2">
        <div className="flex flex-col md:flex-row gap-12 bg-white p-8 rounded-xl shadow-md">
          
          {/* Contact Form */}
          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold text-[#233560] mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-[#00acc1]">
              Contact Form
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  required 
                  className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-[#00acc1]"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  required 
                  className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-[#00acc1]"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea 
                  rows="6" 
                  required 
                  className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-[#00acc1]"
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="bg-[#00acc1] text-white px-6 py-3 rounded font-bold hover:bg-[#008ba3] flex items-center justify-center w-full md:w-auto"
              >
                <i className="fa fa-paper-plane mr-2"></i> Send Message
              </button>
            </form>

            {status === 'success' && (
              <div className="mt-8 flex items-center space-x-4 bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl">
                  <i className="fa fa-check"></i>
                </div>
                <h3 className="text-lg font-bold text-green-700">Your message was successfully sent!</h3>
              </div>
            )}

            {status === 'error' && (
              <div className="mt-8 flex items-center space-x-4 bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-2xl">
                  <i className="fa fa-lock"></i>
                </div>
                <h3 className="text-lg font-bold text-red-700">Something went wrong, try refreshing and submitting the form again.</h3>
              </div>
            )}
          </div>

          {/* Contact Details */}
          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold text-[#233560] mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-[#00acc1]">
              Get in touch
            </h3>
            <p className="text-gray-600 mb-8">We'd love to hear from you. Drop us a line if you have any questions.</p>
            
            <h3 className="text-xl font-bold text-[#233560] mb-4">Head Office</h3>
            <hr className="mb-4" />
            <ul className="space-y-4 text-gray-700 font-medium">
              <li className="flex items-start">
                <i className="fa fa-map-marker text-[#00acc1] mt-1 mr-4 w-4"></i>
                <span>Address: C406, Nirvana courtyard, Sector 50, Near North Close, Gurugram, Haryana 122018</span>
              </li>
              <li className="flex items-start">
                <i className="fa fa-phone text-[#00acc1] mt-1 mr-4 w-4"></i>
                <span>Phone: +91 124 4254012</span>
              </li>
              <li className="flex items-start">
                <i className="fa fa-envelope text-[#00acc1] mt-1 mr-4 w-4"></i>
                <span>info@xraidigital.com</span>
              </li>
            </ul>

            <h3 className="text-xl font-bold text-[#233560] mt-8 mb-4">Office Hours</h3>
            <hr className="mb-4" />
            <ul className="space-y-4 text-gray-700 font-medium mb-8">
              <li className="flex items-start">
                <i className="fa fa-clock-o text-[#00acc1] mt-1 mr-4 w-4"></i>
                <span>Monday - Saturday 9am to 7pm</span>
              </li>
            </ul>

            <h3 className="text-xl font-bold text-[#233560] mb-4">Our Branch Offices</h3>
            <hr className="mb-4" />
            <div className="w-full h-80 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <iframe 
                src="https://www.google.com/maps/d/embed?mid=1GaMu_cGOJgOG9aUlSp6s7YYMNb_O8zM&ehbc=2E312F" 
                width="100%" 
                height="100%" 
                title="Branch Offices Map"
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
