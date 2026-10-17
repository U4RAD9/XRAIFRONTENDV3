/**
 * AI-Powered Health Insurance Underwriting — questionnaire schema.
 *
 * This module is the single source of truth for the underwriting questionnaire
 * on the frontend. Every key and enumerated value below is aligned with the
 * backend serializer
 * (clients/serializers/rural_health_package/underwriting_assessment_serializer.py)
 * so that drafts and submissions pass the backend's strict validation.
 *
 * IMPORTANT notes about the canonical backend contract:
 *   - `questionnaire_data` is replaced wholesale on every PATCH, so callers must
 *     always send the complete merged structure.
 *   - `complications` (diabetes / hypertension) and `procedures` (heart) are
 *     stored as a single string, not an array. The UI collects them as
 *     multi-select checkboxes and joins them with ", ".
 *   - `cancer_type`, `family_history.conditions` and
 *     `symptoms.irregular_heartbeat.symptoms` may be arrays.
 *   - Numeric fields (`age`, `height`, `weight`, `bp_medication_count`,
 *     `hospitalizations_last_year`, `exercise_days_per_week`,
 *     `average_sleep_hours`, `tobacco_years`, `youngest_affected_age`) must be
 *     sent as numbers and must be omitted when empty.
 */

export const QUESTIONNAIRE_SECTIONS = [
  'demographics',
  'medical_history',
  'family_history',
  'lifestyle',
  'mental_health',
  'symptoms',
];

export const STEP_META = [
  { key: 'video', title: 'Video Recording', short: 'Video' },
  { key: 'demographics', title: 'Demographics & Basic Information', short: 'Demographics' },
  { key: 'medical_history', title: 'Medical History', short: 'Medical' },
  { key: 'family_history', title: 'Family History', short: 'Family' },
  { key: 'lifestyle', title: 'Lifestyle', short: 'Lifestyle' },
  { key: 'mental_health', title: 'Mental Health & Stress', short: 'Mental Health' },
  { key: 'symptoms', title: 'Symptom Check', short: 'Symptoms' },
  { key: 'review', title: 'Review Answers', short: 'Review' },
];

// =========================================================
// OPTION LISTS  (value === canonical backend value)
// =========================================================

