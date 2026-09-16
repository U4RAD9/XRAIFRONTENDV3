import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINTS } from '../../api/endpoints';

// Raw axios without global interceptors - ensures we send exactly Token <hex> as required by cbackend
const ruralAxios = axios.create();

function ChannelPartnerPackages() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [servicesMap, setServicesMap] = useState({}); // id -> name
  const [servicesLoading, setServicesLoading] = useState(false);

  const fetchPackages = async () => {
    setLoading(true);
    setError('');
    const token = (sessionStorage.getItem('Token') || '').trim();
    const userId = (sessionStorage.getItem('UserID') || '').trim();
    const clientId = (sessionStorage.getItem('ClientID') || '').trim();

    if (!token) {
      setError('No Token found in session. Please login via campmanager (email/password) again. Token is required as Authorization: Token <hex>.');
      setLoading(false);
      return;
    }

    // cbackend expects ?client=<ClientID> e.g. CL-D0F165 (per corrected endpoint /api/packages/?client=CL-...)
    // keep UserID as fallback in case backend still accepts numeric
    const candidates = [];
    if (clientId) candidates.push(clientId);
    if (userId && !candidates.includes(userId)) candidates.push(userId);
    if (candidates.length === 0) {
      setError('Client identifier not found. Please re-login.');
      setLoading(false);
      return;
    }

    console.log('[Packages] using Token:', token.slice(0, 8) + '...', 'candidates:', candidates);

    // helper to try a single URL with ruralAxios + fetch fallback (to bypass CORS preflight stripping)
    const tryFetch = async (url) => {
      // 1) try ruralAxios
      try {
        const res = await ruralAxios.get(url, {
          headers: { Authorization: `Token ${token}` },
        });
        return res.data;
      } catch (axErr) {
        const axData = axErr?.response?.data;
        const axDetail = axData?.detail || '';
        // If credentials not provided, browser likely stripped Authorization due to CORS - retry via vite proxy and via fetch
        const isNoCreds = String(axDetail).toLowerCase().includes('authentication credentials were not provided');
        if (isNoCreds) {
          // 2) try fetch (native) - sometimes preserves header better
          try {
            const fr = await fetch(url, {
              method: 'GET',
              headers: { Authorization: `Token ${token}` },
            });
            const jd = await fr.json();
            if (fr.ok) return jd;
            // throw to outer to handle proxy fallback
            throw { response: { status: fr.status, data: jd } };
          } catch (fetchErr) {
            // 3) try vite proxy (/cbackend/...) to avoid CORS entirely
            const proxied = url.replace('https://cbackend.xraidigital.com', '/cbackend');
            console.log('[Packages] retry via proxy', proxied);
            const pr = await ruralAxios.get(proxied, {
              headers: { Authorization: `Token ${token}` },
            });
            return pr.data;
          }
        }
        throw axErr;
      }
    };

    let lastErr = null;
    for (const clientVal of candidates) {
      try {
        const url = `${ENDPOINTS.RURAL_PACKAGES}?client=${encodeURIComponent(clientVal)}`;
        const data = await tryFetch(url);
        const list = Array.isArray(data) ? data : data.results || [];
        console.log('[Packages] success client=', clientVal, 'count=', list.length);
        setPackages(list);
        setLoading(false);
        return;
      } catch (err) {
        console.warn('[Packages] failed client=', clientVal, err?.response?.status, err?.response?.data || err?.message);
        lastErr = err;
        const data = err?.response?.data;
        if (data?.code === 'token_not_valid' || (data?.detail && String(data.detail).toLowerCase().includes('token not valid'))) {
          break;
        }
        continue;
      }
    }

    if (lastErr) {
      const data = lastErr?.response?.data;
      const status = lastErr?.response?.status;
      const detail = data?.detail || data?.message || JSON.stringify(data) || lastErr.message;
      // Show curl hint for manual verification since user confirmed token works manually
      const curlHint = `curl -H "Authorization: Token ${token}" "${ENDPOINTS.RURAL_PACKAGES}?client=${candidates[0]}"`;
      setError(
        `Packages fetch failed (${status||'network'}): ${detail}\n` +
        `Sent: Authorization: Token ${token.slice(0, 8)}... + client=${candidates.join(',')}\n` +
        `Verify manually: ${curlHint}\n` +
        `If curl works but app fails, check browser CORS/Network tab. Token from login response is correct — ensure you logged in via campmanager (not fallback) and sessionStorage Token is exactly 97f3b953...`
      );
    }
    setLoading(false);
  };

  const fetchServices = async () => {
    const token = (sessionStorage.getItem('Token') || '').trim();
    const headers = token ? { Authorization: `Token ${token}` } : {};
    setServicesLoading(true);
    try {
      // Try direct then proxy fallback (CORS)
      let res;
      try {
        res = await ruralAxios.get(ENDPOINTS.CBACKEND_SERVICES, { headers });
      } catch (e) {
        const detail = String(e?.response?.data?.detail || '').toLowerCase();
        if (detail.includes('authentication credentials were not provided')) {
          const proxied = ENDPOINTS.CBACKEND_SERVICES.replace('https://cbackend.xraidigital.com', '/cbackend');
          res = await ruralAxios.get(proxied, { headers });
        } else {
          // try without auth (maybe public)
          try {
            res = await ruralAxios.get(ENDPOINTS.CBACKEND_SERVICES);
          } catch (_) { throw e; }
        }
      }
      const list = Array.isArray(res.data) ? res.data : res.data.results || [];
      const map = {};
      list.forEach((s) => { map[s.id] = s.name; });
      setServicesMap(map);
    } catch (err) {
      console.warn('[Services] fetch failed', err?.response?.data || err.message);
      // keep empty map -> fallback to showing IDs
    } finally {
      setServicesLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchServices();
  }, []);

  const handleSelectPackage = (pkg) => {
    navigate('/channel-partner/registration-form', { state: { selectedPackage: pkg } });
  };

  if (loading) {
    return (
      <div className="w-full py-20 text-center">
        <i className="fas fa-spinner fa-spin text-3xl text-[#11A8A4]"></i>
        <p className="mt-3 text-gray-600 font-medium">Loading packages...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Select Package for Registration</h2>
          <p className="text-sm text-gray-500 mt-1">Choose a health package to proceed with family registration.</p>
        </div>
        <button onClick={fetchPackages} className="cursor-pointer bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 self-start sm:self-auto">
          <i className="fas fa-sync"></i> Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm whitespace-pre-wrap break-words font-mono">
          <i className="fas fa-exclamation-circle mr-2"></i>{error}
          <div className="mt-2 text-xs bg-white border border-red-100 rounded-lg p-2 font-mono break-all">
            Stored Token: {(sessionStorage.getItem('Token')||'(empty)').slice(0,32)}...<br/>
            UserID: {sessionStorage.getItem('UserID')} | ClientID: {sessionStorage.getItem('ClientID')}<br/>
            Expected: Authorization: Token 97f3b953... + GET {ENDPOINTS.RURAL_PACKAGES}?client=CL-D0F165<br/>
            <button onClick={async () => {
                try {
                  const tok = sessionStorage.getItem('Token');
                  const cid = sessionStorage.getItem('ClientID')||sessionStorage.getItem('UserID');
                  const url = `${ENDPOINTS.RURAL_PACKAGES}?client=${encodeURIComponent(cid)}`;
                  const r = await ruralAxios.get(url, { headers: { Authorization: `Token ${tok}` }});
                  alert('Success: ' + JSON.stringify(r.data).slice(0,500));
                } catch(e){ alert('Failed: ' + JSON.stringify(e.response?.data||e.message)); }
              }} className="underline text-blue-600 cursor-pointer">Retry with Token header (client=ClientID)</button>
          </div>
        </div>
      )}

      {packages.length === 0 && !error ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-10 text-center">
          <i className="fas fa-box-open text-4xl text-gray-300 mb-3"></i>
          <p className="font-semibold text-gray-600">No packages found for this client.</p>
          <p className="text-sm text-gray-400 mt-1">Client: {sessionStorage.getItem('UserID') || sessionStorage.getItem('ClientID')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
              <div className="h-2 bg-gradient-to-r from-[#233560] to-[#11A8A4]"></div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-3">
                  <h3 className="text-lg font-bold text-gray-800 leading-tight">{pkg.name}</h3>
                  <span className="shrink-0 bg-[#11A8A4]/10 text-[#11A8A4] text-xs font-bold px-3 py-1 rounded-full">ID: {pkg.id}</span>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-[#233560]">₹{pkg.price}</span>
                  <span className="text-xs text-gray-500">Price</span>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500"><i className="fas fa-vials mr-2 text-gray-400"></i>Services</span>
                    <span className="font-semibold text-gray-800">{pkg.service_ids?.length || 0} tests</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500"><i className="fas fa-language mr-2 text-gray-400"></i>Report</span>
                    <span className="font-semibold text-gray-800">{pkg.report_language || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500"><i className="fas fa-calendar mr-2 text-gray-400"></i>Period</span>
                    <span className="font-semibold text-gray-800 text-xs">{pkg.start_date} → {pkg.end_date}</span>
                  </div>
                  {pkg.camp !== null && pkg.camp !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-500"><i className="fas fa-campground mr-2 text-gray-400"></i>Camp</span>
                      <span className="font-semibold text-gray-800">{pkg.camp}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Services {servicesLoading ? '(loading...)' : `(${pkg.service_ids?.length || 0})`}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(pkg.service_ids || []).map((sid) => {
                      const name = servicesMap[sid];
                      return (
                        <span key={sid} title={`ID: ${sid}`} className="bg-[#11A8A4]/10 text-[#233560] border border-[#11A8A4]/20 text-xs px-2.5 py-1 rounded-full font-semibold">
                          {name || `#${sid}`}
                        </span>
                      );
                    })}
                  </div>
                  {pkg.service_ids?.length > 0 && Object.keys(servicesMap).length === 0 && !servicesLoading && (
                    <p className="text-xs text-amber-600 mt-1">Names unavailable - showing IDs (services API unreachable)</p>
                  )}
                </div>

                <button
                  onClick={() => handleSelectPackage(pkg)}
                  className="cursor-pointer mt-6 w-full bg-gradient-to-r from-[#233560] to-[#11A8A4] text-white font-bold py-3 rounded-xl hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  Select Package <i className="fas fa-arrow-right text-xs"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChannelPartnerPackages;
