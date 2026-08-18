import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';
import Modal from '../components/Modal';

function AdminEditBooking() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy State for Service Booking
  const [location, setLocation] = useState('');
  const [slot, setSlot] = useState('');
  const [technician, setTechnician] = useState('');
  const [apiTechnicians, setApiTechnicians] = useState([]);
  const [visitType, setVisitType] = useState('Home');
  const [visitDate, setVisitDate] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  
  const [patientData, setPatientData] = useState({
    phoneNo: 'N/A', patientName: 'N/A', weight: 'N/A', address: 'N/A', email: 'N/A',
    age: 'N/A', gender: 'N/A', pin: 'N/A', alternateNo: 'N/A'
  });
  const [createdOn, setCreatedOn] = useState('N/A');
  const [services, setServices] = useState([]);

  // Masters for Add New Service
  const [serviceGroups, setServiceGroups] = useState([]);
  const [allServices, setAllServices] = useState([]);
  
  // Selection state for Add New Service
  const [selectedServiceGroup, setSelectedServiceGroup] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newNetPayable, setNewNetPayable] = useState('');

  // File Upload Modal State
  const [showFileModal, setShowFileModal] = useState(false);
  const [fileModalType, setFileModalType] = useState(''); // 'Service' or 'Report'
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('No file chosen');
  const [selectedFile, setSelectedFile] = useState(null);

  const openFileModal = (type, serviceId) => {
    setFileModalType(type);
    setSelectedServiceId(serviceId);
    setSelectedFileName('No file chosen');
    setSelectedFile(null);
    setShowFileModal(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setSelectedFileName(e.target.files[0].name);
    } else {
      setSelectedFile(null);
      setSelectedFileName('No file chosen');
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('type', fileModalType);
    
    try {
      const response = await axiosInstance.post(`${ENDPOINTS.UPLOAD_FILE}/${selectedServiceId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data.Success) {
        alert(`${fileModalType} file uploaded successfully`);
        setShowFileModal(false);
        // Refresh booking details to get the new file URLs
        fetchBookingDetailsRef();
      } else {
        alert(response.data.Message || "Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
  };

  // Keep a reference to fetchBookingDetails to call it after upload
  const [fetchBookingDetailsRef, setFetchBookingDetailsRef] = useState(() => () => {});

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await axiosInstance.get(ENDPOINTS.USERS);
        const allUsers = response.data.result || response.data || [];
        const techs = allUsers.filter(user => user.user_type_name === 'Technician');
        setApiTechnicians(techs);
      } catch (err) {
        console.error("Error fetching technicians:", err);
      }
    };

    const fetchMasters = async () => {
      try {
        const [sgRes, svcRes] = await Promise.all([
          axiosInstance.get(ENDPOINTS.SERVICE_GROUPS),
          axiosInstance.get(ENDPOINTS.SERVICES)
        ]);
        setServiceGroups(sgRes.data.result || sgRes.data || []);
        setAllServices(svcRes.data.result || svcRes.data || []);
      } catch (err) {
        console.error("Error fetching masters:", err);
      }
    };
    
    const fetchBookingDetails = async () => {
      try {
        const response = await axiosInstance.get(`${ENDPOINTS.BOOKING_DETAILS}/${id}`);
        if (response.data.Success) {
          const b = response.data.Booking;
          setLocation(b.location_name);
          setSlot(b.slot_name);
          setVisitType(b.visit_type);
          setVisitDate(b.visit_date);
          setPaymentMode(b.payment_mode);
          setCreatedOn(b.created_on);
          setTechnician(b.technician_id || '');
          setPatientData(b.patient);
          setServices(b.services);
        }
      } catch (err) {
        console.error("Error fetching booking details:", err);
      }
    };
    
    setFetchBookingDetailsRef(() => fetchBookingDetails);
    
    fetchTechnicians();
    fetchMasters();
    fetchBookingDetails();
  }, [id]);

  const handleUpdateTechnician = async () => {
    if (!technician) {
      alert("Please select a technician");
      return;
    }
    try {
      // using slot-booking-master endpoint
      await axiosInstance.patch(`/slot-booking-master/${id}/`, {
        service_provider: technician
      });
      alert("Technician updated successfully!");
    } catch (err) {
      console.error("Error updating technician:", err);
      alert("Failed to update technician.");
    }
  };



  const handleAddService = () => {
    if (selectedServiceGroup && selectedService) {
      const groupObj = serviceGroups.find(g => g.service_group_id?.toString() === selectedServiceGroup.toString());
      const svcObj = allServices.find(s => s.service_id?.toString() === selectedService.toString());
      
      const newSvc = {
        id: null,
        service_id: svcObj ? svcObj.service_id : selectedService,
        service: groupObj ? groupObj.service_group_name : selectedServiceGroup,
        bodyPart: svcObj ? svcObj.service_name : selectedService,
        price: newPrice,
        netPayable: newNetPayable || newPrice
      };
      
      setServices([...services, newSvc]);
      setSelectedServiceGroup('');
      setSelectedService('');
      setNewPrice('');
      setNewNetPayable('');
    } else {
      alert("Please select both a service group and a body part.");
    }
  };

  const handleRemoveService = (index) => {
    const newItems = [...services];
    newItems.splice(index, 1);
    setServices(newItems);
  };

  const handleCheckoutSubmit = async () => {
    try {
      const payload = {
        booking_id: id,
        payment_method: paymentMode,
        services: services.map(item => ({
          service_id: item.service_id || item.bodyPart, // fallback if service_id missing
          price: item.price
        }))
      };

      const response = await axiosInstance.post(ENDPOINTS.UPDATE_BOOKING, payload);
      
      if (response.data.Success) {
        alert("Booking successfully updated!");
        navigate('/admin/bookings');
      } else {
        alert("Failed to update booking: " + response.data.Message);
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("An error occurred while updating booking.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50/30">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center text-sm font-medium text-gray-500">
        <Link to="/admin/dashboard" className="hover:text-[#00acc1] transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/admin/bookings" className="hover:text-[#00acc1] transition-colors">Bookings</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Edit Booking</span>
      </div>

      {/* 1. Patient Detail Card */}
      <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] mb-6 overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-50 bg-white">
          <h2 className="text-[14px] font-bold text-[#233560]">Patient Detail</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-[13px]">
            {/* Left Column */}
            <div className="space-y-3 text-gray-700">
              <div className="flex"><span className="font-semibold text-gray-600 w-32">Phone Number:</span> <span>{patientData.phoneNo}</span></div>
              <div className="flex"><span className="font-semibold text-gray-600 w-32">Patient Name:</span> <span className="text-[#00acc1]">{patientData.patientName}</span></div>
              <div className="flex"><span className="font-semibold text-gray-600 w-32">Weight:</span> <span>{patientData.weight}</span></div>
              <div className="flex"><span className="font-semibold text-gray-600 w-32">Address:</span> <span>{patientData.address}</span></div>
              <div className="flex"><span className="font-semibold text-gray-600 w-32">Email:</span> <span className="text-blue-500">{patientData.email}</span></div>
            </div>
            {/* Right Column */}
            <div className="space-y-3 text-gray-700">
              <div className="flex"><span className="font-semibold text-gray-600 w-32">Age:</span> <span>{patientData.age}</span></div>
              <div className="flex"><span className="font-semibold text-gray-600 w-32">Gender:</span> <span>{patientData.gender}</span></div>
              <div className="flex"><span className="font-semibold text-gray-600 w-32">Pin:</span> <span>{patientData.pin}</span></div>
              <div className="flex"><span className="font-semibold text-gray-600 w-32">Alternate Number:</span> <span>{patientData.alternateNo}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Service Booking Card */}
      <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] mb-6 overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-50 bg-white">
          <h2 className="text-[14px] font-bold text-[#233560]">Service Booking</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            
            {/* Left Column */}
            <div className="space-y-5">
              <div>
                <label className="block text-[12px] font-bold text-[#233560] mb-1">Location:</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-[#00acc1] bg-white" />
              </div>
              
              <div>
                <label className="block text-[12px] font-bold text-[#233560] mb-1">Slot:</label>
                <input type="text" value={slot} onChange={(e) => setSlot(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-[#00acc1] bg-white" />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#233560] mb-1">Technician:</label>
                <select value={technician} onChange={(e) => setTechnician(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] text-gray-500 focus:outline-none focus:border-[#00acc1] bg-white">
                  <option value="">-- Please Select Technician --</option>
                  {apiTechnicians.map(tech => (
                    <option key={tech.id} value={tech.id}>{tech.full_name || tech.user_name}</option>
                  ))}
                </select>
                <div className="mt-4">
                  <button 
                    onClick={handleUpdateTechnician}
                    className="w-full bg-[#233560] text-white text-[13px] font-bold py-2.5 rounded hover:bg-[#1a2849] transition-colors flex justify-center items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <i className="fas fa-user-cog"></i> UPDATE TECHNICIAN
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              <div className="h-[21px] flex items-end">
                <p className="text-[12px] font-bold text-[#233560]">Created On: <span className="font-normal text-gray-600">{createdOn}</span></p>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#233560] mb-1">Visit Type:</label>
                <input type="text" value={visitType} onChange={(e) => setVisitType(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-[#00acc1] bg-white" />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#233560] mb-1">Visit Date:</label>
                <input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-[#00acc1] bg-white" />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#233560] mb-1">Payment Mode:</label>
                <input type="text" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] text-gray-600 focus:outline-none focus:border-[#00acc1] bg-white" />
                <div className="mt-4 px-2">
                  <button className="w-[180px] bg-[#233560] text-white text-[11px] font-bold px-2 py-2.5 rounded hover:bg-[#1a2849] transition-colors flex justify-center items-center gap-2 cursor-pointer shadow-sm">
                    <i className="fas fa-eye"></i> VIEW PRESCRIPTION
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Service Table Card */}
      <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] mb-6 overflow-hidden border border-gray-100">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="text-[#00acc1] uppercase font-bold border-b border-gray-100">
                  <th className="pb-4 text-center w-1/5">SERVICE</th>
                  <th className="pb-4 text-center w-1/4">BODY PART</th>
                  <th className="pb-4 text-center w-1/6">PRICE</th>
                  <th className="pb-4 text-center w-1/6">NET PAYABLE</th>
                  <th className="pb-4 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {/* Existing Services */}
                {services.map(svc => (
                  <tr key={svc.id}>
                    <td className="py-5 text-center font-bold text-gray-500 uppercase">{svc.service}</td>
                    <td className="py-5 text-center font-bold text-gray-500 uppercase">{svc.bodyPart}</td>
                    <td className="py-5 text-center font-semibold text-gray-700">{svc.price}</td>
                    <td className="py-5 text-center font-semibold text-gray-700">{svc.netPayable}</td>
                    <td className="py-5 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-2">
                        {svc.serviceFile ? (
                          <button 
                            onClick={() => window.open(`http://localhost:8000/media/${svc.serviceFile}`, '_blank')}
                            className="bg-[#00acc1] hover:bg-[#0097a7] text-white text-[12px] font-bold py-2 px-4 rounded-md transition-colors shadow-sm cursor-pointer"
                          >
                            VIEW SERVICE FILE
                          </button>
                        ) : (
                          <button 
                            onClick={() => openFileModal('Service', svc.id)}
                            className="bg-gray-400 hover:bg-gray-500 text-white text-[12px] font-bold py-2 px-4 rounded-md transition-colors shadow-sm cursor-pointer"
                          >
                            SERVICE FILES
                          </button>
                        )}
                        
                        {svc.reportFile ? (
                          <button 
                            onClick={() => window.open(`http://localhost:8000/media/${svc.reportFile}`, '_blank')}
                            className="bg-[#00acc1] hover:bg-[#0097a7] text-white text-[12px] font-bold py-2 px-4 rounded-md transition-colors shadow-sm cursor-pointer"
                          >
                            VIEW REPORT FILE
                          </button>
                        ) : (
                          <button 
                            onClick={() => openFileModal('Report', svc.id)}
                            className="bg-gray-400 hover:bg-gray-500 text-white text-[12px] font-bold py-2 px-4 rounded-md transition-colors shadow-sm cursor-pointer"
                          >
                            REPORT FILE
                          </button>
                        )}
                        <button 
                          onClick={() => handleRemoveService(services.indexOf(svc))}
                          className="bg-red-600 hover:bg-red-700 text-white text-[12px] font-bold py-2 px-6 rounded-md transition-colors shadow-sm cursor-pointer"
                        >
                          REMOVE
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Add New Service Row */}
                <tr>
                  <td className="py-5 px-2">
                    <select 
                      value={selectedServiceGroup}
                      onChange={(e) => setSelectedServiceGroup(e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-2 text-[12px] text-gray-500 focus:outline-none focus:border-[#00acc1] bg-white"
                    >
                      <option value="">-- Please Select Service --</option>
                      {serviceGroups.map(sg => (
                        <option key={sg.service_group_id} value={sg.service_group_id}>{sg.service_group_name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-5 px-2">
                    <select 
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-2 text-[12px] text-gray-500 focus:outline-none focus:border-[#00acc1] bg-white"
                    >
                      <option value="">-- Please Select Body Part --</option>
                      {allServices
                        .filter(svc => !selectedServiceGroup || String(svc.service_group) === String(selectedServiceGroup))
                        .map(svc => (
                          <option key={svc.service_id} value={svc.service_id}>{svc.service_name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-5 px-2">
                    <input type="text" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#00acc1] bg-white text-center" />
                  </td>
                  <td className="py-5 px-2">
                    <input type="text" value={newNetPayable} onChange={(e) => setNewNetPayable(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#00acc1] bg-white text-center" />
                  </td>
                  <td className="py-5 px-2 text-center">
                    <div className="flex justify-start pl-2">
                      <button 
                        onClick={handleAddService}
                        className="bg-[#00acc1] hover:bg-[#0097a7] text-white text-[11px] font-bold py-1.5 px-4 rounded transition-colors shadow-sm cursor-pointer"
                      >
                        ADD
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8">
            <button 
              onClick={handleCheckoutSubmit}
              className="w-full bg-[#233560] text-white text-[13px] font-bold py-2.5 rounded hover:bg-[#1a2849] transition-colors flex justify-center items-center gap-2 shadow-sm cursor-pointer"
            >
              <i className="fas fa-shopping-cart"></i> CHECKOUT
            </button>
          </div>
        </div>
      </div>
      
      {/* File Upload Modal */}
      <Modal 
        isOpen={showFileModal} 
        onClose={() => setShowFileModal(false)} 
        title={`${fileModalType} File`}
        maxWidth="max-w-[500px]"
      >
        <div className="p-6">
          <label className="block text-[13px] font-bold text-[#233560] mb-2">Upload {fileModalType} File</label>
          <div className="flex border border-gray-300 rounded overflow-hidden">
            <label className="bg-gray-50 text-gray-700 px-4 py-2 border-r border-gray-300 cursor-pointer hover:bg-gray-100 text-[13px] flex items-center">
              Choose File
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
            <div className="px-4 py-2 text-gray-500 text-[13px] flex-1 truncate bg-white flex items-center">
               {selectedFileName}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button 
            onClick={() => setShowFileModal(false)}
            className="px-6 py-2 bg-white border border-gray-300 rounded text-gray-700 text-[13px] font-bold hover:bg-gray-50 shadow-sm"
          >
            CLOSE
          </button>
          <button 
            onClick={handleFileUpload}
            className="px-6 py-2 bg-[#233560] rounded text-white text-[13px] font-bold hover:bg-[#1a2849] shadow-sm"
          >
            UPLOAD
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default AdminEditBooking;