export const OPTIONS = {
  yesNo: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ],
  sex: [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ],
  diabetesType: [
    { label: 'Type 1', value: 'Type 1' },
    { label: 'Type 2', value: 'Type 2' },
    { label: 'Gestational', value: 'Gestational' },
    { label: 'Prediabetes', value: 'Prediabetes' },
    { label: 'Not sure', value: 'Not sure' },
  ],
  hba1c: [
    { label: 'Below 5.7%', value: 'Below 5.7' },
    { label: '5.7–6.4%', value: '5.7-6.4' },
    { label: '6.5–7.5%', value: '6.5-7.5' },
    { label: '7.5–9%', value: '7.5-9' },
    { label: 'Above 9%', value: 'Above 9' },
    { label: 'Never tested', value: 'Never tested' },
  ],
  fastingGlucose: [
    { label: 'Below 100 mg/dL', value: 'Below 100 mg/dL' },
    { label: '100–125 mg/dL', value: '100-125 mg/dL' },
    { label: '126–160 mg/dL', value: '126-160 mg/dL' },
    { label: 'Above 160 mg/dL', value: 'Above 160 mg/dL' },
    { label: 'Never tested', value: 'Never tested' },
  ],
  diabetesTreatment: [
    { label: 'Diet / lifestyle only', value: 'Diet / lifestyle only' },
    { label: 'Oral medication', value: 'Oral medication' },
    { label: 'Insulin', value: 'Insulin' },
    { label: 'Both oral and insulin', value: 'Both oral and insulin' },
  ],
  diabetesComplications: [
    { label: 'None', value: 'None' },
    { label: 'Eye (retinopathy)', value: 'Eye (retinopathy)' },
    { label: 'Kidney', value: 'Kidney' },
    { label: 'Nerve (neuropathy)', value: 'Nerve (neuropathy)' },
    { label: 'Foot', value: 'Foot' },
    { label: 'Not sure', value: 'Not sure' },
  ],
  bloodPressure: [
    { label: 'Below 130/80', value: 'Below 130/80' },
    { label: '130–139 / 80–89', value: '130-139 / 80-89' },
    { label: '140–159 / 90–99', value: '140-159 / 90-99' },
    { label: '160/100 or higher', value: '160/100 or higher' },
    { label: 'Not sure', value: 'Not sure' },
  ],
  bpCount: [
    { label: 'None', value: 0 },
    { label: '1', value: 1 },
    { label: '2 or more', value: 2 },
  ],
  hypertensionComplications: [
    { label: 'None', value: 'None' },
    { label: 'Stroke', value: 'Stroke' },
    { label: 'Kidney damage', value: 'Kidney damage' },
    { label: 'Heart-related', value: 'Heart-related' },
    { label: 'Not sure', value: 'Not sure' },
  ],
  heartConditionType: [
    { label: 'Coronary artery disease', value: 'Coronary artery disease' },
    { label: 'Arrhythmia', value: 'Arrhythmia' },
    { label: 'Prior heart attack', value: 'Prior heart attack' },
    { label: 'Heart failure', value: 'Heart failure' },
    { label: 'Valve disorder', value: 'Valve disorder' },
    { label: 'Congenital', value: 'Congenital' },
    { label: 'Other', value: 'Other' },
  ],
  heartProcedures: [
    { label: 'None', value: 'None' },
    { label: 'Angioplasty / stent', value: 'Angioplasty / stent' },
    { label: 'Bypass surgery', value: 'Bypass surgery' },
    { label: 'Pacemaker / defibrillator', value: 'Pacemaker / defibrillator' },
    { label: 'Other', value: 'Other' },
  ],
  heartSymptoms: [
    { label: 'None', value: 'None' },
    { label: 'Chest discomfort', value: 'Chest discomfort' },
    { label: 'Breathlessness', value: 'Breathlessness' },
    { label: 'Palpitations', value: 'Palpitations' },
    { label: 'More than one', value: 'More than one' },
  ],
  thyroidType: [
    { label: 'Hypothyroid', value: 'Hypothyroid' },
    { label: 'Hyperthyroid', value: 'Hyperthyroid' },
    { label: 'Not sure', value: 'Not sure' },
  ],
  tsh: [
    { label: 'Normal range', value: 'Normal range' },
    { label: 'Above normal', value: 'Above normal' },
    { label: 'Below normal', value: 'Below normal' },
    { label: 'Never tested', value: 'Never tested' },
  ],
  thyroidMedication: [
    { label: 'Yes, stable', value: 'Stable' },
    { label: 'Yes, dose changed recently', value: 'Dose changed' },
    { label: 'Not on medication', value: 'Not taking medication' },
  ],
  respiratorySeverity: [
    { label: 'Mild — occasional symptoms', value: 'Mild — occasional symptoms' },
    { label: 'Moderate — weekly symptoms', value: 'Moderate — weekly symptoms' },
    { label: 'Severe — daily symptoms / frequent flare-ups', value: 'Severe — daily symptoms / frequent flare-ups' },
  ],
  respiratoryMedication: [
    { label: 'Rescue inhaler only, occasionally', value: 'Rescue inhaler only, occasionally' },
    { label: 'Daily controller medication', value: 'Daily controller medication' },
    { label: 'Both', value: 'Both' },
  ],
  hospitalizations: [
    { label: 'None', value: 0 },
    { label: '1', value: 1 },
    { label: '2 or more', value: 2 },
  ],
  kidneySeverity: [
    { label: 'Early stage', value: 'Early stage' },
    { label: 'Moderate', value: 'Moderate' },
    { label: 'Advanced', value: 'Advanced' },
    { label: 'Not sure', value: 'Not sure' },
  ],
  creatinine: [
    { label: 'Normal range', value: 'Normal range' },
    { label: 'Abnormal', value: 'Abnormal' },
    { label: 'Never tested', value: 'Never tested' },
  ],
  cancerType: [
    { label: 'Breast', value: 'Breast' },
    { label: 'Cervical', value: 'Cervical' },
    { label: 'Oral cavity', value: 'Oral cavity' },
    { label: 'Lung', value: 'Lung' },
    { label: 'Stomach', value: 'Stomach' },
    { label: 'Colorectal', value: 'Colorectal' },
    { label: 'Ovarian', value: 'Ovarian' },
    { label: 'Prostate', value: 'Prostate' },
    { label: 'Blood (Leukemia / Lymphoma)', value: 'Blood (Leukemia/Lymphoma)' },
    { label: 'Thyroid', value: 'Thyroid' },
    { label: 'Other', value: 'Other' },
    { label: 'Not sure', value: 'Not sure' },
  ],
  cancerStage: [
    { label: 'Stage 0 / I (early)', value: 'Stage 0 / I (early)' },
    { label: 'Stage II', value: 'Stage II' },
    { label: 'Stage III', value: 'Stage III' },
    { label: 'Stage IV', value: 'Stage IV' },
    { label: 'Not sure', value: 'Not sure' },
  ],
  cancerStatus: [
    { label: 'In remission, 5+ years', value: 'In remission, 5+ years' },
    { label: 'In remission, under 5 years', value: 'In remission, under 5 years' },
    { label: 'Currently under treatment', value: 'Currently under treatment' },
    { label: 'Recurrence', value: 'Recurrence' },
  ],
  cancerTreatment: [
    { label: 'Surgery only', value: 'Surgery only' },
    { label: 'Chemotherapy', value: 'Chemotherapy' },
    { label: 'Radiation', value: 'Radiation' },
    { label: 'Combination', value: 'Combination' },
    { label: 'Not sure', value: 'Not sure' },
  ],
  hospitalizationTimeframe: [
    { label: 'Less than 1 year', value: 'Less than 1 year' },
    { label: '1–3 years', value: '1-3 years' },
    { label: '3–5 years', value: '3-5 years' },
  ],
  medicationDuration: [
    { label: 'Less than 6 months', value: 'Less than 6 months' },
    { label: '6 months–2 years', value: '6 months-2 years' },
    { label: '2+ years', value: '2+ years' },
  ],
  familyRelatives: [
    { label: 'Parent', value: 'Parent' },
    { label: 'Sibling', value: 'Sibling' },
    { label: 'Both', value: 'Both' },
  ],
  familyConditions: [
    { label: 'Diabetes', value: 'Diabetes' },
    { label: 'Heart disease', value: 'Heart disease' },
    { label: 'Cancer', value: 'Cancer' },
    { label: 'More than one', value: 'More than one' },
  ],
  tobaccoFrequency: [
    { label: 'Daily', value: 'Daily' },
    { label: 'Occasionally / socially', value: 'Occasionally / socially' },
  ],
  tobaccoAmount: [
    { label: 'Fewer than 5', value: 'Fewer than 5' },
    { label: '5–10', value: '5-10' },
    { label: 'More than 10', value: 'More than 10' },
  ],
  alcoholFrequency: [
    { label: '1–2 times a week', value: '1-2 times a week' },
    { label: '3–4 times a week', value: '3-4 times a week' },
    { label: 'Almost daily', value: 'Almost daily' },
  ],
  alcoholAmount: [
    { label: '1–2 drinks', value: '1-2 drinks' },
    { label: '3–4 drinks', value: '3-4 drinks' },
    { label: '5 or more drinks', value: '5 or more drinks' },
  ],
  diet: [
    { label: 'Mostly home-cooked', value: 'Mostly home-cooked' },
    { label: 'Mostly outside food', value: 'Mostly outside food' },
    { label: 'Mixed', value: 'Mixed' },
  ],
  stress: [
    { label: 'Low', value: 'Low' },
    { label: 'Moderate', value: 'Moderate' },
    { label: 'High', value: 'High' },
  ],
  supportSought: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
    { label: 'Prefer not to answer', value: 'Prefer not to answer' },
  ],
  supportType: [
    { label: 'Professional (therapist / counselor / doctor)', value: 'Professional' },
    { label: 'Informal support', value: 'Informal' },
  ],
  sobFrequency: [
    { label: 'Rarely', value: 'Rarely' },
    { label: 'Sometimes', value: 'Sometimes' },
    { label: 'Frequently', value: 'Frequently' },
  ],
  sobTrigger: [
    { label: 'At rest', value: 'At rest' },
    { label: 'Mild exertion (e.g. walking)', value: 'Mild exertion (e.g. walking)' },
    { label: 'Only during moderate–heavy exertion', value: 'Only during moderate–heavy exertion' },
  ],
  irregularSymptoms: [
    { label: 'Irregular heartbeat', value: 'Irregular heartbeat' },
    { label: 'Dizziness', value: 'Dizziness' },
    { label: 'Fatigue', value: 'Fatigue' },
    { label: 'More than one', value: 'More than one' },
  ],
  irregularDuration: [
    { label: 'Less than 1 month', value: 'Less than 1 month' },
    { label: '1–6 months', value: '1-6 months' },
    { label: '6+ months', value: '6+ months' },
  ],
  irregularFrequency: [
    { label: 'Occasional', value: 'Occasional' },
    { label: 'Frequent', value: 'Frequent' },
    { label: 'Constant', value: 'Constant' },
  ],
};

