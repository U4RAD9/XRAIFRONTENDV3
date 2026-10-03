import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

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
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);

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

    if (!consent1 || !consent2) {
      alert("Please accept the DPDP Act consent and Privacy Policy to proceed.");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/send_otp', { mobile: formData.MobileNumber });
      if (res.data.StatusCode === true) {
        alert(res.data.Message);
        setOtpSent(true);
      } else {
        alert(res.data.Message || "Error sending OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndSignup = async (e) => {
    e.preventDefault();
    if (!otp) {
      alert("Please enter OTP.");
      return;
    }

    setLoading(true);
    try {
      const verifyRes = await axiosInstance.post('/auth/verify_otp', { mobile: formData.MobileNumber, otp });
      
      if (verifyRes.data === true) {
        const signupRes = await axiosInstance.post('/auth/signup', formData);
        
        if (signupRes.data.Success === true) {
          alert("Registration successful! Please login.");
          navigate('/login', { replace: true });
        } else {
          alert(signupRes.data.Message);
        }
      } else {
        alert("Invalid OTP.");
      }
    } catch (err) {
      console.error(err);
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

            {otpSent && (
              <div className="flex flex-col mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Enter OTP *</label>
                <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full border border-[#b2ebf2] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00acc1]" />
              </div>
            )}

            {!otpSent && (
              <div className="flex flex-col space-y-3 mt-6 text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input type="checkbox" checked={consent1} onChange={(e) => setConsent1(e.target.checked)} className="mt-1 w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500" />
                  <span className="leading-tight">I agree to the Terms of Service and Privacy Policy.</span>
                </label>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input type="checkbox" checked={consent2} onChange={(e) => setConsent2(e.target.checked)} className="mt-1 w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500" />
                  <span className="leading-tight">I explicitly consent to the collection, processing, and storage of my personal and health data in accordance with the Digital Personal Data Protection (DPDP) Act, 2023.</span>
                </label>
              </div>
            )}

            {!otpSent ? (
              <button type="button" onClick={handleSendOtp} disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 rounded-xl mt-4 hover:shadow-lg transition-all">
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            ) : (
              <button type="button" onClick={handleVerifyAndSignup} disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 rounded-xl mt-6 hover:shadow-lg transition-all">
                {loading ? 'Registering...' : 'Verify OTP & Sign up'}
              </button>
            )}
            
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account? <Link to="/login" className="text-[#00acc1] font-bold hover:underline">Log in</Link>
            </p>
          </form>
        </div>

        {/* Right Side: Welcome Banner */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#00acc1] to-blue-600 p-12 flex-col justify-center items-center text-white text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-cyan-300 opacity-20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col items-center space-y-6">
            <div className="bg-white px-6 py-4 rounded-2xl shadow-xl inline-block mb-2">
               <img src="https://xraidigital.com/Content/images/logo.png" alt="XRAI Digital Logo" className="h-14 object-contain" />
            </div>
            
            <h2 className="text-3xl font-extrabold tracking-tight">Welcome to XRAI Digital</h2>
            <p className="text-lg text-cyan-50 font-medium max-w-md mx-auto leading-relaxed">
              Pioneering the future of digital healthcare. We seamlessly connect advanced diagnostic services with patients everywhere—empowering you with fast, secure, and accessible health management tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registration;
