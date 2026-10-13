import React, { useState, useRef, useEffect } from 'react';
import { X, Check, ArrowDown, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

const ConsentNoticeModal = ({ isOpen, onClose, onConsentAgreed, initialConsents = null }) => {
  const [requiredConsents, setRequiredConsents] = useState({
    a: true,
    b: true,
    c: true,
    d: true,
    e: true,
  });

  const [optionalConsents, setOptionalConsents] = useState({
    f: true,
    g: true,
    h: true,
  });

  const [submitted, setSubmitted] = useState(false);
  const [showToBottom, setShowToBottom] = useState(true);

  const bottomRef = useRef(null);
  const contentRef = useRef(null);

  // Sync initial consents if provided, defaulting all to true (auto-clicked)
  useEffect(() => {
    if (isOpen) {
      if (initialConsents?.required) {
        setRequiredConsents({ ...initialConsents.required });
      } else {
        setRequiredConsents({ a: true, b: true, c: true, d: true, e: true });
      }

      if (initialConsents?.optional) {
        setOptionalConsents({ ...initialConsents.optional });
      } else {
        setOptionalConsents({ f: true, g: true, h: true });
      }
    }
  }, [initialConsents, isOpen]);

  const allRequiredChecked = Object.values(requiredConsents).every(Boolean);

  const handleRequiredToggle = (key) => {
    setRequiredConsents((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleOptionalToggle = (key) => {
    setOptionalConsents((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Quick "I Agree" button inside notice: auto-ticks all required (a) to (e)
  const handleAutoAgreeRequired = () => {
    setRequiredConsents({
      a: true,
      b: true,
      c: true,
      d: true,
      e: true,
    });
    // Scroll smoothly to bottom actions if not already there
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleScroll = () => {
    if (!contentRef.current || !bottomRef.current) return;
    const scrollContainer = contentRef.current;
    const isAtBottom =
      scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 120;
    setShowToBottom(!isAtBottom);
  };

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!allRequiredChecked) return;

    const consentRecord = {
      noticeVersion: 'DPDP-1.0',
      timestamp: new Date().toISOString(),
      required: requiredConsents,
      optional: optionalConsents,
    };

    setSubmitted(true);

    setTimeout(() => {
      onConsentAgreed(consentRecord);
      onClose();
      setSubmitted(false);
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[92vh] max-h-[92vh] flex flex-col overflow-hidden border border-gray-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-5 py-4 bg-[#00205b] text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-cyan-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                Notice and Request for Consent
              </h2>
              <p className="text-xs text-blue-200">
                Under the Digital Personal Data Protection (DPDP) Act, 2023 • XRAi Digital
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleAutoAgreeRequired}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
              title="Auto-select all required consent boxes"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>I Agree (Quick Select)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 text-gray-800 text-[15px] leading-relaxed select-text space-y-6"
        >
          {/* Main Title Banner */}
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f1b33] tracking-tight">
              NOTICE AND REQUEST FOR CONSENT
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              XRAi Digital (a brand of U4RAD Technologies Pvt Ltd) • Patient Privacy Notice
            </p>
          </div>

          <p>
            <strong>XRAi Digital</strong> (a brand of U4RAD Technologies Pvt Ltd) (&ldquo;
            <strong>Company</strong>&rdquo;, &ldquo;<strong>we</strong>&rdquo; or &ldquo;
            <strong>us</strong>&rdquo;) respects your privacy. We are the{' '}
            <strong>Data Fiduciary</strong> responsible for your personal data under the{' '}
            <strong>Digital Personal Data Protection Act, 2023</strong> (&ldquo;
            <strong>DPDP Act</strong>&rdquo;).
          </p>

          <p>
            This notice explains how we collect, use, store, share and protect (&ldquo;
            <strong>Process</strong>&rdquo;) your personal and health data when you use our
            diagnostic testing and tele-reporting services — X-Ray, ECG, PFT, Holter, blood and
            pathology tests, physician consultations, home and workplace visits, health camps and
            screening programmes (&ldquo;<strong>Requested Service</strong>&rdquo;). If your test is
            arranged by a hospital or clinic and reported on its systems, that provider&apos;s privacy
            notice will also apply.{' '}
            <strong>Please read this notice before you give your consent.</strong>
          </p>

          {/* Section 1 */}
          <section>
            <h3 className="text-base sm:text-lg font-bold text-[#0f1b33] mb-3">
              1. Categories of Personal Data:{' '}
              <span className="font-normal text-gray-700">
                Depending on the service you use, we may Process the following personal data:
              </span>
            </h3>

            <div className="overflow-x-auto border border-[#1e3a6e] rounded-lg shadow-xs mb-3">
              <table className="w-full border-collapse bg-white text-sm">
                <thead>
                  <tr className="bg-[#00205b] text-white font-bold text-center">
                    <th className="py-3 px-4 text-left w-1/3 border-r border-[#1e3a6e]">
                      Categories
                    </th>
                    <th className="py-3 px-4 text-left">Data Elements</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3a6e]/20">
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20 align-top">
                      Identity and Contact Details
                    </td>
                    <td className="py-3 px-4">
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 list-disc pl-5">
                        <li>Name</li>
                        <li>Age / date of birth</li>
                        <li>Gender</li>
                        <li>Phone number</li>
                        <li>Email address</li>
                        <li>Address</li>
                        <li>ID reference (where required)</li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20 align-top">
                      Parent / Guardian and Nominee Details
                    </td>
                    <td className="py-3 px-4">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Parent / guardian name, relationship and contact (patients under 18)</li>
                        <li>Nominee name and contact details</li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20 align-top">
                      Health and Diagnostic Information
                    </td>
                    <td className="py-3 px-4">
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 list-disc pl-5">
                        <li>X-Ray / imaging</li>
                        <li>ECG</li>
                        <li>PFT</li>
                        <li>Holter data and results</li>
                        <li>Vitals</li>
                        <li>Blood and pathology results</li>
                        <li>Radiology and cardiology reports</li>
                        <li>Physician consultations</li>
                        <li>Physician prescription data</li>
                        <li>Referring doctor details</li>
                        <li>Medical history / symptoms you share</li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20 align-top">
                      Laboratory Information (Partner Labs)
                    </td>
                    <td className="py-3 px-4">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Blood and other samples collected for testing</li>
                        <li>
                          Details sent with your sample (name, age, gender, tests requested,
                          referring doctor)
                        </li>
                        <li>Reports received from partner laboratories</li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20 align-top">
                      Service, Visit and Payment Information
                    </td>
                    <td className="py-3 px-4">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Test booking details</li>
                        <li>Home / workplace visit address and exact location</li>
                        <li>Sample / scan collection details</li>
                        <li>Patient / portal ID</li>
                        <li>Payment amount, mode and transaction reference</li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20 align-top">
                      Technical Information (Device / App / Portal)
                    </td>
                    <td className="py-3 px-4">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Login details</li>
                        <li>Location (only with your permission)</li>
                        <li>IP address</li>
                        <li>Device identifiers (model, operating system, app ID)</li>
                        <li>Usage information needed to run the app securely</li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20 align-top">
                      Communication Records
                    </td>
                    <td className="py-3 px-4">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Calls, emails, chats and messaging-app conversations with us</li>
                        <li>Requests and grievances you raise</li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20 align-top">
                      Sponsor-linked Information (Camps / Checks)
                    </td>
                    <td className="py-3 px-4">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Employee ID (employer-paid tests)</li>
                        <li>Policy number (insurer-paid tests)</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="italic text-sm text-gray-700">
              <strong>Note:</strong> We only collect what is needed for the service you have asked for.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h3 className="text-base sm:text-lg font-bold text-[#0f1b33] mb-3">
              2. Purposes of Processing of Personal Data:{' '}
              <span className="font-normal text-gray-700">
                We Process your personal data for the following purposes:
              </span>
            </h3>

            <div className="overflow-x-auto border border-[#1e3a6e] rounded-lg shadow-xs mb-3">
              <table className="w-full border-collapse bg-white text-sm">
                <thead>
                  <tr className="bg-[#00205b] text-white font-bold text-center">
                    <th className="py-3 px-4 text-left w-1/3 border-r border-[#1e3a6e]">Purpose</th>
                    <th className="py-3 px-4 text-left">Details &amp; Use Cases</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3a6e]/20">
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20 align-top">
                      Verification and Registration
                    </td>
                    <td className="py-3 px-4">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Verifying your identity and any guardian / nominee details</li>
                        <li>
                          Registering you and scheduling your test, home visit or camp appointment
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20 align-top">
                      Diagnostic Testing
                    </td>
                    <td className="py-3 px-4">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Confirming the exact location where your test is to be done</li>
                        <li>
                          Performing your test (X-Ray, ECG, PFT, Holter, vitals, blood and pathology
                          tests, physician consultations) and generating results
                        </li>
                        <li>
                          Blood and pathology samples are sent to{' '}
                          <strong>partner (third-party) laboratories</strong> for testing and reporting
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20 align-top">
                      Tele-reporting (Radiology / Cardiology / Pulmonology)
                    </td>
                    <td className="py-3 px-4">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          Reporting by our qualified radiologists, cardiologists and pulmonologists, on{' '}
                          <strong>our secure platform / PACS</strong> or a{' '}
                          <strong>healthcare client&apos;s secure systems</strong>
                        </li>
                        <li>Access is restricted to authorised medical and technical staff</li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20 align-top">
                      Use of Artificial Intelligence (AI)
                    </td>
                    <td className="py-3 px-4">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          AI is used <strong>ONLY</strong> to help read chest X-rays in{' '}
                          <strong>government TB screening programmes</strong>
                        </li>
                        <li>
                          <strong>All other X-rays, ECGs and tests are reported by qualified doctors</strong>
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20 align-top">
                      Delivery of Results
                    </td>
                    <td className="py-3 px-4">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          To you through our app, portal, SMS or WhatsApp, and to your referring
                          doctor
                        </li>
                        <li>You can ask us at any time to stop sending results on messaging apps</li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20 align-top">
                      Sponsored Tests (Camp / Insurance / Pre-employment)
                    </td>
                    <td className="py-3 px-4">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          Results or fitness outcome shared with your employer or insurer{' '}
                          <strong>only</strong> for these checks — see the Note in Section 3
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20 align-top">
                      Government Screening Programmes (e.g. TB)
                    </td>
                    <td className="py-3 px-4">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          Results shared with the programme partner, who reports to government
                          health authorities
                        </li>
                        <li>
                          We do <strong>not</strong> share your data directly with the government
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20 align-top">
                      Research &amp; Improving Clinical Outcomes{' '}
                      <span className="inline-block bg-[#fff6e3] text-[#8a5a00] text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ml-1">
                        Optional
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>Only with your separate consent</strong> (clause (f) in Section 8)
                        </li>
                        <li>
                          Data is <strong>de-identified</strong> (name and contact details removed)
                          before use
                        </li>
                        <li>
                          Follows ICMR guidelines, with Ethics Committee approval where required
                        </li>
                        <li>
                          Our data models are <strong>proprietary — never sold or licensed</strong> to
                          anyone
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20 align-top">
                      Internal Marketing (Discounts &amp; Offers){' '}
                      <span className="inline-block bg-[#fff6e3] text-[#8a5a00] text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ml-1">
                        Optional
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>Only with your separate consent</strong> (clause (g) in Section 8);
                          you can opt out at any time
                        </li>
                        <li>
                          Offers come from us only; <strong>never sent to patients under 18</strong>
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20 align-top">
                      Customer Support
                    </td>
                    <td className="py-3 px-4">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          Helping you and communicating with you by phone, email and messaging apps
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20 align-top">
                      Legal, Security and Compliance
                    </td>
                    <td className="py-3 px-4">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          Regulatory and medico-legal reporting, including{' '}
                          <strong>mandatory TB notification</strong> (directly or through the programme
                          partner)
                        </li>
                        <li>Maintaining medical records as required by law</li>
                        <li>Security logs (kept at least 1 year) and fraud prevention</li>
                        <li>Enforcing our rights or defending ourselves against claims</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Banner Callout */}
            <div className="bg-[#f3f6fb] border-l-4 border-[#00205b] p-4 text-center my-4 rounded-r-lg font-bold text-gray-900 tracking-wide">
              WE NEVER SELL YOUR DATA OR SHARE IT WITH ANYONE FOR MARKETING.
              <br />
              ALL YOUR DATA IS STORED IN INDIA.
            </div>

            <p className="italic text-sm text-gray-700">
              <strong>Note:</strong> In some cases the law allows us to Process your data without consent
              — for example, in a medical emergency, to comply with a law, court order or
              public-health requirement, or to establish or defend legal claims. Messages you choose to
              receive on WhatsApp travel through WhatsApp&apos;s own service.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h3 className="text-base sm:text-lg font-bold text-[#0f1b33] mb-3">
              3. Data Sharing:{' '}
              <span className="font-normal text-gray-700">
                We may share your personal data only with the following, and only for these purposes:
              </span>
            </h3>

            <div className="overflow-x-auto border border-[#1e3a6e] rounded-lg shadow-xs mb-3">
              <table className="w-full border-collapse bg-white text-sm">
                <thead>
                  <tr className="bg-[#00205b] text-white font-bold text-center">
                    <th className="py-3 px-4 text-left w-1/3 border-r border-[#1e3a6e]">Entity</th>
                    <th className="py-3 px-4 text-left">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e3a6e]/20">
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20">
                      You and your referring doctor
                    </td>
                    <td className="py-3 px-4">To deliver and explain your results</td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20">
                      Our radiologists, cardiologists, pulmonologists and physicians
                    </td>
                    <td className="py-3 px-4">To interpret and report your tests</td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20">
                      Partner laboratories (third-party pathology labs)
                    </td>
                    <td className="py-3 px-4">
                      To test your samples and report results — only the details needed are shared
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20">
                      Healthcare clients (hospitals / clinics)
                    </td>
                    <td className="py-3 px-4">
                      Where reporting is done on their systems, as arranged
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20">
                      Your sponsor (employer / insurer)
                    </td>
                    <td className="py-3 px-4">
                      Only for camps, insurance or pre-employment checks — see Note below
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20">
                      Government screening programme partners
                    </td>
                    <td className="py-3 px-4">
                      Only for government screening programmes (e.g. TB), for reporting to health
                      authorities
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20">
                      Technology providers (Data Processors)
                    </td>
                    <td className="py-3 px-4">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          Cloud hosting (<strong>in India</strong>), PACS, app and portal, SMS, email
                          and WhatsApp services
                        </li>
                        <li>Bound by contract and confidentiality obligations</li>
                      </ul>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20">
                      Payment aggregators and gateways
                    </td>
                    <td className="py-3 px-4">To process payments you make</td>
                  </tr>
                  <tr className="hover:bg-blue-50/30">
                    <td className="py-3 px-4 font-semibold text-[#0f1b33] border-r border-[#1e3a6e]/20">
                      Authorities, courts, lawyers and auditors
                    </td>
                    <td className="py-3 px-4">
                      Only when required by law, court order, audit or to resolve disputes
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-[#f3f6fb] border-l-4 border-[#00205b] p-4 my-3 rounded-r-lg text-sm leading-relaxed">
              <strong>If your test is sponsored (camp / insurance / pre-employment):</strong> your sponsor
              receives <strong>only the result or fitness outcome</strong> needed — not your full medical
              history. We will tell you who the sponsor is at the time of the test.{' '}
              <strong>HIV tests</strong> are done only with your separate written consent, and their
              results are <strong>never shared with a sponsor</strong> without your specific consent. If
              you do not want results shared, you may choose a private test instead.
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h3 className="text-base sm:text-lg font-bold text-[#0f1b33] mb-2">
              4. Retention and Security
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                <strong>How long:</strong> diagnostic reports and images are kept for at least the period
                required by medical record-keeping laws, and system logs for at least 1 year. We keep
                reports longer <strong>only if you agree</strong> (clause (h) in Section 8). Data is
                then securely deleted or anonymised.
              </li>
              <li>
                <strong>Where:</strong> all your data is stored on secure cloud servers{' '}
                <strong>located in India</strong>.
              </li>
              <li>
                <strong>Protection:</strong> encryption in transit, access controls, and
                confidentiality obligations on staff and partners.
              </li>
              <li>
                <strong>Data breach:</strong> if a breach affects you, we will tell you{' '}
                <strong>without delay</strong> — what happened, the likely impact, what we are doing and
                what you can do — and report it to the Data Protection Board of India.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h3 className="text-base sm:text-lg font-bold text-[#0f1b33] mb-2">5. Your Rights</h3>
            <p className="text-sm mb-2">Under the DPDP Act, you have the right to:</p>
            <ol className="list-[lower-alpha] pl-6 space-y-1.5 text-sm">
              <li>
                <strong>Access</strong> a summary of your personal data, how we use it, and who we have
                shared it with.
              </li>
              <li>
                <strong>Correct or update</strong> inaccurate or incomplete data.
              </li>
              <li>
                <strong>Request erasure</strong> of your data where it is no longer needed and the law
                allows.
              </li>
              <li>
                <strong>Nominate</strong> another person to exercise your rights in case of death or
                incapacity.
              </li>
              <li>
                <strong>Grievance redressal</strong> — raise a complaint with our Grievance Officer.
              </li>
              <li>
                <strong>Withdraw consent</strong> at any time (see Section 6).
              </li>
            </ol>
            <p className="text-sm mt-3 text-gray-700">
              To exercise your rights, contact our Grievance Officer at{' '}
              <a
                href="mailto:privacy@u4rad.com"
                className="text-[#1d42c9] font-semibold underline hover:text-[#1636a8]"
              >
                privacy@u4rad.com
              </a>{' '}. We may verify your
              identity first, and will respond within <strong>[30] days</strong> (at most 90 days, as
              required by law). <strong>Your duty:</strong> please give us accurate information and do
              not file false grievances.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h3 className="text-base sm:text-lg font-bold text-[#0f1b33] mb-2">
              6. Consent Withdrawal
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              You can withdraw consent at any time — <strong>as easily as you gave it</strong> — using
              &ldquo;<strong>Withdraw Consent</strong>&rdquo; in the app / portal or by contacting our
              Grievance Officer. Optional consents (clauses (f), (g) and (h)) can be withdrawn
              separately without affecting your tests or reports. Withdrawal stops future Processing for
              that purpose; it does not affect Processing already done, and some data may be kept where
              the law requires. Withdrawing required consents may mean we cannot provide certain services
              (e.g. generating or delivering a report). De-identified data already used for research
              cannot be linked back to you and may not be removable.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h3 className="text-base sm:text-lg font-bold text-[#0f1b33] mb-2">
              7. Grievances and Contact Information
            </h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <strong>Company:</strong> U4RAD Technologies Pvt Ltd (XRAi Digital)
              </p>
              <p>
                <strong>Grievance Officer &amp; Data Protection Officer:</strong> Vivek Sahi —{' '}
                <a
                  href="mailto:privacy@u4rad.com"
                  className="text-[#1d42c9] font-semibold underline"
                >
                  privacy@u4rad.com
                </a>
              </p>
              <p>
                If you are not satisfied with our response, or we do not respond in time, you may
                complain to the <strong>Data Protection Board of India</strong>.
              </p>
            </div>
          </section>

          {/* Section 8: Form Checkboxes */}
          <section
            id="consent-section"
            className="pt-6 border-t-2 border-[#1e3a6e]/20 bg-slate-50/70 -mx-4 sm:-mx-8 px-4 sm:px-8 pb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#0f1b33]">
                  8. Your Consent
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Please tick the boxes below. By ticking, you confirm that you have read and
                  understood this notice.
                </p>
              </div>

              {/* "I AGREE" AUTO SELECT BUTTON AS REQUESTED BY USER */}
              <button
                type="button"
                onClick={handleAutoAgreeRequired}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>I Agree (Auto-Select Required)</span>
              </button>
            </div>

            {/* Required Group */}
            <div className="bg-white border border-[#1e3a6e]/30 rounded-xl p-4 sm:p-5 mb-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-[#e8f5ee] text-[#0f7a3d] text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  Required
                </span>
                <span className="text-xs font-semibold text-gray-600">
                  Needed to provide your test and report
                </span>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={requiredConsents.a}
                    onChange={() => handleRequiredToggle('a')}
                    className="mt-1 w-5 h-5 text-[#1d42c9] rounded border-gray-300 focus:ring-[#1d42c9] cursor-pointer shrink-0"
                  />
                  <span className="text-sm text-gray-800">
                    <strong>(a)</strong> I have read and understood this Notice and Request for
                    Consent.
                  </span>
                </label>

                <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={requiredConsents.b}
                    onChange={() => handleRequiredToggle('b')}
                    className="mt-1 w-5 h-5 text-[#1d42c9] rounded border-gray-300 focus:ring-[#1d42c9] cursor-pointer shrink-0"
                  />
                  <span className="text-sm text-gray-800">
                    <strong>(b)</strong> I consent to U4RAD Technologies and its brand{' '}
                    <strong>XRAi Digital</strong> collecting and Processing my personal and health
                    data for the purposes in Section 2, <strong>except</strong> research and
                    internal marketing, which need my separate consent below.
                  </span>
                </label>

                <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={requiredConsents.c}
                    onChange={() => handleRequiredToggle('c')}
                    className="mt-1 w-5 h-5 text-[#1d42c9] rounded border-gray-300 focus:ring-[#1d42c9] cursor-pointer shrink-0"
                  />
                  <span className="text-sm text-gray-800">
                    <strong>(c)</strong> I understand that <strong>if my test is sponsored</strong> by
                    an employer or insurer, my result will be shared with that sponsor.
                  </span>
                </label>

                <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={requiredConsents.d}
                    onChange={() => handleRequiredToggle('d')}
                    className="mt-1 w-5 h-5 text-[#1d42c9] rounded border-gray-300 focus:ring-[#1d42c9] cursor-pointer shrink-0"
                  />
                  <span className="text-sm text-gray-800">
                    <strong>(d)</strong> I am <strong>18 or older</strong>, or I am the{' '}
                    <strong>parent / guardian</strong> giving consent on behalf of a minor.
                  </span>
                </label>

                <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={requiredConsents.e}
                    onChange={() => handleRequiredToggle('e')}
                    className="mt-1 w-5 h-5 text-[#1d42c9] rounded border-gray-300 focus:ring-[#1d42c9] cursor-pointer shrink-0"
                  />
                  <span className="text-sm text-gray-800">
                    <strong>(e)</strong> I agree to receive service communications (results,
                    appointment updates) by phone, SMS, email or WhatsApp.
                  </span>
                </label>
              </div>
            </div>

            {/* Optional Group */}
            <div className="bg-white border border-[#1e3a6e]/30 rounded-xl p-4 sm:p-5 mb-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-[#fff6e3] text-[#8a5a00] text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  Optional
                </span>
                <span className="text-xs font-semibold text-gray-600">
                  Your choice; your tests and reports are NOT affected
                </span>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={optionalConsents.f}
                    onChange={() => handleOptionalToggle('f')}
                    className="mt-1 w-5 h-5 text-[#1d42c9] rounded border-gray-300 focus:ring-[#1d42c9] cursor-pointer shrink-0"
                  />
                  <span className="text-sm text-gray-800">
                    <strong>(f) Research:</strong> my de-identified data may be used for research and
                    to improve clinical outcomes and our data models.
                  </span>
                </label>

                <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={optionalConsents.g}
                    onChange={() => handleOptionalToggle('g')}
                    className="mt-1 w-5 h-5 text-[#1d42c9] rounded border-gray-300 focus:ring-[#1d42c9] cursor-pointer shrink-0"
                  />
                  <span className="text-sm text-gray-800">
                    <strong>(g) Offers:</strong> XRAi Digital may use my data{' '}
                    <strong>only for internal marketing</strong> of test discounts and offers.{' '}
                    <strong>My data will NOT be shared with any third party for marketing.</strong>
                  </span>
                </label>

                <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={optionalConsents.h}
                    onChange={() => handleOptionalToggle('h')}
                    className="mt-1 w-5 h-5 text-[#1d42c9] rounded border-gray-300 focus:ring-[#1d42c9] cursor-pointer shrink-0"
                  />
                  <span className="text-sm text-gray-800">
                    <strong>(h) Longer retention:</strong> my reports and images may be kept{' '}
                    <strong>beyond the period required by law</strong>, so doctors can compare my
                    future tests with earlier ones.
                  </span>
                </label>
              </div>
            </div>

            <p className="italic text-xs text-gray-600 mb-2">
              <strong>Note – Children:</strong> For patients under 18, a parent or legal guardian must
              consent, and we may verify their details. Children&apos;s data is used only to provide
              health services — never for marketing, tracking or targeted advertising — and for
              research only with the guardian&apos;s consent.
            </p>

            {/* Bottom Actions Form */}
            <div ref={bottomRef} className="pt-6 text-center space-y-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!allRequiredChecked}
                className={`w-full max-w-md mx-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-lg font-bold text-white transition-all shadow-lg ${allRequiredChecked
                    ? 'bg-[#1d42c9] hover:bg-[#1636a8] hover:shadow-xl cursor-pointer active:scale-[0.99]'
                    : 'bg-gray-400 opacity-50 cursor-not-allowed'
                  }`}
              >
                <span>I Agree and Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {!allRequiredChecked ? (
                <p className="text-xs text-red-600 font-medium">
                  Please tick all required boxes (a) to (e) to continue (or click &ldquo;I Agree
                  (Auto-Select Required)&rdquo; above).
                </p>
              ) : (
                <p className="text-xs text-emerald-600 font-medium flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  All required consent boxes are selected. Click &ldquo;I Agree and Continue&rdquo; to
                  proceed.
                </p>
              )}

              {submitted && (
                <div className="max-w-md mx-auto p-3 rounded-lg bg-[#e8f5ee] text-[#0f7a3d] font-semibold text-sm">
                  Thank you. Your consent choices have been recorded.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Floating "Go to Bottom" pill button */}
        {showToBottom && (
          <button
            type="button"
            onClick={scrollToBottom}
            className="absolute bottom-5 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#1d42c9] font-bold text-sm rounded-full shadow-xl border border-gray-200 hover:shadow-2xl transition-all z-20 cursor-pointer"
          >
            <span>Go to Bottom</span>
            <span className="w-6 h-6 rounded-full bg-[#1d42c9] text-white flex items-center justify-center">
              <ArrowDown className="w-3.5 h-3.5" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ConsentNoticeModal;
