import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';

function TechnicianEditBooking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bookingData, setBookingData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [paymentMode, setPaymentMode] = useState('ONLINE');
  const [bookingAddress, setBookingAddress] = useState('');
  
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

  const [showCameraModal, setShowCameraModal] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      let locs = [];
      let slots = [];
      let groups = [];
      let svcs = [];
      try {
        const [locationsRes, slotsRes, groupsRes, servicesRes] = await Promise.all([
          axiosInstance.get(ENDPOINTS.LOCATIONS).catch(() => ({ data: [] })),
          axiosInstance.get(ENDPOINTS.GET_SLOTS).catch(() => ({ data: [] })),
          axiosInstance.get(ENDPOINTS.SERVICE_GROUPS).catch(() => ({ data: [] })),
          axiosInstance.get(ENDPOINTS.SERVICES).catch(() => ({ data: [] }))
        ]);
        const getArrayData = (res) => (res.data?.result || res.data || []);
        
        locs = getArrayData(locationsRes).filter(x => x.is_active !== false);
        slots = getArrayData(slotsRes).filter(x => x.is_active !== false);
        groups = getArrayData(groupsRes).filter(x => x.is_active !== false);
        svcs = getArrayData(servicesRes).filter(x => x.is_active !== false);
        
        setApiLocations(locs);
        setApiSlots(slots);
        setApiServiceGroups(groups);
        setAllApiServices(svcs);
      } catch (err) {
        console.error('Error fetching master data:', err);
      }

      try {
        const response = await axiosInstance.get(`${ENDPOINTS.BOOKING_DETAILS}/${id}`);
        if (response.data.Success) {
          const b = response.data.Booking;
          setBookingData(b);
          
          let locId = b.location_id;
          if (!locId && b.location_name) {
            const match = locs.find(l => l.location_name === b.location_name);
            if (match) locId = match.location_id;
          }
          if (locId) setSelectedLocation(locId);

          let sltId = b.slot_id;
          if (!sltId && b.slot_name) {
            const match = slots.find(s => s.slot_name === b.slot_name);
            if (match) sltId = match.slot_id;
          }
          if (sltId) setSelectedSlot(sltId);

          if (b.visit_date) setVisitDate(b.visit_date);
          else if (b.date) setVisitDate(b.date);

          if (b.payment_method) setPaymentMode(b.payment_method);
          else if (b.payment_mode) setPaymentMode(b.payment_mode);
          
          if (b.patient && b.patient.address) setBookingAddress(b.patient.address);
          
          if (b.services && b.services.length > 0) {
            const formattedServices = b.services.map(s => ({
              service: s.serviceGroup || s.service_group_id || groups.find(g => g.service_group_name === s.service)?.service_group_id,
              bodyPart: s.service_id || svcs.find(sv => sv.service_name === s.bodyPart)?.service_id || s.id,
              price: s.price,
              netPayable: s.netPayable || s.price,
              serviceName: s.service || s.service_name,
              bodyPartName: s.bodyPart || s.service_name
            }));
            setServiceItems(formattedServices);
          }
        }
      } catch (err) {
        console.error("Error fetching booking details:", err);
      }
    };
    loadData();
  }, [id]);

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
    try {
      const payload = {
        booking_id: bookingData.id,
        payment_method: paymentMode,
        services: serviceItems.map(item => ({
          service_id: item.bodyPart,
          price: item.price
        }))
      };

      const response = await axiosInstance.post(ENDPOINTS.UPDATE_BOOKING, payload);
      
      if (response.data.Success) {
        if (paymentMode === 'ONLINE') {
          alert("Redirecting to payment page (placeholder)...");
        } else {
          alert("Booking successfully updated!");
        }
        setShowConsentModal(false);
        setConsentChecked(false);
        navigate('/technician/dashboard');
      } else {
        alert("Failed to update booking: " + response.data.Message);
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("An error occurred while updating booking.");
    }
  };

  if (!bookingData) {
    return <div className="p-6 text-center text-gray-500 font-semibold">Loading booking details...</div>;
  }

  const patient = bookingData.patient || {};

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center">
        <Link 
          to="/technician/dashboard"
          className="text-gray-500 hover:text-gray-700 font-medium flex items-center transition-colors cursor-pointer"
        >
          <i className="fas fa-arrow-left mr-2"></i>
        </Link>
        <span className="text-[#00acc1] px-1"> Edit Booking </span>
      </div>

      {/* Patient Detail Card */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-lg font-bold text-gray-800">Patient Detail</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm text-gray-700">
          <div className="space-y-3">
            <p><span className="font-semibold w-32 inline-block">Phone Number:</span> {patient.phoneNo || patient.alternate_mobile_number || 'N/A'}</p>
            <p><span className="font-semibold w-32 inline-block">Patient Name:</span> {patient.patientName || patient.patient_name || 'N/A'}</p>
            <p><span className="font-semibold w-32 inline-block">Weight:</span> {patient.weight || 'N/A'}</p>
            <p><span className="font-semibold w-32 inline-block">Address:</span> {patient.address || 'N/A'}</p>
            <p><span className="font-semibold w-32 inline-block">Email:</span> {patient.email || 'N/A'}</p>
          </div>
          <div className="space-y-3">
            <p><span className="font-semibold w-40 inline-block">Age:</span> {patient.age || 'N/A'}</p>
            <p><span className="font-semibold w-40 inline-block">Gender:</span> {patient.gender || 'N/A'}</p>
            <p><span className="font-semibold w-40 inline-block">Pin:</span> {patient.pin || 'N/A'}</p>
            <p><span className="font-semibold w-40 inline-block">Alternate Number:</span> {patient.alternateNo || patient.alternate_mobile_number || 'N/A'}</p>
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


      </div>

      {/* Bottom Section */}
      <div className="mb-8 bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-12 gap-4 items-end mb-6">
          <div className="col-span-3">
            <label className="block text-xs font-semibold text-gray-600 mb-1 text-center uppercase">Service</label>
            <select 
              value={currentService.service}
              onChange={(e) => setCurrentService({...currentService, service: e.target.value, bodyPart: ''})}
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
              onChange={(e) => setCurrentService({...currentService, bodyPart: e.target.value})}
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
              onChange={(e) => setCurrentService({...currentService, price: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00acc1] bg-white"
            />
          </div>
          <div className="col-span-3">
            <label className="block text-xs font-semibold text-gray-600 mb-1 text-center uppercase">Net Payable</label>
            <input 
              type="number"
              value={currentService.netPayable}
              onChange={(e) => setCurrentService({...currentService, netPayable: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00acc1] bg-white"
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
          <i className="fas fa-save mr-2"></i> UPDATE BOOKING
        </button>
      </div>

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

export default TechnicianEditBooking;
