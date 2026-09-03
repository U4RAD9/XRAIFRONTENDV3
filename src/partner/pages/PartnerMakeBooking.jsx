import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';

function PartnerMakeBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const passedPatient = location.state?.patient;

  const getStoredGender = () => {
    const g = sessionStorage.getItem('Gender');
    if (!g || g === 'null' || g === 'undefined') return '';
    const lower = g.trim().toLowerCase();
    if (lower === 'male' || lower === 'm') return 'Male';
    if (lower === 'female' || lower === 'f') return 'Female';
    return g;
  };

  const [selectedPatientForBooking, setSelectedPatientForBooking] = useState({
    patient_id: passedPatient?.id || sessionStorage.getItem('UserID') || '',
    alternate_mobile_number: passedPatient?.contactNo || sessionStorage.getItem('MobileNumber') || '',
    patient_name: passedPatient?.patientName || sessionStorage.getItem('FullName') || '',
    age: passedPatient?.age && passedPatient.age !== 'N/A' ? passedPatient.age : (sessionStorage.getItem('Age') !== 'null' && sessionStorage.getItem('Age') !== 'undefined' ? sessionStorage.getItem('Age') : ''),
    weight: passedPatient?.weight && passedPatient.weight !== 'N/A' ? passedPatient.weight : '',
    gender: passedPatient?.gender && passedPatient.gender !== 'N/A' ? passedPatient.gender : getStoredGender(),
    address: passedPatient?.address && passedPatient.address !== 'N/A' ? passedPatient.address : '',
    pin: passedPatient?.pin && passedPatient.pin !== 'N/A' ? passedPatient.pin : '',
    email: passedPatient?.email && passedPatient.email !== 'N/A' ? passedPatient.email : ''
  });

  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [paymentMode, setPaymentMode] = useState('ONLINE');
  const [bookingAddress, setBookingAddress] = useState(selectedPatientForBooking.address || '');
  
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [serviceItems, setServiceItems] = useState([]);
  const [currentService, setCurrentService] = useState({
    service: '', bodyPart: '', price: '', netPayable: ''
  });

  const [apiLocations, setApiLocations] = useState([]);
  const [apiSlots, setApiSlots] = useState([]);
  const [apiServiceGroups, setApiServiceGroups] = useState([]);
  const [allApiServices, setAllApiServices] = useState([]);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [locationsRes, slotsRes, groupsRes, servicesRes] = await Promise.all([
          axiosInstance.get(ENDPOINTS.LOCATIONS).catch(() => ({ data: [] })),
          axiosInstance.get(ENDPOINTS.GET_SLOTS).catch(() => ({ data: [] })),
          axiosInstance.get(ENDPOINTS.SERVICE_GROUPS).catch(() => ({ data: [] })),
          axiosInstance.get(ENDPOINTS.SERVICES).catch(() => ({ data: [] }))
        ]);
        const getArrayData = (res) => {
          if (Array.isArray(res.data)) return res.data;
          if (res.data && Array.isArray(res.data.results)) return res.data.results;
          if (res.data && Array.isArray(res.data.result)) return res.data.result;
          return [];
        };
        
        setApiLocations(getArrayData(locationsRes).filter(x => x.is_active !== false));
        setApiSlots(getArrayData(slotsRes).filter(x => x.is_active !== false));
        setApiServiceGroups(getArrayData(groupsRes).filter(x => x.is_active !== false));
        setAllApiServices(getArrayData(servicesRes).filter(x => x.is_active !== false));
      } catch (err) {
        console.error('Error fetching master data:', err);
      }
    };
    fetchMasterData();
  }, []);

  useEffect(() => {
    if (selectedPatientForBooking && selectedPatientForBooking.patient_id && apiLocations.length > 0 && apiSlots.length > 0) {
      const fetchLastBooking = async () => {
        try {
          const resp = await axiosInstance.get(ENDPOINTS.LAST_BOOKING, { params: { patient_id: selectedPatientForBooking.patient_id } });
          if (resp.data.Success) {
            const lastBooking = resp.data.Booking;
            
            let locId = lastBooking.location_id;
            if (!locId && lastBooking.location_name) {
              const match = apiLocations.find(l => l.location_name === lastBooking.location_name);
              if (match) locId = match.location_id;
            }
            if (locId) setSelectedLocation(locId);

            let sltId = lastBooking.slot_id;
            if (!sltId && lastBooking.slot_name) {
              const match = apiSlots.find(s => s.slot_name === lastBooking.slot_name);
              if (match) sltId = match.slot_id;
            }
            if (sltId) setSelectedSlot(sltId);

            if (lastBooking.date) setVisitDate(lastBooking.date);
            if (lastBooking.payment_method) setPaymentMode(lastBooking.payment_method);
            if (lastBooking.address) setBookingAddress(lastBooking.address);
            
            if (lastBooking.services && lastBooking.services.length > 0) {
              const formattedServices = lastBooking.services.map(s => ({
                service: s.service_group_id,
                bodyPart: s.service_id,
                price: s.price,
                serviceName: s.service_group_name,
                bodyPartName: s.service_name
              }));
              setServiceItems(formattedServices);
            }
          }
        } catch (err) {
          console.log("No previous booking found or error fetching it.");
        }
      };
      fetchLastBooking();
    }
  }, [selectedPatientForBooking.patient_id, apiLocations, apiSlots]);

  const [showCameraModal, setShowCameraModal] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [prescriptionFile, setPrescriptionFile] = useState(null);

  const handleGroupChange = (e) => {
    setCurrentService({ ...currentService, service: e.target.value, bodyPart: '', price: '', netPayable: '' });
  };

  const handleServiceChange = async (e) => {
    const serviceId = e.target.value;
    try {
      const res = await axiosInstance.get(ENDPOINTS.GET_PRICE, {
        params: {
          location_id: selectedLocation,
          service_id: serviceId,
          group_id: currentService.service,
          visit_type_id: 1 // default to 1 as visit type is hardcoded to "Home" in UI
        }
      });
      const price = res.data?.Price || (serviceId === '1' ? 500 : (serviceId === '2' ? 800 : 1200));
      setCurrentService({ ...currentService, bodyPart: serviceId, price: price, netPayable: price });
    } catch (err) {
      console.error(err);
      setCurrentService({ ...currentService, bodyPart: serviceId, price: '', netPayable: '' });
    }
  };

  const handleAddService = () => {
    if (currentService.service && currentService.bodyPart) {
      const groupObj = apiServiceGroups.find(g => g.service_group_id?.toString() === currentService.service.toString());
      const svcObj = allApiServices.find(s => s.service_id?.toString() === currentService.bodyPart.toString());
      
      setServiceItems([...serviceItems, {
        ...currentService,
        serviceName: groupObj ? groupObj.service_group_name : currentService.service,
        bodyPartName: svcObj ? svcObj.service_name : currentService.bodyPart
      }]);
      setCurrentService({ service: '', bodyPart: '', price: '', netPayable: '' });
    }
  };

  const startCamera = async () => {
    setShowCameraModal(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access camera.");
      setShowCameraModal(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      const photoDataUrl = canvas.toDataURL('image/jpeg');
      setCapturedPhoto(photoDataUrl);
      closeCamera();
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCameraModal(false);
  };

  const handleCheckoutSubmit = async () => {
    if (paymentMode === 'ONLINE') {
      alert("Redirecting to payment page (placeholder)...");
      setShowConsentModal(false);
      setConsentChecked(false);
      return;
    }

    try {
      const payload = {
        user_id: sessionStorage.getItem('UserID'),
        patient_id: selectedPatientForBooking.patient_id,
        location_id: selectedLocation,
        slot_id: selectedSlot,
        date: visitDate,
        address: bookingAddress,
        payment_method: paymentMode,
        payment_status: 'Unpaid',
        consent_given: consentChecked,
        services: serviceItems.map(item => ({
          service_id: item.bodyPart,
          price: item.price
        }))
      };

      const response = await axiosInstance.post(ENDPOINTS.SAVE_BOOKING, payload);
      if (response.data.Success === true) {
        const bookingId = response.data.BookingID;
        
        if (prescriptionFile || capturedPhoto) {
          try {
            const formData = new FormData();
            if (prescriptionFile) {
              formData.append('file', prescriptionFile);
            } else if (capturedPhoto) {
              const res = await fetch(capturedPhoto);
              const blob = await res.blob();
              formData.append('file', blob, 'captured_photo.jpg');
            }
            await axiosInstance.post(`${ENDPOINTS.UPLOAD_PRESCRIPTION}/${bookingId}`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
          } catch (uploadErr) {
            console.error("Error uploading file:", uploadErr);
          }
        }

        alert("Booking successful!");
        setShowConsentModal(false);
        setConsentChecked(false);
        navigate(-1);
      } else {
        alert("Failed to create booking: " + response.data.Message);
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("An error occurred while creating booking.");
    }
  };

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-700 font-medium flex items-center transition-colors cursor-pointer"
        >
          <i className="fas fa-arrow-left mr-2"></i>
            <span className="text-[#00acc1] px-1"> Make Booking </span><span> / Book Slot</span>
        </button>
      </div>

      {/* Patient Detail Card */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-lg font-bold text-gray-800">Patient Detail</h3>
          <button className="bg-[#b0008e] hover:bg-[#8e0072] text-white px-4 py-2 rounded text-sm font-semibold flex items-center shadow-sm transition-colors cursor-pointer">
            <i className="fas fa-phone-alt mr-2"></i> CALL TO XRAI FOR HELP/ASSISTANCE
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm text-gray-700">
          <div className="space-y-3">
            <p><span className="font-semibold w-32 inline-block">Phone Number:</span> {selectedPatientForBooking.alternate_mobile_number || 'N/A'}</p>
            <p><span className="font-semibold w-32 inline-block">Patient Name:</span> {selectedPatientForBooking.patient_name || 'N/A'}</p>
            <p><span className="font-semibold w-32 inline-block">Weight:</span> {selectedPatientForBooking.weight || 'N/A'}</p>
            <p><span className="font-semibold w-32 inline-block">Address:</span> {selectedPatientForBooking.address || 'N/A'}</p>
            <p><span className="font-semibold w-32 inline-block">Email:</span> {selectedPatientForBooking.email || 'N/A'}</p>
          </div>
          <div className="space-y-3">
            <p><span className="font-semibold w-40 inline-block">Age:</span> {selectedPatientForBooking.age || 'N/A'}</p>
            <p><span className="font-semibold w-40 inline-block">Gender:</span> {selectedPatientForBooking.gender || 'N/A'}</p>
            <p><span className="font-semibold w-40 inline-block">Pin:</span> {selectedPatientForBooking.pin || 'N/A'}</p>
            <p><span className="font-semibold w-40 inline-block">Alternate Number:</span> {selectedPatientForBooking.alternate_mobile_number || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Service Booking Card */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Service Booking</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Location</label>
            <select 
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00acc1] bg-white"
            >
              <option value="">-- Please Select Location --</option>
              {apiLocations.map(loc => (
                <option key={loc.location_id} value={loc.location_id}>{loc.location_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Visit Type</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00acc1] bg-white">
              <option value="Home">Home</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Visit Date</label>
            <input 
              type="date" 
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00acc1]" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Slot</label>
            <select 
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              className="w-full border border-[#f48fb1] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00acc1] bg-white"
            >
              <option value="">-- Please Select Slot --</option>
              {apiSlots.map(slot => (
                <option key={slot.slot_id} value={slot.slot_id}>{slot.slot_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Payment Mode</label>
            <select 
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00acc1] bg-white"
            >
              <option value="ONLINE">ONLINE</option>
              <option value="Pay At Home">Pay At Home</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Upload Prescription</label>
            <div className="flex">
              <label className="bg-gray-100 border border-gray-300 text-gray-600 px-3 py-2 text-sm rounded-l cursor-pointer hover:bg-gray-200 whitespace-nowrap">
                Choose File
                <input type="file" className="hidden" onChange={(e) => setPrescriptionFile(e.target.files[0])} />
              </label>
              <span className="border border-l-0 border-gray-300 px-3 py-2 text-sm text-gray-400 bg-white rounded-r flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {prescriptionFile ? prescriptionFile.name : "No file chosen"}
              </span>
            </div>
            
            {capturedPhoto && (
              <div className="mt-3 flex items-center justify-between bg-white border border-gray-200 p-2 rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                  <img src={capturedPhoto} alt="Captured" className="w-[60px] h-[60px] object-cover rounded shadow-sm border border-gray-200" />
                  <span className="text-gray-700 text-sm font-semibold">Captured Photo</span>
                </div>
                <button onClick={() => setCapturedPhoto(null)} className="text-red-500 hover:text-red-700 mr-2 cursor-pointer" title="Remove">
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            )}

            <button onClick={startCamera} className="mt-3 bg-[#00acc1] hover:bg-[#008ba3] text-white w-full py-2 rounded text-sm font-semibold flex items-center justify-center transition-colors shadow-sm cursor-pointer">
              <i className="fas fa-camera mr-2"></i> CLICK A PHOTO
            </button>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Address</label>
            <input type="text" value={bookingAddress} onChange={(e) => setBookingAddress(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00acc1] mb-3 bg-white" />
            <input type="text" defaultValue="56 sector, Tikri, Sector 48, Gurugram, Haryana 122018, India" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00acc1] bg-gray-50 text-gray-500 mb-4" readOnly />
            
            {/* Map Placeholder */}
            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden border border-gray-300">
              {/* Fallback pattern/text for Map */}
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
              <div className="text-gray-500 font-semibold z-10 flex flex-col items-center">
                <i className="fas fa-map-marked-alt text-3xl mb-2"></i>
                <span>Google Map View</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      {selectedLocation === '' ? (
        <div className="mb-8">
          <button className="w-full bg-[#00acc1] hover:bg-[#008ba3] text-white font-bold py-2 rounded-lg shadow-md transition-colors text-md tracking-wider cursor-pointer">
            PLEASE SELECT LOCATION TO ADD SERVICE ITEMS.
          </button>
        </div>
      ) : (
        <div className="mb-8 bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <div className="grid grid-cols-12 gap-4 items-end mb-6">
            <div className="col-span-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1 text-center uppercase">Service</label>
              <select 
                value={currentService.service}
                onChange={handleGroupChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00acc1] bg-white"
              >
                <option value="">-- Please Select Service --</option>
                {apiServiceGroups.map(group => (
                  <option key={group.service_group_id} value={group.service_group_id}>{group.service_group_name}</option>
                ))}
              </select>
            </div>
            <div className="col-span-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1 text-center uppercase">Body Part</label>
              <select 
                value={currentService.bodyPart}
                onChange={handleServiceChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00acc1] bg-white"
                disabled={!currentService.service}
              >
                <option value="">-- Please Select Body Part --</option>
                {allApiServices
                  .filter(svc => svc.service_group?.toString() === currentService.service?.toString())
                  .map(svc => (
                    <option key={svc.service_id} value={svc.service_id}>{svc.service_name}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1 text-center uppercase">Price</label>
              <input 
                type="number"
                value={currentService.price}
                readOnly
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00acc1] bg-gray-50 text-gray-500"
              />
            </div>
            <div className="col-span-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1 text-center uppercase">Net Payable</label>
              <input 
                type="number"
                value={currentService.netPayable}
                readOnly
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00acc1] bg-gray-50 text-gray-500"
              />
            </div>
            <div className="col-span-1">
              <button 
                onClick={handleAddService}
                className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white py-2 rounded font-semibold text-sm transition-colors shadow-sm cursor-pointer"
              >
                ADD
              </button>
            </div>
          </div>

          {/* List of Added Services */}
          {serviceItems.length > 0 && (
            <div className="mb-6">
              {serviceItems.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-center mb-2 py-3 border-b border-gray-100">
                  <div className="col-span-3 text-sm text-gray-700 px-2">{item.serviceName}</div>
                  <div className="col-span-3 text-sm text-gray-700 px-2">{item.bodyPartName}</div>
                  <div className="col-span-2 text-sm text-gray-700 px-2">{item.price}</div>
                  <div className="col-span-3 text-sm text-gray-700 px-2">{item.netPayable}</div>
                  <div className="col-span-1 text-center">
                    <button 
                      onClick={() => {
                        const newItems = [...serviceItems];
                        newItems.splice(index, 1);
                        setServiceItems(newItems);
                      }}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                      title="Remove Item"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button 
            onClick={() => setShowConsentModal(true)}
            className="w-full bg-[#283556] hover:bg-[#1a233a] text-white font-bold py-3 rounded shadow-md transition-colors text-sm tracking-wider cursor-pointer flex items-center justify-center"
          >
            <i className="fas fa-shopping-cart mr-2"></i> CHECKOUT
          </button>
        </div>
      )}

      {/* Camera Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black/80 flex flex-col justify-center items-center z-[60]">
          <div className="bg-white p-4 rounded-lg shadow-xl w-full max-w-lg relative" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4 text-center text-gray-800">Capture Photo</h3>
            <div className="relative bg-black rounded-lg overflow-hidden w-full aspect-video flex justify-center items-center">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button onClick={closeCamera} className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-semibold transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={capturePhoto} className="px-6 py-2 bg-[#00acc1] hover:bg-[#008ba3] text-white rounded-full font-semibold flex items-center transition-colors shadow-sm cursor-pointer">
                <i className="fas fa-camera mr-2"></i> Capture
              </button>
            </div>
            <canvas ref={canvasRef} className="hidden"></canvas>
          </div>
        </div>
      )}

      {/* Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[70]" onClick={() => { setShowConsentModal(false); setConsentChecked(false); }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-[#35435e]">Consent</h3>
            </div>
            <div className="p-6 overflow-y-auto flex-1 text-gray-600 text-sm leading-relaxed space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="w-4 h-4 text-[#00acc1] border-gray-300 rounded focus:ring-[#00acc1]"
                />
                <span className="font-bold text-[#35435e]">I hereby give my consent for the procedure</span>
              </label>
              
              <p>I /the patient, do hereby agree, and give my consent for undergoing an X-ray diagnostic procedure(s) for myself/the patient conducted by the radio-technician provided by X-Rai, and Acknowledge that:</p>
              
              <p>• I have been made aware of the reason(s), risks, benefits, and all complications, that could arise during, or after the procedure. I have also been informed of the alternatives – if any- available for this procedure, along with the advantages and disadvantages of the same.</p>
              
              <p>• For Female Patients:<br/>
              I declare that I/the patient am/is NOT pregnant at this point of time, and have no reason to suspect I am/is pregnant. I understand that if I/ the patient, withhold the fact that I/ the patient is pregnant at the time when specifically asked, it will harm the foetus/baby, and the responsibility for causing of this harm lies with me.</p>
              
              <p>I have been made aware that X-Rays causes radiation exposure that is harmful, but without which, its not be able to bring out structural detail of various body parts required for imaging, and reporting leading to an impact on the future course of my/patient care.</p>
              
              <p>• I acknowledge I receive no guarantees regarding the benefits to be realized or the consequences of this procedure.</p>
              
              <p>• I acknowledge that I have read the above information in a language I understand, and fully understand the above information. I also understand, that I have the opportunity & right to ask questions pertaining to the test that I am going to undergo, and have asked these questions, that they have been answered to my satisfaction by the radio technician in a language that I fully comprehend and understand.</p>
              
              <p>• I affirm that this consent is given by me in my full senses.</p>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-4 bg-gray-50">
              <button 
                disabled={!consentChecked}
                onClick={handleCheckoutSubmit}
                className={`px-8 py-2 font-bold rounded shadow-sm transition-colors uppercase ${consentChecked ? 'bg-[#d63384] hover:bg-[#c82375] text-white cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >
                Submit
              </button>
              <button 
                onClick={() => { setShowConsentModal(false); setConsentChecked(false); }}
                className="px-6 py-2 border border-gray-300 text-gray-600 font-bold rounded shadow-sm hover:bg-white transition-colors bg-white uppercase cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PartnerMakeBooking;
