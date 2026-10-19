import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINTS } from '../../api/endpoints';
import {
  STEP_META,
  OPTIONS,
  DEMOGRAPHICS_FIELDS,
  MEDICAL_CONFIG,
  FAMILY_FIELDS,
  LIFESTYLE_FIELDS,
  MENTAL_FIELDS,
  SYMPTOMS_CONFIG,
  defaultForm,
  buildQuestionnaireData,
  formFromAssessment,
  validateQuestionnaire,
  flattenErrors,
  labelForOption,
  isBlank,
  toArray,
} from '../underwriting/questionnaireSchema';

// Existing AI-Vital rPPG analysis endpoint (unchanged contract).
// catbackend does not send CORS headers, so in dev we route through the Vite
// proxy (`/catbackend`, same origin) to avoid a preflight/CORS failure.
const ANALYZE_VITALS_ABS = 'https://catbackend.xraidigital.com/api/vitals/analyze-vitals/';
const ANALYZE_VITALS_PROXY = 'https://catbackend.xraidigital.com/api/vitals/analyze-vitals/';
const ANALYZE_VITALS_URL = import.meta.env.DEV ? ANALYZE_VITALS_PROXY : ANALYZE_VITALS_ABS;

const getToken = () => (sessionStorage.getItem('Token') || '').trim();
const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Token ${token}` } : {};
};

function extractError(err) {
  const data = err?.response?.data;
  if (typeof data === 'string' && data) return data;
  if (data?.message) return data.message;
  if (data?.detail) return data.detail;
  if (data?.errors) {
    const flat = flattenErrors(data.errors);
    const values = Object.values(flat).filter(Boolean);
    if (values.length) return values.join(' ');
  }
  const status = err?.response?.status;
  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status === 403) return 'You are not authorized for underwriting on this member. The signed-in user must be an active technician assigned to this family.';
  if (status === 404) return 'The requested record was not found.';
  if (status === 400) return 'The request was rejected by the server. Please review the highlighted fields.';
  if (status === 500) return 'The server encountered an error. Please try again.';
  if (data) {
    try { return JSON.stringify(data); } catch (_) { /* ignore */ }
  }
  return err?.message || 'Request failed.';
}

function setIn(obj, path, value) {
  const keys = path.split('.');
  const clone = Array.isArray(obj) ? [...obj] : { ...(obj || {}) };
  let cursor = clone;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i];
    const existing = cursor[key];
    cursor[key] = Array.isArray(existing) ? [...existing] : { ...(existing || {}) };
    cursor = cursor[key];
  }
  cursor[keys[keys.length - 1]] = value;
  return clone;
}

function firstErrorStep(errors) {
  const keys = Object.keys(errors || {});
  if (!keys.length) return 7;
  const prefix = keys[0].split('.')[0];
  if (prefix === 'demographics') return 1;
  if (prefix === 'medical_history') return 2;
  if (prefix === 'family_history') return 3;
  if (prefix === 'lifestyle') return 4;
  if (prefix === 'mental_health') return 5;
  if (prefix === 'symptoms') return 6;
  return 1;
}

// =========================================================
// PRESENTATIONAL FIELD COMPONENTS
// =========================================================

function FieldError({ error }) {
  if (!error) return null;
  return <p className="text-xs text-red-600 mt-1">{error}</p>;
}

function QueryInput({ label, value, onChange, disabled, error, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={value === undefined || value === null ? '' : value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#11A8A4] disabled:bg-gray-100 disabled:text-gray-500"
      />
      <FieldError error={error} />
    </div>
  );
}

function NumberField({ label, value, onChange, disabled, error, min, max, step, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <input
        type="number"
        inputMode="decimal"
        value={value === undefined || value === null ? '' : value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === '') { onChange(''); return; }
          const num = Number(raw);
          onChange(Number.isNaN(num) ? raw : num);
        }}
        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#11A8A4] disabled:bg-gray-100 disabled:text-gray-500"
      />
      <FieldError error={error} />
    </div>
  );
}

function YesNoField({ label, value, onChange, disabled, error }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.yesNo.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(o.value)}
              className={`px-5 py-2 rounded-xl text-sm font-bold border ${active
                  ? 'bg-[#11A8A4] text-white border-[#11A8A4]'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-[#11A8A4]'
                } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      <FieldError error={error} />
    </div>
  );
}

function SelectField({ label, value, options, onChange, disabled, error, placeholder = 'Select...' }) {
  const current = value === undefined || value === null ? '' : String(value);
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <select
        value={current}
        disabled={disabled}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === '') { onChange(''); return; }
          const opt = (options || []).find((o) => String(o.value) === raw);
          onChange(opt ? opt.value : raw);
        }}
        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#11A8A4] disabled:bg-gray-100 disabled:text-gray-500"
      >
        <option value="">{placeholder}</option>
        {(options || []).map((o) => (
          <option key={String(o.value)} value={String(o.value)}>{o.label}</option>
        ))}
      </select>
      <FieldError error={error} />
    </div>
  );
}

