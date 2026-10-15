import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import ConsentNoticeModal from '../components/ConsentNoticeModal';

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
  const [consent2, setConsent2] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentRecord, setConsentRecord] = useState({
    noticeVersion: 'DPDP-1.0',
    timestamp: null,
    required: { a: true, b: true, c: true, d: true, e: true },
    optional: { f: true, g: true, h: true },
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxClick = (e) => {
    if (!consent2) {
      // Forcefully open full notice if not agreed yet
      e.preventDefault();
      setShowConsentModal(true);
    } else {
      // Allow unchecking if already agreed
      setConsent2(false);
    }
  };

  const handleConsentAgreed = (record) => {
    setConsentRecord(record);
    setConsent2(true);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.MobileNumber || !formData.MPIN) {
      alert("Please enter mobile number and password.");
      return;
    }

    if (!consent2) {
      alert("Please accept the DPDP Act consent to proceed.");
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
        const signupPayload = {
          ...formData,
          otp,
          consentRecord: {
            ...consentRecord,
            timestamp: consentRecord?.timestamp || new Date().toISOString()
          }
        };
        const signupRes = await axiosInstance.post('/auth/signup', signupPayload);

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
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="dpdpConsent"
                    checked={consent2}
                    onChange={() => { }}
                    onClick={handleCheckboxClick}
                    className="mt-1 w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500 cursor-pointer shrink-0"
                  />
                  <label htmlFor="dpdpConsent" className="leading-relaxed cursor-pointer select-none text-gray-700">
                    I hereby consent to collection and processing of my data for availing Diagnostic Services and relevant services in the manner described in the{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowConsentModal(true);
                      }}
                      className="text-[#00acc1] hover:text-[#008ba3] font-bold underline cursor-pointer inline transition-colors text-left"
                    >
                      notice here
                    </button>
                    .
                  </label>
                </div>
              </div>
            )}

            {!otpSent ? (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading || !consent2}
                  title={!consent2 ? "Please agree to the DPDP Act consent notice to enable Send OTP" : ""}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
                {!consent2 && (
                  <p className="text-xs text-amber-600 text-center mt-2 font-medium">
                    Please read and accept the DPDP Act consent notice above to enable Send OTP.
                  </p>
                )}
              </div>
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

            <h2 className="text-3xl font-extrabold tracking-tight">Welcome to XRAi Digital</h2>
            <p className="text-lg text-cyan-50 font-medium max-w-md mx-auto leading-relaxed">
              Pioneering the future of digital healthcare. We seamlessly connect advanced diagnostic services with patients everywhere—empowering you with fast, secure, and accessible health management tools.
            </p>
          </div>
        </div>
      </div>

      <ConsentNoticeModal
        isOpen={showConsentModal}
        onClose={() => setShowConsentModal(false)}
        onConsentAgreed={handleConsentAgreed}
        initialConsents={consentRecord}
      />
    </div>
  );
}

export default Registration;
