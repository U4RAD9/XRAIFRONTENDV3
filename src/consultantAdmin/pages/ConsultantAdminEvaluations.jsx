import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';
import Modal from '../components/Modal';
import { EXAM_DATA } from '../../consultant/data/examData';
import {
  exportDossierToExcel,
  exportDossierToPDF,
  exportAllSubmissionsToExcel,
} from '../utils/dossierExportUtils';

function ConsultantAdminEvaluations() {
  const [submissions, setSubmissions] = useState([]);
  const [metrics, setMetrics] = useState({
    total_consultants: 0,
    total_submissions: 0,
    submitted_count: 0,
    draft_count: 0,
    evaluated_count: 0,
    avg_coverage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('-last_saved_at');

  // Modals state
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [activeReviewTab, setActiveReviewTab] = useState('overview'); // 'overview' | 'pediatric' | 'adult' | 'closing'

  // Edit status form state
  const [statusForm, setStatusForm] = useState({
    id: null,
    status: 'SUBMITTED',
    admin_notes: '',
  });
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch submissions and metrics from backend
  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (sortBy) params.append('ordering', sortBy);

      const url = `${ENDPOINTS.CONSULTANT_SUBMISSIONS}?${params.toString()}`;
      const res = await axiosInstance.get(url);

      if (res.data?.Success) {
        setSubmissions(res.data.Submissions || []);
        if (res.data.Metrics) {
          setMetrics(res.data.Metrics);
        }
      } else {
        setSubmissions([]);
      }
    } catch (err) {
      console.error('Error fetching consultant submissions:', err);
      showToast('Failed to fetch consultant submissions');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, sortBy]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Open Full Review Dossier
  const handleOpenReview = async (submissionId) => {
    try {
      const res = await axiosInstance.get(ENDPOINTS.CONSULTANT_SUBMISSION_DETAIL(submissionId));
      if (res.data?.Success) {
        setSelectedSubmission(res.data.submission);
        setStatusForm({
          id: res.data.submission.id,
          status: res.data.submission.status,
          admin_notes: res.data.submission.admin_notes || '',
        });
        setActiveReviewTab('overview');
        setIsReviewModalOpen(true);
      } else {
        alert('Could not load submission details.');
      }
    } catch (err) {
      console.error('Error loading submission details:', err);
      alert('Error loading submission dossier from backend.');
    }
  };

  // Open Quick Status Update Modal
  const handleOpenStatusModal = (sub) => {
    setStatusForm({
      id: sub.id,
      status: sub.status,
      admin_notes: sub.admin_notes || '',
    });
    setIsStatusModalOpen(true);
  };

  // Save Status & Admin Notes
  const handleSaveStatus = async (e) => {
    if (e) e.preventDefault();
    if (!statusForm.id) return;

    setIsSavingStatus(true);
    try {
      const res = await axiosInstance.patch(
        ENDPOINTS.CONSULTANT_SUBMISSION_DETAIL(statusForm.id),
        {
          status: statusForm.status,
          admin_notes: statusForm.admin_notes,
        }
      );

      if (res.data?.Success) {
        showToast('Consultant evaluation updated successfully');
        setIsStatusModalOpen(false);
        if (selectedSubmission && selectedSubmission.id === statusForm.id) {
          setSelectedSubmission({
            ...selectedSubmission,
            status: statusForm.status,
            admin_notes: statusForm.admin_notes,
            evaluated_at: res.data.evaluated_at || selectedSubmission.evaluated_at,
          });
        }
        fetchSubmissions();
      } else {
        alert(res.data?.Message || 'Update failed.');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Error updating status on server.');
    } finally {
      setIsSavingStatus(false);
    }
  };

  // Delete submission
  const handleDeleteSubmission = async (id, doctorName) => {
    if (!window.confirm(`Are you sure you want to permanently delete the evaluation packet for ${doctorName || 'this consultant'}? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await axiosInstance.delete(ENDPOINTS.CONSULTANT_SUBMISSION_DETAIL(id));
      if (res.data?.Success) {
        showToast('Evaluation packet deleted');
        if (isReviewModalOpen && selectedSubmission?.id === id) {
          setIsReviewModalOpen(false);
        }
        fetchSubmissions();
      } else {
        alert(res.data?.Message || 'Failed to delete submission');
      }
    } catch (err) {
      console.error('Error deleting submission:', err);
      alert('Error deleting submission');
    }
  };

  // Helper to ensure full submission data with answers is available
  const getFullSubmissionData = async (subOrId) => {
    if (typeof subOrId === 'object' && subOrId.answers && Object.keys(subOrId.answers).length > 0) {
      return subOrId;
    }
    const id = typeof subOrId === 'object' ? subOrId.id : subOrId;
    const res = await axiosInstance.get(ENDPOINTS.CONSULTANT_SUBMISSION_DETAIL(id));
    if (res.data?.Success && res.data.submission) {
      return res.data.submission;
    }
    throw new Error('Could not fetch full submission details.');
  };

  // Download single dossier in Excel (.xlsx)
  const handleDownloadExcel = async (subOrId) => {
    try {
      showToast('Preparing Excel dossier (.xlsx)...');
      const fullSub = await getFullSubmissionData(subOrId);
      exportDossierToExcel(fullSub, EXAM_DATA?.cases || []);
      showToast('Excel dossier downloaded successfully!');
    } catch (err) {
      console.error('Error downloading Excel dossier:', err);
      alert('Failed to generate Excel dossier.');
    }
  };

  // Download single dossier in PDF (.pdf)
  const handleDownloadPDF = async (subOrId) => {
    try {
      showToast('Generating official PDF dossier...');
      const fullSub = await getFullSubmissionData(subOrId);
      exportDossierToPDF(fullSub, EXAM_DATA?.cases || []);
      showToast('PDF dossier downloaded successfully!');
    } catch (err) {
      console.error('Error downloading PDF dossier:', err);
      alert('Failed to generate PDF dossier.');
    }
  };

  // Download single dossier in Plain Text (.txt) with auth
  const handleDownloadText = async (subId, docName) => {
    try {
      showToast('Downloading text summary...');
      const res = await axiosInstance.get(ENDPOINTS.CONSULTANT_SUBMISSION_DOWNLOAD(subId), {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'text/plain;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Consultant_Evaluation_${(docName || 'Report').replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast('Text dossier downloaded successfully!');
    } catch (err) {
      console.error('Error downloading text dossier:', err);
      alert('Failed to download text dossier.');
    }
  };

  // Bulk CSV Export with Bearer authentication
  const handleExportCSV = async () => {
    try {
      showToast('Generating CSV summary export...');
      const res = await axiosInstance.get(ENDPOINTS.CONSULTANT_SUBMISSIONS_EXPORT_CSV, {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Consultant_Evaluations_Summary_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showToast('CSV export downloaded successfully!');
    } catch (err) {
      console.error('Error exporting CSV:', err);
      alert('Failed to export CSV. Please check permissions.');
    }
  };

  // Bulk Excel Export of all submissions
  const handleExportExcelAll = () => {
    if (!submissions || submissions.length === 0) {
      alert('No submissions available to export.');
      return;
    }
    showToast('Exporting all submissions to Excel (.xlsx)...');
    exportAllSubmissionsToExcel(submissions);
    showToast('Submissions summary exported to Excel successfully!');
  };

  // Copy full answers
  const handleCopySummary = async (summaryText) => {
    if (!summaryText) {
      alert('No summary text available to copy.');
      return;
    }
    try {
      await navigator.clipboard.writeText(summaryText);
      showToast('Evaluation summary copied to clipboard');
    } catch (err) {
      const ta = document.createElement('textarea');
      ta.value = summaryText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Evaluation summary copied to clipboard');
    }
  };

  // Status Badge UI Helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <i className="fas fa-paper-plane mr-1.5 text-[10px]"></i>
            Submitted
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <i className="fas fa-check-circle mr-1.5 text-[10px]"></i>
            Approved
          </span>
        );
      case 'EVALUATED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <i className="fas fa-star mr-1.5 text-[10px]"></i>
            Evaluated
          </span>
        );
      case 'DRAFT':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <i className="fas fa-pencil-alt mr-1.5 text-[10px]"></i>
            In Progress
          </span>
        );
    }
  };

  // Format rating display helper
  const renderRatingPill = (val) => {
    if (val === undefined || val === null || val === '') return <span className="text-gray-400 italic">Not rated</span>;
    const num = Number(val);
    let colorClass = 'bg-gray-100 text-gray-700';
    if (num === 2) colorClass = 'bg-emerald-600 text-white';
    else if (num === 1) colorClass = 'bg-emerald-100 text-emerald-800 border border-emerald-300';
    else if (num === 0) colorClass = 'bg-slate-100 text-slate-800 border border-slate-300';
    else if (num === -1) colorClass = 'bg-amber-100 text-amber-800 border border-amber-300';
    else if (num === -2) colorClass = 'bg-red-600 text-white';

    const text = num > 0 ? `+${num}` : String(num);
    return (
      <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${colorClass}`}>
        {text}
      </span>
    );
  };

  const pedCases = (EXAM_DATA?.cases || []).filter((c) => c.part === 'Pediatric');
  const adCases = (EXAM_DATA?.cases || []).filter((c) => c.part !== 'Pediatric');

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1b2a2f] flex items-center gap-2.5">
            <i className="fas fa-user-md text-[#00acc1]"></i>
            Consultant Examination & Evaluations Portal
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor examiners, review clinical candidate markings, evaluate submissions, and download dossiers.
          </p>
        </div>

        {/* Global Header Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchSubmissions}
            className="px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg shadow-xs text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
            title="Refresh list"
          >
            <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
            Refresh
          </button>
          <button
            onClick={handleExportExcelAll}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
            title="Export all submissions to Excel spreadsheet"
          >
            <i className="fas fa-file-excel"></i>
            Export to Excel
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-[#00acc1] hover:bg-[#008ba3] text-white rounded-lg shadow-xs text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
            title="Export all submissions to CSV"
          >
            <i className="fas fa-file-csv"></i>
            Export to CSV
          </button>
        </div>
      </div>

      {/* KPI & Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-xl shrink-0">
            <i className="fas fa-user-md"></i>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{metrics.total_consultants}</div>
            <div className="text-xs font-medium text-gray-500 mt-0.5">Consultants Registered</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
            <i className="fas fa-paper-plane"></i>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{metrics.submitted_count}</div>
            <div className="text-xs font-medium text-gray-500 mt-0.5">Packets Submitted</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
            <i className="fas fa-pencil-alt"></i>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{metrics.draft_count}</div>
            <div className="text-xs font-medium text-gray-500 mt-0.5">In-Progress Drafts</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shrink-0">
            <i className="fas fa-award"></i>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{metrics.evaluated_count}</div>
            <div className="text-xs font-medium text-gray-500 mt-0.5">Evaluated / Approved</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-2xl font-bold text-gray-800">{metrics.avg_coverage}%</div>
            <div className="text-xs font-medium text-gray-500 mt-0.5">Average Case Coverage</div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(metrics.avg_coverage, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search by Doctor Name, Username, Mobile or Notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00acc1]"
          />
        </div>

        {/* Status Filters & Ordering */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-lg border border-gray-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'ALL' ? 'bg-white shadow text-[#00acc1]' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('SUBMITTED')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'SUBMITTED' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Submitted
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('DRAFT')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'DRAFT' ? 'bg-white shadow text-amber-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Drafts
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('EVALUATED')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'EVALUATED' ? 'bg-white shadow text-indigo-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Evaluated
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('APPROVED')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'APPROVED' ? 'bg-white shadow text-emerald-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Approved
            </button>
          </div>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium bg-white text-gray-700 focus:outline-none focus:border-[#00acc1]"
          >
            <option value="-last_saved_at">Recently Saved</option>
            <option value="-submitted_at">Recently Submitted</option>
            <option value="-started_at">Recently Started</option>
            <option value="status">Status (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/75 text-gray-600 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-5 text-left">Consultant Doctor</th>
                <th className="py-3.5 px-4 text-left">Contact</th>
                <th className="py-3.5 px-4 text-left">Status</th>
                <th className="py-3.5 px-4 text-left">Case Progress</th>
                <th className="py-3.5 px-4 text-left">Last Saved</th>
                <th className="py-3.5 px-4 text-left">Submitted At</th>
                <th className="py-3.5 px-4 text-left">Admin Evaluator</th>
                <th className="py-3.5 px-5 text-right w-48">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-16 text-center text-gray-500 font-medium">
                    <i className="fas fa-spinner fa-spin text-2xl text-[#00acc1] mb-2"></i>
                    <div>Loading consultant evaluations...</div>
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-16 text-center text-gray-500">
                    <i className="fas fa-inbox text-3xl text-gray-300 mb-2"></i>
                    <p className="font-semibold text-gray-700">No consultant submissions found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Consultant responses will appear here as doctors log in and begin evaluations.
                    </p>
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => {
                  const pct = sub.percent || 0;
                  return (
                    <tr key={sub.id} className="hover:bg-teal-50/20 transition-colors">
                      {/* Doctor info */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800 text-[14px]">
                            {sub.full_name || sub.username}
                          </span>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                            #{sub.id}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5">
                          @{sub.username}
                        </div>
                      </td>

                      {/* Mobile */}
                      <td className="py-4 px-4 text-gray-600 text-xs">
                        {sub.mobile_number ? (
                          <span className="flex items-center gap-1.5">
                            <i className="fas fa-phone-alt text-gray-400 text-[10px]"></i>
                            {sub.mobile_number}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {renderStatusBadge(sub.status)}
                      </td>

                      {/* Progress */}
                      <td className="py-4 px-4">
                        <div className="w-36">
                          <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-1">
                            <span>{sub.completed_cases || 0} / {sub.total_cases || 13} Cases</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                pct === 100
                                  ? 'bg-emerald-500'
                                  : pct > 50
                                  ? 'bg-blue-500'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-[10px] text-gray-400 mt-1">
                            {sub.answered_count || 0} response items filled
                          </div>
                        </div>
                      </td>

                      {/* Last Saved */}
                      <td className="py-4 px-4 text-xs text-gray-600">
                        {sub.last_saved_at ? (
                          <div>
                            <div className="font-medium text-gray-700">
                              {new Date(sub.last_saved_at).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </div>
                            <div className="text-[11px] text-gray-400">
                              {new Date(sub.last_saved_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>

                      {/* Submitted At */}
                      <td className="py-4 px-4 text-xs">
                        {sub.submitted_at ? (
                          <div className="text-blue-700">
                            <div className="font-semibold">
                              {new Date(sub.submitted_at).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </div>
                            <div className="text-[11px] opacity-75">
                              {new Date(sub.submitted_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Not submitted</span>
                        )}
                      </td>

                      {/* Evaluated By */}
                      <td className="py-4 px-4 text-xs text-gray-600">
                        {sub.evaluated_by_name ? (
                          <div>
                            <span className="font-medium text-gray-800">{sub.evaluated_by_name}</span>
                            {sub.evaluated_at && (
                              <div className="text-[10px] text-gray-400">
                                {new Date(sub.evaluated_at).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Pending</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Review Dossier Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenReview(sub.id)}
                            className="px-2.5 py-1.5 bg-[#00acc1] hover:bg-[#008ba3] text-white rounded text-xs font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-1"
                            title="Inspect & Review Full Dossier"
                          >
                            <i className="fas fa-eye text-[11px]"></i>
                            Review
                          </button>

                          {/* Download in Excel */}
                          <button
                            type="button"
                            onClick={() => handleDownloadExcel(sub)}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-xs transition-colors cursor-pointer"
                            title="Download Dossier in Excel (.xlsx)"
                          >
                            <i className="fas fa-file-excel text-[12px]"></i>
                          </button>

                          {/* Download in PDF */}
                          <button
                            type="button"
                            onClick={() => handleDownloadPDF(sub)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-xs transition-colors cursor-pointer"
                            title="Download Dossier in PDF (.pdf)"
                          >
                            <i className="fas fa-file-pdf text-[12px]"></i>
                          </button>

                          {/* Download Text Summary */}
                          <button
                            type="button"
                            onClick={() => handleDownloadText(sub.id, sub.full_name || sub.username)}
                            className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded text-xs transition-colors cursor-pointer"
                            title="Download Summary (.txt)"
                          >
                            <i className="fas fa-file-alt text-[12px]"></i>
                          </button>

                          {/* Quick Edit Status */}
                          <button
                            type="button"
                            onClick={() => handleOpenStatusModal(sub)}
                            className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded text-xs transition-colors cursor-pointer"
                            title="Change Status & Feedback"
                          >
                            <i className="fas fa-cog text-[12px]"></i>
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteSubmission(sub.id, sub.full_name || sub.username)}
                            className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded text-xs transition-colors cursor-pointer"
                            title="Delete Submission"
                          >
                            <i className="fas fa-trash-alt text-[12px]"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL REVIEW DOSSIER MODAL */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Consultant Clinical Examination Dossier"
        maxWidth="max-w-6xl"
      >
        {selectedSubmission && (
          <div className="flex flex-col flex-1 overflow-hidden max-h-[85vh]">
            {/* Modal Subheader with Doctor profile & quick status */}
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#00acc1] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {(selectedSubmission.full_name || selectedSubmission.username).charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800 leading-tight">
                    {selectedSubmission.full_name || selectedSubmission.username}
                  </h3>
                  <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                    <span>@{selectedSubmission.username}</span>
                    <span>•</span>
                    <span>{selectedSubmission.mobile_number || 'No contact'}</span>
                    <span>•</span>
                    <span>Exam ID: #{selectedSubmission.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {renderStatusBadge(selectedSubmission.status)}

                {/* Download in Excel */}
                <button
                  type="button"
                  onClick={() => handleDownloadExcel(selectedSubmission)}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  title="Download full dossier in Excel (.xlsx)"
                >
                  <i className="fas fa-file-excel"></i>
                  <span>Excel (.xlsx)</span>
                </button>

                {/* Download in PDF */}
                <button
                  type="button"
                  onClick={() => handleDownloadPDF(selectedSubmission)}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  title="Download official evaluation dossier in PDF (.pdf)"
                >
                  <i className="fas fa-file-pdf"></i>
                  <span>PDF (.pdf)</span>
                </button>

                {/* Download in TXT */}
                <button
                  type="button"
                  onClick={() => handleDownloadText(selectedSubmission.id, selectedSubmission.full_name)}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-700 text-slate-700 hover:text-white border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Download text summary"
                >
                  <i className="fas fa-file-alt"></i>
                  <span>TXT</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopySummary(selectedSubmission.compiled_summary)}
                  className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <i className="far fa-copy"></i>
                  Copy Transcript
                </button>
              </div>
            </div>

            {/* Navigation Tabs inside Dossier */}
            <div className="px-6 border-b border-gray-200 bg-white flex gap-6 shrink-0 text-sm font-medium">
              <button
                type="button"
                onClick={() => setActiveReviewTab('overview')}
                className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                  activeReviewTab === 'overview'
                    ? 'border-[#00acc1] text-[#00acc1] font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <i className="fas fa-clipboard-list"></i>
                Overview & Summary
              </button>
              <button
                type="button"
                onClick={() => setActiveReviewTab('pediatric')}
                className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                  activeReviewTab === 'pediatric'
                    ? 'border-[#00acc1] text-[#00acc1] font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <i className="fas fa-baby"></i>
                Pediatric Cases (1–6)
              </button>
              <button
                type="button"
                onClick={() => setActiveReviewTab('adult')}
                className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                  activeReviewTab === 'adult'
                    ? 'border-[#00acc1] text-[#00acc1] font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <i className="fas fa-user"></i>
                Adult Cases (7–13)
              </button>
              <button
                type="button"
                onClick={() => setActiveReviewTab('closing')}
                className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                  activeReviewTab === 'closing'
                    ? 'border-[#00acc1] text-[#00acc1] font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <i className="fas fa-comment-dots"></i>
                Closing Feedback
              </button>
            </div>

            {/* Tab Body Content */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6 bg-slate-50">
              {/* TAB 1: OVERVIEW */}
              {activeReviewTab === 'overview' && (
                <div className="space-y-6">
                  {/* Progress Stats Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <div className="text-xs text-gray-500 font-medium">Completed Cases</div>
                      <div className="text-xl font-bold text-gray-800 mt-1">
                        {selectedSubmission.progress_stats?.completed_cases || 0} / 13 Cases
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <div className="text-xs text-gray-500 font-medium">Total Exam Coverage</div>
                      <div className="text-xl font-bold text-emerald-600 mt-1">
                        {selectedSubmission.progress_stats?.percent || 0}%
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <div className="text-xs text-gray-500 font-medium">Started At</div>
                      <div className="text-sm font-semibold text-gray-700 mt-1">
                        {selectedSubmission.started_at ? new Date(selectedSubmission.started_at).toLocaleString() : '—'}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <div className="text-xs text-gray-500 font-medium">Last Saved At</div>
                      <div className="text-sm font-semibold text-gray-700 mt-1">
                        {selectedSubmission.last_saved_at ? new Date(selectedSubmission.last_saved_at).toLocaleString() : '—'}
                      </div>
                    </div>
                  </div>

                  {/* Admin Governance & Scoring Panel */}
                  <div className="bg-white p-5 rounded-xl border border-teal-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-gray-800 flex items-center gap-2">
                        <i className="fas fa-clipboard-check text-[#00acc1]"></i>
                        Administrative Governance & Board Ruling
                      </h4>
                      <span className="text-xs text-gray-500">
                        Evaluated By: {selectedSubmission.evaluated_by_name || 'Pending assignment'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                          Evaluation Status
                        </label>
                        <select
                          value={statusForm.status}
                          onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#00acc1]"
                        >
                          <option value="DRAFT">In Progress / Draft</option>
                          <option value="SUBMITTED">Submitted (Pending Review)</option>
                          <option value="EVALUATED">Evaluated</option>
                          <option value="APPROVED">Approved</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                          Admin / Board Reviewer Notes
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Excellent clinical pediatric coverage, approved for board panel."
                          value={statusForm.admin_notes}
                          onChange={(e) => setStatusForm({ ...statusForm, admin_notes: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00acc1]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleSaveStatus}
                        disabled={isSavingStatus}
                        className="px-5 py-2 bg-[#00acc1] hover:bg-[#0097a7] text-white font-semibold rounded-lg text-sm shadow transition-colors cursor-pointer flex items-center gap-2"
                      >
                        {isSavingStatus ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                        Save Evaluation Ruling
                      </button>
                    </div>
                  </div>

                  {/* Human-Readable Compiled Dossier Transcript */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Compiled Human-Readable Dossier Transcript
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleCopySummary(selectedSubmission.compiled_summary)}
                        className="text-xs text-[#00acc1] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <i className="far fa-copy"></i>
                        Copy Full Text
                      </button>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs font-mono whitespace-pre-wrap max-h-96 overflow-y-auto custom-scrollbar leading-relaxed">
                      {selectedSubmission.compiled_summary || 'No transcript generated yet.'}
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB 2 & 3: PEDIATRIC & ADULT CASES INSPECTION */}
              {(activeReviewTab === 'pediatric' || activeReviewTab === 'adult') && (
                <div className="space-y-6">
                  {(activeReviewTab === 'pediatric' ? pedCases : adCases).map((c) => {
                    const p = 'c' + c.n + '-';
                    const ansMap = selectedSubmission.answers || {};
                    const isSkipped = Boolean(ansMap[p + 'scope']);

                    return (
                      <div
                        key={c.n}
                        className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
                          isSkipped ? 'border-gray-200 opacity-60' : 'border-gray-200'
                        }`}
                      >
                        {/* Case Header */}
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#1b2a2f] text-white flex items-center justify-center font-bold text-sm">
                              {c.n}
                            </span>
                            <div>
                              <h4 className="font-bold text-gray-800 text-base">
                                Case {c.n} ({c.part})
                              </h4>
                              <p className="text-xs text-gray-500">
                                {c.scenario && c.scenario[0] ? c.scenario[0][1].slice(0, 90) + '...' : ''}
                              </p>
                            </div>
                          </div>

                          {isSkipped && (
                            <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-xs font-semibold">
                              Marked Outside Scope (Skipped)
                            </span>
                          )}
                        </div>

                        {/* Case Details */}
                        {!isSkipped && (
                          <div className="p-6 space-y-6">
                            {/* Opening Question if present */}
                            {c.opening && (
                              <div className="p-4 bg-teal-50/50 rounded-lg border border-teal-100 space-y-2">
                                <div className="text-xs font-bold text-teal-800 uppercase tracking-wide">
                                  {c.opening.id} · Opening Question
                                </div>
                                <div className="text-sm font-semibold text-gray-800">{c.opening.q}</div>
                                <div className="mt-2 text-sm text-gray-700 bg-white p-3 rounded border border-teal-100">
                                  <b className="text-xs text-gray-500 block mb-1">Doctor's Clinical Answer:</b>
                                  {ansMap[p + 'open'] || <span className="text-gray-400 italic">No answer provided</span>}
                                </div>
                              </div>
                            )}

                            {/* Candidate Questions and Doctor's Verdicts */}
                            <div className="space-y-4">
                              <h5 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                                Examination Candidate Questions & Doctor Ruling
                              </h5>

                              {c.qs.map((q, qIdx) => {
                                const qId = p + 'q' + (qIdx + 1);
                                const verdict = ansMap[qId];
                                const disagreeWhy = ansMap[qId + '-why'];
                                const agreeWhy = ansMap[qId + '-agree-why'];
                                const rule = ansMap[qId + '-rule'];

                                return (
                                  <div key={qIdx} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                                    <div className="font-semibold text-gray-800 text-sm">{q.q}</div>
                                    <div className="bg-white p-3 rounded border border-gray-200 text-xs text-gray-600 leading-relaxed">
                                      <b className="text-gray-700 block mb-1">Candidate's oral exam answer:</b>
                                      {q.a}
                                    </div>

                                    {/* Doctor's Verdict */}
                                    <div className="flex flex-col gap-2 pt-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-gray-600">Consultant Ruling:</span>
                                        {verdict === 'yes' ? (
                                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                            <i className="fas fa-check text-[10px]"></i>
                                            AGREES WITH CANDIDATE
                                          </span>
                                        ) : verdict === 'no' ? (
                                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
                                            <i className="fas fa-times text-[10px]"></i>
                                            DOES NOT AGREE
                                          </span>
                                        ) : (
                                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                                            Not Marked
                                          </span>
                                        )}
                                      </div>

                                      {/* Explanation if Agree */}
                                      {verdict === 'yes' && agreeWhy && (
                                        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded text-xs text-emerald-900 mt-1">
                                          <b>Doctor's Supporting Rationale:</b> {agreeWhy}
                                        </div>
                                      )}

                                      {/* Explanation if Disagree */}
                                      {verdict === 'no' && disagreeWhy && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-900 mt-1">
                                          <b>Why Doctor Disagrees / Doctor's Alternative Answer:</b> {disagreeWhy}
                                        </div>
                                      )}

                                      {/* Ruling on reviewer note */}
                                      {rule && (
                                        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 mt-1">
                                          <b>Doctor's Ruling on Candidate Note:</b> {rule}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Second Candidate Evaluation */}
                            {c.second && (
                              <div className="p-4 bg-indigo-50/40 rounded-lg border border-indigo-100 space-y-2">
                                <div className="text-xs font-bold text-indigo-800 uppercase tracking-wide">
                                  Second Candidate Pass/Fail Evaluation
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs font-semibold text-gray-700">Ruling:</span>
                                  {ansMap[p + 'second-v'] === 'pass' ? (
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                      PASS
                                    </span>
                                  ) : ansMap[p + 'second-v'] === 'fail' ? (
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
                                      FAIL
                                    </span>
                                  ) : (
                                    <span className="text-xs text-gray-400 italic">Not evaluated</span>
                                  )}
                                </div>
                                {ansMap[p + 'second'] && (
                                  <div className="text-xs text-indigo-950 bg-white p-3 rounded border border-indigo-100 mt-1">
                                    <b>Doctor's Reasoning:</b> {ansMap[p + 'second']}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Management Options Ratings */}
                            {c.ratings && c.ratings.length > 0 && (
                              <div className="space-y-3">
                                <h5 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                                  Management Option Ratings (-2 Strongly Inappropriate to +2 Strongly Indicated)
                                </h5>
                                {c.ratings.map((g, gi) => (
                                  <div key={gi} className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-2">
                                    <div className="text-xs font-bold text-gray-700">{g.title}</div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                      {g.opts.map((optText, oi) => {
                                        const rate = ansMap[p + 'r' + gi + '-' + oi];
                                        return (
                                          <div
                                            key={oi}
                                            className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100"
                                          >
                                            <span className="text-gray-700 pr-2">{optText}</span>
                                            {renderRatingPill(rate)}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Practice & Validity Feedback */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                              <div className="p-3 bg-white rounded-lg border border-gray-200">
                                <b className="text-gray-700 block mb-1">Missed / Unnecessary Questions Feedback:</b>
                                <span className="text-gray-600">
                                  {ansMap[p + 'missed'] || <span className="text-gray-400 italic">No notes</span>}
                                </span>
                              </div>
                              <div className="p-3 bg-white rounded-lg border border-gray-200">
                                <b className="text-gray-700 block mb-1">Realistic Task in Real Practice:</b>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-gray-800">{ansMap[p + 'real'] || 'Not answered'}</span>
                                  {ansMap[p + 'real-why'] && (
                                    <span className="text-gray-500">— {ansMap[p + 'real-why']}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 4: CLOSING QUESTION */}
              {activeReviewTab === 'closing' && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                      Final Examination Evaluation
                    </span>
                    <h3 className="text-base font-bold text-gray-800">Closing Question</h3>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-gray-800 font-medium">
                    {EXAM_DATA?.closing}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Consultant Doctor's Closing Response
                    </label>
                    <div className="p-4 bg-white rounded-lg border border-gray-300 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed shadow-inner">
                      {selectedSubmission.answers?.closing || (
                        <span className="text-gray-400 italic">No closing response provided.</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Footer Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center shrink-0">
              <span className="text-xs text-gray-500">
                Exam Title: {selectedSubmission.exam_title || 'Clinical Examination Packet'}
              </span>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg text-sm transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* QUICK STATUS & ADMIN NOTES MODAL */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Update Evaluation Status & Notes"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveStatus} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Evaluation Status
              </label>
              <select
                value={statusForm.status}
                onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:border-[#00acc1]"
              >
                <option value="DRAFT">In Progress / Draft</option>
                <option value="SUBMITTED">Submitted (Ready for Board)</option>
                <option value="EVALUATED">Evaluated</option>
                <option value="APPROVED">Approved</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Admin / Board Feedback Notes
              </label>
              <textarea
                rows={4}
                value={statusForm.admin_notes}
                onChange={(e) => setStatusForm({ ...statusForm, admin_notes: e.target.value })}
                placeholder="Enter feedback or internal board notes on this consultant's marking..."
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-[#00acc1]"
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsStatusModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-600 font-semibold rounded-lg text-sm hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSavingStatus}
              className="px-5 py-2 bg-[#00acc1] hover:bg-[#0097a7] text-white font-semibold rounded-lg text-sm shadow transition-colors cursor-pointer flex items-center gap-2"
            >
              {isSavingStatus ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check"></i>}
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#1b2a2f] text-white px-5 py-3 rounded-lg shadow-xl text-sm z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <i className="fas fa-check-circle text-emerald-400"></i>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default ConsultantAdminEvaluations;
