import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EXAM_DATA } from '../../consultant/data/examData';
import { XRAI_LOGO_BASE64 } from './logoAsset';

/**
 * Format a rating value (-2 to +2) into a human readable string.
 */
function formatRatingDescription(val) {
  switch (String(val)) {
    case '2':
      return '+2 (Strongly indicated)';
    case '1':
      return '+1 (Appropriate)';
    case '0':
      return '0 (Acceptable)';
    case '-1':
      return '-1 (Inappropriate)';
    case '-2':
      return '-2 (Strongly inappropriate)';
    default:
      return 'Not rated';
  }
}

/**
 * Export a single consultant evaluation dossier to Excel (.xlsx) with multiple organized tabs.
 */
export function exportDossierToExcel(submission, examCases = EXAM_DATA.cases) {
  const wb = XLSX.utils.book_new();
  const answers = submission.answers || {};
  const stats = submission.progress_stats || {};
  const doctorName = submission.full_name || submission.username || 'Consultant';

  // ----------------------------------------------------
  // Sheet 1: Summary & Audit Metadata
  // ----------------------------------------------------
  const summaryRows = [
    { Property: 'Examination Title', Value: submission.exam_title || 'Clinical Case Examination Packet' },
    { Property: 'Submission ID', Value: `#${submission.id}` },
    { Property: 'Consultant Doctor', Value: `Dr. ${doctorName}` },
    { Property: 'Login Username', Value: `@${submission.username}` },
    { Property: 'Contact Mobile', Value: submission.mobile_number || '—' },
    { Property: 'Email', Value: submission.email || '—' },
    { Property: 'Evaluation Status', Value: submission.status },
    { Property: 'Cases Completed', Value: `${submission.completed_cases || stats.completed_cases || 0} of 13` },
    { Property: 'Completion Coverage', Value: `${submission.percent || stats.percent || 0}%` },
    { Property: 'Started At', Value: submission.started_at ? new Date(submission.started_at).toLocaleString('en-IN') : '—' },
    { Property: 'Last Saved At', Value: submission.last_saved_at ? new Date(submission.last_saved_at).toLocaleString('en-IN') : '—' },
    { Property: 'Submitted At', Value: submission.submitted_at ? new Date(submission.submitted_at).toLocaleString('en-IN') : 'Not yet submitted' },
    { Property: 'Evaluated At', Value: submission.evaluated_at ? new Date(submission.evaluated_at).toLocaleString('en-IN') : 'Pending review' },
    { Property: 'Admin Evaluator', Value: submission.evaluated_by_name || '—' },
    { Property: 'Board Audit Notes', Value: submission.admin_notes || '—' },
  ];
  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
  wsSummary['!cols'] = [{ wch: 24 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Overview');

  // ----------------------------------------------------
  // Sheet 2: Questions, Verdicts & Explanations
  // ----------------------------------------------------
  const qRows = [];

  examCases.forEach((c) => {
    const p = `c${c.n}-`;
    const isSkipped = Boolean(answers[p + 'scope']);

    if (isSkipped) {
      qRows.push({
        Case: `Case ${c.n} (${c.part})`,
        Item: 'Scope',
        Question: 'Clinical Case Evaluation',
        CandidateAnswer: '—',
        Verdict: 'SKIPPED (Outside Scope)',
        DoctorExplanation: 'Doctor flagged this case as outside their clinical scope.',
        ReviewerRuling: '—'
      });
      return;
    }

    // Opening question
    if (c.opening) {
      qRows.push({
        Case: `Case ${c.n} (${c.part})`,
        Item: c.opening.id,
        Question: c.opening.q,
        CandidateAnswer: '—',
        Verdict: answers[p + 'open'] ? 'ANSWERED' : 'UNANSWERED',
        DoctorExplanation: answers[p + 'open'] || '(No answer provided)',
        ReviewerRuling: '—'
      });
    }

    // Examination questions
    c.qs.forEach((q, i) => {
      const qId = `${p}q${i + 1}`;
      const verdictVal = answers[qId];
      let verdictText = 'NOT MARKED';
      let explanation = '';

      if (verdictVal === 'yes') {
        verdictText = 'AGREE';
        explanation = answers[`${qId}-agree-why`] || answers[`${qId}-why`] || '';
      } else if (verdictVal === 'no') {
        verdictText = 'DOES NOT AGREE';
        explanation = answers[`${qId}-why`] || '';
      }

      qRows.push({
        Case: `Case ${c.n} (${c.part})`,
        Item: `Q${i + 1}`,
        Question: q.q,
        CandidateAnswer: q.a,
        Verdict: verdictText,
        DoctorExplanation: explanation || '(No explanation provided)',
        ReviewerRuling: answers[`${qId}-rule`] || '—'
      });
    });

    // Follow-up question
    if (c.follow) {
      const followId = `${p}follow`;
      const verdictVal = answers[followId];
      let verdictText = 'NOT MARKED';
      let explanation = '';

      if (verdictVal === 'yes') {
        verdictText = 'AGREE';
        explanation = answers[`${followId}-agree-why`] || answers[`${followId}-why`] || '';
      } else if (verdictVal === 'no') {
        verdictText = 'DOES NOT AGREE';
        explanation = answers[`${followId}-why`] || '';
      }

      qRows.push({
        Case: `Case ${c.n} (${c.part})`,
        Item: 'Follow-up',
        Question: c.follow.q,
        CandidateAnswer: c.follow.a,
        Verdict: verdictText,
        DoctorExplanation: explanation || '(No explanation provided)',
        ReviewerRuling: answers[`${followId}-rule`] || '—'
      });
    }

    // Outright fail items
    c.fails.forEach((f, fIdx) => {
      const failId = `${p}f${fIdx}`;
      const verdictVal = answers[failId];
      let verdictText = 'NOT MARKED';
      let explanation = '';

      if (verdictVal === 'yes') {
        verdictText = 'AGREE';
        explanation = answers[`${failId}-agree-why`] || answers[`${failId}-why`] || '';
      } else if (verdictVal === 'no') {
        verdictText = 'DOES NOT AGREE';
        explanation = answers[`${failId}-why`] || '';
      }

      qRows.push({
        Case: `Case ${c.n} (${c.part})`,
        Item: `Outright Fail #${fIdx + 1}`,
        Question: 'Board Proposed Outright Fail Answer',
        CandidateAnswer: f,
        Verdict: verdictText,
        DoctorExplanation: explanation || '(No explanation provided)',
        ReviewerRuling: answers[`${failId}-rule`] || '—'
      });
    });

    // Added outright fails
    if (answers[p + 'fails-add']) {
      qRows.push({
        Case: `Case ${c.n} (${c.part})`,
        Item: 'Additional Fail Item',
        Question: 'Any answer consultant would also fail outright',
        CandidateAnswer: '—',
        Verdict: 'PROPOSED',
        DoctorExplanation: answers[p + 'fails-add'],
        ReviewerRuling: '—'
      });
    }
  });

  const wsQuestions = XLSX.utils.json_to_sheet(qRows);
  wsQuestions['!cols'] = [
    { wch: 18 },
    { wch: 16 },
    { wch: 38 },
    { wch: 45 },
    { wch: 18 },
    { wch: 50 },
    { wch: 30 }
  ];
  XLSX.utils.book_append_sheet(wb, wsQuestions, 'Questions & Answers');

  // ----------------------------------------------------
  // Sheet 3: Management Option Ratings
  // ----------------------------------------------------
  const ratingRows = [];
  examCases.forEach((c) => {
    const p = `c${c.n}-`;
    if (answers[p + 'scope']) return;

    c.ratings.forEach((g, gi) => {
      g.opts.forEach((optText, oi) => {
        const ratingKey = `${p}r${gi}-${oi}`;
        const score = answers[ratingKey];
        ratingRows.push({
          Case: `Case ${c.n} (${c.part})`,
          RatingGroup: g.title,
          ManagementOption: optText,
          Score: score !== undefined && score !== null ? score : 'Not rated',
          RatingDescription: formatRatingDescription(score)
        });
      });
    });
  });

  const wsRatings = XLSX.utils.json_to_sheet(ratingRows);
  wsRatings['!cols'] = [{ wch: 18 }, { wch: 32 }, { wch: 48 }, { wch: 10 }, { wch: 28 }];
  XLSX.utils.book_append_sheet(wb, wsRatings, 'Option Ratings');

  // ----------------------------------------------------
  // Sheet 4: Second Candidate & Clinical Realism
  // ----------------------------------------------------
  const feedbackRows = [];
  examCases.forEach((c) => {
    const p = `c${c.n}-`;
    if (answers[p + 'scope']) return;

    feedbackRows.push({
      Case: `Case ${c.n} (${c.part})`,
      Candidate2Verdict: ({ pass: 'PASS', fail: 'FAIL' }[answers[p + 'second-v']] || 'NOT MARKED'),
      Candidate2Reasoning: answers[p + 'second'] || '—',
      MissedDecisionFeedback: answers[p + 'missed'] || '—',
      RealisticTaskVerdict: answers[p + 'real'] || '—',
      RealisticTaskRationale: answers[p + 'real-why'] || '—'
    });
  });

  const wsFeedback = XLSX.utils.json_to_sheet(feedbackRows);
  wsFeedback['!cols'] = [{ wch: 18 }, { wch: 20 }, { wch: 45 }, { wch: 40 }, { wch: 18 }, { wch: 35 }];
  XLSX.utils.book_append_sheet(wb, wsFeedback, 'Second Candidate & Feedback');

  // ----------------------------------------------------
  // Sheet 5: Closing Remarks
  // ----------------------------------------------------
  const closingRows = [
    {
      Prompt: EXAM_DATA.closing,
      ConsultantAnswer: answers['closing'] || '(No closing remarks provided)'
    }
  ];
  const wsClosing = XLSX.utils.json_to_sheet(closingRows);
  wsClosing['!cols'] = [{ wch: 50 }, { wch: 70 }];
  XLSX.utils.book_append_sheet(wb, wsClosing, 'Closing Question');

  // Generate and download file
  const safeDocName = doctorName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `Consultant_Evaluation_${safeDocName}_Packet${submission.id}.xlsx`;
  XLSX.writeFile(wb, filename);
}

/**
 * Export a single consultant evaluation dossier to a professional, formatted PDF document.
 */
export function exportDossierToPDF(submission, examCases = EXAM_DATA.cases) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const answers = submission.answers || {};
  const stats = submission.progress_stats || {};
  
  // Format clean doctor name (do not show username along with name)
  const rawName = submission.full_name || submission.username || 'Consultant';
  const cleanName = rawName.replace(/^dr\.?\s*/i, '').trim();
  const doctorName = cleanName || 'Consultant';

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // ----------------------------------------------------
  // Page 1 Header: Official Company Logo & Dossier Title
  // ----------------------------------------------------
  try {
    if (XRAI_LOGO_BASE64) {
      // 358 x 92 original ratio (3.89:1) -> 42mm x 10.8mm
      doc.addImage(XRAI_LOGO_BASE64, 'PNG', margin, 7.5, 42, 10.8);
    }
  } catch (err) {
    console.error('Failed to embed logo in PDF:', err);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(35, 53, 96);
    doc.text('XRAi Digital', margin, 15);
  }

  // Header Right: Document Title & Audit Metadata
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(35, 53, 96); // #233560 Corporate Navy
  doc.text('CLINICAL EVALUATION DOSSIER', pageWidth - margin, 11, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text('Diagnostic Case Markings & Consensus Report', pageWidth - margin, 15.5, { align: 'right' });

  doc.setFontSize(7.5);
  doc.setTextColor(0, 172, 193); // #00acc1 Medical Cyan
  const reportDateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  doc.text(`Audit Ref: EVAL-${submission.id} • ${reportDateStr}`, pageWidth - margin, 19.5, { align: 'right' });

  // Decorative Brand Accent Line (Corporate Navy with Cyan Tip)
  doc.setFillColor(35, 53, 96); // #233560
  doc.rect(margin, 22.5, pageWidth - (margin * 2) - 30, 0.8, 'F');
  doc.setFillColor(0, 172, 193); // #00acc1
  doc.rect(pageWidth - margin - 30, 22.5, 30, 0.8, 'F');

  // ----------------------------------------------------
  // Metadata Card Table (No username attached to name)
  // ----------------------------------------------------
  const metadataRows = [
    [
      { content: 'Consultant Doctor:', styles: { fontStyle: 'bold', textColor: [35, 53, 96], fillColor: [248, 250, 252] } },
      { content: `Dr. ${doctorName}`, styles: { fontStyle: 'bold', textColor: [15, 23, 42] } },
      { content: 'Contact Mobile:', styles: { fontStyle: 'bold', textColor: [35, 53, 96], fillColor: [248, 250, 252] } },
      { content: submission.mobile_number || '—', styles: { textColor: [30, 41, 59] } }
    ],
    [
      { content: 'Evaluation Status:', styles: { fontStyle: 'bold', textColor: [35, 53, 96], fillColor: [248, 250, 252] } },
      { 
        content: submission.status || 'DRAFT', 
        styles: { 
          fontStyle: 'bold', 
          textColor: submission.status === 'EVALUATED' ? [16, 149, 106] : (submission.status === 'SUBMITTED' ? [0, 172, 193] : [35, 53, 96]) 
        } 
      },
      { content: 'Case Coverage:', styles: { fontStyle: 'bold', textColor: [35, 53, 96], fillColor: [248, 250, 252] } },
      { content: `${submission.completed_cases || stats.completed_cases || 0} / 13 Cases (${submission.percent || stats.percent || 0}%)`, styles: { textColor: [30, 41, 59] } }
    ],
    [
      { content: 'Submitted At:', styles: { fontStyle: 'bold', textColor: [35, 53, 96], fillColor: [248, 250, 252] } },
      { content: submission.submitted_at ? new Date(submission.submitted_at).toLocaleString('en-IN') : 'Not submitted', styles: { textColor: [30, 41, 59] } },
      { content: 'Evaluated By:', styles: { fontStyle: 'bold', textColor: [35, 53, 96], fillColor: [248, 250, 252] } },
      { content: submission.evaluated_by_name || 'Pending Review', styles: { textColor: [30, 41, 59] } }
    ],
  ];

  if (submission.admin_notes) {
    metadataRows.push([
      { content: 'Board Audit Notes:', styles: { fontStyle: 'bold', textColor: [35, 53, 96], fillColor: [248, 250, 252] } },
      { content: submission.admin_notes, colSpan: 3, styles: { fontStyle: 'italic', textColor: [51, 65, 85] } }
    ]);
  }

  autoTable(doc, {
    startY: 25.5,
    margin: { left: margin, right: margin },
    body: metadataRows,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2.2,
      textColor: [31, 41, 55],
      lineColor: [226, 232, 240],
      lineWidth: 0.15,
    },
    columnStyles: {
      0: { cellWidth: 32 },
      1: { cellWidth: 58 },
      2: { cellWidth: 30 },
      3: { cellWidth: 62 },
    },
  });

  let currentY = doc.lastAutoTable.finalY + 7;

  // ----------------------------------------------------
  // Section 1: Examination Questions & Consultant Markings
  // ----------------------------------------------------
  const tableData = [];

  examCases.forEach((c) => {
    const p = `c${c.n}-`;
    const isSkipped = Boolean(answers[p + 'scope']);

    if (isSkipped) {
      tableData.push([
        `Case ${c.n}`,
        'All Questions & Evaluation',
        'SKIPPED (Outside Scope)',
        'Consultant flagged case as outside clinical scope.'
      ]);
      return;
    }

    if (c.opening) {
      tableData.push([
        `Case ${c.n}`,
        c.opening.q,
        answers[p + 'open'] ? 'COMPLETED' : 'BLANK',
        answers[p + 'open'] || '(No opening answer provided)'
      ]);
    }

    c.qs.forEach((q, i) => {
      const qId = `${p}q${i + 1}`;
      const verdictVal = answers[qId];
      let verdict = 'NOT MARKED';
      let exp = '';

      if (verdictVal === 'yes') {
        verdict = 'AGREE';
        exp = answers[`${qId}-agree-why`] || answers[`${qId}-why`] || '(Agreed without additional notes)';
      } else if (verdictVal === 'no') {
        verdict = 'DISAGREE';
        exp = answers[`${qId}-why`] || '(Disagreed without additional notes)';
      }

      if (answers[`${qId}-rule`]) {
        exp += `\n[Ruling: ${answers[`${qId}-rule`]}]`;
      }

      tableData.push([
        `Case ${c.n} Q${i + 1}`,
        q.q,
        verdict,
        exp || '—'
      ]);
    });

    if (c.follow) {
      const followId = `${p}follow`;
      const verdictVal = answers[followId];
      let verdict = 'NOT MARKED';
      let exp = '';

      if (verdictVal === 'yes') {
        verdict = 'AGREE';
        exp = answers[`${followId}-agree-why`] || answers[`${followId}-why`] || '';
      } else if (verdictVal === 'no') {
        verdict = 'DISAGREE';
        exp = answers[`${followId}-why`] || '';
      }

      tableData.push([
        `Case ${c.n} Follow-up`,
        c.follow.q,
        verdict,
        exp || '—'
      ]);
    }

    c.fails.forEach((f, fIdx) => {
      const failId = `${p}f${fIdx}`;
      const verdictVal = answers[failId];
      let verdict = 'NOT MARKED';
      let exp = '';

      if (verdictVal === 'yes') {
        verdict = 'AGREE';
        exp = answers[`${failId}-agree-why`] || answers[`${failId}-why`] || '';
      } else if (verdictVal === 'no') {
        verdict = 'DISAGREE';
        exp = answers[`${failId}-why`] || '';
      }

      tableData.push([
        `Case ${c.n} Fail #${fIdx + 1}`,
        f,
        verdict,
        exp || '—'
      ]);
    });

    if (answers[p + 'fails-add']) {
      tableData.push([
        `Case ${c.n} Additional Fail`,
        'Additional Answer Consultant Would Fail Outright',
        'PROPOSED',
        answers[p + 'fails-add']
      ]);
    }
  });

  // Section Heading with Cyan Indicator Accent
  doc.setFillColor(0, 172, 193); // #00acc1
  doc.rect(margin, currentY - 3.4, 2, 4.4, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(35, 53, 96); // #233560 Corporate Navy
  doc.text('Examination Questions, Candidate Answers & Consultant Verdicts', margin + 4.5, currentY);

  autoTable(doc, {
    startY: currentY + 3,
    margin: { left: margin, right: margin, top: 16, bottom: 15 },
    head: [['Item', 'Examination Question / Prompt', 'Verdict', 'Doctor Explanation / Rationale']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [35, 53, 96], // #233560 Corporate Navy
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 2.5,
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2.3,
      overflow: 'linebreak',
      lineColor: [226, 232, 240],
      lineWidth: 0.15,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 26, fontStyle: 'bold', textColor: [35, 53, 96] },
      1: { cellWidth: 62 },
      2: { cellWidth: 24, fontStyle: 'bold' },
      3: { cellWidth: 70 },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 2) {
        const text = String(data.cell.raw);
        if (text === 'AGREE') {
          data.cell.styles.textColor = [16, 149, 106]; // Medical Emerald
        } else if (text === 'DISAGREE') {
          data.cell.styles.textColor = [220, 38, 38]; // Red
        } else if (text.startsWith('SKIPPED')) {
          data.cell.styles.textColor = [100, 116, 139]; // Slate 500
        } else if (text === 'COMPLETED' || text === 'PROPOSED') {
          data.cell.styles.textColor = [0, 172, 193]; // Cyan
        }
      }
    },
  });

  // ----------------------------------------------------
  // Section 2: Closing Reflections (if present)
  // ----------------------------------------------------
  if (answers['closing']) {
    const afterQuestionsY = doc.lastAutoTable.finalY + 8;
    if (afterQuestionsY > pageHeight - 35) {
      doc.addPage();
      currentY = 18;
    } else {
      currentY = afterQuestionsY;
    }

    doc.setFillColor(0, 172, 193); // #00acc1
    doc.rect(margin, currentY - 3.4, 2, 4.4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(35, 53, 96);
    doc.text('Closing Reflections', margin + 4.5, currentY);

    autoTable(doc, {
      startY: currentY + 3,
      margin: { left: margin, right: margin, top: 16, bottom: 15 },
      head: [['Closing Question Prompt', 'Consultant Doctor Response']],
      body: [[EXAM_DATA.closing, answers['closing']]],
      theme: 'grid',
      headStyles: {
        fillColor: [35, 53, 96],
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 8,
        cellPadding: 3,
        lineColor: [226, 232, 240],
        lineWidth: 0.15,
        textColor: [30, 41, 59],
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: 'bold', textColor: [35, 53, 96] },
        1: { cellWidth: 112 },
      },
    });
  }

  // ----------------------------------------------------
  // Running Header (pages > 1) & Bottom Footer (all pages)
  // Strictly: 'XRAi Digital • Confidential Medical Document'
  // (Removed 'Consultant Admin Portal' and 'Packet #2')
  // ----------------------------------------------------
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Running top header on pages 2 and onwards
    if (i > 1) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('XRAi Digital • Clinical Evaluation Dossier', margin, 10);
      doc.text(`Dr. ${doctorName}`, pageWidth - margin, 10, { align: 'right' });
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.25);
      doc.line(margin, 12, pageWidth - margin, 12);
    }

    // Running bottom divider line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.25);
    doc.line(margin, pageHeight - 9, pageWidth - margin, pageHeight - 9);

    // Bottom Footer Line
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(
      'XRAi Digital • Confidential Medical Document',
      margin,
      pageHeight - 5
    );
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 5,
      { align: 'right' }
    );
  }

  // Save PDF
  const safeDocName = doctorName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `Consultant_Evaluation_${safeDocName}_Packet${submission.id}.pdf`;
  doc.save(filename);
}