// =========================================================
// FIELD CONFIGURATION (drives rendering + review)
// =========================================================

export const DEMOGRAPHICS_FIELDS = [
  { key: 'full_name', label: 'Full name', type: 'text', placeholder: 'Full name' },
  { key: 'age', label: 'Age', type: 'number', min: 0, max: 150, placeholder: 'e.g. 35' },
  { key: 'sex', label: 'Sex', type: 'select', options: OPTIONS.sex },
  { key: 'height', label: 'Height (cm)', type: 'number', min: 30, max: 300, placeholder: 'e.g. 170' },
  { key: 'weight', label: 'Weight (kg)', type: 'number', min: 1, max: 500, placeholder: 'e.g. 72' },
  { key: 'occupation', label: 'Occupation', type: 'text', placeholder: 'e.g. Farmer / Office work' },
  { key: 'nature_of_work', label: 'Nature of work', type: 'text', placeholder: 'e.g. Desk-based / Field work' },
  { key: 'city', label: 'City / District', type: 'text', placeholder: 'City' },
  { key: 'state', label: 'State', type: 'text', placeholder: 'State' },
];

export const MEDICAL_CONFIG = [
  {
    key: 'diabetes',
    title: 'A. Diabetes',
    gate: { key: 'has_diabetes', label: 'Have you ever been diagnosed with diabetes or high blood sugar?' },
    fields: [
      { key: 'diabetes_type', label: 'Type of diabetes', type: 'select', options: OPTIONS.diabetesType, required: true },
      { key: 'hba1c_range', label: 'Most recent HbA1c result', type: 'select', options: OPTIONS.hba1c, required: true },
      { key: 'fasting_glucose_range', label: 'Most recent fasting blood sugar', type: 'select', options: OPTIONS.fastingGlucose, required: true },
      { key: 'treatment', label: 'Current treatment', type: 'select', options: OPTIONS.diabetesTreatment },
      { key: 'complications', label: 'Diagnosed complications', type: 'multi', options: OPTIONS.diabetesComplications, join: true },
    ],
  },
  {
    key: 'hypertension',
    title: 'B. Hypertension',
    gate: { key: 'has_hypertension', label: 'Have you ever been diagnosed with high blood pressure (hypertension)?' },
    fields: [
      { key: 'blood_pressure_range', label: 'Most recent blood pressure reading', type: 'select', options: OPTIONS.bloodPressure, required: true },
      { key: 'bp_medication_count', label: 'Number of BP medications', type: 'select', options: OPTIONS.bpCount, required: true },
      { key: 'complications', label: 'Diagnosed complications', type: 'multi', options: OPTIONS.hypertensionComplications, join: true },
    ],
  },
  {
    key: 'heart_condition',
    title: 'D. Heart Condition',
    gate: { key: 'has_heart_condition', label: 'Have you ever been diagnosed with a heart condition, such as heart disease, arrhythmia, or a prior heart attack?' },
    fields: [
      { key: 'condition_type', label: 'Type of condition', type: 'select', options: OPTIONS.heartConditionType, required: true },
      { key: 'procedures', label: 'Procedure(s) undergone', type: 'multi', options: OPTIONS.heartProcedures, join: true },
      { key: 'symptoms_during_activity', label: 'Current symptoms during activity', type: 'select', options: OPTIONS.heartSymptoms },
      { key: 'cardiologist_followup', label: 'Under regular cardiologist follow-up?', type: 'yesno' },
    ],
  },
  {
    key: 'thyroid',
    title: 'E. Thyroid Disorder',
    gate: { key: 'has_thyroid_condition', label: 'Have you been diagnosed with a thyroid disorder?' },
    fields: [
      { key: 'thyroid_type', label: 'Type', type: 'select', options: OPTIONS.thyroidType, required: true },
      { key: 'tsh_range', label: 'Most recent TSH level', type: 'select', options: OPTIONS.tsh },
      { key: 'medication_status', label: 'On medication with stable dosage?', type: 'select', options: OPTIONS.thyroidMedication, required: true },
    ],
  },
  {
    key: 'respiratory',
    title: 'F. Respiratory Condition',
    gate: { key: 'has_respiratory_condition', label: 'Do you have asthma or another chronic respiratory condition?' },
    fields: [
      { key: 'severity', label: 'Severity', type: 'select', options: OPTIONS.respiratorySeverity, required: true },
      { key: 'medication', label: 'Medication use', type: 'select', options: OPTIONS.respiratoryMedication },
      { key: 'hospitalizations_last_year', label: 'Hospitalizations during the last year', type: 'select', options: OPTIONS.hospitalizations, required: true },
    ],
  },
  {
    key: 'kidney',
    title: 'G. Kidney Condition',
    gate: { key: 'has_kidney_condition', label: 'Have you been diagnosed with a kidney condition?' },
    fields: [
      { key: 'severity', label: 'Stage / severity', type: 'select', options: OPTIONS.kidneySeverity, required: true },
      { key: 'creatinine_egfr_status', label: 'Most recent creatinine or eGFR result', type: 'select', options: OPTIONS.creatinine },
      { key: 'dialysis_status', label: 'Currently on dialysis?', type: 'yesno' },
    ],
  },
  {
    key: 'cancer',
    title: 'H. Cancer',
    gate: { key: 'has_cancer', label: 'Have you ever been diagnosed with cancer?' },
    fields: [
      { key: 'cancer_type', label: 'Type of cancer', type: 'select', options: OPTIONS.cancerType, required: true },
      { key: 'stage', label: 'Stage at diagnosis', type: 'select', options: OPTIONS.cancerStage },
      { key: 'current_status', label: 'Current status', type: 'select', options: OPTIONS.cancerStatus },
      { key: 'treatment', label: 'Treatment received', type: 'select', options: OPTIONS.cancerTreatment },
    ],
  },
  {
    key: 'hospitalization',
    title: 'I. Hospitalization',
    gate: { key: 'hospitalized_last_5_years', label: 'Have you been hospitalized for any reason in the last five years?' },
    fields: [
      { key: 'reason', label: 'Primary reason for hospitalization', type: 'text', placeholder: 'Reason', required: true },
      { key: 'timeframe', label: 'How long ago?', type: 'select', options: OPTIONS.hospitalizationTimeframe },
      { key: 'ongoing_effects', label: 'Any ongoing effects?', type: 'yesno' },
    ],
  },
  {
    key: 'regular_medication',
    title: 'J. Regular Medication',
    gate: { key: 'takes_regular_medication', label: 'Are you currently taking any prescribed medication on a regular basis?' },
    fields: [
      { key: 'medication_name', label: 'Medication name', type: 'text', placeholder: 'Medication name', required: true },
      { key: 'condition_treated', label: 'Condition it treats', type: 'text', placeholder: 'Condition' },
      { key: 'duration', label: 'Duration', type: 'select', options: OPTIONS.medicationDuration },
    ],
  },
];

