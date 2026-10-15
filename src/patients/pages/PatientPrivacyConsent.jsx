import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';

function PatientPrivacyConsent() {
  const [consent, setConsent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Granular preference toggles
  const [researchConsent, setResearchConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [retentionConsent, setRetentionConsent] = useState(false);

  // Original state to detect unsaved changes
  const [originalPrefs, setOriginalPrefs] = useState({ research: false, marketing: false, retention: false });
  const [hasChanges, setHasChanges] = useState(false);

  // Withdrawal modal state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState('Data principal requested withdrawal via patient privacy hub');
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  // Status message / feedback
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchMyConsent();
  }, []);

  const fetchMyConsent = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(ENDPOINTS.DPDP_MY_CONSENT);
      if (res.data?.Success && res.data?.consent) {
        const c = res.data.consent;
        setConsent(c);

        // Parse optional preferences
        let optObj = {};
        if (typeof c.consented_purposes === 'string') {
          try {
            optObj = JSON.parse(c.consented_purposes)?.optional || {};
          } catch (e) {
            optObj = {};
          }
        } else if (c.consented_purposes && typeof c.consented_purposes === 'object') {
          optObj = c.consented_purposes.optional || {};
        }

        let isResearch = false;
        let isMarketing = false;
        let isRetention = false;

        Object.entries(optObj).forEach(([clause, val]) => {
          const lower = clause.toLowerCase();
          if (lower.includes('research')) isResearch = Boolean(val);
          if (lower.includes('offer') || lower.includes('marketing')) isMarketing = Boolean(val);
          if (lower.includes('retention') || lower.includes('period')) isRetention = Boolean(val);
        });

        setResearchConsent(isResearch);
        setMarketingConsent(isMarketing);
        setRetentionConsent(isRetention);
        setOriginalPrefs({ research: isResearch, marketing: isMarketing, retention: isRetention });
        setHasChanges(false);
      } else {
        setConsent(null);
      }
    } catch (err) {
      console.error('Error fetching patient consent record:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check for unsaved changes
  useEffect(() => {
    const changed =
      researchConsent !== originalPrefs.research ||
      marketingConsent !== originalPrefs.marketing ||
      retentionConsent !== originalPrefs.retention;
    setHasChanges(changed);
  }, [researchConsent, marketingConsent, retentionConsent, originalPrefs]);

  const handleCopyId = () => {
    if (!consent?.consent_id) return;
    navigator.clipboard.writeText(consent.consent_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSavePreferences = async () => {
    try {
      setSaving(true);
      setMessage(null);
      const payload = {
        action: 'update_preferences',
        optional_preferences: {
          research: researchConsent,
          marketing: marketingConsent,
          retention: retentionConsent,
        }
      };

      const res = await axiosInstance.post(ENDPOINTS.DPDP_MY_CONSENT, payload);
      if (res.data?.Success) {
        setConsent(res.data.consent);
        setOriginalPrefs({ research: researchConsent, marketing: marketingConsent, retention: retentionConsent });
        setHasChanges(false);
        setMessage({ type: 'success', text: 'Privacy preferences updated successfully. Changes are now live across all records!' });
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({ type: 'error', text: res.data?.Message || 'Failed to update preferences.' });
      }
    } catch (err) {
      console.error('Error saving preferences:', err);
      setMessage({ type: 'error', text: 'An error occurred while saving your preferences.' });
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmWithdraw = async () => {
    try {
      setWithdrawLoading(true);
      const payload = {
        action: 'request_withdrawal',
        reason: withdrawReason.trim() || 'Patient requested consent revocation via Privacy Hub'
      };

      const res = await axiosInstance.post(ENDPOINTS.DPDP_MY_CONSENT, payload);
      if (res.data?.Success) {
        setConsent(res.data.consent);
        setShowWithdrawModal(false);
        setMessage({ type: 'success', text: 'Revocation request submitted. It will be reviewed and finalized by the SuperAdmin / Data Protection Officer.' });
      } else {
        alert(res.data?.Message || 'Failed to submit revocation request.');
      }
    } catch (err) {
      console.error('Error submitting revocation request:', err);
      alert('Failed to submit revocation request.');
    } finally {
      setWithdrawLoading(false);
    }
  };

  const handleCancelWithdrawal = async () => {
    try {
      setWithdrawLoading(true);
      const payload = {
        action: 'cancel_withdrawal_request'
      };
      const res = await axiosInstance.post(ENDPOINTS.DPDP_MY_CONSENT, payload);
      if (res.data?.Success) {
        setConsent(res.data.consent);
        setMessage({ type: 'success', text: 'Revocation request cancelled. Your consent remains Active.' });
      } else {
        alert(res.data?.Message || 'Failed to cancel request.');
      }
    } catch (err) {
      console.error('Error cancelling revocation request:', err);
      alert('Failed to cancel request.');
    } finally {
      setWithdrawLoading(false);
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500">
        <i className="fas fa-spinner fa-spin text-3xl text-[#11A8A4]"></i>
        <p className="text-sm font-medium">Loading your DPDP privacy & consent record...</p>
      </div>
    );
  }

  // If no consent record exists
  if (!consent) {
    return (
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-cyan-50 border border-cyan-200 text-[#11A8A4] flex items-center justify-center mx-auto text-2xl">
          <i className="fas fa-shield-alt"></i>
        </div>
        <h2 className="text-xl font-bold text-slate-900">DPDP Act 2023 Consent Record</h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Your account was registered before the automated DPDP Act consent logging protocol was activated.
        </p>
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-left text-xs text-emerald-900 max-w-md mx-auto">
          <div className="flex items-center gap-2 font-bold mb-1">
            <i className="fas fa-check-circle text-emerald-600"></i>
            Active Account Protection
          </div>
          Your healthcare records and diagnostic tests are secured under standard National Medical Commission and HIPAA-aligned clinical data protection safeguards.
        </div>
      </div>
    );
  }

  const isPending = consent.status === 'PENDING_WITHDRAWAL';
  const isWithdrawn = consent.status === 'WITHDRAWN';
  const formattedDate = consent.consent_timestamp
    ? new Date(consent.consent_timestamp).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
    : 'N/A';

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Toast Feedback */}
      {message && (
        <div className={`p-4 rounded-xl text-xs md:text-sm font-semibold flex items-center justify-between shadow-sm animate-in fade-in duration-200 ${message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
          }`}>
          <div className="flex items-center gap-2">
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-white/80 hover:text-white">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Main Consent Overview Hero Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden">
        <div className="bg-gradient-to-r from-[#233560] to-[#1c2c52] p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 text-2xl shrink-0 mt-0.5">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Privacy & DPDP Consent Hub
                </h2>
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${isWithdrawn
                    ? 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                    : isPending
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                  }`}>
                  {isWithdrawn ? 'Revoked / Withdrawn' : isPending ? 'Revocation Pending Approval' : 'Active & Verified'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Digital Personal Data Protection Act, 2023 • Regulatory Audit Trail
              </p>
            </div>
          </div>

          <button
            onClick={handlePrintCertificate}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0"
          >
            <i className="fas fa-print"></i>
            <span>Print Certificate</span>
          </button>
        </div>

        {/* Identification Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 bg-slate-50/70 border-b border-slate-200 text-xs">
          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Consent Audit ID</span>
            <div className="flex items-center gap-1.5 mt-0.5 font-mono font-bold text-slate-900">
              <span className="truncate">{consent.consent_id}</span>
              <button
                onClick={handleCopyId}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
                title="Copy ID"
              >
                <i className={copied ? "fas fa-check text-emerald-600" : "far fa-copy"}></i>
              </button>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Registered Mobile</span>
            <span className="font-mono font-semibold text-slate-800 mt-0.5 block">
              {consent.patient_number || 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Shared OTP</span>
            <span className="inline-block mt-0.5 px-2 py-0.5 font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded">
              OTP: {consent.shared_otp || 'Verified'}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Consent Timestamp</span>
            <span className="text-slate-800 font-medium mt-0.5 block">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Pending Revocation Request Notice Banner */}
        {isPending && (
          <div className="p-4 bg-amber-50 border-b border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <i className="fas fa-clock text-amber-600 text-base mt-0.5"></i>
              <div>
                <p className="font-bold">Consent Revocation Request Submitted (Pending Review)</p>
                <p className="text-amber-800 mt-0.5">
                  Your request to revoke consent was submitted on {consent.metadata?.withdrawal_request?.requested_at ? new Date(consent.metadata.withdrawal_request.requested_at).toLocaleString('en-IN') : 'recently'}. It is currently queued for review and approval by the SuperAdmin / Data Protection Officer.
                </p>
                {consent.metadata?.withdrawal_request?.reason && (
                  <p className="mt-1 text-slate-600">
                    <strong>Your Reason:</strong> {consent.metadata.withdrawal_request.reason}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleCancelWithdrawal}
              disabled={withdrawLoading}
              className="px-3 py-1.5 bg-white hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition-colors shadow-xs"
            >
              Cancel Request
            </button>
          </div>
        )}

        {/* Withdrawal Notice Banner if revoked */}
        {isWithdrawn && (
          <div className="p-4 bg-rose-50 border-b border-rose-200 text-xs text-rose-900 flex items-start gap-3">
            <i className="fas fa-exclamation-triangle text-rose-600 text-base mt-0.5"></i>
            <div>
              <p className="font-bold">Consent Withdrawn under DPDP Act Section 6(4)</p>
              <p className="text-rose-700 mt-0.5">
                Your optional permissions have been revoked and all non-essential data processing has terminated.
              </p>
              {consent.metadata?.withdrawal && (
                <p className="mt-1 text-slate-600">
                  <strong>Revoked on:</strong> {new Date(consent.metadata.withdrawal.withdrawn_at).toLocaleString('en-IN')} | <strong>Reason:</strong> {consent.metadata.withdrawal.reason}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Section 1: Mandatory Core Health Diagnostic Clauses */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <i className="fas fa-file-medical text-[#11A8A4]"></i>
              Section 1: Mandatory Diagnostic Services Clauses
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Essential for booking appointments, diagnostic sample collection, report delivery, and patient communication.
            </p>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full uppercase">
            Mandatory
          </span>
        </div>

        <div className="space-y-2.5">
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-3 text-xs md:text-sm">
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
              <i className="fas fa-check text-[10px]"></i>
            </div>
            <div className="flex-1 text-slate-700 leading-relaxed">
              I have read and understood the Notice and Request for Consent under the Digital Personal Data Protection Act, 2023.
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-3 text-xs md:text-sm">
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
              <i className="fas fa-check text-[10px]"></i>
            </div>
            <div className="flex-1 text-slate-700 leading-relaxed">
              I consent to U4RAD Technologies and its brand XRAi Digital collecting and processing my personal and health data for clinical diagnostics, report generation, and sharing with my consulting physician/lab.
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-3 text-xs md:text-sm">
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
              <i className="fas fa-check text-[10px]"></i>
            </div>
            <div className="flex-1 text-slate-700 leading-relaxed">
              I understand that if my test is sponsored by an employer or insurer, my result will be shared with that sponsor.
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-3 text-xs md:text-sm">
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
              <i className="fas fa-check text-[10px]"></i>
            </div>
            <div className="flex-1 text-slate-700 leading-relaxed">
              I am 18 or older, or I am the parent / legal guardian giving consent on behalf of a minor.
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-3 text-xs md:text-sm">
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
              <i className="fas fa-check text-[10px]"></i>
            </div>
            <div className="flex-1 text-slate-700 leading-relaxed">
              I agree to receive service communications (results, appointment updates, dispatch alerts) by phone, SMS, email or WhatsApp.
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Granular Optional Permissions (DPDP Section 6) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <i className="fas fa-sliders-h text-[#11A8A4]"></i>
              Section 2: Manage Granular Privacy Preferences
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Under Section 6(2) of the DPDP Act 2023, you can toggle these permissions ON or OFF at any time without affecting your diagnostic bookings.
            </p>
          </div>
          <span className="text-[11px] font-bold text-cyan-800 bg-cyan-100 border border-cyan-300 px-2.5 py-0.5 rounded-full uppercase">
            Customizable
          </span>
        </div>

        <div className="space-y-4">

          {/* Toggle 1: Research & AI Models */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">Clinical Research & AI Model Improvement</h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${researchConsent ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                  {researchConsent ? 'Allowed' : 'Opted Out'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Allow my de-identified, anonymized test data and radiology images to be used for medical research and improving diagnostic machine learning models.
              </p>
            </div>

            <button
              type="button"
              disabled={isWithdrawn || saving}
              onClick={() => setResearchConsent(!researchConsent)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-40 ${researchConsent ? 'bg-[#11A8A4]' : 'bg-slate-300'
                }`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${researchConsent ? 'translate-x-5' : 'translate-x-0'
                }`} />
            </button>
          </div>

          {/* Toggle 2: Internal Marketing Offers */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">Preventive Health Reminders & Offers</h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${marketingConsent ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                  {marketingConsent ? 'Allowed' : 'Opted Out'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                XRAi Digital may use my contact details only for internal marketing of preventive test discounts and wellness packages. My data will NEVER be shared with any third party for marketing.
              </p>
            </div>

            <button
              type="button"
              disabled={isWithdrawn || saving}
              onClick={() => setMarketingConsent(!marketingConsent)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-40 ${marketingConsent ? 'bg-[#11A8A4]' : 'bg-slate-300'
                }`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${marketingConsent ? 'translate-x-5' : 'translate-x-0'
                }`} />
            </button>
          </div>

          {/* Toggle 3: Longer Retention */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">Extended Lifetime Health Record Retention</h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${retentionConsent ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                  {retentionConsent ? 'Allowed' : 'Opted Out'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Keep my diagnostic reports and DICOM imaging securely stored beyond the statutory 7-year legal period, so future doctors can compare new tests with my longitudinal health history.
              </p>
            </div>

            <button
              type="button"
              disabled={isWithdrawn || saving}
              onClick={() => setRetentionConsent(!retentionConsent)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-40 ${retentionConsent ? 'bg-[#11A8A4]' : 'bg-slate-300'
                }`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${retentionConsent ? 'translate-x-5' : 'translate-x-0'
                }`} />
            </button>
          </div>

        </div>

        {/* Save Changes Button */}
        {!isWithdrawn && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSavePreferences}
              disabled={!hasChanges || saving}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${hasChanges && !saving
                  ? 'bg-[#11A8A4] hover:bg-[#0e8f8c] text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
            >
              {saving ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Saving Changes...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  {hasChanges ? 'Save Privacy Preferences' : 'Preferences Saved'}
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Section 3: Right to Withdraw Consent & Grievance Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Revocation Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm mb-1">
              <i className="fas fa-user-shield"></i>
              Right to Withdraw Consent (Section 6(4))
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              You may withdraw consent at any time. Revoking consent will cease processing of optional data and flag your account.
            </p>
          </div>

          <div className="pt-4">
            {isPending ? (
              <div className="space-y-2">
                <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 p-2.5 rounded-xl font-medium flex items-center gap-2">
                  <i className="fas fa-hourglass-half text-amber-600"></i>
                  <span>Revocation request is pending SuperAdmin review.</span>
                </div>
                <button
                  onClick={handleCancelWithdrawal}
                  disabled={withdrawLoading}
                  className="w-full py-2 px-3 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel Revocation Request
                </button>
              </div>
            ) : !isWithdrawn ? (
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="w-full py-2 px-3 border border-rose-300 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <i className="fas fa-paper-plane"></i>
                Request Consent Revocation
              </button>
            ) : (
              <div className="text-xs text-rose-700 bg-rose-50 p-2 rounded-lg text-center font-medium">
                Consent currently revoked
              </div>
            )}
          </div>
        </div>

        {/* Grievance Redressal Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-1">
              <i className="fas fa-headset text-[#11A8A4]"></i>
              Data Protection & Grievance Redressal
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Have questions regarding your personal health data under the DPDP Act, 2023? Contact our designated Grievance Officer:
            </p>
            <div className="mt-2 text-xs text-slate-700 space-y-0.5 font-medium">
              <p><i className="far fa-envelope mr-1.5 text-slate-400"></i> privacy@xraidigital.com</p>
              <p><i className="fas fa-phone-alt mr-1.5 text-slate-400"></i> +91 1234567890</p>
              <p><i className="far fa-clock mr-1.5 text-slate-400"></i> Statutory SLA: Response within 30 days</p>
            </div>
          </div>
        </div>

      </div>

      {/* Confirmation Modal for Consent Withdrawal Request */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-amber-600 text-white px-5 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <i className="fas fa-exclamation-triangle"></i>
                <h3 className="font-bold text-sm">Request Consent Revocation</h3>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-amber-100 hover:text-white"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700">
              <p className="leading-relaxed">
                Submitting this request will send an official revocation request to the <strong>SuperAdmin / Data Protection Officer</strong> for review and final execution under Section 6(4) of the DPDP Act, 2023.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Once approved by SuperAdmin, all optional data processing will cease.</li>
                <li>Your profile will be archived in accordance with statutory medical data retention regulations.</li>
              </ul>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Reason for Revocation Request <span className="text-amber-600">*</span>
                </label>
                <textarea
                  rows={2}
                  value={withdrawReason}
                  onChange={(e) => setWithdrawReason(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-500 outline-none"
                  placeholder="Tell the SuperAdmin why you wish to revoke consent..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  disabled={withdrawLoading}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmWithdraw}
                  disabled={withdrawLoading}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  {withdrawLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Submit to SuperAdmin
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default PatientPrivacyConsent;
