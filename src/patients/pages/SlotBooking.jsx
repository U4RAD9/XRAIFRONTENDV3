import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientCard from '../../employee/components/PatientCard';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';
import { showToast } from '../components/ToastNotification';
import Modal from '../../employee/components/Modal';

function SlotBooking() {
  const [viewMode, setViewMode] = useState('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [selectedPatientForBooking, setSelectedPatientForBooking] = useState(null);
  const [newPatient, setNewPatient] = useState({
    name: '', age: '', weight: '', gender: '', height: '', bp: '', address: '', pin: '', email: '', alternateMobile: '', comment: ''
  });

  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [locationsRes, slotsRes, groupsRes, servicesRes, patientsRes] = await Promise.all([
          axiosInstance.get(ENDPOINTS.LOCATIONS).catch(() => ({ data: [] })),
          axiosInstance.get(ENDPOINTS.GET_SLOTS).catch(() => ({ data: [] })),
          axiosInstance.get(ENDPOINTS.SERVICE_GROUPS).catch(() => ({ data: [] })),
          axiosInstance.get(ENDPOINTS.SERVICES).catch(() => ({ data: [] })),
          axiosInstance.get(ENDPOINTS.PATIENTS, { params: { user_id: sessionStorage.getItem('UserID') } }).catch(() => ({ data: [] }))
        ]);
        const getArrayData = (res) => (res.data?.result || res.data || []);
        
        setApiLocations(getArrayData(locationsRes).filter(x => x.is_active !== false));
        setApiSlots(getArrayData(slotsRes).filter(x => x.is_active !== false));
        setApiServiceGroups(getArrayData(groupsRes).filter(x => x.is_active !== false));
        setAllApiServices(getArrayData(servicesRes).filter(x => x.is_active !== false));
        setPatients(getArrayData(patientsRes));
      } catch (err) {
        console.error('Error fetching master data:', err);
      }
    };
    fetchMasterData();
  }, []);

  const [prescriptionFiles, setPrescriptionFiles] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [patients, setPatients] = useState([]);

  const handleBookSlot = async (patient) => {
    setSelectedPatientForBooking(patient);
    setCurrentBookingId(null);
    setSelectedLocation(''); 
    setServiceItems([]);
    setBookingAddress(patient.address || '');
    
    try {
      const resp = await axiosInstance.get(ENDPOINTS.LAST_BOOKING, { params: { patient_id: patient.patient_id } });
      if (resp.data.Success) {
        const lastBooking = resp.data.Booking;
        if (lastBooking.slot_booking_id) setCurrentBookingId(lastBooking.slot_booking_id);
        
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
            netPayable: s.price,
            serviceName: s.service_group_name,
            bodyPartName: s.service_name
          }));
          setServiceItems(formattedServices);
        }

        if (lastBooking.prescription_file) {
          const files = lastBooking.prescription_file.split(',').filter(Boolean).map(url => ({
            name: url.split('/').pop(),
            url: url,
            isExisting: true
          }));
          setPrescriptionFiles(files);
        } else {
          setPrescriptionFiles([]);
        }

        if (lastBooking.image_file) {
          setImageFile({
            name: lastBooking.image_file.split('/').pop(),
            url: lastBooking.image_file,
            isExisting: true
          });
        } else {
          setImageFile(null);
        }
      }
    } catch (err) {
      console.log("No previous booking found or error fetching it.");
      setCurrentBookingId(null);
    }
  };

  const handleAddPatientSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        user_id: sessionStorage.getItem('UserID'),
        patient_name: newPatient.name,
        age: newPatient.age ? parseInt(newPatient.age) : null,
        weight: newPatient.weight ? parseInt(newPatient.weight) : null,
        gender: newPatient.gender,
        height: newPatient.height ? parseFloat(newPatient.height) : null,
        bp: newPatient.bp,
        address: newPatient.address,
        pin: newPatient.pin,
        email: newPatient.email,
        alternate_mobile_number: newPatient.alternateMobile,
        comment: newPatient.comment
      };
      await axiosInstance.post(ENDPOINTS.PATIENTS, payload);
      showToast('Patient saved!', 'success');
      setShowAddPatientModal(false);
      setNewPatient({ name: '', age: '', weight: '', gender: '', height: '', bp: '', address: '', pin: '', email: '', alternateMobile: '', comment: '' });
      // Refresh list
      const patientsRes = await axiosInstance.get(ENDPOINTS.PATIENTS, { params: { user_id: sessionStorage.getItem('UserID') } });
      setPatients(patientsRes.data?.result || patientsRes.data || []);
    } catch (err) {
      console.error("Error saving patient:", err.response?.data || err);
      showToast("Failed to save patient: " + JSON.stringify(err.response?.data || err.message), "error");
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



  const handleCheckoutSubmit = async () => {
    if (paymentMode === 'ONLINE') {
      showToast("Redirecting to payment page...", "info");
      setShowConsentModal(false);
      setConsentChecked(false);
      return;
    }

    // Pay At Home logic
    try {
      const payload = {
        patient_id: selectedPatientForBooking.id || selectedPatientForBooking.patient_id,
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
        })),
        prescription_file: prescriptionFiles.filter(f => f.isExisting).map(f => f.url).join(','),
        image_file: imageFile && imageFile.isExisting ? imageFile.url : ""
      };

      if (currentBookingId) {
        payload.booking_id = currentBookingId;
      }

      const response = currentBookingId 
        ? await axiosInstance.post(ENDPOINTS.UPDATE_BOOKING, payload)
        : await axiosInstance.post(ENDPOINTS.SAVE_BOOKING, payload);
      if (response.data.Success === true) {
        const bookingId = response.data.BookingID;
        
        if (prescriptionFiles.length > 0 && bookingId) {
          for (const item of prescriptionFiles) {
            if (!item.isExisting) {
              const presFormData = new FormData();
              presFormData.append('file', item.file);
              await axiosInstance.post(`${ENDPOINTS.UPLOAD_PRESCRIPTION}/${bookingId}`, presFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              }).catch(err => console.error("Error uploading prescription:", err));
            }
          }
        }

        if (imageFile && !imageFile.isExisting && bookingId) {
          const imgFormData = new FormData();
          imgFormData.append('file', imageFile.file);
          await axiosInstance.post(`${ENDPOINTS.UPLOAD_IMAGE}/${bookingId}`, imgFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          }).catch(err => console.error("Error uploading image:", err));
        }

        showToast("Booking successful!", "success");
        setShowConsentModal(false);
        setConsentChecked(false);
        navigate('/patient/book-slot');
        window.location.reload(); 
      } else {
        showToast("Failed to create booking: " + response.data.Message, "error");
      }
    } catch (err) {
      console.error("Booking error:", err);
      showToast("An error occurred while creating booking.", "error");
    }
  };

  const fetchPriceForService = async (locationId, serviceId, groupId) => {
    if (locationId && serviceId && groupId) {
      try {
        const response = await axiosInstance.get(ENDPOINTS.GET_PRICE, {
          params: { location_id: locationId, service_id: serviceId, group_id: groupId, visit_type_id: 1 }
        });
        if (response.data && response.data.Price !== undefined) {
          setCurrentService(prev => ({
            ...prev,
            price: response.data.Price,
            netPayable: response.data.Price
          }));
        }
      } catch (err) {
        console.error("Error fetching price:", err);
      }
    }
  };

  const handleBodyPartChange = (e) => {
    const serviceId = e.target.value;
    setCurrentService(prev => ({...prev, bodyPart: serviceId}));
    fetchPriceForService(selectedLocation, serviceId, currentService.service);
  };

  const handleLocationChange = (e) => {
    const locId = e.target.value;
    setSelectedLocation(locId);
    if (currentService.bodyPart && currentService.service) {
      fetchPriceForService(locId, currentService.bodyPart, currentService.service);
    }
  };

  const filteredPatients = patients.filter(p => 
    (p.patient_name && p.patient_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.email && p.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (selectedPatientForBooking) {
    return (
      <div className="w-full">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center">
          <button 
            onClick={() => setSelectedPatientForBooking(null)}
            className="text-gray-500 hover:text-gray-700 font-medium flex items-center transition-colors cursor-pointer"
          >
            <i className="fas fa-arrow-left mr-2"></i>
              <span className="text-[#00acc1] px-1"> Patient Panel </span><span> / Book Slot</span>
          </button>
        </div>

        {/* Patient Detail Card */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-base md:text-lg font-bold text-gray-800">Patient Detail</h3>
            <button className="bg-[#b0008e] hover:bg-[#8e0072] text-white px-4 py-2 rounded text-sm font-semibold flex items-center shadow-sm transition-colors cursor-pointer">
              <i className="fas fa-phone-alt mr-2"></i> CALL TO XRAI FOR HELP/ASSISTANCE
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm text-gray-700">
            <div className="space-y-3">
              <p><span className="font-semibold w-32 inline-block">Phone Number:</span> {selectedPatientForBooking.alternate_mobile_number || 'N/A'}</p>
              <p><span className="font-semibold w-32 inline-block">Patient Name:</span> {selectedPatientForBooking.patient_name}</p>
              <p><span className="font-semibold w-32 inline-block">Weight:</span> {selectedPatientForBooking.weight}</p>
              <p><span className="font-semibold w-32 inline-block">Address:</span> {selectedPatientForBooking.address}</p>
              <p><span className="font-semibold w-32 inline-block">Email:</span> {selectedPatientForBooking.email}</p>
            </div>
            <div className="space-y-3">
              <p><span className="font-semibold w-40 inline-block">Age:</span> {selectedPatientForBooking.age}</p>
              <p><span className="font-semibold w-40 inline-block">Gender:</span> {selectedPatientForBooking.gender}</p>
              <p><span className="font-semibold w-40 inline-block">Pin:</span> {selectedPatientForBooking.pin}</p>
              <p><span className="font-semibold w-40 inline-block">Alternate Number:</span> {selectedPatientForBooking.alternate_mobile_number}</p>
            </div>
          </div>
        </div>

        {/* Service Booking Card */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Service Booking</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Location</label>
              <select 
                value={selectedLocation}
                onChange={handleLocationChange}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
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
            <div className="md:col-span-1 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Upload Prescription</label>
                <div className="flex">
                  <label htmlFor="prescription-upload" className="bg-gray-100 border border-gray-300 text-gray-600 px-3 py-2 text-sm rounded-l cursor-pointer hover:bg-gray-200 whitespace-nowrap">
                    Choose File
                  </label>
                  <input id="prescription-upload" type="file" multiple className="hidden" onChange={(e) => {
                    const files = Array.from(e.target.files || []).map(f => ({
                      file: f,
                      name: f.name,
                      isExisting: false
                    }));
                    if (files.length > 0) {
                      setPrescriptionFiles(prev => [...prev, ...files]);
                    }
                    e.target.value = '';
                  }} />
                  <span className="border border-l-0 border-gray-300 px-3 py-2 text-sm text-gray-400 bg-white rounded-r flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {prescriptionFiles.length > 0 ? `${prescriptionFiles.length} file(s) chosen` : 'No file chosen'}
                  </span>
                </div>
                {prescriptionFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {prescriptionFiles.map((f, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded px-2 py-1">
                        <span className="text-xs text-blue-600 hover:underline cursor-pointer truncate mr-2" onClick={() => {
                          if (f.isExisting) {
                            const mediaBaseURL = axiosInstance.defaults.baseURL.replace('/api', '/media');
                            window.open(`${mediaBaseURL}/${f.url}`, '_blank');
                          } else {
                            window.open(URL.createObjectURL(f.file), '_blank');
                          }
                        }} title={f.name}>
                          {f.name}
                        </span>
                        <button 
                          type="button"
                          onClick={() => setPrescriptionFiles(prev => prev.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700 cursor-pointer flex-shrink-0"
                          title="Remove file"
                        >
                          <i className="fas fa-trash-alt text-xs"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Upload Image</label>
                <div className="flex">
                  <label htmlFor="image-upload" className="bg-gray-100 border border-gray-300 text-gray-600 px-3 py-2 text-sm rounded-l cursor-pointer hover:bg-gray-200 whitespace-nowrap">
                    Choose File
                  </label>
                  <input id="image-upload" type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const f = e.target.files[0];
                      setImageFile({
                        file: f,
                        name: f.name,
                        isExisting: false
                      });
                    }
                    e.target.value = '';
                  }} />
                  <span className="border border-l-0 border-gray-300 px-3 py-2 text-sm text-gray-400 bg-white rounded-r flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {imageFile ? '1 file(s) chosen' : 'No image chosen'}
                  </span>
                </div>
                {imageFile && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded px-2 py-1">
                      <span className="text-xs text-blue-600 hover:underline cursor-pointer truncate mr-2" onClick={() => {
                        if (imageFile.isExisting) {
                          const mediaBaseURL = axiosInstance.defaults.baseURL.replace('/api', '/media');
                          window.open(`${mediaBaseURL}/${imageFile.url}`, '_blank');
                        } else {
                          window.open(URL.createObjectURL(imageFile.file), '_blank');
                        }
                      }} title={imageFile.name}>
                        {imageFile.name}
                      </span>
                      <button 
                        type="button"
                        onClick={() => setImageFile(null)}
                        className="text-red-500 hover:text-red-700 cursor-pointer flex-shrink-0"
                        title="Remove file"
                      >
                        <i className="fas fa-trash-alt text-xs"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Address</label>
              <input type="text" value={bookingAddress} onChange={(e) => setBookingAddress(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00acc1] mb-3 bg-white" />
              <input type="text" defaultValue="56 sector, Tikri, Sector 48, Gurugram, Haryana 122018, India" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00acc1] bg-gray-50 text-gray-500 mb-4" readOnly />
              
              {/* Map Placeholder */}
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden border border-gray-300">
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
          <div className="mb-8 bg-white shadow-sm border border-gray-200 rounded-lg p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 md:gap-4 items-end mb-4 md:mb-6">
              <div className="col-span-1 sm:col-span-3">
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
              <div className="col-span-1 sm:col-span-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1 text-center uppercase">Body Part</label>
                <select 
                  value={currentService.bodyPart}
                  onChange={handleBodyPartChange}
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
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1 text-center uppercase">Price</label>
                <input 
                  type="number"
                  value={currentService.price}
                  onChange={(e) => setCurrentService({...currentService, price: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00acc1] bg-gray-50"
                  readOnly
                />
              </div>
              <div className="col-span-1 sm:col-span-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1 text-center uppercase">Net Payable</label>
                <input 
                  type="number"
                  value={currentService.netPayable}
                  onChange={(e) => setCurrentService({...currentService, netPayable: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00acc1] bg-gray-50"
                  readOnly
                />
              </div>
              <div className="col-span-1 sm:col-span-1 mt-2 sm:mt-0">
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
                  <div key={index} className="grid grid-cols-2 sm:grid-cols-12 gap-2 sm:gap-4 items-center mb-2 py-3 border-b border-gray-100">
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

  return (
    <div className='w-full py-4 2xl:py-0 xl:py-0 lg:py-0 md-py-0'>
      <div className="flex justify-between items-center mb-6 gap-3 flex-nowrap">
        {/* Left Side: Search */}
        <div className="relative flex-1 md:flex-none md:w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <i className="fas fa-search text-gray-400"></i>
          </span>
          <input 
            type="text" 
            placeholder="Search Patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#00acc1]"
          />
        </div>

        {/* Right Side: Toggle and Add Button */}
        <div className="flex items-center gap-2 md:gap-5 flex-shrink-0">
          <div className="hidden md:flex bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <button 
              onClick={() => setViewMode('table')}
              className={`cursor-pointer px-3 py-2 ${viewMode === 'table' ? 'bg-gray-100 text-[#00acc1]' : 'text-gray-500 hover:bg-gray-50'}`}
              title="Table View"
            >
              <i className="fas fa-list"></i>
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`cursor-pointer px-3 py-2 border-l border-gray-300 ${viewMode === 'grid' ? 'bg-gray-100 text-[#00acc1]' : 'text-gray-500 hover:bg-gray-50'}`}
              title="Grid View"
            >
              <i className="fas fa-th-large"></i>
            </button>
          </div>
          <button 
            onClick={() => setShowAddPatientModal(true)}
            className="cursor-pointer bg-[#00acc1] hover:bg-[#008ba3] text-white font-semibold py-2 px-3 md:px-4 rounded-lg flex items-center shadow-sm transition-colors text-sm md:text-base whitespace-nowrap"
          >
            <i className="fas fa-plus md:mr-2"></i> <span className="hidden md:inline">Add New Patient</span><span className="md:hidden ml-1 py-0.5">Add</span>
          </button>
        </div>
      </div>

      {/* Responsive View Rendering */}
      <div className="block md:hidden mt-4 w-full">
        <div className="grid grid-cols-1 gap-4 w-full">
          {filteredPatients.length === 0 ? (
            <div className="col-span-full py-8 text-center text-gray-500 text-sm">No patients found.</div>
          ) : (
            filteredPatients.map(p => (
              <PatientCard key={p.patient_id || p.id} patient={p} onBookSlot={handleBookSlot} />
            ))
          )}
        </div>
      </div>
      <div className="hidden md:block w-full">
      {viewMode === 'table' ? (
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <table className="min-w-full bg-white whitespace-nowrap">
              <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 text-left font-bold border-b border-gray-200">Name</th>
                  <th className="py-3 px-4 text-center font-bold border-b border-gray-200">Age</th>
                  <th className="py-3 px-4 text-center font-bold border-b border-gray-200">BP</th>
                  <th className="py-3 px-4 text-center font-bold border-b border-gray-200">Weight</th>
                  <th className="py-3 px-4 text-center font-bold border-b border-gray-200">Height</th>
                  <th className="py-3 px-4 text-center font-bold border-b border-gray-200">Gender</th>
                  <th className="py-3 px-4 text-left font-bold border-b border-gray-200">Address</th>
                  <th className="py-3 px-4 text-center font-bold border-b border-gray-200">Pin</th>
                  <th className="py-3 px-4 text-left font-bold border-b border-gray-200">Email</th>
                  <th className="py-3 px-4 text-center font-bold border-b border-gray-200">Alt Mobile No.</th>
                  <th className="py-3 px-4 text-left font-bold border-b border-gray-200">Comment</th>
                  <th className="py-3 px-4 text-center font-bold border-b border-gray-200">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 divide-y divide-gray-100 text-sm">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="py-8 text-center text-gray-500">No patients found.</td>
                  </tr>
                ) : (
                  filteredPatients.map(p => (
                    <tr key={p.patient_id} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="py-3 px-4 text-left">{p.patient_name}</td>
                      <td className="py-3 px-4 text-center">{p.age}</td>
                      <td className="py-3 px-4 text-center">{p.bp}</td>
                      <td className="py-3 px-4 text-center">{p.weight}</td>
                      <td className="py-3 px-4 text-center">{p.height}</td>
                      <td className="py-3 px-4 text-center">{p.gender}</td>
                      <td className="py-3 px-4 text-left">{p.address}</td>
                      <td className="py-3 px-4 text-center">{p.pin}</td>
                      <td className="py-3 px-4 text-left">{p.email}</td>
                      <td className="py-3 px-4 text-center">{p.alternate_mobile_number}</td>
                      <td className="py-3 px-4 text-left">{p.comment}</td>
                      <td className="py-3 px-4 text-center">
                        <button 
                          onClick={() => handleBookSlot(p)}
                          className="cursor-pointer bg-[#00acc1] hover:bg-[#008ba3] text-white font-semibold py-1.5 px-4 rounded text-sm shadow-sm transition-colors"
                        >
                          Book Your Slot
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPatients.length === 0 ? (
            <div className="col-span-full py-8 text-center text-gray-500">No patients found.</div>
          ) : (
            filteredPatients.map(p => (
              <PatientCard key={p.id} patient={p} onBookSlot={handleBookSlot} />
            ))
          )}
        </div>
      )}
      </div>

      {/* Add Patient Modal */}
      <Modal 
        isOpen={showAddPatientModal} 
        onClose={() => setShowAddPatientModal(false)}
        title="Add New Patient"
        maxWidth="max-w-4xl"
      >
        <form onSubmit={handleAddPatientSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                {/* Row 1 */}
                <div>
                  <label className="block text-sm font-semibold text-[#1f2937] mb-1">Patient Name <span className="text-red-500">*</span></label>
                  <input type="text" required value={newPatient.name} onChange={(e) => setNewPatient({...newPatient, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1]" placeholder="Patient Name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1f2937] mb-1">Age <span className="text-red-500">*</span></label>
                  <input type="number" required value={newPatient.age} onChange={(e) => setNewPatient({...newPatient, age: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1]" placeholder="Age (Yrs.)" />
                </div>

                {/* Row 2 */}
                <div>
                  <label className="block text-sm font-semibold text-[#1f2937] mb-1">Weight</label>
                  <input type="text" value={newPatient.weight} onChange={(e) => setNewPatient({...newPatient, weight: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1]" placeholder="Weight(kgs.)" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1f2937] mb-1">Gender <span className="text-red-500">*</span></label>
                  <select required value={newPatient.gender} onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1] bg-white">
                    <option value="">-- Select Gender --</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {/* Row 3 */}
                <div>
                  <label className="block text-sm font-semibold text-[#1f2937] mb-1">Height</label>
                  <input type="text" value={newPatient.height} onChange={(e) => setNewPatient({...newPatient, height: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1]" placeholder="Height(Cm.)" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1f2937] mb-1">BP</label>
                  <input type="text" value={newPatient.bp} onChange={(e) => setNewPatient({...newPatient, bp: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1]" placeholder="BP" />
                </div>

                {/* Row 4 */}
                <div>
                  <label className="block text-sm font-semibold text-[#1f2937] mb-1">Address</label>
                  <input type="text" value={newPatient.address} onChange={(e) => setNewPatient({...newPatient, address: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1]" placeholder="Address" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1f2937] mb-1">Pin <span className="text-red-500">*</span></label>
                  <input type="text" required value={newPatient.pin} onChange={(e) => setNewPatient({...newPatient, pin: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1]" placeholder="PIN" />
                </div>

                {/* Row 5 */}
                <div>
                  <label className="block text-sm font-semibold text-[#1f2937] mb-1">Email</label>
                  <input type="email" value={newPatient.email} onChange={(e) => setNewPatient({...newPatient, email: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1]" placeholder="Email" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1f2937] mb-1">Alternate mobile number <span className="text-red-500">*</span></label>
                  <input type="text" required value={newPatient.alternateMobile} onChange={(e) => setNewPatient({...newPatient, alternateMobile: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1]" placeholder="Alternat Mobile Number" />
                </div>
              </div>

              {/* Row 6 (Full Width) */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#1f2937] mb-1">Comment</label>
                <textarea rows="4" value={newPatient.comment} onChange={(e) => setNewPatient({...newPatient, comment: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00acc1] resize-none" placeholder="Comments"></textarea>
              </div>

          </div>
          <div className="px-4 md:px-6 py-4 md:py-5 border-t border-gray-100 flex justify-end gap-3 md:gap-4 flex-shrink-0 bg-gray-50">
            <button type="button" onClick={() => setShowAddPatientModal(false)} className="px-4 md:px-6 py-2 border border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors cursor-pointer text-sm md:text-base">
              Cancel
            </button>
            <button type="submit" className="px-4 md:px-6 py-2 bg-[#00acc1] hover:bg-[#0097a7] text-white font-semibold rounded-lg shadow transition-colors cursor-pointer text-sm md:text-base">
              Save
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

export default SlotBooking;