export const FAMILY_FIELDS = [
  { key: 'has_family_history', label: 'Has an immediate family member (parent or sibling) been diagnosed with diabetes, heart disease, or cancer before age 60?', type: 'yesno' },
  { key: 'relatives', label: 'Which relative(s)?', type: 'select', options: OPTIONS.familyRelatives, when: (f) => f.has_family_history === 'Yes' },
  { key: 'conditions', label: 'Which condition(s)?', type: 'multi', options: OPTIONS.familyConditions, when: (f) => f.has_family_history === 'Yes' },
  { key: 'youngest_affected_age', label: 'Age at diagnosis of the youngest-affected relative', type: 'number', min: 0, max: 150, placeholder: 'e.g. 45', when: (f) => f.has_family_history === 'Yes' },
];

export const LIFESTYLE_FIELDS = [
  { key: 'tobacco_use', label: 'Do you currently smoke or use any tobacco product?', type: 'yesno' },
  { key: 'tobacco_frequency', label: 'Frequency', type: 'select', options: OPTIONS.tobaccoFrequency, when: (f) => f.tobacco_use === 'Yes' },
  { key: 'tobacco_amount_per_day', label: 'Amount per day', type: 'select', options: OPTIONS.tobaccoAmount, when: (f) => f.tobacco_use === 'Yes' },
  { key: 'tobacco_years', label: 'Years smoking / using tobacco', type: 'number', min: 0, max: 150, placeholder: 'e.g. 5', when: (f) => f.tobacco_use === 'Yes' },
  { key: 'alcohol_use', label: 'Do you consume alcohol?', type: 'yesno' },
  { key: 'alcohol_frequency', label: 'Frequency', type: 'select', options: OPTIONS.alcoholFrequency, when: (f) => f.alcohol_use === 'Yes' },
  { key: 'alcohol_amount_per_sitting', label: 'Typical amount per sitting', type: 'select', options: OPTIONS.alcoholAmount, when: (f) => f.alcohol_use === 'Yes' },
  { key: 'exercise_days_per_week', label: 'How many days a week do you exercise for 30 minutes or more? (0–7)', type: 'number', min: 0, max: 7, placeholder: '0–7' },
  { key: 'average_sleep_hours', label: 'On average, how many hours do you sleep per night?', type: 'number', min: 0, max: 24, step: 0.5, placeholder: 'e.g. 7' },
  { key: 'diet', label: 'How would you describe your typical diet?', type: 'select', options: OPTIONS.diet },
];

