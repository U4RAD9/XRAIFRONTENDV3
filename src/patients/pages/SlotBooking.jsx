import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, CalendarCheck, User, Users, MapPin, 
  Home as HomeIcon, Clock, Lock, ChevronRight, 
  ShieldCheck, Zap, HeadphonesIcon, Award,
  Phone, ShoppingBag, Plus, X, IndianRupee, Activity, Check, CreditCard
} from 'lucide-react';
import { ToastNotification, showToast } from '../components/ToastNotification';


const CustomSelect = ({ name, value, onChange, options, icon: Icon, placeholder, disabled = false }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value?.toString() === value?.toString());

  return (
    <div className="relative" ref={dropdownRef}>
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <Icon size={18} className="text-[#11A8A4]" />
        </div>
      )}
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`block w-full flex items-center ${Icon ? 'pl-10' : 'pl-3'} pr-10 py-3 border border-gray-200 rounded-xl text-gray-800 bg-white select-none ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer focus:ring-[#11A8A4] focus:border-[#11A8A4] hover:border-gray-300'} transition-colors`}
      >
        <span className={`block w-full truncate ${!selectedOption ? "text-gray-400" : "font-medium"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
      </div>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-10">
        <svg className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto left-0 origin-top">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-gray-400 text-sm text-center">No options available</div>
          ) : (
            options.map((opt, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  onChange({ target: { name, value: opt.value } });
                  setIsOpen(false);
                }}
                className={`px-4 py-3 cursor-pointer transition-colors ${value?.toString() === opt.value?.toString() ? 'bg-[#11A8A4]/10 text-[#11A8A4] font-bold border-l-4 border-[#11A8A4]' : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'}`}
              >
                {opt.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const SlotBooking = () => {
  const [locations, setLocations] = useState([]);
  const [serviceGroups, setServiceGroups] = useState([]);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [bookingItems, setBookingItems] = useState([]);
  
  const [bookingFor, setBookingFor] = useState('me');
  
  const getStoredGender = () => {
    const g = sessionStorage.getItem('Gender');
    if (!g || g === 'null' || g === 'undefined') return '';
    const lower = g.trim().toLowerCase();
    if (lower === 'male' || lower === 'm') return 'Male';
    if (lower === 'female' || lower === 'f') return 'Female';
    return g;
  };

  const [patientData, setPatientData] = useState({
    PatientID: sessionStorage.getItem('UserID') || 1, 
    MobileNumber: sessionStorage.getItem('MobileNumber') || '',
    PatientName: sessionStorage.getItem('FullName') || '',
    Age: sessionStorage.getItem('Age') !== 'null' && sessionStorage.getItem('Age') !== 'undefined' ? sessionStorage.getItem('Age') : '',
    Weight: '',
    Gender: getStoredGender(),
    Address: '',
    Pin: '',
    Email: '',
    AlternativeMobileNumber: ''
  });

  const [bookingData, setBookingData] = useState({
    LocationID: '',
    VisitTypeID: '1',
    VisitDate: new Date().toISOString().split('T')[0],
    SlotID: '',
    PaymentMethod: 'ONLINE',
  });

  const [currentItem, setCurrentItem] = useState({
    SERVICEGROUPID: '',
    SERVICEID: '',
    PRICE: 0
  });

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const navigate = useNavigate();

  const handleBookingForChange = (type) => {
    setBookingFor(type);
    if (type === 'me') {
      setPatientData({
        ...patientData,
        PatientName: sessionStorage.getItem('FullName') || '',
        MobileNumber: sessionStorage.getItem('MobileNumber') || '',
        Age: sessionStorage.getItem('Age') !== 'null' && sessionStorage.getItem('Age') !== 'undefined' ? sessionStorage.getItem('Age') : '',
        Gender: getStoredGender()
      });
    } else {
      setPatientData({
        ...patientData,
        PatientName: '',
        MobileNumber: '',
        Age: '',
        Gender: ''
      });
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const slotsRes = await axiosInstance.get(ENDPOINTS.GET_SLOTS);
        setSlots(slotsRes.data);
      } catch (err) {
        console.error('Error fetching slots:', err);
      }
      
      try {
        const locRes = await axiosInstance.get(ENDPOINTS.LOCATIONS);
        setLocations(locRes.data.filter(l => l.is_active));
      } catch (err) {
        console.error('Error fetching locations:', err);
      }

      try {
        const sgRes = await axiosInstance.get(ENDPOINTS.SERVICE_GROUPS);
        setServiceGroups(sgRes.data.filter(sg => sg.is_active));
      } catch (err) {
        console.error('Error fetching service groups:', err);
      }
    };
    fetchInitialData();
  }, []);

  const handlePatientChange = (e) => {
    setPatientData({ ...patientData, [e.target.name]: e.target.value });
  };

  const handleBookingChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleGroupChange = async (e) => {
    const groupId = e.target.value;
    setCurrentItem({ ...currentItem, SERVICEGROUPID: groupId, SERVICEID: '', PRICE: 0 });
    try {
      const res = await axiosInstance.get(`${ENDPOINTS.GET_SERVICES}?group_id=${groupId}`);
      setServices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleServiceChange = async (e) => {
    const serviceId = e.target.value;
    try {
      const res = await axiosInstance.get(ENDPOINTS.GET_PRICE, {
        params: {
          location_id: bookingData.LocationID,
          service_id: serviceId,
          group_id: currentItem.SERVICEGROUPID,
          visit_type_id: bookingData.VisitTypeID
        }
      });
      const price = res.data[0]?.PRICE || 0;
      setCurrentItem({ ...currentItem, SERVICEID: serviceId, PRICE: price });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddItem = () => {
    if (!currentItem.SERVICEID) {
      showToast('Select a service', 'warning');
      return;
    }
    const serviceName = services.find(s => s.service_id?.toString() === currentItem.SERVICEID?.toString())?.service_name;
    const serviceGroupName = serviceGroups.find(g => g.service_group_id?.toString() === currentItem.SERVICEGROUPID?.toString())?.service_group_name;
    setBookingItems([...bookingItems, { ...currentItem, serviceName, serviceGroupName }]);
    setCurrentItem({ SERVICEGROUPID: '', SERVICEID: '', PRICE: 0 });
  };

  const handleCheckout = () => {
    if (bookingItems.length === 0) {
      showToast("Please add at least one service.", 'warning');
      return;
    }
    setShowCheckoutModal(true);
  };

  const confirmBooking = async () => {
    const totalAmount = bookingItems.reduce((acc, item) => acc + item.PRICE, 0);
    const payload = {
      ...patientData,
      ...bookingData,
      TotalNetAmount: totalAmount,
      slotBookingDetails: bookingItems
    };

    try {
      const res = await axiosInstance.post(ENDPOINTS.SAVE_BOOKING, payload);
      if (res.data.Success) {
        showToast(res.data.Message, 'success');
        setShowCheckoutModal(false);
        navigate('/patient/dashboard');
      } else {
        showToast(res.data.Message, 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to book slot', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] font-sans text-gray-800 pb-12">
      <ToastNotification />
      {/* Header Section */}
      <div className="max-w-5xl mx-auto pt-8 pb-6 2xl:px-4 xl:px-4 lg:px-4 md:px-4 px-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#11A8A4] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#11A8A4]/30">
            <CalendarCheck size={25} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#1E1B4B]">Service Booking</h1>
            <p className="text-gray-500 text-sm mt-1">Book your service in a few simple steps</p>
          </div>
        </div>
        {/* Header Illustration placeholder (hidden on mobile) */}
        <div className="hidden md:flex relative opacity-80">
          <Calendar size={64} className="text-[#11A8A4]/30 absolute -top-4 -right-12 rotate-12" />
          <Clock size={48} className="text-blue-200 absolute top-4 -left-10 -rotate-12" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto 2xl:px-4 xl:px-4 md:px-4 px-2">
        
        {/* Container for timeline and cards */}
        <div className="relative">
          {/* Vertical dashed line for desktop */}
          <div className="hidden md:block absolute left-[30px] top-12 bottom-20 w-[2px] border-l-2 border-dashed border-gray-300 -z-0"></div>

          {/* Section 1: Patient Details */}
          <div className="flex flex-col md:flex-row gap-6 mb-8 relative z-40">
            {/* Timeline Marker */}
            <div className="hidden md:flex flex-col items-center mt-6 w-16 shrink-0 bg-[#F8F9FE]">
              <div className="w-10 h-10 rounded-full bg-[#11A8A4] text-white flex items-center justify-center font-bold text-base shadow-md">01</div>
              <div className="mt-8 bg-[#F8F9FE] p-1">
                <User size={24} className="text-gray-400" />
              </div>
            </div>
            
            {/* Card Content */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-[#11A8A4] font-bold tracking-wide text-sm mb-6 uppercase">Patient Details</h2>
              
              {/* Radio Group */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  onClick={() => handleBookingForChange('me')}
                  className={`flex-1 flex items-center justify-start gap-3 p-4 rounded-xl border ${bookingFor === 'me' ? 'border-[#11A8A4] bg-[#11A8A4]/5' : 'border-gray-200 bg-white'} transition-all`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${bookingFor === 'me' ? 'border-[#11A8A4]' : 'border-gray-300'}`}>
                    {bookingFor === 'me' && <div className="w-2.5 h-2.5 rounded-full bg-[#11A8A4]" />}
                  </div>
                  <div className="bg-[#11A8A4]/20 p-2 rounded-full">
                    <User size={20} className={bookingFor === 'me' ? 'text-[#11A8A4]' : 'text-[#11A8A4]'} />
                  </div>
                  <span className={bookingFor === 'me' ? 'font-semibold text-gray-800' : 'text-gray-600 font-medium'}>Services for me</span>
                </button>
                
                <button 
                  onClick={() => handleBookingForChange('family')}
                  className={`flex-1 flex items-center justify-start gap-3 p-4 rounded-xl border ${bookingFor === 'family' ? 'border-[#11A8A4] bg-[#11A8A4]/5' : 'border-gray-200 bg-white'} transition-all`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${bookingFor === 'family' ? 'border-[#11A8A4]' : 'border-gray-300'}`}>
                    {bookingFor === 'family' && <div className="w-2.5 h-2.5 rounded-full bg-[#11A8A4]" />}
                  </div>
                  <div className="bg-green-50 p-2 rounded-full">
                    <Users size={20} className="text-green-600" />
                  </div>
                  <span className={bookingFor === 'family' ? 'font-semibold text-gray-800' : 'text-gray-600 font-medium'}>Services for Family member</span>
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={18} className="text-[#11A8A4]" />
                    </div>
                    <input placeholder=' phone number' name="MobileNumber" value={patientData.MobileNumber} onChange={handlePatientChange} type="text" className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-[#11A8A4] focus:border-[#11A8A4] text-gray-800" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-[#11A8A4]" />
                    </div>
                    <input placeholder=' patient name' name="PatientName" value={patientData.PatientName} onChange={handlePatientChange} type="text" className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-[#11A8A4] focus:border-[#11A8A4] text-gray-800" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age (Yrs)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-[#11A8A4]" />
                    </div>
                    <input placeholder=' age' name="Age" value={patientData.Age} onChange={handlePatientChange} type="number" className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-[#11A8A4] focus:border-[#11A8A4] text-gray-800" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <CustomSelect 
                      name="Gender" 
                      value={patientData.Gender} 
                      onChange={handlePatientChange} 
                      options={[{value: 'Male', label: 'Male'}, {value: 'Female', label: 'Female'}]} 
                      placeholder="Select Gender" 
                      icon={Users} 
                    />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Service Booking Details */}
          <div className="flex flex-col md:flex-row gap-6 mb-8 relative z-30">
            {/* Timeline Marker */}
            <div className="hidden md:flex flex-col items-center mt-6 w-16 shrink-0 bg-[#F8F9FE]">
              <div className="w-10 h-10 rounded-full bg-[#11A8A4] text-white flex items-center justify-center font-bold text-base shadow-md">02</div>
              <div className="mt-8 bg-[#F8F9FE] p-1">
                <Calendar size={24} className="text-gray-400" />
              </div>
            </div>
            
            {/* Card Content */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-[#11A8A4] font-bold tracking-wide text-sm mb-6 uppercase">Service Booking Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <CustomSelect 
                      name="LocationID" 
                      value={bookingData.LocationID} 
                      onChange={handleBookingChange} 
                      options={locations.map(loc => ({value: loc.location_id, label: loc.location_name}))} 
                      placeholder="-- Please Select Location --" 
                      icon={MapPin} 
                    />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visit Type</label>
                  <CustomSelect 
                      name="VisitTypeID" 
                      value={bookingData.VisitTypeID} 
                      onChange={handleBookingChange} 
                      options={[{value: '1', label: 'Home'}, {value: '2', label: 'Camp'}]} 
                      placeholder="Select Visit Type" 
                      icon={HomeIcon} 
                    />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-[#11A8A4]" />
                    </div>
                    <input name="VisitDate" onChange={handleBookingChange} value={bookingData.VisitDate} type="date" className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-[#11A8A4] focus:border-[#11A8A4] text-gray-800" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slot</label>
                  <CustomSelect 
                      name="SlotID" 
                      value={bookingData.SlotID} 
                      onChange={handleBookingChange} 
                      options={slots.map(s => ({value: s.slot_id, label: s.slot_name}))} 
                      placeholder="-- Please Select Slot --" 
                      icon={Clock} 
                    />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Add Services */}
          <div className="flex flex-col md:flex-row gap-6 mb-8 relative z-20">
            {/* Timeline Marker */}
            <div className="hidden md:flex flex-col items-center mt-6 w-16 shrink-0 bg-[#F8F9FE]">
              <div className="w-10 h-10 rounded-full bg-[#11A8A4] text-white flex items-center justify-center font-bold text-base shadow-md">03</div>
              <div className="mt-8 bg-[#F8F9FE] p-1">
                <ShoppingBag size={24} className="text-gray-400" />
              </div>
            </div>
            
            {/* Card Content */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-[#11A8A4] font-bold tracking-wide text-sm mb-6 uppercase">Add Services</h2>
              
              {/* Form Grid for Add Services */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Group</label>
                  <CustomSelect 
                    name="SERVICEGROUPID" 
                    value={currentItem.SERVICEGROUPID} 
                    onChange={handleGroupChange} 
                    options={serviceGroups.map(g => ({value: g.service_group_id, label: g.service_group_name}))} 
                    placeholder=" Select Group" 
                    icon={Activity}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                  <CustomSelect 
                    name="SERVICEID" 
                    value={currentItem.SERVICEID} 
                    onChange={handleServiceChange} 
                    options={services.map(s => ({value: s.service_id, label: s.service_name}))} 
                    placeholder=" Select Service" 
                    icon={Activity}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Net Payable</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IndianRupee size={18} className="text-[#11A8A4]" />
                    </div>
                    <input type="text" readOnly value={currentItem.PRICE} className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-800 font-medium" />
                  </div>
                </div>
                <div className="flex items-end">
                  <button onClick={handleAddItem} className="w-full flex items-center justify-center gap-2 bg-[#11A8A4] hover:bg-[#0D8885] text-white font-medium py-3 px-4 rounded-xl transition-colors h-[50px]">
                    <Plus size={18} /> Add Service
                  </button>
                </div>
              </div>

              {/* Added Services List */}
              <div className="space-y-3">
                {bookingItems.map((item, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
                    <div className="flex-1 w-full md:w-auto grid grid-cols-1 md:grid-cols-10 gap-4 mb-4 md:mb-0">
                      <div className="col-span-4 text-sm font-medium text-gray-800">
                        <span className="md:hidden text-xs text-gray-500 block mb-1">Group</span>
                        {item.serviceGroupName || `Group ${item.SERVICEGROUPID}`}
                      </div>
                      <div className="col-span-4 text-sm text-gray-600">
                        <span className="md:hidden text-xs text-gray-500 block mb-1">Service</span>
                        {item.serviceName}
                      </div>
                      <div className="col-span-2 text-sm font-bold text-[#1E1B4B]">
                        <span className="md:hidden text-xs text-gray-500 block mb-1">Price</span>
                        ₹{item.PRICE}
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const newItems = [...bookingItems];
                        newItems.splice(idx, 1);
                        setBookingItems(newItems);
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors self-end md:self-auto"
                      title="Remove Service"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout Footer Section */}
          <div className="flex flex-col md:flex-row gap-6 mt-12 relative z-10">
            {/* Empty space for timeline alignment */}
            <div className="hidden md:block w-16 shrink-0"></div>
            
            {/* Checkout Card */}
            <div className="flex-1 bg-gradient-to-r from-[#11A8A4]/10 to-[#11A8A4]/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#11A8A4]/20">
              <div className="flex items-center gap-6">
                <div className="w-16 h-20 bg-white rounded-lg shadow-sm border border-[#11A8A4]/20 flex flex-col justify-center items-center gap-2 p-2">
                  <div className="flex items-center gap-2 text-[#11A8A4] w-full"><div className="w-3 h-3 rounded bg-[#11A8A4]/30 flex-shrink-0 relative"><Check size={10} className="text-[#11A8A4] absolute -top-0.5 -right-0.5"/></div> <div className="h-1.5 bg-gray-200 rounded w-full"></div></div>
                  <div className="flex items-center gap-2 text-[#11A8A4] w-full"><div className="w-3 h-3 rounded bg-[#11A8A4]/30 flex-shrink-0 relative"><Check size={10} className="text-[#11A8A4] absolute -top-0.5 -right-0.5"/></div> <div className="h-1.5 bg-gray-200 rounded w-full"></div></div>
                  <div className="flex items-center gap-2 text-[#11A8A4] w-full"><div className="w-3 h-3 rounded bg-[#11A8A4]/30 flex-shrink-0 relative"><Check size={10} className="text-[#11A8A4] absolute -top-0.5 -right-0.5"/></div> <div className="h-1.5 bg-gray-200 rounded w-full"></div></div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1E1B4B] mb-1">All set to go!</h3>
                  <p className="text-gray-600 text-sm max-w-md">Please review all the details above and proceed to checkout to confirm your booking.</p>
                </div>
              </div>
              <button onClick={handleCheckout} className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#11A8A4] hover:bg-[#0D8885] text-white font-medium py-4 px-8 rounded-xl shadow-lg shadow-[#11A8A4]/30 transition-all hover:scale-105 active:scale-95">
                <Lock size={18} />
                <span className="text-lg">Checkout</span>
                <ChevronRight size={18} className="ml-2" />
              </button>
            </div>
          </div>
        </div>



      </div>

      {showCheckoutModal && (
        <div className="fixed inset-0 bg-[#1E1B4B]/50 backdrop-blur-sm flex items-center justify-center p-2 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-2xl font-bold text-[#1E1B4B]">Booking Summary</h3>
              <button onClick={() => setShowCheckoutModal(false)} className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <span className="block text-gray-500 mb-1">Patient Name</span>
                  <strong className="text-gray-800">{patientData.PatientName || 'N/A'}</strong>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <span className="block text-gray-500 mb-1">Phone</span>
                  <strong className="text-gray-800">{patientData.MobileNumber || 'N/A'}</strong>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <span className="block text-gray-500 mb-1">Visit Date</span>
                  <strong className="text-gray-800">{bookingData.VisitDate}</strong>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <span className="block text-gray-500 mb-1">Payment Mode</span>
                  <CustomSelect 
                    name="PaymentMethod" 
                    value={bookingData.PaymentMethod} 
                    onChange={handleBookingChange} 
                    options={[{value: 'Select Payment Method', label: 'Select Payment Method'},{value: 'Online Payment', label: 'Online Payment'}, {value: 'Cash on Delivery', label: 'Cash on Delivery'}]} 
                    placeholder="Select Payment Mode" 
                    icon={CreditCard} 
                  />
                </div>
              </div>
              
              <h4 className="font-bold text-[#1E1B4B] mb-3">Selected Services</h4>
              <ul className="mb-6 space-y-3">
                {bookingItems.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-[#11A8A4]/10/50 p-3 rounded-lg border border-[#11A8A4]/20">
                    <span className="font-medium text-gray-800">{item.serviceName}</span>
                    <span className="font-bold text-[#11A8A4]">₹{item.PRICE}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex justify-between items-center text-xl font-bold p-5 bg-[#F8F9FE] rounded-xl border border-gray-200">
                <span className="text-gray-800">Total Amount:</span>
                <span className="text-[#11A8A4]">₹{bookingItems.reduce((acc, item) => acc + item.PRICE, 0)}</span>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button onClick={() => setShowCheckoutModal(false)} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-6 rounded-xl transition-colors">Cancel</button>
              <button onClick={confirmBooking} className="bg-[#11A8A4] hover:bg-[#0D8885] text-white font-semibold py-2.5 px-8 rounded-xl shadow-md transition-colors">Confirm & Book</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotBooking;

