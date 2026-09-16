import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';
import { ENDPOINTS } from '../api/endpoints';

function Login() {
  const [formData, setFormData] = useState({
    MobileNumber: '',
    MPIN: ''
  });
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMsg, setOtpMsg] = useState('');
  const [resetStep, setResetStep] = useState(1);
  const [resetData, setResetData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.MobileNumber || !formData.MPIN) {
      alert("Please enter mobile number and password.");
      return;
    }

    setLoading(true);

    // 1) Try CampManager login first
    try {
      const campRes = await axios.post(ENDPOINTS.CAMPMANAGER_LOGIN, {
        email: formData.MobileNumber,
        password: formData.MPIN,
      });

      const campData = campRes.data;

      if (campData && campData.success === true && campData.token) {
        sessionStorage.setItem('Token', campData.token);
        sessionStorage.setItem('UserName', campData.email || formData.MobileNumber);
        sessionStorage.setItem('FullName', campData.name || '');
        sessionStorage.setItem('UserID', String(campData.user_id || ''));
        sessionStorage.setItem('ClientID', campData.client_id || '');
        sessionStorage.setItem('Email', campData.email || '');
        sessionStorage.setItem('ContactNumber', campData.contact_number || '');
        sessionStorage.setItem('Groups', JSON.stringify(campData.groups || []));
        // Keep UserType as ChannelPartner for route guard
        sessionStorage.setItem('UserType', 'ChannelPartner');
        // Also persist for dashboard display
        sessionStorage.setItem('ChannelDashboard', campData.dashboard || '/channel-partner/dashboard');
        sessionStorage.setItem('MobileNumber', campData.contact_number || campData.email || formData.MobileNumber);

        const groups = campData.groups || [];
        setLoading(false);
        if (groups.includes('ChannelPartner')) {
          navigate('/channel-partner/dashboard', { replace: true });
        } else if (campData.dashboard) {
          navigate(campData.dashboard, { replace: true });
        } else {
          navigate('/channel-partner/dashboard', { replace: true });
        }
        return;
      }
    } catch (campErr) {
      // CampManager login did not succeed / not exist -> fallback to normal login
      // console.debug('CampManager login failed, falling back', campErr);
    }

    // 2) Fallback: existing normal login flow
    try {
      const res = await axiosInstance.post(ENDPOINTS.LOGIN, formData);
      if (res.data.Success === true) {
        sessionStorage.setItem('Token', res.data.Token);
        sessionStorage.setItem('UserName', res.data.UserName);
        sessionStorage.setItem('FullName', res.data.FullName);
        sessionStorage.setItem('UserType', res.data.UserType);
        sessionStorage.setItem('UserID', res.data.UserID);
        sessionStorage.setItem('Age', res.data.Age || '');
        sessionStorage.setItem('Gender', res.data.Gender || '');
        sessionStorage.setItem('MobileNumber', res.data.MobileNumber || res.data.UserName || '');
        
        if (res.data.UserType === "Admin") {
          navigate('/admin/dashboard', { replace: true });
        } else if (res.data.UserType === "Partner") {
          navigate('/partner/dashboard', { replace: true });
        } else if (res.data.UserType === "Technician") {
          navigate('/technician/dashboard', { replace: true });
        } else {
          navigate('/patient/dashboard', { replace: true });
        }
      } else {
        alert(res.data.message || res.data.Message || "Login failed. Please check credentials.");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.Message || "Error logging in";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.MobileNumber) {
      alert("Please enter mobile number first.");
      return;
    }
    
    // In our simplified mock, we will just send an OTP if the user exists
    setLoading(true);
    try {
      // For forgot password, we can reuse send_otp or a specific endpoint
      // Let's call our newly mapped auth/send_otp for now (in production, we'd have a forget_mpin that checks if user exists before sending OTP).
      const res = await axiosInstance.post(ENDPOINTS.FORGET_MPIN, { mobile: formData.MobileNumber });
      if (res.data.StatusCode === true) {
        alert("OTP is: " + res.data.OTP);
        setOtpMsg(`OTP has been sent to ${formData.MobileNumber}. Kindly verify OTP to reset password.`);
        setResetStep(1);
        setShowOtpModal(true);
      } else {
        alert(res.data.Message || "Failed to send OTP.");
      }
    } catch (err) {
      alert("Error processing request");
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
      const verifyRes = await axiosInstance.post(ENDPOINTS.VERIFY_OTP, { 
        mobile: formData.MobileNumber, 
        otp: otp 
      });

      if (verifyRes.data === true) {
        setResetStep(2);
      } else {
        alert("Invalid OTP. Please retry with valid OTP.");
      }
    } catch (err) {
      alert("Error during verification.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetData.email || !resetData.newPassword || !resetData.confirmPassword) {
      alert("All fields are required.");
      return;
    }
    if (resetData.newPassword !== resetData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    setOtpLoading(true);
    try {
      const res = await axiosInstance.post(ENDPOINTS.UPDATE_PASSWORD, {
        mobile: formData.MobileNumber,
        email: resetData.email,
        new_password: resetData.newPassword
      });
      if (res.data.Success) {
        alert("Password updated successfully.");
        setShowOtpModal(false);
      } else {
        alert(res.data.Message);
      }
    } catch (e) {
       alert("Error updating password.");
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
            <p className="text-gray-500 text-sm mt-2">Enter your Mobile Number / Username and Password to sign in</p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number / Username</label>
              <input type="text" name="MobileNumber" placeholder="Mobile Number / Username" value={formData.MobileNumber} onChange={handleChange} className="w-full border border-[#b2ebf2] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00acc1]" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input type="password" name="MPIN" placeholder="Password" value={formData.MPIN} onChange={handleChange} className="w-full border border-[#b2ebf2] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00acc1]" />
              
              <div className="flex justify-between items-center mt-2">
                <button type="button" onClick={handleForgotPassword} className="text-[#00acc1] text-sm hover:underline font-semibold cursor-pointer">
                  forgot Password?
                </button>
                <Link to="/register" className="text-blue-600 text-sm hover:underline font-semibold">
                  not have account ? signup
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="rememberMe" className="w-4 h-4 text-[#00acc1]" />
              <label htmlFor="rememberMe" className="text-sm text-gray-600 font-semibold">Remember me</label>
            </div>

            <button type="button" onClick={handleLogin} disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 rounded-xl mt-6 hover:shadow-lg transition-all">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Right Side: Image */}
        <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://xraidigital.com/AdminContent_New/assets/img/curved-images/curved6.jpg')" }}>
        </div>
      </div>

      {/* OTP / Reset Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-[90%] max-w-md">
            <h4 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
              {resetStep === 1 ? 'Verify OTP' : 'Reset Password'}
            </h4>
            
            {resetStep === 1 ? (
              <>
                <p className="text-sm text-gray-600 mb-4 font-semibold">{otpMsg}</p>
                <div className="flex gap-4 items-center">
                  <input type="number" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="flex-1 border border-[#b2ebf2] rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1]" />
                  <button type="button" onClick={handleVerifyOtp} disabled={otpLoading} className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold px-6 py-2 rounded-lg hover:shadow-lg transition-all">
                    {otpLoading ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <input type="email" placeholder="Old Email" value={resetData.email} onChange={(e) => setResetData({...resetData, email: e.target.value})} className="w-full border border-[#b2ebf2] rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1]" />
                <input type="password" placeholder="New Password" value={resetData.newPassword} onChange={(e) => setResetData({...resetData, newPassword: e.target.value})} className="w-full border border-[#b2ebf2] rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1]" />
                <input type="password" placeholder="Verify Password" value={resetData.confirmPassword} onChange={(e) => setResetData({...resetData, confirmPassword: e.target.value})} className="w-full border border-[#b2ebf2] rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1]" />
                <button type="button" onClick={handleResetPassword} disabled={otpLoading} className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold px-6 py-2 rounded-lg hover:shadow-lg transition-all">
                    {otpLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setShowOtpModal(false)} className="text-gray-500 hover:text-gray-800 font-semibold px-4 py-2 border rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
