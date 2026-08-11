import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/services/');
      setServices(res.data.filter(s => s.is_active));
    } catch (err) {
      console.error('Error fetching public services', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="pt-1 pb-4">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-2xl font-bold text-[#233560]">Our Services</h1>
            <div className="text-sm font-semibold text-gray-500 mt-2 md:mt-0">
              <Link to="/" className="text-[#0F847E] hover:underline">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700">Services</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#233560] mb-4">Comprehensive Diagnostic Solutions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We provide a wide range of reliable and accurate diagnostic tests, delivered right to your doorstep by our certified health professionals.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <i className="fas fa-spinner fa-spin text-4xl text-[#00acc1]"></i>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-blue-50 rounded-full flex justify-center items-center text-[#00acc1] text-2xl mb-4">
                  <i className="fas fa-microscope"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{service.service_name}</h3>
                <p className="text-gray-500 text-sm mb-4">
                  High-quality diagnostic testing with quick and accurate results.
                </p>
                <Link to="/login" className="text-[#00acc1] font-semibold hover:underline flex items-center">
                  Book Now <i className="fas fa-arrow-right ml-2 text-sm"></i>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Services;