export const MENTAL_FIELDS = [
  { key: 'stress_level', label: 'How would you rate your day-to-day stress levels?', type: 'select', options: OPTIONS.stress },
  { key: 'sought_support', label: 'Have you sought support for anxiety or stress in the past year?', type: 'select', options: OPTIONS.supportSought },
  { key: 'support_type', label: 'Was this through:', type: 'select', options: OPTIONS.supportType, when: (f) => f.sought_support === 'Yes' },
];

export const SYMPTOMS_CONFIG = [
  {
    key: 'shortness_of_breath',
    title: 'A. Shortness of Breath',
    gate: { key: 'present', label: 'Do you experience shortness of breath during normal daily activity?' },
    fields: [
      { key: 'frequency', label: 'Frequency', type: 'select', options: OPTIONS.sobFrequency },
      { key: 'trigger', label: 'Trigger level', type: 'select', options: OPTIONS.sobTrigger },
    ],
  },
  {
    key: 'irregular_heartbeat',
    title: 'B. Irregular Heartbeat, Dizziness, or Unusual Fatigue',
    gate: { key: 'present', label: 'Have you recently noticed an irregular heartbeat, dizziness, or unusual fatigue?' },
    fields: [
      { key: 'symptoms', label: 'Which symptoms have you noticed?', type: 'multi', options: OPTIONS.irregularSymptoms },
      { key: 'duration', label: 'How long has this been happening?', type: 'select', options: OPTIONS.irregularDuration },
      { key: 'frequency', label: 'Frequency', type: 'select', options: OPTIONS.irregularFrequency },
    ],
  },
];

