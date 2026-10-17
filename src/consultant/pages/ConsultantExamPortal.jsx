import React, { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';
import { EXAM_DATA } from '../data/examData';
import '../styles/consultantExam.css';

const CASES = EXAM_DATA.cases;
const LOCAL_STORAGE_KEY = 'pcexam-consultant-answers-v1';

function ConsultantExamPortal() {
  const [answers, setAnswers] = useState({});
  const [currentView, setCurrentView] = useState('intro');
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examStatus, setExamStatus] = useState('DRAFT');
  const [loading, setLoading] = useState(true);

  const answersRef = useRef({});
  answersRef.current = answers;

  const currentViewRef = useRef('intro');
  currentViewRef.current = currentView;

  const saveTimerRef = useRef(null);

  // Helper: compute units that count toward progress per case
  const getCaseUnits = useCallback((c) => {
    const p = 'c' + c.n + '-';
    const u = [];
    if (c.opening) u.push(p + 'open');
    c.qs.forEach((q, i) => u.push(p + 'q' + (i + 1)));
    if (c.follow) u.push(p + 'follow');
    c.fails.forEach((f, i) => u.push(p + 'f' + i));
    u.push(p + 'second-v');
    c.ratings.forEach((g, gi) => g.opts.forEach((o, oi) => u.push(p + 'r' + gi + '-' + oi)));
    u.push(p + 'missed', p + 'real');
    return u;
  }, []);

  const isUnitDone = useCallback((k, ansMap) => {
    const v = ansMap[k];
    if (v === undefined || String(v).trim() === '') return false;
    // Selecting yes/no or providing any input counts as progress. Additional reasoning is completely optional.
    return true;
  }, []);

  const getCaseProgress = useCallback((c, ansMap) => {
    const u = getCaseUnits(c);
    const done = u.filter((k) => isUnitDone(k, ansMap)).length;
    return [done, u.length];
  }, [getCaseUnits, isUnitDone]);

  // Compile readable text format for download/copy
  const compileAnswers = useCallback((ansMap) => {
    const consultantName = sessionStorage.getItem('FullName') || sessionStorage.getItem('UserName') || 'Consultant';
    const o = [
      'CLINICAL CASE EXAMINATION PACKET — CONSULTANT EVALUATION',
      `Consultant: Dr. ${consultantName}`,
      `Recorded on: ${new Date().toLocaleString('en-IN')}`,
      ''
    ];

    const getVerdict = (id) => {
      const v = ansMap[id];
      if (v === 'yes') {
        const exp = ansMap[id + '-agree-why'] || ansMap[id + '-why'];
        return 'AGREE' + (exp ? '\n  Why / explanation: ' + exp : '');
      }
      if (v === 'no') return 'DOES NOT AGREE\n  Why / my answer: ' + (ansMap[id + '-why'] || '');
      return '(not marked)';
    };

    CASES.forEach((c) => {
      const p = 'c' + c.n + '-';
      o.push('='.repeat(64), `CASE ${c.n} (${c.part})`);
      if (ansMap[p + 'scope']) {
        o.push('Outside my scope (Skipped)', '');
        return;
      }
      if (c.opening) {
        o.push('', `${c.opening.id}: ${c.opening.q}`, 'Answer: ' + (ansMap[p + 'open'] || ''));
      }
      c.qs.forEach((q, i) => {
        const qId = p + 'q' + (i + 1);
        o.push('', q.q, "Candidate's answer: " + q.a, 'Verdict: ' + getVerdict(qId));
        if (ansMap[qId + '-rule']) o.push('Ruling on reviewer note: ' + ansMap[qId + '-rule']);
      });
      if (c.follow) {
        o.push('', c.follow.q, "Candidate's answer: " + c.follow.a, 'Verdict: ' + getVerdict(p + 'follow'));
      }
      c.fails.forEach((f, i) => {
        o.push('', 'Board outright-fail answer ' + (i + 1) + ': ' + f, 'Verdict: ' + getVerdict(p + 'f' + i));
        if (ansMap[p + 'f' + i + '-rule']) o.push('Ruling on reviewer note: ' + ansMap[p + 'f' + i + '-rule']);
      });
      if (ansMap[p + 'fails-add']) {
        o.push('Also fail outright: ' + ansMap[p + 'fails-add']);
      }
      o.push(
        '',
        'Second candidate: ' + ({ pass: 'PASS', fail: 'FAIL' }[ansMap[p + 'second-v']] || '(not marked)'),
        'Reason: ' + (ansMap[p + 'second'] || '')
      );
      c.ratings.forEach((g, gi) => {
        o.push('', 'RATINGS — ' + g.title);
        g.opts.forEach((x, oi) => {
          const r = ansMap[p + 'r' + gi + '-' + oi];
          o.push(`  [${r === undefined ? ' ' : r > 0 ? '+' + r : r}] ${x}`);
        });
      });
      o.push(
        '',
        'Missed or unnecessary: ' + (ansMap[p + 'missed'] || ''),
        'Realistic task: ' + (ansMap[p + 'real'] || '') + (ansMap[p + 'real-why'] ? ' — ' + ansMap[p + 'real-why'] : ''),
        ''
      );
    });

    o.push('='.repeat(64), 'CLOSING QUESTION', EXAM_DATA.closing, 'Answer: ' + (ansMap['closing'] || ''));
    return o.join('\n');
  }, []);

  // Compute overall stats
  const computeStats = useCallback((ansMap) => {
    let totalCompleted = 0;
    let totalCases = CASES.length;
    let answeredUnits = 0;
    let totalUnits = 0;

    CASES.forEach((c) => {
      const [done, total] = getCaseProgress(c, ansMap);
      answeredUnits += done;
      totalUnits += total;
      if (ansMap['c' + c.n + '-scope'] || done === total) {
        totalCompleted += 1;
      }
    });

    return {
      completed_cases: totalCompleted,
      total_cases: totalCases,
      answered_units: answeredUnits,
      total_units: totalUnits,
      percent: Math.round((answeredUnits / (totalUnits || 1)) * 100)
    };
  }, [getCaseProgress]);

  // Broadcast save event to layout header
  const notifySaveStatus = (status, time) => {
    window.dispatchEvent(new CustomEvent('consultant-save-status', {
      detail: { status, time }
    }));
  };

  // Debounced backend save
  const triggerDebouncedSave = useCallback((newAnswers, view) => {
    notifySaveStatus('saving');
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(async () => {
      try {
        const stats = computeStats(newAnswers);
        const compiled = compileAnswers(newAnswers);
        const userId = sessionStorage.getItem('UserID');
        const userName = sessionStorage.getItem('UserName');
        const res = await axiosInstance.post(ENDPOINTS.CONSULTANT_EXAM, {
          user_id: userId,
          username: userName,
          answers: newAnswers,
          current_view: view,
          progress_stats: stats,
          compiled_summary: compiled,
          action: 'save'
        });

        if (res.data?.Success) {
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          notifySaveStatus('saved', timeStr);
        } else {
          notifySaveStatus('error');
        }
      } catch (err) {
        console.error('Error auto-saving to backend:', err);
        notifySaveStatus('error');
      }
    }, 750);
  }, [computeStats, compileAnswers]);

  // Initial load: Fetch from backend and hydrate state
  useEffect(() => {
    const fetchExamData = async () => {
      setLoading(true);
      let localCached = {};
      try {
        const local = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (local) localCached = JSON.parse(local) || {};
      } catch (e) {
        localCached = {};
      }

      try {
        const userId = sessionStorage.getItem('UserID');
        const userName = sessionStorage.getItem('UserName');
        const qParams = userId ? `?user_id=${userId}` : userName ? `?username=${userName}` : '';
        const res = await axiosInstance.get(`${ENDPOINTS.CONSULTANT_EXAM}${qParams}`);
        if (res.data?.Success) {
          const serverAnswers = res.data.answers || {};
          const merged = { ...localCached, ...serverAnswers };
          setAnswers(merged);
          setExamStatus(res.data.status || 'DRAFT');
          if (res.data.current_view) {
            setCurrentView(String(res.data.current_view));
          }
          notifySaveStatus('saved', res.data.last_saved_at ? new Date(res.data.last_saved_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');
        } else {
          setAnswers(localCached);
        }
      } catch (err) {
        console.warn('Backend fetch failed, falling back to local storage cache:', err);
        setAnswers(localCached);
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleValueChange = (key, value) => {
    const updated = { ...answersRef.current, [key]: value };
    setAnswers(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
    triggerDebouncedSave(updated, currentViewRef.current);
  };

  const handleViewChange = (v) => {
    const strV = String(v);
    setCurrentView(strV);
    triggerDebouncedSave(answersRef.current, strV);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownload = () => {
    try {
      const text = compileAnswers(answersRef.current);
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Consultant_Exam_Evaluation_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast('Answers downloaded successfully as .txt');
    } catch (err) {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    const text = compileAnswers(answersRef.current);
    try {
      await navigator.clipboard.writeText(text);
      showToast('All answers copied to clipboard');
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        showToast('All answers copied to clipboard');
      } catch (_) {
        alert('Could not auto-copy. Please use download button.');
      }
      document.body.removeChild(ta);
    }
  };

  const handleSubmitFinal = async () => {
    const stats = computeStats(answersRef.current);
    const confirmMsg =
      `Submit your examination evaluation packet?\n\n` +
      `Current progress: ${stats.completed_cases} of ${stats.total_cases} clinical cases touched (${stats.percent}% coverage).\n\n` +
      `Note: None of the questions are compulsory. You may submit with whatever answers you have completed. All responses are saved securely to your consultant account.`;
    if (!window.confirm(confirmMsg)) return;

    setIsSubmitting(true);
    try {
      const compiled = compileAnswers(answersRef.current);
      const userId = sessionStorage.getItem('UserID');
      const userName = sessionStorage.getItem('UserName');
      const res = await axiosInstance.post(ENDPOINTS.CONSULTANT_EXAM_SUBMIT, {
        user_id: userId,
        username: userName,
        answers: answersRef.current,
        compiled_summary: compiled,
        progress_stats: stats,
      });

      if (res.data?.Success) {
        setExamStatus('SUBMITTED');
        showToast('Exam packet officially submitted!');
        alert('Your examination evaluation packet has been successfully submitted to the regulatory board.');
      } else {
        alert(res.data?.Message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('Error submitting exam packet to backend. Please check network and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper text with [Reviewer: ...] flagged
  const renderRichText = (t) => {
    if (!t) return null;
    const parts = String(t).split(/(\[Reviewer:[^\]]*\])/);
    return parts.map((part, idx) => {
      if (part.startsWith('[Reviewer:')) {
        return (
          <mark key={idx} className="flag">
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  const hasFlag = (t) => /\[Reviewer:/.test(t);

  // Agree / Disagree Component Block
  const AgreeBlock = ({ id, flagged }) => {
    const val = answers[id];
    return (
      <div className="mt-3">
        <p className="agree">Do you agree with this answer?</p>
        <div className="seg yn" role="radiogroup">
          <label>
            <input
              type="radio"
              name={id}
              value="yes"
              checked={val === 'yes'}
              onChange={() => handleValueChange(id, 'yes')}
            />
            <span>Yes, I agree</span>
          </label>
          <label>
            <input
              type="radio"
              name={id}
              value="no"
              checked={val === 'no'}
              onChange={() => handleValueChange(id, 'no')}
            />
            <span>No, I don’t agree</span>
          </label>
        </div>

        {val === 'yes' && (
          <div className="why agree-why">
            <p className="label">Why do you agree? Write your explanation (Optional)</p>
            <textarea
              rows={4}
              value={answers[id + '-agree-why'] || ''}
              placeholder="(Optional) Explain why you agree, clinical rationale, or supporting notes..."
              onChange={(e) => handleValueChange(id + '-agree-why', e.target.value)}
            />
          </div>
        )}

        {val === 'no' && (
          <div className="why">
            <p className="label">Why don’t you agree? Write your answer (Optional)</p>
            <textarea
              rows={4}
              value={answers[id + '-why'] || ''}
              placeholder="(Optional) What is wrong, missing or unsafe, and what would you answer instead?"
              onChange={(e) => handleValueChange(id + '-why', e.target.value)}
            />
          </div>
        )}

        {flagged && (
          <div className="why ruling" style={{ marginTop: '10px' }}>
            <p className="label" style={{ color: 'var(--warn)' }}>
              Your ruling on the reviewer note (Optional)
            </p>
            <textarea
              rows={3}
              value={answers[id + '-rule'] || ''}
              placeholder="(Optional) Rule on the point the candidate flagged"
              onChange={(e) => handleValueChange(id + '-rule', e.target.value)}
            />
          </div>
        )}
      </div>
    );
  };

  // Render Instructions Section
  const renderIntro = () => {
    const heads = { 'For each case you will see': 1, 'How to answer': 1 };
    let listOpen = false;

    return (
      <div>
        <div className="casehead">
          <h2>Instructions</h2>
        </div>
        <section className="card instr">
          {EXAM_DATA.instr.map(([k, t], idx) => {
            if (k === 'p') {
              if (heads[t]) {
                return <h3 key={idx}>{t}</h3>;
              }
              return <p key={idx}>{renderRichText(t)}</p>;
            }
            return (
              <ul key={idx} style={{ margin: '0 0 6px', paddingLeft: '20px' }}>
                <li>{renderRichText(t)}</li>
              </ul>
            );
          })}
        </section>

        <section className="card">
          <p className="label">How this form works</p>
          <p style={{ margin: 0 }}>
            Under every candidate answer, choose <b>Yes, I agree</b> or <b>No, I don’t agree</b>. An explanation box opens for both Agree and Disagree where you can write your rationale, clinical feedback, or what you would answer instead. All explanations are optional.
          </p>
        </section>

        <div className="nav">
          <span />
          <button className="btn" type="button" onClick={() => handleViewChange('1')}>
            Start Case 1
          </button>
        </div>
      </div>
    );
  };

  // Render a Single Clinical Case
  const renderCase = (c) => {
    const p = 'c' + c.n + '-';
    const isSkipped = Boolean(answers[p + 'scope']);

    return (
      <div>
        <div className="casehead">
          <h2>Case {c.n}</h2>
          <span className="chip">
            {c.part} cases · case {c.n} of {CASES.length}
          </span>
        </div>

        <label className="scope">
          <input
            type="checkbox"
            checked={isSkipped}
            onChange={(e) => handleValueChange(p + 'scope', e.target.checked)}
          />
          <span>Outside my scope (skip this case)</span>
        </label>

        {/* Optional Opening Question */}
        {c.opening && (
          <section className="card open">
            <p className="label">{c.opening.id} · answer before marking this case</p>
            <p className="q">{c.opening.q}</p>
            <textarea
              rows={3}
              value={answers[p + 'open'] || ''}
              placeholder="Your answer:"
              onChange={(e) => handleValueChange(p + 'open', e.target.value)}
            />
          </section>
        )}

        {/* Clinical Scenario */}
        <section className="card scen">
          <p className="label">Clinical scenario</p>
          {c.scenario.map(([k, t], sIdx) => {
            if (k === 'li') {
              return (
                <ul key={sIdx} style={{ margin: '0 0 6px', paddingLeft: '20px' }}>
                  <li>{t}</li>
                </ul>
              );
            }
            return <p key={sIdx}>{t}</p>;
          })}

          {c.notes && (
            <details open>
              <summary>Clinical notes</summary>
              <pre>{c.notes}</pre>
            </details>
          )}
        </section>

        {/* The Examination Questions & Candidate Answers */}
        <section className="card">
          <p className="label">The examination · mark each candidate answer</p>
          <p className="scale" style={{ margin: '0 0 10px' }}>
            A senior physician sat this case as an oral exam. You are the examiner: agree if you would accept the answer, or say what is wrong or missing.
          </p>

          {c.qs.map((q, qIdx) => {
            const m = q.q.match(/^(Q\d+)\.\s*(.*)$/s);
            const qNum = m ? m[1] : `Q${qIdx + 1}`;
            const qText = m ? m[2] : q.q;
            const qId = p + 'q' + (qIdx + 1);

            return (
              <div key={qIdx} className="item">
                <p className="q">
                  <span className="qn">{qNum}.</span>
                  {qText}
                </p>
                <div className="cand">
                  <b className="t">Candidate’s answer</b>
                  <div>{renderRichText(q.a)}</div>
                </div>
                <AgreeBlock id={qId} flagged={hasFlag(q.a)} />
              </div>
            );
          })}
        </section>

        {/* Follow-up question */}
        {c.follow && (
          <section className="card">
            <p className="label">Follow-up</p>
            <p className="q">
              {c.follow.q.replace(/^Follow-up\.\s*/, '')}
            </p>
            <div className="cand">
              <b className="t">Candidate’s answer</b>
              <div>{renderRichText(c.follow.a)}</div>
            </div>
            <AgreeBlock id={p + 'follow'} flagged={hasFlag(c.follow.a)} />
          </section>
        )}

        {/* Outright Fail Proposed Answers */}
        {c.fails && c.fails.length > 0 && (
          <section className="card fails">
            <p className="label">Answers the examining board proposes should fail a candidate outright</p>
            {c.fails.map((f, fIdx) => (
              <div key={fIdx} className="item">
                <div className="cand">
                  <b className="t">
                    Board’s proposed outright fail {c.fails.length > 1 ? fIdx + 1 : ''}
                  </b>
                  <div>{renderRichText(f)}</div>
                </div>
                <AgreeBlock id={p + 'f' + fIdx} flagged={hasFlag(f)} />
              </div>
            ))}

            <div className="item">
              <p className="q">Add any answer you would also fail outright.</p>
              <textarea
                rows={3}
                value={answers[p + 'fails-add'] || ''}
                placeholder="Optional: any other answer you would fail outright"
                onChange={(e) => handleValueChange(p + 'fails-add', e.target.value)}
              />
            </div>
          </section>
        )}

        {/* A Second Candidate's Answer */}
        {c.second && (
          <section className="card second">
            <p className="label">A second candidate’s answer</p>
            <p className="scale" style={{ margin: '0 0 10px' }}>
              Another candidate sat the same case. This answer was written to be strong on most points while committing one error the examining board considers failing. We are checking whether the board is right.
            </p>
            <div className="cand">
              {c.second.split('\n').map((line, lIdx) => (
                <p key={lIdx} style={{ margin: '0 0 8px' }}>{line}</p>
              ))}
            </div>

            <p className="q" style={{ marginTop: '14px' }}>
              Would you pass or fail this candidate? If fail, name the error. If pass, say why the board is being too harsh.
            </p>

            <div className="seg pf" role="radiogroup">
              <label>
                <input
                  type="radio"
                  name={p + 'second-v'}
                  value="pass"
                  checked={answers[p + 'second-v'] === 'pass'}
                  onChange={() => handleValueChange(p + 'second-v', 'pass')}
                />
                <span>Pass</span>
              </label>
              <label>
                <input
                  type="radio"
                  name={p + 'second-v'}
                  value="fail"
                  checked={answers[p + 'second-v'] === 'fail'}
                  onChange={() => handleValueChange(p + 'second-v', 'fail')}
                />
                <span>Fail</span>
              </label>
            </div>

            <textarea
              rows={4}
              value={answers[p + 'second'] || ''}
              placeholder="Your reasoning"
              onChange={(e) => handleValueChange(p + 'second', e.target.value)}
            />
          </section>
        )}

        {/* Option Ratings */}
        {c.ratings && c.ratings.length > 0 && (
          <section className="card">
            <p className="label">Rate each management option on its own</p>
            <p className="scale">
              −2 strongly inappropriate · −1 inappropriate · 0 acceptable · +1 appropriate · +2 strongly indicated
            </p>

            {c.ratings.map((g, gi) => (
              <div key={gi} style={{ marginTop: '18px' }}>
                <p className="q font-semibold text-slate-800">{g.title}</p>
                {g.opts.map((optText, oi) => {
                  const ratingKey = p + 'r' + gi + '-' + oi;
                  const currentRate = answers[ratingKey];

                  return (
                    <div key={oi} className="opt">
                      <p>{optText}</p>
                      <div className="seg" role="radiogroup">
                        {['-2', '-1', '0', '1', '2'].map((rateVal) => (
                          <label key={rateVal}>
                            <input
                              type="radio"
                              name={ratingKey}
                              value={rateVal}
                              checked={currentRate === rateVal}
                              onChange={() => handleValueChange(ratingKey, rateVal)}
                            />
                            <span>{rateVal > 0 ? '+' + rateVal : rateVal === '0' ? '0' : rateVal.replace('-', '−')}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </section>
        )}

        {/* Practice Feedback */}
        <section className="card">
          <p className="q">
            Did the examiners miss a decision you would have tested? Is any question above unnecessary?
          </p>
          <textarea
            rows={3}
            value={answers[p + 'missed'] || ''}
            placeholder="Your feedback:"
            onChange={(e) => handleValueChange(p + 'missed', e.target.value)}
          />

          <p className="q" style={{ marginTop: '16px' }}>
            Would a practicing physician face this task as written? Yes / Somewhat / No, one line why.
          </p>
          <div className="seg" role="radiogroup">
            {['Yes', 'Somewhat', 'No'].map((realVal) => (
              <label key={realVal}>
                <input
                  type="radio"
                  name={p + 'real'}
                  value={realVal}
                  checked={answers[p + 'real'] === realVal}
                  onChange={() => handleValueChange(p + 'real', realVal)}
                />
                <span>{realVal}</span>
              </label>
            ))}
          </div>
          <input
            type="text"
            value={answers[p + 'real-why'] || ''}
            placeholder="One line why"
            onChange={(e) => handleValueChange(p + 'real-why', e.target.value)}
          />
        </section>

        {/* Navigation Buttons */}
        <div className="nav">
          <button
            className="btn ghost"
            type="button"
            onClick={() => handleViewChange(c.n === 1 ? 'intro' : String(c.n - 1))}
          >
            {c.n === 1 ? 'Instructions' : 'Previous case'}
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => handleViewChange(c.n === CASES.length ? 'closing' : String(c.n + 1))}
          >
            {c.n === CASES.length ? 'Closing question' : 'Next case'}
          </button>
        </div>
      </div>
    );
  };

  // Render Closing Question Section
  const renderClosing = () => (
    <div>
      <div className="casehead">
        <h2>Closing question</h2>
        <span className="chip">After the packet</span>
      </div>
      <section className="card">
        <p className="q">{EXAM_DATA.closing}</p>
        <textarea
          rows={5}
          value={answers['closing'] || ''}
          placeholder="(Optional) Enter your answer or impressions..."
          onChange={(e) => handleValueChange('closing', e.target.value)}
        />
      </section>

      <div className="nav">
        <button
          className="btn ghost"
          type="button"
          onClick={() => handleViewChange(String(CASES.length))}
        >
          Previous case
        </button>

        <button
          className="btn submit-action"
          type="button"
          onClick={handleSubmitFinal}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Exam Packet'}
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-slate-500">
        <i className="fas fa-spinner fa-spin text-3xl text-[#0f6f7a]"></i>
        <p className="text-sm font-medium">Loading clinical cases examination packet...</p>
      </div>
    );
  }

  const pedCases = CASES.filter((c) => c.part === 'Pediatric');
  const adCases = CASES.filter((c) => c.part !== 'Pediatric');

  return (
    <div className="consultant-exam-root">
      <div className="wrap">
        {/* Sticky Rail Sidebar */}
        <nav className="rail" aria-label="Sections">
          <h2>Sections</h2>
          <div className="tabs">
            <button
              type="button"
              className="tab"
              aria-current={currentView === 'intro'}
              onClick={() => handleViewChange('intro')}
            >
              <span>Instructions</span>
            </button>

            <h2>Pediatric cases</h2>
            {pedCases.map((c) => {
              const [d, t] = getCaseProgress(c, answers);
              const isScope = answers['c' + c.n + '-scope'];
              const isFull = isScope || d === t;

              return (
                <button
                  key={c.n}
                  type="button"
                  className={`tab ${isFull ? 'full' : ''}`}
                  aria-current={currentView === String(c.n)}
                  onClick={() => handleViewChange(String(c.n))}
                >
                  <span>Case {c.n}</span>
                  <span className="pct">{isScope ? 'skipped' : `${d}/${t}`}</span>
                </button>
              );
            })}

            <h2>Adult cases</h2>
            {adCases.map((c) => {
              const [d, t] = getCaseProgress(c, answers);
              const isScope = answers['c' + c.n + '-scope'];
              const isFull = isScope || d === t;

              return (
                <button
                  key={c.n}
                  type="button"
                  className={`tab ${isFull ? 'full' : ''}`}
                  aria-current={currentView === String(c.n)}
                  onClick={() => handleViewChange(String(c.n))}
                >
                  <span>Case {c.n}</span>
                  <span className="pct">{isScope ? 'skipped' : `${d}/${t}`}</span>
                </button>
              );
            })}

            <h2>After the packet</h2>
            <button
              type="button"
              className={`tab ${isUnitDone('closing', answers) ? 'full' : ''}`}
              aria-current={currentView === 'closing'}
              onClick={() => handleViewChange('closing')}
            >
              <span>Closing question</span>
            </button>
          </div>

          <div className="tools">
            <button className="btn" type="button" onClick={handleDownload}>
              <i className="fas fa-download mr-1.5 text-xs"></i>
              Download answers
            </button>
            <button className="btn ghost" type="button" onClick={handleCopy}>
              <i className="far fa-copy mr-1.5 text-xs"></i>
              Copy all answers
            </button>
            <button
              className="btn submit-action"
              type="button"
              onClick={handleSubmitFinal}
              disabled={isSubmitting}
            >
              <i className="fas fa-paper-plane mr-1.5 text-xs"></i>
              {examStatus === 'SUBMITTED' ? 'Resubmit Packet' : 'Submit Packet'}
            </button>
          </div>
        </nav>

        {/* Main Content Area */}
        <main>
          {currentView === 'intro' && renderIntro()}
          {currentView === 'closing' && renderClosing()}
          {currentView !== 'intro' && currentView !== 'closing' && renderCase(CASES[Number(currentView) - 1])}
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && <div className="toast">{toastMessage}</div>}
    </div>
  );
}

export default ConsultantExamPortal;
