import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINTS } from '../../api/endpoints';

const ruralAxios = axios.create();

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'RH+'];
const GENDERS = ['MALE', 'FEMALE', 'OTHER'];
const RELATIONSHIPS = ['HEAD', 'SPOUSE', 'SON', 'DAUGHTER', 'FATHER', 'MOTHER', 'BROTHER', 'SISTER', 'OTHER'];
const MARITAL_STATUS = ['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'];
const SOCIAL_CATEGORIES = ['GENERAL', 'OBC', 'SC', 'ST', 'OTHER'];

const calcAge = (dob) => {
  if (!dob) return '';
  const d = new Date(dob);
  if (isNaN(d.getTime())) return '';
  const diff = Date.now() - d.getTime();
  const ageDt = new Date(diff);
  return String(Math.abs(ageDt.getUTCFullYear() - 1970));
};

const emptyMember = (relationship = 'SON') => ({
  first_name: '',
  middle_name: '',
  last_name: '',
  date_of_birth: '',
  age: '',
  gender: 'MALE',
  relationship,
  mobile: '',
  alternate_mobile: '',
  email: '',
  blood_group: '',
  marital_status: 'SINGLE',
  education: '',
  occupation: '',
  annual_income: '',
  social_category: 'GENERAL',
  is_primary_contact: false,
  photo: null,
  photoPreview: '',
});