function MultiField({ label, value, options, onChange, disabled, error, join }) {
  const selected = Array.isArray(value) ? value : toArray(value);
  const toggle = (val) => {
    const has = selected.includes(val);
    const next = has ? selected.filter((v) => v !== val) : [...selected, val];
    onChange(join ? next.join(', ') : next);
  };
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <div className="flex flex-wrap gap-2">
        {(options || []).map((o) => {
          const active = selected.includes(o.value);
          return (
            <button
              key={String(o.value)}
              type="button"
              disabled={disabled}
              onClick={() => toggle(o.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${active
                  ? 'bg-[#11A8A4] text-white border-[#11A8A4]'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-[#11A8A4]'
                } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {active ? <i className="fas fa-check mr-1"></i> : null}{o.label}
            </button>
          );
        })}
      </div>
      <FieldError error={error} />
    </div>
  );
}

function renderFields(fields, sectionForm, prefix, updateField, errors, disabled) {
  return (fields || []).map((field) => {
    if (field.when && !field.when(sectionForm || {})) return null;
    const path = prefix ? `${prefix}.${field.key}` : field.key;
    const value = sectionForm ? sectionForm[field.key] : undefined;
    const error = errors[path];
    const onChange = (v) => updateField(path, v);

    if (field.type === 'yesno') {
      return <YesNoField key={field.key} label={field.label} value={value} onChange={onChange} disabled={disabled} error={error} />;
    }
    if (field.type === 'select') {
      return <SelectField key={field.key} label={field.label} value={value} options={field.options} onChange={onChange} disabled={disabled} error={error} />;
    }
    if (field.type === 'multi') {
      return <MultiField key={field.key} label={field.label} value={value} options={field.options} join={field.join} onChange={onChange} disabled={disabled} error={error} />;
    }
    if (field.type === 'number') {
      return <NumberField key={field.key} label={field.label} value={value} min={field.min} max={field.max} step={field.step} placeholder={field.placeholder} onChange={onChange} disabled={disabled} error={error} />;
    }
    return <QueryInput key={field.key} label={field.label} value={value} placeholder={field.placeholder} onChange={onChange} disabled={disabled} error={error} />;
  });
}

function GateSubsection({ sec, subForm, prefix, updateField, errors, disabled }) {
  const gateValue = (subForm || {})[sec.gate.key];
  const gatePath = `${prefix}.${sec.gate.key}`;
  return (
    <div className="border border-gray-200 rounded-2xl p-4 space-y-4">
      <h4 className="font-bold text-gray-800">{sec.title}</h4>
      <YesNoField
        label={sec.gate.label}
        value={gateValue}
        disabled={disabled}
        error={errors[gatePath]}
        onChange={(v) => updateField(gatePath, v)}
      />
      {gateValue === 'Yes' && (
        <div className="space-y-4 pl-3 border-l-2 border-[#11A8A4]/30">
          {renderFields(sec.fields, subForm, prefix, updateField, errors, disabled)}
        </div>
      )}
    </div>
  );
}

// =========================================================
// REVIEW HELPERS
// =========================================================

function reviewRows(fields, sectionForm) {
  if (!sectionForm) return [];
  return (fields || [])
    .filter((f) => !(f.when && !f.when(sectionForm)))
    .map((f) => {
      const v = sectionForm[f.key];
      if (isBlank(v)) return null;
      let display;
      if (f.type === 'multi' || f.type === 'select' || f.type === 'yesno') {
        display = labelForOption(f.options || OPTIONS.yesNo, v);
      } else {
        display = String(v);
      }
      return { label: f.label, value: display };
    })
    .filter(Boolean);
}

function ReviewBlock({ title, rows }) {
  if (!rows || !rows.length) return null;
  return (
    <div className="border border-gray-200 rounded-2xl p-4">
      <h4 className="font-bold text-gray-800 mb-2 text-sm">{title}</h4>
      {rows.map((r, i) => (
        <div key={`${r.label}-${i}`} className="flex justify-between gap-4 py-1 border-b border-gray-100 last:border-0">
          <span className="text-gray-500 text-xs">{r.label}</span>
          <span className="font-semibold text-gray-800 text-xs text-right max-w-[60%]">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

function formatDateTime(value) {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  } catch (_) {
    return value;
  }
}

const STATUS_STYLES = {
  DRAFT: 'bg-yellow-100 text-yellow-700',
  SUBMITTED: 'bg-blue-100 text-blue-700',
  UNDER_REVIEW: 'bg-purple-100 text-purple-700',
  COMPLETED: 'bg-green-100 text-green-700',
};

// =========================================================
// MAIN COMPONENT
// =========================================================

function ChannelPartnerAiVital() {
  const navigate = useNavigate();
  const { memberId } = useParams();
  const location = useLocation();

  const [member, setMember] = useState(location.state?.member || null);
  const [family, setFamily] = useState(location.state?.family || null);
  const [memberLoading, setMemberLoading] = useState(!location.state?.member && !!memberId);
  const [memberError, setMemberError] = useState('');

  const [form, setForm] = useState(() => defaultForm(location.state?.member || null, location.state?.family || null));
  const [step, setStep] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [serverErrors, setServerErrors] = useState({});

  const [assessmentId, setAssessmentId] = useState(null);
  const [assessmentStatus, setAssessmentStatus] = useState('DRAFT');

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);

  const [saving, setSaving] = useState(false);
  const [draftError, setDraftError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitResult, setSubmitResult] = useState(null);

  const [dirty, setDirty] = useState(false);

  // ----- Video recording state (same contract as before) -----
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const [camStage, setCamStage] = useState('idle'); // idle | preview | denied | unavailable
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [recordedURL, setRecordedURL] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [storedScan, setStoredScan] = useState(null);
  const [loadedAivital, setLoadedAivital] = useState(null);
  const [videoError, setVideoError] = useState('');
  const [videoSent, setVideoSent] = useState(false);

  const savingRef = useRef(false);
  const submittingRef = useRef(false);

  const assessmentLocked = assessmentStatus !== 'DRAFT';

  const updateField = useCallback((path, value) => {
    setForm((prev) => setIn(prev, path, value));
    setDirty(true);
    setDraftError('');
    setSaveSuccess('');
  }, []);

  // ---------- Member fallback fetch (e.g. hard refresh with no router state) ----------
  useEffect(() => {
    if (member || !memberId) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`${ENDPOINTS.RURAL_MEMBERS}${memberId}/`, { headers: authHeaders() });
        if (cancelled) return;
        const fetched = res.data;
        setMember(fetched);
        let fam = family;
        if (!fam && fetched.family) {
          try {
            const famRes = await axios.get(`${ENDPOINTS.RURAL_FAMILIES}${fetched.family}/`, { headers: authHeaders() });
            fam = famRes.data;
            if (!cancelled) setFamily(fam);
          } catch (_) { /* family details optional */ }
        }
        if (!cancelled) setForm(defaultForm(fetched, fam));
      } catch (err) {
        if (!cancelled) setMemberError(extractError(err));
      } finally {
        if (!cancelled) setMemberLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId]);

  // ---------- Family fallback fetch (fills city/state when router state is missing) ----------
  useEffect(() => {
    if (!member || family || !member.family) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`${ENDPOINTS.RURAL_FAMILIES}${member.family}/`, { headers: authHeaders() });
        if (cancelled) return;
        const fam = res.data;
        setFamily(fam);
        setForm((prev) => {
          const city = prev.demographics?.city || fam.district || fam.village || '';
          const state = prev.demographics?.state || fam.state || '';
          return { ...prev, demographics: { ...prev.demographics, city, state } };
        });
      } catch (_) { /* family details are optional */ }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member, family]);

  // ---------- Assessment history ----------
  const loadHistory = useCallback(async () => {
    if (!member?.id) return;
    setHistoryLoading(true);
    setHistoryError('');
    try {
      const res = await axios.get(ENDPOINTS.UNDERWRITING_MEMBER_ASSESSMENTS(member.id), { headers: authHeaders() });
      const list = Array.isArray(res.data?.assessments) ? res.data.assessments : [];
      setHistory(list);
    } catch (err) {
      setHistoryError(extractError(err));
    } finally {
      setHistoryLoading(false);
    }
  }, [member?.id]);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  // ---------- Stored scan (kept in frontend state only; NOT linked to backend) ----------
  useEffect(() => {
    if (!member?.id) return;
    try {
      const raw = localStorage.getItem(`aivital_scan_${member.id}`);
      if (raw) setStoredScan(JSON.parse(raw));
    } catch (_) { /* ignore */ }
  }, [member?.id]);

  // ---------- Camera / recording (preserved from existing AI-Vital implementation) ----------
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamStage('unavailable');
      return;
    }
    try {
      stopStream();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => { });
      }
      setCamStage('preview');
    } catch (err) {
      const name = err?.name || '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') setCamStage('denied');
      else setCamStage('unavailable');
    }
  }, [stopStream]);

  // Bind the stream to the <video> element once the preview stage mounts.
  useEffect(() => {
    if (camStage === 'preview' && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => { });
    }
  }, [camStage]);

  useEffect(() => {
    if (step !== 0) return undefined;
    startCamera();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        try { recorderRef.current.stop(); } catch (_) { /* ignore */ }
      }
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => () => {
    stopStream();
  }, [stopStream]);

  const startRecording = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    if (recordedURL) {
      URL.revokeObjectURL(recordedURL);
      setRecordedURL(null);
      setRecordedBlob(null);
    }
    setAnalysis(null);
    setUploadError('');
    setVideoError('');
    setVideoSent(false);

    const mimeTypes = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
    let selectedMime = '';
    for (const m of mimeTypes) {
      if (window.MediaRecorder && MediaRecorder.isTypeSupported(m)) { selectedMime = m; break; }
    }
    const recorder = new MediaRecorder(streamRef.current, selectedMime ? { mimeType: selectedMime } : undefined);
    recorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data); };
    recorder.onstop = () => {
      setRecording(false);
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      if (chunksRef.current.length > 0) {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
        setRecordedURL(URL.createObjectURL(blob));
      }
    };
    recorderRef.current = recorder;
    recorder.start();
    setRecording(true);
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed((p) => p + 1), 1000);
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') recorderRef.current.stop();
  };

  const uploadVideo = async () => {
    if (!recordedBlob || !member) return;
    setUploading(true);
    setUploadError('');
    setVideoError('');
    setAnalysis(null);
    // Open the questionnaire immediately after the video is sent; do not wait
    // for the vitals analysis to finish. Analysis/errors are shown as a banner.
    setVideoSent(true);
    setStep(1);
    try {
      const formData = new FormData();
      if (member.full_name) formData.append('patient_name', member.full_name);
      if (member.age) formData.append('patient_age', String(member.age));
      formData.append('video', recordedBlob, 'recording.webm');

      const technicianEmail = localStorage.getItem('technicianEmail');
      if (technicianEmail) formData.append('scan_user', technicianEmail);

      const res = await axios.post(ANALYZE_VITALS_URL, formData, { headers: authHeaders() });
      setAnalysis(res.data);
      try {
        localStorage.setItem(
          `aivital_scan_${member.id}`,
          JSON.stringify({ scan: res.data, saved_at: new Date().toISOString() })
        );
      } catch (_) { /* ignore */ }
    } catch (err) {
      setUploadError(extractError(err));
    } finally {
      setUploading(false);
    }
  };

  const formatTime = (s) => {
    const m = String(Math.floor(s / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${m}:${sec}`;
  };

  const videoDone = videoSent || !!analysis;

  // The backend has no dedicated vitals column, but it preserves unknown keys
  // inside `questionnaire_data`. Attach the AI-Vital rPPG result under the
  // custom `aivital` key so it is stored with the assessment.
  const buildAivitalPayload = () => {
    if (analysis) {
      const scanUser = localStorage.getItem('technicianEmail') || null;
      return { scan: analysis, scan_user: scanUser, recorded_at: new Date().toISOString() };
    }
    return loadedAivital || null;
  };

  const buildPayload = () => {
    const data = buildQuestionnaireData(form);
    const aivital = buildAivitalPayload();
    if (aivital) data.aivital = aivital;
    return data;
  };

  // ---------- Draft save / submit ----------
  const createDraft = async (questionnaireData) => {
    const body = { family_member_id: Number(member.id), questionnaire_data: questionnaireData };
    const pkgId = family?.package;
    if (pkgId !== undefined && pkgId !== null && pkgId !== '') body.package_id = Number(pkgId);
    const res = await axios.post(ENDPOINTS.UNDERWRITING_ASSESSMENTS, body, {
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
    });
    const created = res.data?.assessment;
    if (!created?.id) throw new Error('Draft was not created by the server.');
    setAssessmentId(created.id);
    setAssessmentStatus(created.status || 'DRAFT');
    return created.id;
  };

  const patchDraft = async (id, questionnaireData) => {
    const res = await axios.patch(ENDPOINTS.UNDERWRITING_ASSESSMENT_DETAIL(id), { questionnaire_data: questionnaireData }, {
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
    });
    setAssessmentStatus(res.data?.assessment?.status || 'DRAFT');
  };

  const saveDraft = async () => {
    if (!member) return;
    if (assessmentLocked) { setDraftError('This assessment has been submitted and can no longer be edited.'); return; }
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setDraftError('');
    setServerErrors({});
    try {
      const questionnaireData = buildPayload();
      if (!assessmentId) {
        await createDraft(questionnaireData);
      } else {
        await patchDraft(assessmentId, questionnaireData);
      }
      setDirty(false);
      setSaveSuccess('Draft saved successfully.');
      setTimeout(() => setSaveSuccess(''), 4000);
      await loadHistory();
    } catch (err) {
      const data = err?.response?.data;
      if (data?.errors) setServerErrors(flattenErrors(data.errors));
      setDraftError(extractError(err));
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const submitAssessment = async () => {
    if (!member) return;
    if (assessmentLocked) return;
    if (submittingRef.current) return;

    const clientErrors = validateQuestionnaire(form);
    setFormErrors(clientErrors);
    if (Object.keys(clientErrors).length) {
      setSubmitError('Please complete all required fields before submitting.');
      setStep(firstErrorStep(clientErrors));
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError('');
    setServerErrors({});
    setSubmitResult(null);
    try {
      const questionnaireData = buildPayload();
      let id = assessmentId;
      if (!id) id = await createDraft(questionnaireData);
      else await patchDraft(id, questionnaireData);

      const res = await axios.post(ENDPOINTS.UNDERWRITING_ASSESSMENT_SUBMIT(id), {}, {
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
      });
      setAssessmentStatus(res.data?.assessment?.status || 'SUBMITTED');
      setSubmitResult(res.data);
      setDirty(false);
      await loadHistory();
      // Return to the family list table after a successful submission.
      navigate('/channel-partner/list');
    } catch (err) {
      const data = err?.response?.data;
      if (data?.errors) {
        const flat = flattenErrors(data.errors);
        setServerErrors(flat);
        setFormErrors((prev) => ({ ...prev, ...flat }));
      }
      setSubmitError(extractError(err));
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  // ---------- History actions ----------
  const resumeAssessment = async (assessment) => {
    setResumeLoading(true);
    setHistoryError('');
    try {
      const res = await axios.get(ENDPOINTS.UNDERWRITING_ASSESSMENT_DETAIL(assessment.id), { headers: authHeaders() });
      const loaded = res.data?.assessment || assessment;
      setAssessmentId(loaded.id);
      setAssessmentStatus(loaded.status || 'DRAFT');
      setForm(formFromAssessment(loaded.questionnaire_data || {}, defaultForm(member, family)));
      setLoadedAivital(loaded.questionnaire_data?.aivital || null);
      setFormErrors({});
      setServerErrors({});
      setDraftError('');
      setSubmitError('');
      setSubmitResult(null);
      setDirty(false);
      setHistoryOpen(false);
      setStep(1);
    } catch (err) {
      setHistoryError('Unable to load the selected assessment: ' + extractError(err));
    } finally {
      setResumeLoading(false);
    }
  };

  const startNewAssessment = () => {
    setAssessmentId(null);
    setAssessmentStatus('DRAFT');
    setForm(defaultForm(member, family));
    setLoadedAivital(null);
    setFormErrors({});
    setServerErrors({});
    setDraftError('');
    setSubmitError('');
    setSubmitResult(null);
    setDirty(false);
    setHistoryOpen(false);
    setStep(0);
  };

  // ---------- Navigation ----------
  const goNext = () => {
    if (step === 0) {
      if (!videoDone) { setVideoError('Record and submit the AI-Vital video before continuing.'); return; }
      setVideoError('');
      setStep(1);
      return;
    }
    if (step < STEP_META.length - 1) setStep(step + 1);
  };

  const goBackStep = () => { if (step > 0) setStep(step - 1); };

  const handleStepClick = (index) => {
    if (index === 0) { setStep(0); return; }
    if (!videoDone) { setVideoError('Complete the AI-Vital video first to start the questionnaire.'); return; }
    setStep(index);
  };

  const handleBackToList = () => {
    if (dirty && !assessmentLocked) {
      // eslint-disable-next-line no-alert
      if (!window.confirm('You have unsaved changes. Leave without saving?')) return;
    }
    navigate(-1);
  };

  // Unsaved changes guard
  useEffect(() => {
    const handler = (e) => {
      if (dirty && !assessmentLocked) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty, assessmentLocked]);

  const errors = { ...formErrors, ...serverErrors };
  const serverErrorMessages = Array.from(new Set(Object.values(serverErrors).filter((v) => typeof v === 'string')));

  // ---------- Guards ----------
  if (memberLoading) {
    return (
      <div className="w-full py-20 text-center">
        <i className="fas fa-spinner fa-spin text-3xl text-[#11A8A4]"></i>
        <p className="mt-3 text-gray-600 font-medium">Loading member...</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="w-full space-y-4">
        <button onClick={handleBackToList} className="cursor-pointer bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
          <i className="fas fa-arrow-left mr-2"></i>Back
        </button>
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-8 text-center">
          <i className="fas fa-user-slash text-4xl text-gray-300 mb-3"></i>
          <p className="text-gray-600 font-semibold">No member selected.</p>
          <p className="text-sm text-gray-500 mt-1">{memberError || `Open this page via List → AI-Vital → member (ID: ${memberId}).`}</p>
        </div>
      </div>
    );
  }

  const currentMeta = STEP_META[step];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={handleBackToList} className="cursor-pointer bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <i className="fas fa-arrow-left mr-2"></i>Back
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <i className="fas fa-heartbeat text-[#11A8A4]"></i>AI-Vital Underwriting
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {family?.family_id ? `${family.family_id} • ` : ''}{member.full_name} ({member.relationship || '-'}) • Age {member.age || '-'}
            </p>
          </div>
        </div>
        <button onClick={() => setHistoryOpen(true)} className="cursor-pointer self-start bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
          <i className="fas fa-history"></i>Assessment History
        </button>
      </div>

      {/* Member summary */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-5 flex gap-4 items-center">
        {member.photo ? (
          <img src={member.photo} alt={member.full_name} className="w-16 h-16 rounded-full object-cover border" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-[#11A8A4]/10 flex items-center justify-center text-[#11A8A4] font-bold text-2xl">
            {member.first_name?.[0] || '?'}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-bold text-gray-800 text-lg truncate">{member.full_name}</p>
          <p className="text-sm text-gray-600">
            {member.gender || '-'} • DOB {member.date_of_birth || '-'} • {member.age ? `${member.age}y` : '-'} • {member.mobile || '-'}
          </p>
          {assessmentId ? (
            <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLES[assessmentStatus] || 'bg-gray-100 text-gray-700'}`}>
              Assessment #{assessmentId} • {assessmentStatus}
            </span>
          ) : (
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600">New Assessment</span>
          )}
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-gray-800">
            Step {step + 1} of {STEP_META.length} — {currentMeta.title}
          </p>
          <p className="text-xs text-gray-500">{Math.round(((step) / (STEP_META.length - 1)) * 100)}% complete</p>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#11A8A4] transition-all" style={{ width: `${((step) / (STEP_META.length - 1)) * 100}%` }}></div>
        </div>
        <div className="hidden md:flex flex-wrap gap-2 mt-3">
          {STEP_META.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => handleStepClick(i)}
              className={`px-3 py-1 rounded-full text-xs font-bold border ${i === step
                  ? 'bg-[#11A8A4] text-white border-[#11A8A4]'
                  : i < step
                    ? 'bg-[#11A8A4]/10 text-[#0e8c89] border-[#11A8A4]/30'
                    : 'bg-white text-gray-500 border-gray-200'
                }`}
            >
              {i + 1}. {s.short}
            </button>
          ))}
        </div>
      </div>

      {assessmentLocked && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl text-sm">
          <i className="fas fa-lock mr-2"></i>
          This assessment is <strong>{assessmentStatus}</strong> and is read-only. Start a new assessment to make changes.
          <button onClick={startNewAssessment} className="cursor-pointer ml-3 underline font-bold">Start New Assessment</button>
        </div>
      )}

      {serverErrorMessages.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm space-y-1">
          <p className="font-bold"><i className="fas fa-exclamation-circle mr-2"></i>The server rejected the request:</p>
          {serverErrorMessages.map((m, i) => <p key={i} className="pl-5">• {m}</p>)}
        </div>
      )}

      {/* Background video-analysis status (video already sent, questionnaire open) */}
      {step !== 0 && uploading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-sm">
          <i className="fas fa-spinner fa-spin mr-2"></i>AI-Vital video analysis is running in the background...
        </div>
      )}
      {step !== 0 && !uploading && uploadError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm flex flex-wrap items-center justify-between gap-2">
          <span><i className="fas fa-exclamation-triangle mr-2"></i>Video analysis failed: {uploadError}</span>
          <button onClick={() => setStep(0)} className="cursor-pointer underline font-bold">Re-record video</button>
        </div>
      )}

      {/* STEP CONTENT */}
      {step === 0 && (
        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
          <div className="bg-[#233560] text-white px-5 py-4">
            <h3 className="font-bold text-lg flex items-center gap-2"><i className="fas fa-video"></i>Step 1 — Record Vitals Video</h3>
            <p className="text-xs text-white/70 mt-1">Position the face in frame, record, then send. The questionnaire opens immediately; vitals analysis runs in the background.</p>
          </div>

          <div className="p-5 space-y-4">
            {camStage === 'denied' && (
              <div className="bg-white rounded-2xl border border-red-100 p-8 text-center">
                <i className="fas fa-video-slash text-4xl text-red-400 mb-3"></i>
                <h3 className="font-bold text-gray-800 text-lg">Camera permission denied</h3>
                <p className="text-sm text-gray-500 mt-1">Please allow camera access in your browser and try again.</p>
                <button onClick={startCamera} className="cursor-pointer mt-4 bg-[#11A8A4] hover:bg-[#0e8c89] text-white px-6 py-2 rounded-xl font-bold">Try Again</button>
              </div>
            )}

            {camStage === 'unavailable' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <i className="fas fa-video-slash text-4xl text-gray-300 mb-3"></i>
                <h3 className="font-bold text-gray-800 text-lg">Camera unavailable</h3>
                <p className="text-sm text-gray-500 mt-1">No camera detected or it is being used by another app.</p>
                <button onClick={startCamera} className="cursor-pointer mt-4 bg-[#11A8A4] hover:bg-[#0e8c89] text-white px-6 py-2 rounded-xl font-bold">Retry</button>
              </div>
            )}

            {camStage === 'preview' && (
              <>
                <div className="relative bg-black rounded-xl overflow-hidden">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full max-h-[420px] object-cover" style={{ transform: 'scaleX(-1)' }} />
                  {recording && (
                    <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                      REC {formatTime(elapsed)}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  {!recording ? (
                    <button onClick={startRecording} disabled={assessmentLocked} className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50">
                      <i className="fas fa-circle mr-2"></i>Start Recording
                    </button>
                  ) : (
                    <button onClick={stopRecording} className="cursor-pointer bg-gray-800 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold text-sm">
                      <i className="fas fa-stop mr-2"></i>Stop ({formatTime(elapsed)})
                    </button>
                  )}
                  <button onClick={startCamera} className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-sm">
                    <i className="fas fa-sync mr-2"></i>Restart Camera
                  </button>
                </div>

                {recordedURL && !recording && (
                  <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                    <p className="text-sm font-bold text-gray-700">Recorded preview</p>
                    <video src={recordedURL} controls className="w-full max-h-[300px] bg-black rounded-xl" />
                    <div className="flex flex-wrap gap-3">
                      <button onClick={uploadVideo} disabled={uploading || assessmentLocked} className="cursor-pointer bg-[#11A8A4] hover:bg-[#0e8c89] text-white px-5 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50">
                        {uploading ? (<><i className="fas fa-spinner fa-spin mr-2"></i>Analyzing...</>) : (<><i className="fas fa-paper-plane mr-2"></i>Send for Analysis</>)}
                      </button>
                      <button onClick={startRecording} disabled={assessmentLocked} className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50">
                        <i className="fas fa-redo mr-2"></i>Record Again
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {uploadError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                <i className="fas fa-exclamation-circle mr-2"></i>{uploadError}
              </div>
            )}

            {analysis && (
              <div className="border border-green-200 bg-green-50 rounded-xl p-4 space-y-2">
                <p className="font-bold text-green-800 text-sm"><i className="fas fa-check-circle mr-2"></i>Video analyzed successfully</p>
                <pre className="text-xs text-gray-800 whitespace-pre-wrap break-words bg-white border rounded-lg p-3 max-h-56 overflow-y-auto">
                  {JSON.stringify(analysis, null, 2)}
                </pre>
              </div>
            )}

            {storedScan?.scan && !analysis && (
              <p className="text-xs text-gray-500">
                <i className="fas fa-info-circle mr-1"></i>A previous scan is stored locally for this member ({formatDateTime(storedScan.saved_at)}). A fresh video is required for this session.
              </p>
            )}

            <p className="text-xs text-gray-400">
              <i className="fas fa-info-circle mr-1"></i>
              Scan results are also attached to this assessment (stored under the <code>aivital</code> key) when you save or submit.
            </p>

            {videoError && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm">
                <i className="fas fa-exclamation-triangle mr-2"></i>{videoError}
              </div>
            )}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-5 space-y-4">
          <h3 className="font-bold text-lg text-gray-800">Step 2 — Demographics & Basic Information</h3>
          <p className="text-xs text-gray-500">Prefilled from the selected member's profile where available. Answers here are stored only in this assessment.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderFields(DEMOGRAPHICS_FIELDS, form.demographics, 'demographics', updateField, errors, assessmentLocked)}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-5 space-y-4">
          <h3 className="font-bold text-lg text-gray-800">Step 3 — Medical History</h3>
          {MEDICAL_CONFIG.map((sec) => (
            <GateSubsection
              key={sec.key}
              sec={sec}
              subForm={form.medical_history[sec.key] || {}}
              prefix={`medical_history.${sec.key}`}
              updateField={updateField}
              errors={errors}
              disabled={assessmentLocked}
            />
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-5 space-y-4">
          <h3 className="font-bold text-lg text-gray-800">Step 4 — Family History</h3>
          <div className="space-y-4">
            {renderFields(FAMILY_FIELDS, form.family_history, 'family_history', updateField, errors, assessmentLocked)}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-5 space-y-4">
          <h3 className="font-bold text-lg text-gray-800">Step 5 — Lifestyle</h3>
          <div className="space-y-4">
            {renderFields(LIFESTYLE_FIELDS, form.lifestyle, 'lifestyle', updateField, errors, assessmentLocked)}
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-5 space-y-4">
          <h3 className="font-bold text-lg text-gray-800">Step 6 — Mental Health & Stress</h3>
          <div className="space-y-4">
            {renderFields(MENTAL_FIELDS, form.mental_health, 'mental_health', updateField, errors, assessmentLocked)}
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-5 space-y-4">
          <h3 className="font-bold text-lg text-gray-800">Step 7 — Symptom Check</h3>
          {SYMPTOMS_CONFIG.map((sec) => (
            <GateSubsection
              key={sec.key}
              sec={sec}
              subForm={form.symptoms[sec.key] || {}}
              prefix={`symptoms.${sec.key}`}
              updateField={updateField}
              errors={errors}
              disabled={assessmentLocked}
            />
          ))}
        </div>
      )}

      {step === 7 && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-5 space-y-3">
            <h3 className="font-bold text-lg text-gray-800">Step 8 — Review Answers</h3>
            <p className="text-xs text-gray-500">Confirm the details below. A draft can be saved at any time; all required fields must be complete to submit.</p>
            <ReviewBlock title="Demographics & Basic Information" rows={reviewRows(DEMOGRAPHICS_FIELDS, form.demographics)} />
            <div className="border border-gray-200 rounded-2xl p-4 space-y-2">
              <h4 className="font-bold text-gray-800 text-sm">Medical History</h4>
              {MEDICAL_CONFIG.map((sec) => {
                const sub = form.medical_history[sec.key] || {};
                const gate = sub[sec.gate.key];
                if (!gate) return null;
                return (
                  <div key={sec.key} className="py-1 border-b border-gray-100 last:border-0">
                    <p className="text-xs text-gray-500">{sec.gate.label}</p>
                    <p className="text-xs font-semibold text-gray-800">{gate}</p>
                    {gate === 'Yes' && (
                      <div className="mt-1">
                        {reviewRows(sec.fields, sub).map((r, i) => (
                          <div key={i} className="flex justify-between gap-4">
                            <span className="text-gray-500 text-xs">{r.label}</span>
                            <span className="font-semibold text-gray-800 text-xs text-right max-w-[60%]">{r.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <ReviewBlock title="Family History" rows={reviewRows(FAMILY_FIELDS, form.family_history)} />
            <ReviewBlock title="Lifestyle" rows={reviewRows(LIFESTYLE_FIELDS, form.lifestyle)} />
            <ReviewBlock title="Mental Health & Stress" rows={reviewRows(MENTAL_FIELDS, form.mental_health)} />
            <div className="border border-gray-200 rounded-2xl p-4 space-y-2">
              <h4 className="font-bold text-gray-800 text-sm">Symptom Check</h4>
              {SYMPTOMS_CONFIG.map((sec) => {
                const sub = form.symptoms[sec.key] || {};
                const gate = sub.present;
                if (!gate) return null;
                return (
                  <div key={sec.key} className="py-1 border-b border-gray-100 last:border-0">
                    <p className="text-xs text-gray-500">{sec.gate.label}</p>
                    <p className="text-xs font-semibold text-gray-800">{gate}</p>
                    {gate === 'Yes' && (
                      <div className="mt-1">
                        {reviewRows(sec.fields, sub).map((r, i) => (
                          <div key={i} className="flex justify-between gap-4">
                            <span className="text-gray-500 text-xs">{r.label}</span>
                            <span className="font-semibold text-gray-800 text-xs text-right max-w-[60%]">{r.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {Object.keys(formErrors).length > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              <p className="font-bold"><i className="fas fa-exclamation-circle mr-2"></i>Please fix the following before submitting:</p>
              <ul className="list-disc pl-6 mt-1">
                {Object.entries(formErrors).map(([path, msg]) => (
                  <li key={path} className="text-xs">{path.replace(/\./g, ' → ')}: {msg}</li>
                ))}
              </ul>
            </div>
          )}

          {submitResult && (
            <div className="border border-green-200 bg-green-50 rounded-xl p-4">
              <p className="font-bold text-green-800 text-sm"><i className="fas fa-check-circle mr-2"></i>Assessment submitted</p>
              <p className="text-xs text-green-700 mt-1">
                Assessment #{submitResult?.assessment?.id} • {submitResult?.assessment?.status}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Draft/submit feedback */}
      {draftError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          <i className="fas fa-exclamation-circle mr-2"></i>{draftError}
        </div>
      )}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          <i className="fas fa-check-circle mr-2"></i>{saveSuccess}
        </div>
      )}
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          <i className="fas fa-exclamation-circle mr-2"></i>{submitError}
        </div>
      )}

      {/* Footer navigation */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur border border-gray-100 rounded-2xl shadow p-4 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={goBackStep}
          disabled={step === 0}
          className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-5 py-2.5 rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <i className="fas fa-arrow-left mr-2"></i>Back
        </button>

        <div className="flex flex-wrap items-center gap-3">
          {step >= 1 && !assessmentLocked && (
            <button
              onClick={saveDraft}
              disabled={saving}
              className="cursor-pointer bg-white border border-[#11A8A4] text-[#0e8c89] hover:bg-[#11A8A4]/5 font-bold px-5 py-2.5 rounded-xl text-sm disabled:opacity-50"
            >
              {saving ? (<><i className="fas fa-spinner fa-spin mr-2"></i>Saving...</>) : (<><i className="fas fa-save mr-2"></i>Save Draft</>)}
            </button>
          )}

          {step >= 1 && step < STEP_META.length - 1 && (
            <button onClick={goNext} className="cursor-pointer bg-[#11A8A4] hover:bg-[#0e8c89] text-white font-bold px-6 py-2.5 rounded-xl text-sm">
              Next<i className="fas fa-arrow-right ml-2"></i>
            </button>
          )}

          {step === STEP_META.length - 1 && !assessmentLocked && (
            <button
              onClick={submitAssessment}
              disabled={submitting}
              className="cursor-pointer bg-[#233560] hover:bg-[#1a2747] text-white font-bold px-6 py-2.5 rounded-xl text-sm disabled:opacity-50"
            >
              {submitting ? (<><i className="fas fa-spinner fa-spin mr-2"></i>Submitting...</>) : (<><i className="fas fa-paper-plane mr-2"></i>Submit Assessment</>)}
            </button>
          )}

          {step === 0 && (
            <button
              onClick={goNext}
              disabled={!videoDone}
              className="cursor-pointer bg-[#11A8A4] hover:bg-[#0e8c89] text-white font-bold px-6 py-2.5 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next<i className="fas fa-arrow-right ml-2"></i>
            </button>
          )}
        </div>
      </div>

      {/* Assessment history modal */}
      {historyOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setHistoryOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <div>
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <i className="fas fa-history text-[#11A8A4]"></i>Assessment History
                </h3>
                <p className="text-xs text-gray-500 mt-1">{member.full_name} • {history.length} record(s)</p>
              </div>
              <button onClick={() => setHistoryOpen(false)} className="cursor-pointer w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                <i className="fas fa-times text-gray-600"></i>
              </button>
            </div>

            <div className="p-6 space-y-3">
              {historyLoading && (
                <p className="text-center text-gray-500 py-6"><i className="fas fa-spinner fa-spin mr-2"></i>Loading history...</p>
              )}
              {historyError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  <i className="fas fa-exclamation-circle mr-2"></i>{historyError}
                </div>
              )}
              {!historyLoading && !historyError && history.length === 0 && (
                <p className="text-gray-500 italic text-sm">No assessments found for this member.</p>
              )}
              {history.map((a) => (
                <div key={a.id} className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Assessment #{a.id}</p>
                    <p className="text-xs text-gray-500">
                      Created {formatDateTime(a.created_at)}
                      {a.submitted_at ? ` • Submitted ${formatDateTime(a.submitted_at)}` : ''}
                    </p>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLES[a.status] || 'bg-gray-100 text-gray-700'}`}>
                      {a.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {a.status === 'DRAFT' ? (
                      <button onClick={() => resumeAssessment(a)} disabled={resumeLoading} className="cursor-pointer bg-[#11A8A4] hover:bg-[#0e8c89] text-white px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-50">
                        {resumeLoading ? 'Loading...' : 'Resume'}
                      </button>
                    ) : (
                      <button onClick={() => resumeAssessment(a)} disabled={resumeLoading} className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-50">
                        View
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t flex justify-between">
              <button onClick={startNewAssessment} className="cursor-pointer bg-[#233560] hover:bg-[#1a2747] text-white font-bold px-5 py-2 rounded-xl text-sm">
                <i className="fas fa-plus mr-2"></i>Start New Assessment
              </button>
              <button onClick={() => setHistoryOpen(false)} className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-6 py-2 rounded-xl">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChannelPartnerAiVital;
