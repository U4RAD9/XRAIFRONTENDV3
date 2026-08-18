import React, { useState } from 'react';
import Modal from '../components/Modal';

function AdminTechnicianSummaryReport() {
  const [reports, setReports] = useState([
    {
      id: 1,
      date: '2023-10-25',
      name: 'John Doe',
      tripAssigned: 5,
      tripPerformed: 4,
      unperformedTrips: 1,
      startedAt: '09:00 AM',
      endedAt: '05:00 PM',
      workTime: '8h 0m',
      distanceCovered: '45 km'
    },
    {
      id: 2,
      date: '2023-10-26',
      name: 'Jane Smith',
      tripAssigned: 6,
      tripPerformed: 6,
      unperformedTrips: 0,
      startedAt: '08:30 AM',
      endedAt: '04:30 PM',
      workTime: '8h 0m',
      distanceCovered: '62 km'
    }
  ]);

  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Filter inputs in modal
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [techName, setTechName] = useState('');

  // Applied filters that actually affect the table
  const [appliedFilters, setAppliedFilters] = useState({
    fromDate: '',
    toDate: '',
    techName: ''
  });

  const filteredReports = reports.filter(report => {
    let match = true;
    if (appliedFilters.techName && !report.name.toLowerCase().includes(appliedFilters.techName.toLowerCase())) {
      match = false;
    }
    if (appliedFilters.fromDate && report.date < appliedFilters.fromDate) {
      match = false;
    }
    if (appliedFilters.toDate && report.date > appliedFilters.toDate) {
      match = false;
    }
    return match;
  });

  const columns = [
    { key: 'date', label: 'DATE' },
    { key: 'name', label: 'NAME' },
    { key: 'tripAssigned', label: 'TRIP ASSIGNED' },
    { key: 'tripPerformed', label: 'TRIP PERFORMED' },
    { key: 'unperformedTrips', label: 'UNPERFORMED TRIPS' },
    { key: 'startedAt', label: 'STARTED AT' },
    { key: 'endedAt', label: 'ENDED AT' },
    { key: 'workTime', label: 'WORK TIME' },
    { key: 'distanceCovered', label: 'DISTANCE COVERED' }
  ];

  const handleExportToExcel = () => {
    // Quote headers to prevent any delimiter issues
    const headers = columns.map(c => `"${c.label}"`).join(',');
    
    const rows = filteredReports.map(report => {
      return columns.map(c => {
        const value = report[c.key] !== undefined ? String(report[c.key]) : '';
        return `"${value.replace(/"/g, '""')}"`;
      }).join(',');
    });
    
    const csvContent = [headers, ...rows].join('\n');
    // Add UTF-8 BOM (\uFEFF) so Excel parses the first column (DATE) and encoding correctly
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'technician_summary_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApplyFilter = () => {
    setAppliedFilters({
      fromDate,
      toDate,
      techName
    });
    setShowFilterModal(false);
  };

  return (
    <div className='w-full'>
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setShowFilterModal(true)} className="cursor-pointer bg-[#00acc1] hover:bg-[#008ba3] text-white font-semibold py-2 px-4 rounded flex items-center shadow-sm transition-colors">
          <i className="fas fa-filter mr-2"></i> Filter
        </button>
        <button onClick={handleExportToExcel} className="cursor-pointer bg-[#00acc1] hover:bg-[#008ba3] text-white font-semibold py-2 px-4 rounded flex items-center shadow-sm transition-colors">
          <i className="fas fa-file-excel mr-2"></i> Export to Excel
        </button>
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
                    <td className="py-3 px-4 text-center">{report.date}</td>
                    <td className="py-3 px-4 text-center">{report.name}</td>
                    <td className="py-3 px-4 text-center">{report.tripAssigned}</td>
                    <td className="py-3 px-4 text-center">{report.tripPerformed}</td>
                    <td className="py-3 px-4 text-center">{report.unperformedTrips}</td>
                    <td className="py-3 px-4 text-center">{report.startedAt}</td>
                    <td className="py-3 px-4 text-center">{report.endedAt}</td>
                    <td className="py-3 px-4 text-center">{report.workTime}</td>
                    <td className="py-3 px-4 text-center">{report.distanceCovered}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filter Modal */}
      <Modal 
        isOpen={showFilterModal} 
        onClose={() => setShowFilterModal(false)}
        title="Filter Reports"
        maxWidth="max-w-md"
      >
        <div className="p-6 flex flex-col overflow-y-auto custom-scrollbar flex-1">
          <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <input 
                    type="date" 
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#00acc1]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <input 
                    type="date" 
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#00acc1]"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Technician Name</label>
                <input 
                  type="text" 
                  placeholder="Search technician..."
                  value={techName}
                  onChange={(e) => setTechName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#00acc1]"
                />
              </div>
          </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50 flex-shrink-0">
          <button 
            onClick={() => setShowFilterModal(false)} 
            className="cursor-pointer px-4 py-2 border border-gray-300 text-gray-600 font-medium rounded hover:bg-white transition-colors bg-white"
          >
            Cancel
          </button>
          <button 
            onClick={handleApplyFilter}
            className="cursor-pointer px-4 py-2 bg-[#00acc1] text-white font-medium rounded hover:bg-[#008ba3] transition-colors shadow-sm"
          >
            Apply Filter
          </button>
        </div>
      </Modal>

    </div>
  );
}

export default AdminTechnicianSummaryReport;
