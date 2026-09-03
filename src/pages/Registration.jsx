import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Registration() {
  const [formData, setFormData] = useState({
    MobileNumber: '',
    MPIN: '',
    FullName: '',
    Email: '',
    Gender: '',
    Age: ''
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!formData.MobileNumber || !formData.MPIN) {
      alert("Please enter mobile number and password.");
      return;
    }

    setLoading(true);
    try {
      const signupRes = await axios.post('http://127.0.0.1:8000/api/auth/signup', formData);
      
      if (signupRes.data.Success === true) {
        alert("Registration successful! Please login.");
        navigate('/login');
      } else {
        alert(signupRes.data.Message);
      }
    } catch (err) {
      alert("Error during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 flex items-center justify-center p-4 font-sans">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-4xl flex overflow-hidden">
        
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="mb-8 text-center md:text-left">
            <h3 className="text-3xl font-bold text-[#00acc1] bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500">Welcome</h3>
            <p className="text-gray-500 text-sm mt-2">Please fill out details to signup and start booking your slot</p>
          </div>

          <form className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
                <input type="text" name="MobileNumber" placeholder="Mobile Number" value={formData.MobileNumber} onChange={handleChange} className="w-full border border-[#b2ebf2] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00acc1]" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password *</label>
                <input type="password" name="MPIN" placeholder="Password" value={formData.MPIN} onChange={handleChange} className="w-full border border-[#b2ebf2] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00acc1]" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input type="text" name="FullName" placeholder="Full Name" value={formData.FullName} onChange={handleChange} className="w-full border border-[#b2ebf2] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00acc1]" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input type="email" name="Email" placeholder="Email" value={formData.Email} onChange={handleChange} className="w-full border border-[#b2ebf2] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00acc1]" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                <select name="Gender" value={formData.Gender} onChange={handleChange} className="w-full border border-[#b2ebf2] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00acc1] bg-white">
                  <option value="">-- Select Gender --</option>
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Age</label>
                <input type="number" name="Age" placeholder="Age" value={formData.Age} onChange={handleChange} className="w-full border border-[#b2ebf2] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00acc1]" />
              </div>
            </div>

            <button type="button" onClick={handleSignup} disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 rounded-xl mt-6 hover:shadow-lg transition-all">
              {loading ? 'Registering...' : 'Sign up'}
            </button>
            
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account? <Link to="/login" className="text-[#00acc1] font-bold hover:underline">Log in</Link>
            </p>
          </form>
        </div>

        {/* Right Side: Image */}
        <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://xraidigital.com/Admin_Content/Images/CompanyLogo/Logo.jpg')" }}>
        </div>
      </div>
    </div>
  );
}

export default Registration;
