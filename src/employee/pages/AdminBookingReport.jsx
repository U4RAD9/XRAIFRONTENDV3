import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';
import Pagination from '../../components/Pagination';

function AdminBookingReport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    fetchReports();
  }, [currentPage, debouncedSearch]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(ENDPOINTS.ALL_BOOKINGS, {
        params: { page: currentPage, search: debouncedSearch }
      });
      const data = res.data.results || res.data.result || res.data;
      if (res.data.total_pages) {
        setTotalPages(res.data.total_pages);
      } else {
        setTotalPages(1);
      }
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch admin bookings report', err);
    } finally {
      setLoading(false);
    }
  };

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

  // Server-side search and pagination handled via API

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
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-gray-500 font-semibold">
                    <i className="fas fa-spinner fa-spin mr-2"></i> Loading reports...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-8 text-center text-gray-500">
                    No reports found.
                  </td>
                </tr>
              ) : (
                reports.map((report, idx) => (
                  <tr key={report.id || idx} className="hover:bg-blue-50 transition-colors duration-150">
                    {columns.map(col => (
                      <td key={col.key} className="py-3 px-4 text-center">
                        {report[col.key] !== undefined && report[col.key] !== null ? String(report[col.key]) : 'N/A'}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex justify-center bg-gray-50/50">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminBookingReport;
