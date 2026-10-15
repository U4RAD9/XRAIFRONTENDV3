import React, { useState } from 'react';

function ConsentDetailModal({ consent, isOpen, onClose, onWithdrawClick }) {
  const [copied, setCopied] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  if (!isOpen || !consent) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(consent.consent_id || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Safe parse consented_purposes
  let purposesObj = {};
  try {
    if (typeof consent.consented_purposes === 'string') {
      purposesObj = JSON.parse(consent.consented_purposes);
    } else if (consent.consented_purposes && typeof consent.consented_purposes === 'object') {
      purposesObj = consent.consented_purposes;
    }
  } catch (err) {
    purposesObj = {};
  }

  const requiredPurposes = purposesObj.required || {};
  const optionalPurposes = purposesObj.optional || {};

  const requiredEntries = Object.entries(requiredPurposes);
  const optionalEntries = Object.entries(optionalPurposes);

  const formattedDate = consent.consent_timestamp 
    ? new Date(consent.consent_timestamp).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'medium',
      })
    : (consent.created_at ? new Date(consent.created_at).toLocaleString('en-IN') : 'N/A');

  const withdrawalMeta = consent.metadata?.withdrawal || null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#233560] to-[#1c2c52] text-white px-6 py-4.5 flex justify-between items-start shrink-0">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 text-sm">
                <i className="fas fa-shield-alt"></i>
              </span>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  DPDP Consent Audit Record
                  <span className={`text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full border ${
                    consent.status === 'ACTIVE' 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' 
                      : consent.status === 'PENDING_WITHDRAWAL'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/30 animate-pulse'
                      : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                  }`}>
                    {consent.status === 'PENDING_WITHDRAWAL' ? 'REVOCATION REQUESTED' : (consent.status || 'ACTIVE')}
                  </span>
                </h2>
                <div className="flex items-center gap-2 text-xs text-gray-300 mt-0.5">
                  <span className="font-mono text-cyan-300 font-semibold">{consent.consent_id}</span>
                  <button 
                    onClick={handleCopyId}
                    className="hover:text-white transition-colors cursor-pointer text-[11px] bg-white/10 px-1.5 py-0.5 rounded"
                    title="Copy Consent ID"
                  >
                    <i className={copied ? "fas fa-check text-emerald-400" : "far fa-copy"}></i>
                    <span className="ml-1">{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Print Audit Report"
            >
              <i className="fas fa-print"></i>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 custom-scrollbar">
          
          {/* Key Identification Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Patient / User ID</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                {consent.patient_id ? `#${consent.patient_id}` : 'Unassigned'}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Mobile Number</span>
              <span className="text-sm font-semibold text-slate-900 mt-0.5 block font-mono">
                {consent.patient_number || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Shared OTP</span>
              <span className="inline-block mt-0.5 px-2 py-0.5 font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded">
                {consent.shared_otp || 'Verified'}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Notice Version</span>
              <span className="text-sm font-semibold text-slate-800 mt-0.5 block">
                {consent.notice_version || 'v1.0 (DPDP 2023)'}
              </span>
            </div>
          </div>

          {/* Full Name & Timestamp Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-[11px] font-medium text-slate-400 block">Data Principal Full Name</span>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">{consent.full_name || 'N/A'}</p>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-[11px] font-medium text-slate-400 block">Consent Captured At</span>
              <p className="text-sm font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                <i className="far fa-clock text-slate-400"></i>
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Pending Revocation Request Banner (if applicable) */}
          {consent.status === 'PENDING_WITHDRAWAL' && (
            <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl text-amber-900 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-amber-800 mb-1">
                <i className="fas fa-hourglass-half"></i>
                Patient Revocation Request Awaiting SuperAdmin Approval
              </div>
              <p className="text-xs text-amber-700 mb-2.5">
                This patient submitted a formal request to revoke consent under DPDP Act Section 6(4). As Data Fiduciary, review and decision are pending.
              </p>
              {consent.metadata?.withdrawal_request && (
                <div className="space-y-1.5 text-xs bg-white/80 p-3 rounded-lg border border-amber-200">
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-semibold text-amber-900">Requested Timestamp:</span>
                    <span>{new Date(consent.metadata.withdrawal_request.requested_at).toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-amber-900 block mb-0.5">Patient's Stated Reason:</span>
                    <p className="italic text-slate-700 bg-amber-50/50 p-2 rounded border border-amber-100">
                      "{consent.metadata.withdrawal_request.reason || 'No detailed reason specified.'}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Withdrawal Banner (if applicable) */}
          {consent.status === 'WITHDRAWN' && (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-900">
              <div className="flex items-center gap-2 font-bold text-rose-800 mb-1">
                <i className="fas fa-exclamation-triangle"></i>
                Consent Withdrawn under DPDP Act Section 6(4)
              </div>
              <p className="text-xs text-rose-700 mb-2">
                This user has formally revoked consent. Data processing for optional purposes has terminated.
              </p>
              {withdrawalMeta && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-white/70 p-2.5 rounded-lg border border-rose-200">
                  <div>
                    <span className="font-semibold text-rose-800">Withdrawn At: </span>
                    <span>{new Date(withdrawalMeta.withdrawn_at).toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-rose-800">Authorized By: </span>
                    <span>{withdrawalMeta.withdrawn_by || 'Admin/User'}</span>
                  </div>
                  <div className="col-span-full">
                    <span className="font-semibold text-rose-800">Reason: </span>
                    <span>{withdrawalMeta.reason || 'Requested by data principal'}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section: Consented Purposes Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <i className="fas fa-clipboard-check text-[#00acc1]"></i>
                Consented Purposes Breakdown
              </h3>
              <span className="text-[11px] text-slate-500">
                Digital Personal Data Protection Act 2023 (Section 6)
              </span>
            </div>

            {/* Required Clauses */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Mandatory Notice & Service Clauses (Required)
                </h4>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                  {requiredEntries.length} Items Agreed
                </span>
              </div>

              <div className="space-y-2">
                {requiredEntries.length > 0 ? (
                  requiredEntries.map(([clauseText, agreed], idx) => (
                    <div 
                      key={idx} 
                      className="p-3 bg-emerald-50/50 border border-emerald-200/80 rounded-xl flex items-start gap-3 transition-colors hover:bg-emerald-50"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <i className="fas fa-check text-[10px]"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm text-slate-800 font-medium leading-relaxed">
                          {clauseText}
                        </p>
                      </div>
                      <span className="shrink-0 text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Agreed
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No specific required clauses logged.</p>
                )}
              </div>
            </div>

            {/* Optional Clauses */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                  Granular & Optional Consent Clauses
                </h4>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                  {optionalEntries.length} Granular Options
                </span>
              </div>

              <div className="space-y-2">
                {optionalEntries.length > 0 ? (
                  optionalEntries.map(([clauseText, consented], idx) => (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                        consented 
                          ? 'bg-cyan-50/40 border-cyan-200/80 hover:bg-cyan-50/70' 
                          : 'bg-slate-50/70 border-slate-200 text-slate-500'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${
                        consented ? 'bg-cyan-600 text-white' : 'bg-slate-300 text-slate-600'
                      }`}>
                        <i className={`fas ${consented ? 'fa-check' : 'fa-times'} text-[10px]`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs md:text-sm leading-relaxed ${consented ? 'font-medium text-slate-800' : 'text-slate-500'}`}>
                          {clauseText}
                        </p>
                      </div>
                      <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                        consented 
                          ? 'text-cyan-800 bg-cyan-100 border-cyan-300' 
                          : 'text-slate-600 bg-slate-200/70 border-slate-300'
                      }`}>
                        {consented ? 'Consented' : 'Opted Out'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No optional clauses configured.</p>
                )}
              </div>
            </div>

            {/* Patient Self-Service Preference Updates Trail */}
            {consent.metadata?.preference_history && consent.metadata.preference_history.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <i className="fas fa-history text-[#00acc1]"></i>
                  Patient Self-Service Preference Updates Trail
                </h4>
                <div className="space-y-2">
                  {consent.metadata.preference_history.map((hist, hIdx) => (
                    <div key={hIdx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-semibold text-slate-800">{hist.updated_by}</span> updated optional preferences
                        <span className="text-slate-400 text-[11px] block">
                          {new Date(hist.updated_at).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                        <span className={`px-2 py-0.5 rounded border ${hist.preferences?.research ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-300'}`}>
                          Research: {hist.preferences?.research ? 'ON' : 'OFF'}
                        </span>
                        <span className={`px-2 py-0.5 rounded border ${hist.preferences?.marketing ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-300'}`}>
                          Offers: {hist.preferences?.marketing ? 'ON' : 'OFF'}
                        </span>
                        <span className={`px-2 py-0.5 rounded border ${hist.preferences?.retention ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-300'}`}>
                          Retention: {hist.preferences?.retention ? 'ON' : 'OFF'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Collapsible Raw JSON for Technical Auditors */}
          <div className="pt-2">
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 focus:outline-none cursor-pointer"
            >
              <i className={`fas fa-chevron-${showRawJson ? 'up' : 'down'} text-[10px]`}></i>
              {showRawJson ? 'Hide Raw Audit JSON' : 'View Raw Audit JSON Payload'}
            </button>
            {showRawJson && (
              <pre className="mt-2 p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto border border-slate-800 max-h-48 custom-scrollbar">
                {JSON.stringify(consent, null, 2)}
              </pre>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex flex-wrap justify-between items-center gap-3 shrink-0">
          <div className="text-[11px] text-slate-500">
            Immutable Audit Trail • Indian DPDP Act 2023 Compliance
          </div>
          <div className="flex items-center gap-2">
            {(consent.status === 'ACTIVE' || consent.status === 'PENDING_WITHDRAWAL') && onWithdrawClick && (
              <button
                onClick={() => {
                  onClose();
                  onWithdrawClick(consent);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border shadow-xs ${
                  consent.status === 'PENDING_WITHDRAWAL'
                    ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-300'
                }`}
              >
                <i className={consent.status === 'PENDING_WITHDRAWAL' ? 'fas fa-tasks' : 'fas fa-ban'}></i>
                {consent.status === 'PENDING_WITHDRAWAL' ? 'Process Revocation Request' : 'Withdraw Consent'}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ConsentDetailModal;