// =========================================================
// HELPERS
// =========================================================

export function deepClone(value) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (_) {
    return value;
  }
}

export function isBlank(value) {
  return value === undefined
    || value === null
    || value === ''
    || (Array.isArray(value) && value.length === 0);
}

export function toArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    if (!value.trim()) return [];
    if (value.includes(',')) return value.split(',').map((v) => v.trim()).filter(Boolean);
    return [value];
  }
  return [];
}

function genderToSex(gender) {
  const g = String(gender || '').toUpperCase();
  if (g === 'MALE') return 'Male';
  if (g === 'FEMALE') return 'Female';
  if (g === 'OTHER') return 'Other';
  return '';
}

/**
 * Builds a fresh, prefilled form from the selected member + family. Only values
 * that actually exist on the member/family are prefilled; nothing is fabricated.
 */
export function defaultForm(member, family) {
  const fullName = (member && member.full_name)
    || [(member && member.first_name), (member && member.middle_name), (member && member.last_name)]
      .filter(Boolean)
      .join(' ');
  return {
    demographics: {
      full_name: fullName || '',
      age: (member && member.age != null) ? member.age : '',
      sex: genderToSex(member && member.gender),
      height: '',
      weight: '',
      occupation: (member && member.occupation) || '',
      nature_of_work: '',
      city: (family && (family.district || family.village)) || '',
      state: (family && family.state) || '',
    },
    medical_history: {
      diabetes: {},
      hypertension: {},
      heart_condition: {},
      thyroid: {},
      respiratory: {},
      kidney: {},
      cancer: {},
      hospitalization: {},
      regular_medication: {},
    },
    family_history: {},
    lifestyle: {},
    mental_health: {},
    symptoms: {
      shortness_of_breath: {},
      irregular_heartbeat: {},
    },
  };
}

