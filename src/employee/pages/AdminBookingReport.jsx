import React, { useState } from 'react';

function AdminBookingReport() {
  const [searchQuery, setSearchQuery] = useState('');

  const [reports] = useState([
    {
      id: 1,
      name: 'Dr. Smith',
      userType: 'Partner',
      patientId: 'PT-1001',
      phoneNo: '9876543210',
      patientName: 'Srinivasan',
      refNo: 'REF-8821',
      bookingDate: '2023-11-01',
      slot: '10:00 AM',
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      status: 'Completed',
      grossAmount: '₹ 1500',
      invoiceDiscount: '₹ 100',
      itemDiscount: '₹ 50',
      netAmount: '₹ 1350'
    },
    {
      id: 2,
      name: 'City Hospital',
      userType: 'Corporate',
      patientId: 'PT-1002',
      phoneNo: '9876543211',
      patientName: 'Jane Doe',
      refNo: 'REF-8822',
      bookingDate: '2023-11-02',
      slot: '02:30 PM',
      paymentMethod: 'Cash',
      paymentStatus: 'Pending',
      status: 'Scheduled',
      grossAmount: '₹ 2000',
      invoiceDiscount: '₹ 0',
      itemDiscount: '₹ 200',
      netAmount: '₹ 1800'
    }
  ]);

  const columns = [
    { key: 'name', label: 'NAME' },
    { key: 'userType', label: 'USER TYPE' },
    { key: 'patientId', label: 'PATIENT ID' },
    { key: 'phoneNo', label: 'PHONE NO.' },
    { key: 'patientName', label: 'PATIENT NAME' },
    { key: 'refNo', label: 'REF NO' },
    { key: 'bookingDate', label: 'BOOKING DATE' },
    { key: 'slot', label: 'SLOT' },
    { key: 'paymentMethod', label: 'PAYMENT METHOD' },
    { key: 'paymentStatus', label: 'PAYMENT STATUS' },
    { key: 'status', label: 'STATUS' },
    { key: 'grossAmount', label: 'GROSSAMOUNT' },
    { key: 'invoiceDiscount', label: 'INVOICE DISCOUNT' },
    { key: 'itemDiscount', label: 'ITEM DISCOUNT' },
    { key: 'netAmount', label: 'NETAMOUNT' }
  ];

  const filteredReports = reports.filter(r => 
    r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.phoneNo.includes(searchQuery)
  );

  return (
    <div className='w-full'>
      <div className="flex justify-between items-center mb-6">
        {/* Left Side: Search */}
        <div className="relative w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <i className="fas fa-search text-gray-400"></i>
          </span>
          <input 
            type="text" 
            placeholder="Search Reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#00acc1]"
          />
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
        {/* Horizontal scroll without visible scrollbar */}
        <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="min-w-full bg-white whitespace-nowrap">
            <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
              <tr>
                {columns.map(col => (
                  <th key={col.key} className="py-3 px-4 text-center font-bold border-b border-gray-200">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y divide-gray-100 text-sm">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-8 text-center text-gray-500">
                    No reports found.
                  </td>
                </tr>
              ) : (
                filteredReports.map(report => (
                  <tr key={report.id} className="hover:bg-blue-50 transition-colors duration-150">
                    {columns.map(col => (
                      <td key={col.key} className="py-3 px-4 text-center">
                        {report[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminBookingReport;
