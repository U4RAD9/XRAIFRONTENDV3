import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';
import Modal from '../components/Modal';

const mediaBaseURL = axiosInstance.defaults.baseURL.replace('/api', '/media');

function AdminEditBooking() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy State for Service Booking
  const [location, setLocation] = useState('');
  const [slot, setSlot] = useState('');
  const [technician, setTechnician] = useState('');
  const [assignedTechnician, setAssignedTechnician] = useState('');
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
  const [prescriptionFile, setPrescriptionFile] = useState(null);

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
        const allUsers = response.data.results || response.data.result || (Array.isArray(response.data) ? response.data : []);
        const techs = allUsers.filter(user => user.user_type_name === 'Technician');
        setApiTechnicians(techs);
      } catch (err) {
        console.error("Error fetching technicians:", err);
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
          setAssignedTechnician(b.technician_id || '');
          setPatientData(b.patient || { phoneNo: 'N/A', patientName: 'N/A', weight: 'N/A', address: 'N/A', email: 'N/A', age: 'N/A', gender: 'N/A', pin: 'N/A', alternateNo: 'N/A' });
          setServices(b.services || []);
          setPrescriptionFile(b.prescriptionFile);
        }
      } catch (err) {
        console.error("Error fetching booking details:", err);
      }
    };
    
    setFetchBookingDetailsRef(() => fetchBookingDetails);
    
    fetchTechnicians();
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
      setAssignedTechnician(technician);
      alert("Technician updated successfully!");
    } catch (err) {
      console.error("Error updating technician:", err);
      alert("Failed to update technician.");
    }
  };



  return (
    <div className=" max-w-7xl mx-auto min-h-screen bg-gray-50/30">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center text-sm font-medium text-gray-500">
        <i className="fas fa-arrow-left mr-2"></i>
        <Link to="/admin/bookings" className="hover:text-[#00acc1] transition-colors px-1">Bookings</Link>
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
                    <i className="fas fa-user-cog"></i> {assignedTechnician ? 'UPDATE TECHNICIAN' : 'ADD TECHNICIAN'}
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
                  <button 
                    onClick={() => {
                      if (prescriptionFile) {
                        window.open(`${mediaBaseURL}/${prescriptionFile}`, '_blank');
                      } else {
                        alert("No prescription file uploaded.");
                      }
                    }}
                    className="w-[180px] bg-[#233560] text-white text-[11px] font-bold px-2 py-2.5 rounded hover:bg-[#1a2849] transition-colors flex justify-center items-center gap-2 cursor-pointer shadow-sm"
                  >
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
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => openFileModal('Service', svc.id)}
                            className="bg-gray-400 hover:bg-gray-500 text-white text-[12px] font-bold py-2 px-4 rounded-md transition-colors shadow-sm cursor-pointer"
                          >
                            UPLOAD SERVICE FILE
                          </button>
                          
                          <button 
                            onClick={() => openFileModal('Report', svc.id)}
                            className="bg-gray-400 hover:bg-gray-500 text-white text-[12px] font-bold py-2 px-4 rounded-md transition-colors shadow-sm cursor-pointer"
                          >
                            UPLOAD REPORT FILE
                          </button>
                        </div>
                        
                        {/* Display uploaded Service Files */}
                        {svc.serviceFiles && svc.serviceFiles.length > 0 && (
                          <div className="flex flex-wrap justify-center gap-1 mt-1">
                            {svc.serviceFiles.map((file, idx) => (
                              <button 
                                key={`svc-${idx}`}
                                onClick={() => window.open(`${mediaBaseURL}/${file}`, '_blank')}
                                className="bg-[#00acc1] hover:bg-[#0097a7] text-white text-[10px] font-bold py-1 px-2 rounded-md transition-colors shadow-sm cursor-pointer"
                              >
                                VIEW SERVICE {idx + 1}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Display uploaded Report Files */}
                        {svc.reportFiles && svc.reportFiles.length > 0 && (
                          <div className="flex flex-wrap justify-center gap-1 mt-1">
                            {svc.reportFiles.map((file, idx) => (
                              <button 
                                key={`rep-${idx}`}
                                onClick={() => window.open(`${mediaBaseURL}/${file}`, '_blank')}
                                className="bg-[#00acc1] hover:bg-[#0097a7] text-white text-[10px] font-bold py-1 px-2 rounded-md transition-colors shadow-sm cursor-pointer"
                              >
                                VIEW REPORT {idx + 1}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