function pruneEmpty(node) {
  if (node === undefined || node === null || node === '') return undefined;
  if (Array.isArray(node)) return node;
  if (typeof node === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      const cleaned = pruneEmpty(v);
      if (cleaned === undefined) continue;
      if (cleaned && typeof cleaned === 'object' && !Array.isArray(cleaned)
        && Object.keys(cleaned).length === 0) continue;
      out[k] = cleaned;
    }
    return out;
  }
  return node;
}

/**
 * Converts the UI form state into the exact structure the backend accepts.
 * Empty values are pruned so draft PATCH/POST never trip numeric / enum
 * validation on blank strings.
 */
export function buildQuestionnaireData(form) {
  const data = deepClone(form || {});
  return pruneEmpty(data) || {};
}

/**
 * Hydrates the UI form state from a stored questionnaire_data payload.
 */
export function formFromAssessment(payload, base) {
  const form = deepClone(base || defaultForm(null, null));
  if (!payload || typeof payload !== 'object') return form;

  for (const section of ['demographics', 'family_history', 'lifestyle', 'mental_health']) {
    if (payload[section] && typeof payload[section] === 'object' && !Array.isArray(payload[section])) {
      form[section] = { ...(form[section] || {}), ...payload[section] };
    }
  }

  if (payload.medical_history && typeof payload.medical_history === 'object') {
    for (const [key, value] of Object.entries(payload.medical_history)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        form.medical_history[key] = { ...(form.medical_history[key] || {}), ...value };
      }
    }
  }

  if (payload.symptoms && typeof payload.symptoms === 'object') {
    for (const [key, value] of Object.entries(payload.symptoms)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        form.symptoms[key] = { ...(form.symptoms[key] || {}), ...value };
      }
    }
  }

  form.family_history.conditions = toArray(form.family_history.conditions);
  form.symptoms.irregular_heartbeat = form.symptoms.irregular_heartbeat || {};
  form.symptoms.irregular_heartbeat.symptoms = toArray(form.symptoms.irregular_heartbeat.symptoms);

  return form;
}

// =========================================================
// CLIENT-SIDE VALIDATION (mirrors backend require_complete=True)
// =========================================================

