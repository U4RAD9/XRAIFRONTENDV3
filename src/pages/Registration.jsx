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
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.MobileNumber || !formData.MPIN) {
      alert("Please enter mobile number and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/auth/send_otp', { mobile: formData.MobileNumber });
      if (res.data.StatusCode === true) {
        alert("OTP is: " + res.data.OTP);
        alert(res.data.Message);
        setShowOtpModal(true);
      } else {
        alert(res.data.Message || "Failed to send OTP.");
      }
    } catch (err) {
      alert("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP.");
      return;
    }

    setOtpLoading(true);
    try {
      // 1. Verify OTP
      const verifyRes = await axios.post('http://127.0.0.1:8000/api/auth/verify_otp', { 
        mobile: formData.MobileNumber, 
        otp: otp 
      });

      if (verifyRes.data === true) {
        alert("OTP has been verified successfully.");
        
        // 2. Signup
        const signupRes = await axios.post('http://127.0.0.1:8000/api/auth/signup', formData);
        
        if (signupRes.data.Success === true) {
          alert("Registration successful! Please login.");
          navigate('/login');
        } else {
          alert(signupRes.data.Message);
        }
      } else {
        alert("Invalid OTP. Please retry with valid OTP.");
      }
    } catch (err) {
      alert("Error during verification.");
    } finally {
      setOtpLoading(false);
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

            <button type="button" onClick={handleSendOtp} disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 rounded-xl mt-6 hover:shadow-lg transition-all">
              {loading ? 'Sending...' : 'Sign up'}
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

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-[90%] max-w-md">
            <h4 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Verify OTP</h4>
            <div className="flex gap-4 items-center">
              <input type="number" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="flex-1 border border-[#b2ebf2] rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1]" />
              <button type="button" onClick={handleVerifyOtp} disabled={otpLoading} className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold px-6 py-2 rounded-lg hover:shadow-lg transition-all">
                {otpLoading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setShowOtpModal(false)} className="text-gray-500 hover:text-gray-800 font-semibold px-4 py-2 border rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Registration;