function ChannelPartnerRegistration() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPackage = location.state?.selectedPackage || null;

  const [family, setFamily] = useState({
    primary_mobile: '',
    loan_number: '',
    address_line_1: '',
    address_line_2: '',
    village: '',
    gram_panchayat: '',
    block: '',
    district: '',
    state: '',
    pincode: '',
  });

  const [head, setHead] = useState(emptyMember('HEAD'));
  const [headExtra, setHeadExtra] = useState({ is_primary_contact: true });
  const [members, setMembers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const getToken = () => (sessionStorage.getItem('Token') || '').trim();

  const postWithAuthFallback = async (url, data, extraHeaders = {}) => {
    const token = getToken();
    if (!token) throw new Error('No Token in sessionStorage');
    const proxiedUrl = url.replace('https://cbackend.xraidigital.com', '/cbackend');
    const isFormData = extraHeaders['Content-Type'] === 'multipart/form-data';
    // Primary is Token <hex> as confirmed working for packages with same token
    try {
      return await ruralAxios.post(url, data, {
        headers: { Authorization: `Token ${token}`, ...extraHeaders },
      });
    } catch (err) {
      const rdata = err?.response?.data;
      const detail = String(rdata?.detail||'').toLowerCase();
      const isTokenInvalid = rdata?.code === 'token_not_valid' || detail.includes('token not valid');
      const isNoCreds = detail.includes('authentication credentials were not provided');
      if (isTokenInvalid) {
        console.warn('[Rural] Token header failed, retrying Bearer', rdata);
        return await ruralAxios.post(url, data, {
          headers: { Authorization: `Bearer ${token}`, ...extraHeaders },
        });
      }
      if (isNoCreds) {
        console.warn('[Rural] Credentials not provided - retry via vite proxy', url);
        // Retry via proxy to bypass CORS header stripping
        return await ruralAxios.post(proxiedUrl, data, {
          headers: { Authorization: `Token ${token}`, ...extraHeaders },
        });
      }
      throw err;
    }
  };

  const handleFamilyChange = (e) => setFamily({ ...family, [e.target.name]: e.target.value });

  const handleHeadChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const file = files[0] || null;
      setHead({ ...head, photo: file, photoPreview: file ? URL.createObjectURL(file) : '' });
    } else if (type === 'checkbox') {
      setHeadExtra({ ...headExtra, [name]: checked });
    } else if (name === 'date_of_birth') {
      setHead({ ...head, date_of_birth: value, age: calcAge(value) });
    } else {
      setHead({ ...head, [name]: value });
    }
  };

  const handleMemberChange = (idx, e) => {
    const { name, value, type, checked, files } = e.target;
    const updated = [...members];
    if (type === 'file') {
      const file = files[0] || null;
      updated[idx] = { ...updated[idx], photo: file, photoPreview: file ? URL.createObjectURL(file) : '' };
    } else if (type === 'checkbox') {
      updated[idx] = { ...updated[idx], [name]: checked };
    } else if (name === 'date_of_birth') {
      updated[idx] = { ...updated[idx], date_of_birth: value, age: calcAge(value) };
    } else {
      updated[idx] = { ...updated[idx], [name]: value };
    }
    setMembers(updated);
  };

  const addMember = () => setMembers([...members, emptyMember('SON')]);
  const removeMember = (idx) => setMembers(members.filter((_, i) => i !== idx));

  const validate = () => {
    if (!head.first_name || !head.last_name || !head.date_of_birth || !head.age || !head.gender || !head.mobile) {
      alert('Please fill required Family Head fields: First Name, Last Name, DOB, Age, Gender, Mobile.');
      return false;
    }
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.first_name || !m.last_name || !m.date_of_birth || !m.age) {
        alert(`Please fill First Name, Last Name, DOB and Age for Member #${i + 1}.`);
        return false;
      }
    }
    return true;
  };

  const buildMemberFormData = (familyId, memberData, extra = {}) => {
    const fd = new FormData();
    fd.append('family', String(familyId));
    fd.append('first_name', memberData.first_name);
    if (memberData.middle_name) fd.append('middle_name', memberData.middle_name);
    fd.append('last_name', memberData.last_name);
    fd.append('date_of_birth', memberData.date_of_birth);
    if (memberData.age) fd.append('age', String(memberData.age));
    fd.append('gender', memberData.gender);
    fd.append('relationship', memberData.relationship);
    if (memberData.mobile) fd.append('mobile', memberData.mobile);
    if (memberData.alternate_mobile) fd.append('alternate_mobile', memberData.alternate_mobile);
    if (memberData.email) fd.append('email', memberData.email);
    if (memberData.blood_group) fd.append('blood_group', memberData.blood_group);
    if (memberData.marital_status) fd.append('marital_status', memberData.marital_status);
    if (memberData.education) fd.append('education', memberData.education);
    if (memberData.occupation) fd.append('occupation', memberData.occupation);
    if (memberData.annual_income) fd.append('annual_income', String(memberData.annual_income));
    if (memberData.social_category) fd.append('social_category', memberData.social_category);
    fd.append('is_primary_contact', String(extra.is_primary_contact ?? memberData.is_primary_contact ?? false));
    if (memberData.photo) fd.append('photo', memberData.photo);
    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const curToken = getToken();
    if (!curToken) {
      alert('Session token missing. Please re-login.');
      navigate('/login');
      return;
    }

    setSubmitting(true);
    setResult(null);
    try {
      // 1) Create Family - include package id to satisfy backend perform_create: package.client_id check
      if (!selectedPackage?.id) {
        alert('No package selected. Please select a package first.');
        return;
      }
      const familyPayload = {
        package: Number(selectedPackage.id),
        primary_mobile: family.primary_mobile,
        loan_number: family.loan_number,
        address_line_1: family.address_line_1,
        address_line_2: family.address_line_2,
        village: family.village,
        gram_panchayat: family.gram_panchayat,
        block: family.block,
        district: family.district,
        state: family.state,
        pincode: family.pincode,
      };

      const famRes = await postWithAuthFallback(ENDPOINTS.RURAL_FAMILIES, familyPayload, { 'Content-Type': 'application/json' });
      const famData = famRes.data;
      const familyId = famData.id || famData.family_id;
      // Backend may return numeric id and family_id string; we need numeric id for members
      const numericFamilyId = famData.id;

      if (!numericFamilyId) throw new Error('Family creation did not return id');

      // 2) Create Family Head
      const headFd = buildMemberFormData(numericFamilyId, { ...head, relationship: 'HEAD' }, { is_primary_contact: true });
      const headRes = await postWithAuthFallback(ENDPOINTS.RURAL_MEMBERS, headFd, { 'Content-Type': 'multipart/form-data' });

      // 3) Create Additional Members
      const memberResults = [];
      for (let i = 0; i < members.length; i++) {
        const m = members[i];
        if (!m.first_name || !m.last_name || !m.date_of_birth) {
          // skip incomplete member but warn
          continue;
        }
        const fd = buildMemberFormData(numericFamilyId, m, { is_primary_contact: false });
        const r = await postWithAuthFallback(ENDPOINTS.RURAL_MEMBERS, fd, { 'Content-Type': 'multipart/form-data' });
        memberResults.push(r.data);
      }

      setResult({
        family: famData,
        head: headRes.data,
        members: memberResults,
        selectedPackage,
      });

      // Optionally reset form? Keep data for review
      alert(`Registration successful! Family ${famData.family_id || famData.id} created with ${1 + memberResults.length} members.`);
    } catch (err) {
      console.error(err);
      const detail = err?.response?.data;
      let msg = 'Registration failed';
      if (detail) {
        if (typeof detail === 'string') msg = detail;
        else if (detail.detail) msg = detail.detail;
        else msg = JSON.stringify(detail);
      } else if (err.message) msg = err.message;
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!selectedPackage) {
    return (
      <div className="w-full space-y-6">
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-xl">
          <p className="font-semibold"><i className="fas fa-exclamation-triangle mr-2"></i>No package selected</p>
          <p className="text-sm mt-1">Please select a package first to proceed with registration. The package will be linked to this registration.</p>
        </div>
        <button onClick={() => navigate('/channel-partner/registration')} className="cursor-pointer bg-[#11A8A4] hover:bg-[#0e8c89] text-white font-bold px-6 py-3 rounded-xl">
          <i className="fas fa-box mr-2"></i> Browse Packages
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Selected Package Banner */}
      <div className="bg-gradient-to-r from-[#233560] to-[#11A8A4] rounded-2xl p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest opacity-80 font-semibold">Selected Package</p>
          <h3 className="text-xl font-bold mt-1">{selectedPackage.name} <span className="font-normal text-white/80 text-sm">(ID: {selectedPackage.id})</span></h3>
          <p className="text-sm text-white/90 mt-1">₹{selectedPackage.price} • {selectedPackage.service_ids?.length} services • {selectedPackage.report_language} • {selectedPackage.start_date} → {selectedPackage.end_date}</p>
        </div>
        <button onClick={() => navigate('/channel-partner/registration')} className="cursor-pointer bg-white text-[#233560] px-5 py-2 rounded-xl font-bold text-sm hover:bg-gray-100 shrink-0">
          Change Package
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Family Address */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><i className="fas fa-home text-[#11A8A4]"></i> Family Address</h3>
          <p className="text-sm text-gray-500 mt-1">These fields create the family record. Backend will generate <code>family_id</code>.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Loan Number</label>
              <input name="loan_number" value={family.loan_number} onChange={handleFamilyChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#11A8A4]" placeholder="LN-123456" />
            </div>
            {/* <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Mobile <span className="text-red-500">*</span></label>
              <input name="primary_mobile" value={family.primary_mobile} onChange={handleFamilyChange} required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#11A8A4]" placeholder="9876543210" />
            </div> */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Pincode <span className="text-red-500">*</span></label>
              <input name="pincode" value={family.pincode} onChange={handleFamilyChange} required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#11A8A4]" placeholder="412205" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Address Line 1</label>
              <input name="address_line_1" value={family.address_line_1} onChange={handleFamilyChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#11A8A4]" placeholder="House No. 25" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Address Line 2</label>
              <input name="address_line_2" value={family.address_line_2} onChange={handleFamilyChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#11A8A4]" placeholder="Near Primary School" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Village <span className="text-red-500">*</span></label>
              <input name="village" value={family.village} onChange={handleFamilyChange} required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#11A8A4]" placeholder="Rampur" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Gram Panchayat</label>
              <input name="gram_panchayat" value={family.gram_panchayat} onChange={handleFamilyChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#11A8A4]" placeholder="Rampur Gram Panchayat" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Block</label>
              <input name="block" value={family.block} onChange={handleFamilyChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#11A8A4]" placeholder="Khandala" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">District <span className="text-red-500">*</span></label>
              <input name="district" value={family.district} onChange={handleFamilyChange} required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#11A8A4]" placeholder="Pune" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">State <span className="text-red-500">*</span></label>
              <input name="state" value={family.state} onChange={handleFamilyChange} required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#11A8A4]" placeholder="Maharashtra" />
            </div>
          </div>
        </div>

        {/* Family Head */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><i className="fas fa-user-crown text-[#11A8A4]"></i> Family Head <span className="text-xs font-normal text-gray-500">(relationship = HEAD, is_primary_contact = true)</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
              <input name="first_name" value={head.first_name} onChange={handleHeadChange} required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#11A8A4]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Middle Name</label>
              <input name="middle_name" value={head.middle_name} onChange={handleHeadChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#11A8A4]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
              <input name="last_name" value={head.last_name} onChange={handleHeadChange} required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#11A8A4]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth <span className="text-red-500">*</span></label>
              <input type="date" name="date_of_birth" value={head.date_of_birth} onChange={handleHeadChange} required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#11A8A4]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Age <span className="text-red-500">*</span></label>
              <input type="number" name="age" value={head.age} onChange={handleHeadChange} required min="0" max="120" placeholder="Auto from DOB" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#11A8A4]" />
              <p className="text-xs text-gray-400 mt-1">Auto-calculated from DOB, editable</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Gender <span className="text-red-500">*</span></label>
              <select name="gender" value={head.gender} onChange={handleHeadChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-[#11A8A4]">
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            {/* <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Blood Group</label>
              <select name="blood_group" value={head.blood_group} onChange={handleHeadChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-[#11A8A4]">
                <option value="">Select</option>
                {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div> */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile <span className="text-red-500">*</span></label>
              <input name="mobile" value={head.mobile} onChange={handleHeadChange} required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#11A8A4]" placeholder="9876543210" />
            </div>
            {/* <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Alternate Mobile</label>
              <input name="alternate_mobile" value={head.alternate_mobile} onChange={handleHeadChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#11A8A4]" />
            </div> */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={head.email} onChange={handleHeadChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#11A8A4]" placeholder="ramesh@example.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Marital Status</label>
              <select name="marital_status" value={head.marital_status} onChange={handleHeadChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-[#11A8A4]">
                {MARITAL_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {/* <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Education</label>
              <input name="education" value={head.education} onChange={handleHeadChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#11A8A4]" placeholder="Graduate" />
            </div> */}
            {/* <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Occupation</label>
              <input name="occupation" value={head.occupation} onChange={handleHeadChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#11A8A4]" placeholder="Farmer" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Annual Income</label>
              <input type="number" name="annual_income" value={head.annual_income} onChange={handleHeadChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#11A8A4]" placeholder="250000" />
            </div> */}
            {/* <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Social Category</label>
              <select name="social_category" value={head.social_category} onChange={handleHeadChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-[#11A8A4]">
                {SOCIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div> */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Photo</label>
              <input type="file" name="photo" accept="image/*" onChange={handleHeadChange} className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-white focus:outline-none focus:border-[#11A8A4]" />
              {head.photoPreview && <img src={head.photoPreview} alt="preview" className="mt-2 h-16 w-16 rounded-lg object-cover border" />}
            </div>
          </div>
        </div>

        {/* Additional Members */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><i className="fas fa-users text-[#11A8A4]"></i> Family Members <span className="text-xs font-normal text-gray-500">({members.length} added)</span></h3>
            <button type="button" onClick={addMember} className="cursor-pointer bg-[#11A8A4] hover:bg-[#0e8c89] text-white font-semibold px-4 py-2 rounded-xl text-sm flex items-center gap-2">
              <i className="fas fa-plus"></i> Add Member
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Add spouse, son, daughter, etc. Each will be posted as <code>multipart/form-data</code> to <code>/members/</code> with <code>family = &lt;id&gt;</code>.</p>

          {members.length === 0 ? (
            <div className="mt-6 border border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-400">
              <i className="fas fa-user-friends text-2xl mb-2"></i>
              <p className="text-sm">No additional members yet. Click “Add Member” to add.</p>
            </div>
          ) : (
            <div className="space-y-6 mt-6">
              {members.map((m, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl p-5 bg-gray-50/50">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-gray-800">Member #{idx + 1}</h4>
                    <button type="button" onClick={() => removeMember(idx)} className="cursor-pointer text-red-500 hover:text-red-700 text-sm font-semibold flex items-center gap-1">
                      <i className="fas fa-trash"></i> Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">First Name *</label>
                      <input name="first_name" value={m.first_name} onChange={(e) => handleMemberChange(idx, e)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#11A8A4] bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Middle Name</label>
                      <input name="middle_name" value={m.middle_name} onChange={(e) => handleMemberChange(idx, e)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#11A8A4] bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name *</label>
                      <input name="last_name" value={m.last_name} onChange={(e) => handleMemberChange(idx, e)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#11A8A4] bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">DOB *</label>
                      <input type="date" name="date_of_birth" value={m.date_of_birth} onChange={(e) => handleMemberChange(idx, e)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#11A8A4] bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Age *</label>
                      <input type="number" name="age" value={m.age} onChange={(e) => handleMemberChange(idx, e)} required min="0" max="120" placeholder="Auto from DOB" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#11A8A4] bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Gender *</label>
                      <select name="gender" value={m.gender} onChange={(e) => handleMemberChange(idx, e)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white">
                        {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Relationship *</label>
                      <select name="relationship" value={m.relationship} onChange={(e) => handleMemberChange(idx, e)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white">
                        {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile</label>
                      <input name="mobile" value={m.mobile} onChange={(e) => handleMemberChange(idx, e)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white" />
                    </div>
                    {/* <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Blood Group</label>
                      <select name="blood_group" value={m.blood_group} onChange={(e) => handleMemberChange(idx, e)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white">
                        <option value="">Select</option>
                        {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div> */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Photo</label>
                      <input type="file" name="photo" accept="image/*" onChange={(e) => handleMemberChange(idx, e)} className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-white text-sm" />
                      {m.photoPreview && <img src={m.photoPreview} alt="preview" className="mt-2 h-14 w-14 rounded-lg object-cover border" />}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Marital Status</label>
                      <select name="marital_status" value={m.marital_status} onChange={(e) => handleMemberChange(idx, e)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white">
                        {MARITAL_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    {/* <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Education</label>
                      <input name="education" value={m.education} onChange={(e) => handleMemberChange(idx, e)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Occupation</label>
                      <input name="occupation" value={m.occupation} onChange={(e) => handleMemberChange(idx, e)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Annual Income</label>
                      <input type="number" name="annual_income" value={m.annual_income} onChange={(e) => handleMemberChange(idx, e)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Social Category</label>
                      <select name="social_category" value={m.social_category} onChange={(e) => handleMemberChange(idx, e)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white">
                        {SOCIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div> */}
                    {/* <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                      <input type="email" name="email" value={m.email} onChange={(e) => handleMemberChange(idx, e)} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-white" />
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button type="button" onClick={() => navigate('/channel-partner/registration')} className="cursor-pointer flex-1 bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50">
            Back to Packages
          </button>
          <button type="submit" disabled={submitting} className={`cursor-pointer flex-1 bg-gradient-to-r from-[#233560] to-[#11A8A4] text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}>
            {submitting ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</> : <><i className="fas fa-paper-plane"></i> Complete Registration</>}
          </button>
        </div>
      </form>

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <h3 className="text-green-800 font-bold flex items-center gap-2"><i className="fas fa-check-circle"></i> Registration Complete</h3>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-500">Family:</span> <span className="font-bold text-gray-800">{result.family.family_id || result.family.id} (ID: {result.family.id})</span></div>
            <div><span className="text-gray-500">Head:</span> <span className="font-bold text-gray-800">{result.head.member_id || result.head.id} - {result.head.first_name} {result.head.last_name}</span></div>
            <div><span className="text-gray-500">Members created:</span> <span className="font-bold text-gray-800">{1 + (result.members?.length || 0)}</span></div>
            <div><span className="text-gray-500">Package:</span> <span className="font-bold text-gray-800">{result.selectedPackage?.name} (₹{result.selectedPackage?.price})</span></div>
          </div>
          <pre className="mt-4 bg-white border border-green-100 rounded-xl p-4 text-xs overflow-auto max-h-60">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default ChannelPartnerRegistration;
