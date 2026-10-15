import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';
import Pagination from '../../components/Pagination';
import ConsentDetailModal from '../components/ConsentDetailModal';
import WithdrawConsentModal from '../components/WithdrawConsentModal';

function SuperAdminConsentManagement() {
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // '' = all
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Selected for inspection / withdrawal
  const [selectedConsent, setSelectedConsent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  // Copy indicator state
  const [copiedId, setCopiedId] = useState(null);

  // Quick stats state
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    withdrawn: 0,
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 450);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Consents
  const fetchConsents = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        page_size: pageSize,
      };
      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }
      if (statusFilter) {
        params.status = statusFilter;
      }

      const res = await axiosInstance.get(ENDPOINTS.DPDP_CONSENTS, { params });
      
      const results = res.data.results || (Array.isArray(res.data) ? res.data : []);
      const count = res.data.count ?? results.length;
      const pages = res.data.total_pages ?? Math.ceil(count / pageSize) ?? 1;

      setConsents(results);
      setTotalCount(count);
      setTotalPages(pages || 1);

      // Compute quick stats from current counts
      const activeCount = results.filter(c => c.status === 'ACTIVE').length;
      const pendingCount = results.filter(c => c.status === 'PENDING_WITHDRAWAL').length;
      const withdrawnCount = results.filter(c => c.status === 'WITHDRAWN').length;
      setStats({
        total: count,
        active: statusFilter === 'ACTIVE' ? count : activeCount,
        pending: statusFilter === 'PENDING_WITHDRAWAL' ? count : pendingCount,
        withdrawn: statusFilter === 'WITHDRAWN' ? count : withdrawnCount,
      });

    } catch (err) {
      console.error('Error fetching DPDP consent logs:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentPage, pageSize, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchConsents();
  }, [fetchConsents]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchConsents();
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleViewDetail = (item) => {
    setSelectedConsent(item);
    setShowDetailModal(true);
  };

  const handleOpenWithdraw = (item) => {
    setSelectedConsent(item);
    setShowWithdrawModal(true);
  };

  const handleConfirmWithdraw = async (payload) => {
    if (!selectedConsent) return;
    try {
      setWithdrawLoading(true);
      const res = await axiosInstance.post(
        `${ENDPOINTS.DPDP_CONSENTS}${selectedConsent.id}/withdraw/`,
        payload
      );
      if (res.data?.Success || res.status === 200) {
        alert('Consent status updated to WITHDRAWN successfully.');
        setShowWithdrawModal(false);
        fetchConsents();
      } else {
        alert(res.data?.Message || 'Failed to update consent status.');
      }
    } catch (err) {
      console.error('Error withdrawing consent:', err);
      alert(err?.response?.data?.detail || 'Failed to withdraw consent.');
    } finally {
      setWithdrawLoading(false);
    }
  };

  const handleRejectWithdrawal = async (consent, remarks) => {
    try {
      setWithdrawLoading(true);
      const res = await axiosInstance.post(
        `${ENDPOINTS.DPDP_CONSENTS}${consent.id}/reject_withdrawal/`,
        { remarks }
      );
      if (res.data?.Success || res.status === 200) {
        alert('Revocation request dismissed/rejected. Consent remains ACTIVE.');
        setShowWithdrawModal(false);
        fetchConsents();
      } else {
        alert(res.data?.Message || 'Failed to reject request.');
      }
    } catch (err) {
      console.error('Error rejecting withdrawal:', err);
      alert('Failed to reject revocation request.');
    } finally {
      setWithdrawLoading(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!consents.length) {
      alert('No consent records available to export.');
      return;
    }

    const headers = [
      'Consent ID',
      'Patient ID',
      'Patient Name',
      'Mobile Number',
      'Email',
      'Shared OTP',
      'Status',
      'Notice Version',
      'Consent Timestamp',
      'Withdrawn Date',
      'Withdrawal Reason',
    ];

    const rows = consents.map(c => {
      const withdrawal = c.metadata?.withdrawal || {};
      return [
        `"${c.consent_id || ''}"`,
        `"${c.patient_id || ''}"`,
        `"${(c.full_name || '').replace(/"/g, '""')}"`,
        `"${c.patient_number || ''}"`,
        `"${c.email || ''}"`,
        `"${c.shared_otp || ''}"`,
        `"${c.status || 'ACTIVE'}"`,
        `"${c.notice_version || 'v1.0'}"`,
        `"${c.consent_timestamp || c.created_at || ''}"`,
        `"${withdrawal.withdrawn_at || ''}"`,
        `"${(withdrawal.reason || '').replace(/"/g, '""')}"`,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DPDP_Consent_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title & Actions Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl shadow-xs border border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#233560] to-[#00acc1] flex items-center justify-center text-white shadow-sm">
              <i className="fas fa-file-contract text-lg"></i>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                DPDP Consent Governance & Audit
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                Indian Digital Personal Data Protection Act 2023 • Section 5 & 6 Compliance Logs
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/70 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Refresh table"
          >
            <i className={`fas fa-sync-alt ${refreshing ? 'fa-spin' : ''}`}></i>
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#00acc1] hover:bg-[#0097a7] rounded-xl shadow-xs transition-colors cursor-pointer"
            title="Download audit records as CSV"
          >
            <i className="fas fa-download"></i>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#00acc1] text-xl shrink-0">
            <i className="fas fa-clipboard-list"></i>
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Total Consent Logs</span>
            <h3 className="text-2xl font-bold text-slate-900 leading-tight mt-0.5">{totalCount}</h3>
            <span className="text-[11px] text-slate-400">All registered consents</span>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-xl shrink-0">
            <i className="fas fa-check-circle"></i>
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Active Consents</span>
            <h3 className="text-2xl font-bold text-emerald-600 leading-tight mt-0.5">
              {statusFilter === 'ACTIVE' ? totalCount : consents.filter(c => c.status === 'ACTIVE').length}
            </h3>
            <span className="text-[11px] text-emerald-700 font-medium">Valid & processing</span>
          </div>
        </div>

        <div 
          onClick={() => {
            setStatusFilter('PENDING_WITHDRAWAL');
            setCurrentPage(1);
          }}
          className={`bg-white p-4.5 rounded-2xl border shadow-xs flex items-center gap-4 cursor-pointer transition-all hover:shadow-md ${
            stats.pending > 0 ? 'border-amber-400 bg-amber-50/20 ring-2 ring-amber-400/20' : 'border-slate-200/80'
          }`}
          title="Click to filter by Pending Revocation Requests"
        >
          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xl shrink-0 ${
            stats.pending > 0 ? 'bg-amber-100 border-amber-200 text-amber-700 animate-pulse' : 'bg-amber-50 border-amber-100 text-amber-600'
          }`}>
            <i className="fas fa-hourglass-half"></i>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Revocation Requests</span>
              {stats.pending > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                  Action
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-amber-600 leading-tight mt-0.5">
              {statusFilter === 'PENDING_WITHDRAWAL' ? totalCount : (stats.pending || consents.filter(c => c.status === 'PENDING_WITHDRAWAL').length)}
            </h3>
            <span className="text-[11px] text-amber-700 font-medium">
              {stats.pending > 0 ? `${stats.pending} awaiting review` : '0 pending review'}
            </span>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 text-xl shrink-0">
            <i className="fas fa-ban"></i>
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Withdrawn Consents</span>
            <h3 className="text-2xl font-bold text-rose-600 leading-tight mt-0.5">
              {statusFilter === 'WITHDRAWN' ? totalCount : consents.filter(c => c.status === 'WITHDRAWN').length}
            </h3>
            <span className="text-[11px] text-rose-600 font-medium">Section 6(4) revoked</span>
          </div>
        </div>
      </div>

      {/* Pending Revocation Requests Banner */}
      {stats.pending > 0 && (
        <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg shrink-0 shadow-xs">
              <i className="fas fa-bell animate-bounce"></i>
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-950">
                Action Required: {stats.pending} Patient Revocation Request{stats.pending > 1 ? 's' : ''} Awaiting Review
              </h4>
              <p className="text-xs text-amber-800">
                Data Principals have requested to revoke their consent. As SuperAdmin, your regulatory review and sign-off is required before final revocation.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setStatusFilter('PENDING_WITHDRAWAL');
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
          >
            <i className="fas fa-tasks"></i>
            <span>Filter Pending Requests ({stats.pending})</span>
          </button>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search input */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <i className="fas fa-search text-xs"></i>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Consent ID, Mobile, Name, Patient ID, OTP..."
            className="w-full pl-9 pr-8 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00acc1] focus:border-transparent outline-none transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <i className="fas fa-times-circle text-xs"></i>
            </button>
          )}
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00acc1] outline-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING_WITHDRAWAL">Revocation Requests (Pending)</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Per Page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00acc1] outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {(searchQuery || statusFilter) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('');
                setCurrentPage(1);
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <i className="fas fa-undo-alt mr-1"></i> Reset
            </button>
          )}
        </div>

      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-3.5 px-4">Consent ID</th>
                <th className="py-3.5 px-4">Patient / Principal</th>
                <th className="py-3.5 px-4">Contact & OTP</th>
                <th className="py-3.5 px-4">Notice Ver.</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <i className="fas fa-spinner fa-spin text-2xl text-[#00acc1]"></i>
                      <span className="text-xs font-medium">Loading DPDP consent audit logs...</span>
                    </div>
                  </td>
                </tr>
              ) : consents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-lg">
                        <i className="fas fa-folder-open"></i>
                      </div>
                      <p className="font-semibold text-slate-700">No Consent Records Found</p>
                      <p className="text-xs text-slate-400 max-w-xs">
                        {searchQuery || statusFilter 
                          ? 'Try adjusting your search criteria or resetting filters.' 
                          : 'Consent records will be recorded here whenever a user completes registration under DPDP Act 2023.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                consents.map((item) => {
                  const isWithdrawn = item.status === 'WITHDRAWN';
                  const isPending = item.status === 'PENDING_WITHDRAWAL';
                  const dateStr = item.consent_timestamp 
                    ? new Date(item.consent_timestamp).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : (item.created_at ? new Date(item.created_at).toLocaleString('en-IN') : 'N/A');

                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-slate-50/80 transition-colors group ${isPending ? 'bg-amber-50/30' : ''}`}
                    >
                      {/* Consent ID */}
                      <td className="py-3 px-4 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 text-xs">
                            {item.consent_id}
                          </span>
                          <button
                            onClick={() => handleCopyId(item.consent_id)}
                            className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors cursor-pointer"
                            title="Copy Consent ID"
                          >
                            <i className={copiedId === item.consent_id ? "fas fa-check text-emerald-500 text-[11px]" : "far fa-copy text-[11px]"}></i>
                          </button>
                        </div>
                      </td>

                      {/* Patient / Principal */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">
                          {item.full_name || 'N/A'}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                            PID: {item.patient_id ? `#${item.patient_id}` : 'Unassigned'}
                          </span>
                        </div>
                      </td>

                      {/* Mobile & OTP */}
                      <td className="py-3 px-4">
                        <div className="font-mono font-medium text-slate-800">
                          {item.patient_number || 'N/A'}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded font-mono">
                            OTP: {item.shared_otp || 'Verified'}
                          </span>
                        </div>
                      </td>

                      {/* Notice Version */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                          {item.notice_version || 'v1.0'}
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3 px-4 text-slate-600 text-[11px] whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <i className="far fa-calendar-alt text-slate-400"></i>
                          <span>{dateStr}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {isWithdrawn ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            Withdrawn
                          </span>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            Revocation Requested
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Active
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleViewDetail(item)}
                            className="px-2.5 py-1 text-xs font-semibold text-[#00acc1] bg-cyan-50 hover:bg-cyan-100 rounded-lg border border-cyan-200 transition-colors flex items-center gap-1 cursor-pointer"
                            title="Inspect Consent Breakdown & Audit Details"
                          >
                            <i className="fas fa-eye text-[11px]"></i>
                            <span>Audit</span>
                          </button>

                          {isPending ? (
                            <button
                              onClick={() => handleOpenWithdraw(item)}
                              className="px-2.5 py-1 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-300 transition-colors flex items-center gap-1 cursor-pointer shadow-xs animate-pulse"
                              title="Review & Process Revocation Request"
                            >
                              <i className="fas fa-tasks text-[11px] text-amber-600"></i>
                              <span>Process Request</span>
                            </button>
                          ) : !isWithdrawn ? (
                            <button
                              onClick={() => handleOpenWithdraw(item)}
                              className="px-2.5 py-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                              title="Withdraw Consent (DPDP Section 6(4))"
                            >
                              <i className="fas fa-ban text-[11px]"></i>
                              <span>Withdraw</span>
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Modals */}
      <ConsentDetailModal
        consent={selectedConsent}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onWithdrawClick={(consent) => {
          setSelectedConsent(consent);
          setShowWithdrawModal(true);
        }}
      />

      <WithdrawConsentModal
        consent={selectedConsent}
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onConfirm={handleConfirmWithdraw}
        onReject={handleRejectWithdrawal}
        loading={withdrawLoading}
      />

    </div>
  );
}

export default SuperAdminConsentManagement;
