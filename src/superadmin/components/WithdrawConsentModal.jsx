import React, { useState, useEffect } from 'react';

function WithdrawConsentModal({ consent, isOpen, onClose, onConfirm, onReject, loading = false }) {
  const [reason, setReason] = useState('');
  const [withdrawnBy, setWithdrawnBy] = useState(sessionStorage.getItem('FullName') || 'Super Admin');

  const isPendingRequest = consent?.status === 'PENDING_WITHDRAWAL' || consent?.metadata?.withdrawal_request?.status === 'PENDING';
  const patientRequest = consent?.metadata?.withdrawal_request || null;

  useEffect(() => {
    if (isPendingRequest && patientRequest?.reason) {
      setReason(patientRequest.reason);
    } else {
      setReason('Data principal requested withdrawal under DPDP Act Section 6(4)');
    }
  }, [consent, isPendingRequest, patientRequest]);

  if (!isOpen || !consent) return null;

  const handleApprove = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please provide a reason or remarks for the withdrawal audit log.');
      return;
    }
    onConfirm({
      reason,
      withdrawn_by: withdrawnBy
    });
  };

  const handleReject = () => {
    const remarks = prompt('Enter remarks/reason for dismissing this revocation request:', 'Request dismissed after patient verification');
    if (remarks !== null) {
      if (onReject) {
        onReject(consent, remarks);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className={`px-6 py-4 flex justify-between items-center text-white ${
          isPendingRequest ? 'bg-amber-600' : 'bg-rose-600'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
              <i className={`fas ${isPendingRequest ? 'fa-tasks' : 'fa-shield-virus'}`}></i>
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {isPendingRequest ? 'Review Patient Revocation Request' : 'Withdraw DPDP Consent'}
              </h3>
              <p className="text-[11px] text-white/80">DPDP Act 2023 • Section 6(4) Regulatory Authority</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            disabled={loading}
            className="text-white/80 hover:text-white p-1 rounded-md"
            aria-label="Close"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleApprove} className="p-6 space-y-4 text-sm text-slate-700">
          
          {/* Incoming Request Alert Box if submitted by patient */}
          {isPendingRequest && patientRequest && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <i className="fas fa-user-clock text-sm"></i>
                <span>Incoming Revocation Request From Patient</span>
              </div>
              <p>
                <strong>Patient:</strong> {consent.full_name || 'N/A'} ({consent.patient_number}) | <strong>Patient ID:</strong> #{consent.patient_id || 'N/A'}
              </p>
              <p>
                <strong>Requested At:</strong> {new Date(patientRequest.requested_at).toLocaleString('en-IN')}
              </p>
              <div className="p-2 bg-white rounded border border-amber-200 text-slate-700 mt-1">
                <span className="font-bold text-amber-900 block mb-0.5">Patient's Stated Reason:</span>
                <p className="italic">{patientRequest.reason || 'No specific remarks provided.'}</p>
              </div>
            </div>
          )}

          {!isPendingRequest && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs">
              <p className="font-bold mb-1">
                Are you sure you want to withdraw consent for <span className="font-mono underline">{consent.consent_id}</span>?
              </p>
              <p className="text-slate-600">
                Patient: <span className="font-semibold text-slate-800">{consent.full_name || 'N/A'}</span> ({consent.patient_number})
              </p>
              <p className="mt-1 text-slate-500 text-[11px]">
                This marks the consent status as <strong className="text-rose-700">WITHDRAWN</strong> in the regulatory compliance logs. All optional processing will be flagged as discontinued.
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {isPendingRequest ? 'Approval Remarks / Reason' : 'Withdrawal Reason / Remarks'} <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State the regulatory audit reason..."
              required
              className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00acc1] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              SuperAdmin Officer Name
            </label>
            <input
              type="text"
              value={withdrawnBy}
              onChange={(e) => setWithdrawnBy(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00acc1] outline-none bg-slate-50"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-200">
            <div>
              {isPendingRequest && onReject && (
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={loading}
                  className="px-3.5 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <i className="fas fa-times mr-1 text-slate-500"></i>
                  Dismiss / Reject Request
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-5 py-2 rounded-lg text-xs font-semibold text-white transition-colors flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 ${
                  isPendingRequest ? 'bg-amber-600 hover:bg-amber-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className={`fas ${isPendingRequest ? 'fa-check-circle' : 'fa-ban'}`}></i>
                    {isPendingRequest ? 'Approve & Finalize Revocation' : 'Confirm Withdrawal'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}

export default WithdrawConsentModal;