/**
 * Export summary of all consultant submissions to Excel (.xlsx).
 */
export function exportAllSubmissionsToExcel(submissionsList) {
  const wb = XLSX.utils.book_new();

  const rows = (submissionsList || []).map((s) => {
    const stats = s.progress_stats || {};
    return {
      'Submission ID': `#${s.id}`,
      'Consultant Doctor': s.full_name || s.username || 'Dr. Consultant',
      'Username': `@${s.username}`,
      'Mobile Number': s.mobile_number || '—',
      'Status': s.status,
      'Completed Cases': `${s.completed_cases || stats.completed_cases || 0} / ${s.total_cases || 13}`,
      'Coverage (%)': `${s.percent || stats.percent || 0}%`,
      'Answered Units': s.answered_count || 0,
      'Started At': s.started_at ? new Date(s.started_at).toLocaleString('en-IN') : '—',
      'Last Saved At': s.last_saved_at ? new Date(s.last_saved_at).toLocaleString('en-IN') : '—',
      'Submitted At': s.submitted_at ? new Date(s.submitted_at).toLocaleString('en-IN') : '—',
      'Evaluated At': s.evaluated_at ? new Date(s.evaluated_at).toLocaleString('en-IN') : '—',
      'Evaluated By': s.evaluated_by_name || '—',
      'Admin Board Notes': s.admin_notes || '—',
    };
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [
    { wch: 14 },
    { wch: 26 },
    { wch: 18 },
    { wch: 16 },
    { wch: 14 },
    { wch: 16 },
    { wch: 14 },
    { wch: 14 },
    { wch: 22 },
    { wch: 22 },
    { wch: 22 },
    { wch: 22 },
    { wch: 20 },
    { wch: 35 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Consultant Submissions');
  const filename = `Consultant_Evaluations_Summary_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, filename);
}