export function validateQuestionnaire(form) {
  const errors = {};
  const f = form || {};
  const req = (path, cond, message) => {
    if (!cond) errors[path] = message || 'This field is required.';
  };
  const inRange = (value, min, max) => typeof value === 'number' && !Number.isNaN(value)
    && (min === undefined || value >= min) && (max === undefined || value <= max);

  const d = f.demographics || {};
  req('demographics.full_name', !isBlank(d.full_name));
  req('demographics.age', d.age !== '' && d.age != null && inRange(d.age, 0, 150), 'Enter a valid age (0–150).');
  req('demographics.sex', !isBlank(d.sex));
  req('demographics.height', d.height !== '' && d.height != null && inRange(d.height, 30, 300), 'Enter a valid height (30–300 cm).');
  req('demographics.weight', d.weight !== '' && d.weight != null && inRange(d.weight, 1, 500), 'Enter a valid weight (1–500 kg).');
  req('demographics.occupation', !isBlank(d.occupation));
  req('demographics.nature_of_work', !isBlank(d.nature_of_work));
  req('demographics.city', !isBlank(d.city));
  req('demographics.state', !isBlank(d.state));

  const mh = f.medical_history || {};
  for (const sec of MEDICAL_CONFIG) {
    const sub = mh[sec.key] || {};
    const gatePath = `medical_history.${sec.key}.${sec.gate.key}`;
    req(gatePath, sub[sec.gate.key] === 'Yes' || sub[sec.gate.key] === 'No');
    if (sub[sec.gate.key] === 'Yes') {
      for (const field of sec.fields) {
        if (!field.required) continue;
        const path = `medical_history.${sec.key}.${field.key}`;
        req(path, !isBlank(sub[field.key]));
      }
    }
  }

  const fh = f.family_history || {};
  req('family_history.has_family_history', fh.has_family_history === 'Yes' || fh.has_family_history === 'No');
  if (fh.has_family_history === 'Yes') {
    req('family_history.relatives', !isBlank(fh.relatives));
    req('family_history.conditions', !isBlank(fh.conditions));
    req('family_history.youngest_affected_age',
      fh.youngest_affected_age !== '' && fh.youngest_affected_age != null
      && inRange(fh.youngest_affected_age, 0, 150),
      'Enter a valid age (0–150).');
  }

  const lf = f.lifestyle || {};
  req('lifestyle.tobacco_use', lf.tobacco_use === 'Yes' || lf.tobacco_use === 'No');
  if (lf.tobacco_use === 'Yes') req('lifestyle.tobacco_frequency', !isBlank(lf.tobacco_frequency));
  req('lifestyle.alcohol_use', lf.alcohol_use === 'Yes' || lf.alcohol_use === 'No');
  if (lf.alcohol_use === 'Yes') req('lifestyle.alcohol_frequency', !isBlank(lf.alcohol_frequency));
  req('lifestyle.exercise_days_per_week',
    lf.exercise_days_per_week !== '' && lf.exercise_days_per_week != null
    && inRange(lf.exercise_days_per_week, 0, 7),
    'Enter a value between 0 and 7.');
  req('lifestyle.average_sleep_hours',
    lf.average_sleep_hours !== '' && lf.average_sleep_hours != null
    && inRange(lf.average_sleep_hours, 0, 24),
    'Enter valid sleep hours (0–24).');
  req('lifestyle.diet', !isBlank(lf.diet));

  const mhf = f.mental_health || {};
  req('mental_health.stress_level', !isBlank(mhf.stress_level));
  req('mental_health.sought_support', !isBlank(mhf.sought_support));
  if (mhf.sought_support === 'Yes') req('mental_health.support_type', !isBlank(mhf.support_type));

  const sym = f.symptoms || {};
  const sob = sym.shortness_of_breath || {};
  req('symptoms.shortness_of_breath.present', sob.present === 'Yes' || sob.present === 'No');
  if (sob.present === 'Yes') {
    req('symptoms.shortness_of_breath.frequency', !isBlank(sob.frequency));
  }
  const ihb = sym.irregular_heartbeat || {};
  req('symptoms.irregular_heartbeat.present', ihb.present === 'Yes' || ihb.present === 'No');
  if (ihb.present === 'Yes') {
    req('symptoms.irregular_heartbeat.symptoms', !isBlank(ihb.symptoms));
  }

  return errors;
}

export function countErrors(errors) {
  return Object.keys(errors || {}).length;
}

/** Flattens a DRF error payload into a `path -> message` map for display. */
export function flattenErrors(errors) {
  const out = {};
  const walk = (node, path) => {
    if (node == null) return;
    if (typeof node === 'string') {
      out[path || 'detail'] = node;
      return;
    }
    if (Array.isArray(node)) {
      out[path || 'detail'] = node.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(', ');
      return;
    }
    if (typeof node === 'object') {
      for (const [key, value] of Object.entries(node)) {
        if (key === 'questionnaire_data' && !path) walk(value, '');
        else walk(value, path ? `${path}.${key}` : key);
      }
    }
  };
  walk(errors, '');
  return out;
}

/** Returns the human label for a stored value, falling back to the raw value. */
export function labelForOption(options, value) {
  if (value === undefined || value === null || value === '') return '—';
  const option = (options || []).find((o) => String(o.value) === String(value));
  if (option) return option.label;
  if (Array.isArray(value)) {
    if (!value.length) return '—';
    return value.map((v) => labelForOption(options, v)).join(', ');
  }
  return String(value);
}
