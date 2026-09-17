import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { ENDPOINTS } from '../../api/endpoints';

const ruralAxios = axios.create();

function ChannelPartnerFamilyList() {
  const [families, setFamilies] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterPackage, setFilterPackage] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [savingMember, setSavingMember] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [addingMember, setAddingMember] = useState(false);
  const emptyAddMember = {
    first_name: '', middle_name: '', last_name: '', date_of_birth: '', age: '', gender: 'MALE', relationship: 'SON',
    mobile: '', alternate_mobile: '', email: '', blood_group: 'B+', marital_status: 'SINGLE', education: '', occupation: '', annual_income: '', social_category: 'GENERAL', photo: null
  };
  const [newMember, setNewMember] = useState(emptyAddMember);

  const getToken = () => (sessionStorage.getItem('Token') || '').trim();

  const fetchWithAuth = async (url, method = 'GET', data = null, extraHeaders = {}) => {
    const token = getToken();
    const headers = token ? { Authorization: `Token ${token}`, ...extraHeaders } : { ...extraHeaders };
    try {
      const cfg = { headers, method };
      if (method === 'GET') {
        const res = await ruralAxios.get(url, cfg);
        return res.data;
      } else if (method === 'DELETE') {
        const res = await ruralAxios.delete(url, cfg);
        return res.data;
      } else {
        // POST, PUT, PATCH
        const res = await ruralAxios({ url, method, data, headers });
        return res.data;
      }
    } catch (e) {
      const detail = String(e?.response?.data?.detail || '').toLowerCase();
      if (detail.includes('authentication credentials were not provided')) {
        const proxied = url.replace('https://cbackend.xraidigital.com', '/cbackend');
        if (method === 'GET') {
          const res2 = await ruralAxios.get(proxied, { headers });
          return res2.data;
        } else if (method === 'DELETE') {
          const res2 = await ruralAxios.delete(proxied, { headers });
          return res2.data;
        } else {
          const res2 = await ruralAxios({ url: proxied, method, data, headers });
          return res2.data;
        }
      }
      throw e;
    }
  };

  const fetchFamilies = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchWithAuth(ENDPOINTS.RURAL_FAMILIES);
      const list = Array.isArray(data) ? data : data.results || [];
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setFamilies(list);
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.response?.data?.message || JSON.stringify(err?.response?.data) || err.message || 'Failed to load families';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const data = await fetchWithAuth(ENDPOINTS.RURAL_PACKAGES + `?client=${encodeURIComponent(sessionStorage.getItem('ClientID') || sessionStorage.getItem('UserID') || '')}`);
      const list = Array.isArray(data) ? data : data.results || [];
      setPackages(list);
    } catch (_) {}
  };

  useEffect(() => {
    fetchFamilies();
    fetchPackages();
  }, []);

  const filtered = useMemo(() => {
    return families.filter((f) => {
      if (filterPackage && String(f.package) !== String(filterPackage)) return false;
      if (filterStatus !== 'all') {
        if (filterStatus === 'active' && !f.is_active) return false;
        if (filterStatus === 'inactive' && f.is_active) return false;
      }
      if (filterDate) {
        const d = f.created_at ? f.created_at.slice(0, 10) : '';
        if (d !== filterDate) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        const hay = `${f.family_id} ${f.primary_mobile} ${f.village} ${f.district} ${f.pincode} ${f.package_name} ${f.members?.map(m=>m.full_name).join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [families, filterPackage, filterDate, filterStatus, search]);

  // Member CRUD helpers
  const openEdit = (member) => {
    setEditingMember(member);
    setEditForm({
      first_name: member.first_name || '',
      middle_name: member.middle_name || '',
      last_name: member.last_name || '',
      date_of_birth: member.date_of_birth || '',
      age: member.age || '',
      gender: member.gender || 'MALE',
      relationship: member.relationship || 'OTHER',
      mobile: member.mobile || '',
      email: member.email || '',
      blood_group: member.blood_group || '',
      marital_status: member.marital_status || 'SINGLE',
      education: member.education || '',
      occupation: member.occupation || '',
      annual_income: member.annual_income || '',
      social_category: member.social_category || 'GENERAL',
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const saveEdit = async () => {
    if (!editingMember) return;
    setSavingMember(true);
    try {
      // Use PATCH for partial update with JSON; photo not handled here (use PUT multipart if needed)
      const url = `${ENDPOINTS.RURAL_MEMBERS}${editingMember.id}/`;
      const payload = { ...editForm };
      // clean empty
      if (!payload.middle_name) delete payload.middle_name;
      await fetchWithAuth(url, 'PATCH', payload, { 'Content-Type': 'application/json' });
      alert('Member updated');
      setEditingMember(null);
      // refresh families and selected
      await fetchFamilies();
      // update selected modal with fresh data
      setSelected(null);
    } catch (err) {
      const msg = err?.response?.data ? JSON.stringify(err.response.data) : err.message;
      alert('Update failed: ' + msg);
    } finally {
      setSavingMember(false);
    }
  };

  const deleteMember = async (member) => {
    if (!confirm(`Deactivate member ${member.full_name} (${member.member_id})?`)) return;
    try {
      const url = `${ENDPOINTS.RURAL_MEMBERS}${member.id}/`;
      await fetchWithAuth(url, 'DELETE');
      alert('Member deactivated');
      await fetchFamilies();
      // remove from selected view
      setSelected(prev => {
        if (!prev) return prev;
        return { ...prev, members: prev.members.filter(m=>m.id!==member.id) };
      });
    } catch (err) {
      const msg = err?.response?.data ? JSON.stringify(err.response.data) : err.message;
      alert('Delete failed: ' + msg);
    }
  };

  const handleAddMemberChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === 'file') {
      setNewMember({ ...newMember, photo: files[0] || null });
    } else {
      setNewMember({ ...newMember, [name]: value });
    }
  };

  const submitAddMember = async () => {
    if (!selected) return;
    if ((selected.members?.length || 0) >= 3) {
      alert('Cannot add more than 3 members per family');
      return;
    }
    if (!newMember.first_name || !newMember.last_name || !newMember.date_of_birth || !newMember.age) {
      alert('First Name, Last Name, DOB and Age are required');
      return;
    }
    setAddingMember(true);
    try {
      const token = getToken();
      const headers = token ? { Authorization: `Token ${token}` } : {};
      const fd = new FormData();
      fd.append('family', String(selected.id));
      fd.append('first_name', newMember.first_name);
      if (newMember.middle_name) fd.append('middle_name', newMember.middle_name);
      fd.append('last_name', newMember.last_name);
      fd.append('date_of_birth', newMember.date_of_birth);
      if (newMember.age) fd.append('age', String(newMember.age));
      fd.append('gender', newMember.gender);
      fd.append('relationship', newMember.relationship);
      if (newMember.mobile) fd.append('mobile', newMember.mobile);
      if (newMember.alternate_mobile) fd.append('alternate_mobile', newMember.alternate_mobile);
      if (newMember.email) fd.append('email', newMember.email);
      if (newMember.blood_group) fd.append('blood_group', newMember.blood_group);
      if (newMember.marital_status) fd.append('marital_status', newMember.marital_status);
      if (newMember.education) fd.append('education', newMember.education);
      if (newMember.occupation) fd.append('occupation', newMember.occupation);
      if (newMember.annual_income) fd.append('annual_income', String(newMember.annual_income));
      if (newMember.social_category) fd.append('social_category', newMember.social_category);
      fd.append('is_primary_contact', 'false');
      if (newMember.photo) fd.append('photo', newMember.photo);

      // use ruralAxios directly for multipart
      try {
        await ruralAxios.post(ENDPOINTS.RURAL_MEMBERS, fd, { headers });
      } catch (e) {
        const detail = String(e?.response?.data?.detail || '').toLowerCase();
        if (detail.includes('authentication credentials were not provided')) {
          const proxied = ENDPOINTS.RURAL_MEMBERS.replace('https://cbackend.xraidigital.com', '/cbackend');
          await ruralAxios.post(proxied, fd, { headers });
        } else throw e;
      }
      alert('Member added');
      setShowAddMember(false);
      setNewMember(emptyAddMember);
      await fetchFamilies();
      // keep modal open with updated data - refetch selected
      const fresh = await fetchWithAuth(`${ENDPOINTS.RURAL_FAMILIES}${selected.id}/`);
      setSelected(fresh);
    } catch (err) {
      const msg = err?.response?.data ? JSON.stringify(err.response.data) : err.message;
      alert('Add failed: ' + msg);
    } finally {
      setAddingMember(false);
    }
  };

  // Also support direct GET members list if needed (not used in table but can be fetched)
  // const fetchMembersDirect = ... (GET /api/rural-health/members/) - available via same helper

  if (loading) {
    return (
      <div className="w-full py-20 text-center">
        <i className="fas fa-spinner fa-spin text-3xl text-[#11A8A4]"></i>
        <p className="mt-3 text-gray-600 font-medium">Loading families...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Registered Families / Patients</h2>
        </div>
        <button onClick={fetchFamilies} className="cursor-pointer bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 self-start">
          <i className="fas fa-sync"></i> Refresh
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow border border-gray-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Search</label>
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
              <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Family ID, mobile, village..." className="w-full border border-gray-300 rounded-xl pl-8 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#11A8A4]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Package</label>
            <select value={filterPackage} onChange={(e)=>setFilterPackage(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#11A8A4]">
              <option value="">All Packages</option>
              {packages.map(p=> (
                <option key={p.id} value={p.id}>{p.name} - ₹{p.price} (#{p.id})</option>
              ))}
              {[...new Set(families.map(f=>f.package))].filter(id=>!packages.find(p=>String(p.id)===String(id))).map(id=> (
                <option key={id} value={id}>Package #{id}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Date</label>
            <input type="date" value={filterDate} onChange={(e)=>setFilterDate(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#11A8A4]" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Status</label>
            <select value={filterStatus} onChange={(e)=>setFilterStatus(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#11A8A4]">
              <option value="all">All</option>
              <option value="active">Active only</option>
              <option value="inactive">Inactive only</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={()=>{setFilterPackage(''); setFilterDate(''); setFilterStatus('all'); setSearch('');}} className="cursor-pointer w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm">Clear</button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm whitespace-pre-wrap break-words">
          <i className="fas fa-exclamation-circle mr-2"></i>{error}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-10 text-center">
          <i className="fas fa-users-slash text-4xl text-gray-300 mb-3"></i>
          <p className="font-semibold text-gray-600">No families found.</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Family ID</th>
                    <th className="px-4 py-3 text-left">Package</th>
                    <th className="px-4 py-3 text-left">Village</th>
                    <th className="px-4 py-3 text-left">Mobile</th>
                    <th className="px-4 py-3 text-center">Members</th>
                    <th className="px-4 py-3 text-center">Active</th>
                    <th className="px-4 py-3 text-left">Created</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(f=> (
                    <tr key={f.id} className="hover:bg-[#11A8A4]/5">
                      <td className="px-4 py-3 font-mono font-bold text-[#233560]">{f.family_id}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-800">{f.package_name || `Pkg #${f.package}`}</div>
                        <div className="text-xs text-gray-500">₹{f.package_price} • ID:{f.package}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-800">{f.village || '-'}, {f.district || '-'}</div>
                        <div className="text-xs text-gray-500">{f.state} • {f.pincode}</div>
                      </td>
                      <td className="px-4 py-3 font-mono">{f.primary_mobile}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="bg-[#11A8A4]/10 text-[#11A8A4] px-2.5 py-1 rounded-full font-bold text-xs">{f.members?.length ?? 0}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {f.is_active ? <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold">Active</span> : <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-bold">Inactive</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">{f.created_at ? new Date(f.created_at).toLocaleString() : '-'}</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={()=>setSelected(f)} className="cursor-pointer bg-[#233560] hover:bg-[#1a2747] text-white px-3 py-1.5 rounded-lg text-xs font-bold">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="md:hidden grid grid-cols-1 gap-4">
            {filtered.map(f=> (
              <div key={f.id} className="bg-white rounded-2xl shadow border border-gray-100 p-4">
                <div className="flex justify-between">
                  <span className="font-mono font-bold text-[#233560] text-sm">{f.family_id}</span>
                  {f.is_active ? <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">Active</span> : <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">Inactive</span>}
                </div>
                <p className="text-sm font-semibold text-gray-800 mt-1">{f.package_name} • ₹{f.package_price}</p>
                <p className="text-xs text-gray-500">{f.village}, {f.district} • {f.pincode}</p>
                <p className="text-xs font-mono mt-1">{f.primary_mobile}</p>
                <p className="text-xs text-gray-600 mt-1">Members: {f.members?.length || 0}</p>
                <button onClick={()=>setSelected(f)} className="cursor-pointer mt-3 w-full bg-[#11A8A4] text-white py-2 rounded-xl text-sm font-bold">View Details</button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Family Detail Modal with Member CRUD */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={()=>setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <h3 className="font-bold text-gray-800">{selected.family_id} – {selected.package_name}</h3>
              <button onClick={()=>setSelected(null)} className="cursor-pointer w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"><i className="fas fa-times text-gray-600"></i></button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-gray-500">Package:</span> <span className="font-semibold">#{selected.package} {selected.package_name} ₹{selected.package_price}</span></div>
                <div><span className="text-gray-500">Mobile:</span> <span className="font-mono font-semibold">{selected.primary_mobile}</span></div>
                <div className="col-span-2"><span className="text-gray-500">Address:</span> <span className="font-semibold">{[selected.address_line_1, selected.address_line_2, selected.village, selected.gram_panchayat, selected.block, selected.district, selected.state, selected.pincode].filter(Boolean).join(', ')}</span></div>
                <div><span className="text-gray-500">Status:</span> {selected.is_active ? <span className="text-green-600 font-bold">Active</span> : <span className="text-red-600 font-bold">Inactive</span>}</div>
                <div><span className="text-gray-500">Members:</span> <span className="font-bold">{selected.members?.length || 0}/3</span></div>
                <div><span className="text-gray-500">Created:</span> {selected.created_at ? new Date(selected.created_at).toLocaleString() : '-'}</div>
              </div>
              {(selected.members?.length || 0) < 3 && (
                <button onClick={() => setShowAddMember(true)} className="cursor-pointer w-full bg-[#11A8A4] hover:bg-[#0e8c89] text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2">
                  <i className="fas fa-user-plus"></i> Add Member
                </button>
              )}
              {(selected.members?.length || 0) >= 3 && (
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">Maximum 3 members reached for this family.</p>
              )}

              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-800 mb-2">Members</h4>
                {selected.members?.length ? (
                  <div className="space-y-3">
                    {selected.members.map(m=> (
                      <div key={m.id} className="border border-gray-200 rounded-xl p-3 flex gap-3">
                        {m.photo ? <img src={m.photo} alt={m.full_name} className="w-12 h-12 rounded-full object-cover border"/> : <div className="w-12 h-12 rounded-full bg-[#11A8A4]/10 flex items-center justify-center text-[#11A8A4] font-bold">{m.first_name?.[0]}</div>}
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-gray-800 truncate">{m.full_name} <span className="text-xs font-normal text-gray-500">({m.relationship})</span></p>
                          <p className="text-xs text-gray-600">{m.gender} • {m.date_of_birth} • {m.age}y • {m.mobile || '-'} {m.email ? `• ${m.email}`:''}</p>
                          <p className="text-xs text-gray-500">{m.blood_group} • {m.marital_status} • {m.occupation || ''}</p>
                          <div className="flex gap-2 mt-2">
                            <button onClick={()=>openEdit(m)} className="cursor-pointer text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-semibold border border-blue-200"><i className="fas fa-edit mr-1"></i>Edit</button>
                            <button onClick={()=>deleteMember(m)} className="cursor-pointer text-xs bg-red-50 hover:bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-semibold border border-red-200"><i className="fas fa-trash mr-1"></i>Delete</button>
                          </div>
                        </div>
                        <span className={`self-start px-2 py-1 rounded-full text-xs font-bold ${m.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{m.is_active ? 'Active' : 'Inactive'}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No members</p>
                )}
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button onClick={()=>setSelected(null)} className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-6 py-2 rounded-xl">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" onClick={()=>setEditingMember(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Edit Member – {editingMember.full_name}</h3>
              <button onClick={()=>setEditingMember(null)} className="cursor-pointer w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><i className="fas fa-times"></i></button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><label className="block text-xs font-bold text-gray-600 mb-1">First Name</label><input name="first_name" value={editForm.first_name} onChange={handleEditChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#11A8A4]" /></div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1">Last Name</label><input name="last_name" value={editForm.last_name} onChange={handleEditChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#11A8A4]" /></div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1">DOB</label><input type="date" name="date_of_birth" value={editForm.date_of_birth} onChange={handleEditChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#11A8A4]" /></div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1">Age</label><input type="number" name="age" value={editForm.age} onChange={handleEditChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#11A8A4]" /></div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1">Gender</label><input name="gender" value={editForm.gender} onChange={handleEditChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#11A8A4]" /></div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1">Mobile</label><input name="mobile" value={editForm.mobile} onChange={handleEditChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#11A8A4]" /></div>
              <div className="md:col-span-2"><label className="block text-xs font-bold text-gray-600 mb-1">Email</label><input name="email" value={editForm.email} onChange={handleEditChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#11A8A4]" /></div>
              {/* <div><label className="block text-xs font-bold text-gray-600 mb-1">Blood Group</label><input name="blood_group" value={editForm.blood_group} onChange={handleEditChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#11A8A4]" /></div> */}
              <div><label className="block text-xs font-bold text-gray-600 mb-1">Relationship</label><input name="relationship" value={editForm.relationship} onChange={handleEditChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#11A8A4]" /></div>
            </div>
            <div className="p-4 border-t flex justify-end gap-3">
              <button onClick={()=>setEditingMember(null)} className="cursor-pointer bg-gray-100 px-5 py-2 rounded-xl font-semibold">Cancel</button>
              <button onClick={saveEdit} disabled={savingMember} className="cursor-pointer bg-[#11A8A4] hover:bg-[#0e8c89] text-white px-6 py-2 rounded-xl font-bold disabled:opacity-50">{savingMember ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal - only if <3 members */}
      {showAddMember && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" onClick={()=>setShowAddMember(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Add Member to {selected.family_id} <span className="text-xs font-normal text-gray-500">POST /api/rural-health/members/</span></h3>
              <button onClick={()=>setShowAddMember(false)} className="cursor-pointer w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><i className="fas fa-times"></i></button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><label className="block text-xs font-bold text-gray-600 mb-1">First Name *</label><input name="first_name" value={newMember.first_name} onChange={handleAddMemberChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#11A8A4]" /></div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1">Last Name *</label><input name="last_name" value={newMember.last_name} onChange={handleAddMemberChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#11A8A4]" /></div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1">Middle Name</label><input name="middle_name" value={newMember.middle_name} onChange={handleAddMemberChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#11A8A4]" /></div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1">DOB *</label><input type="date" name="date_of_birth" value={newMember.date_of_birth} onChange={handleAddMemberChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#11A8A4]" /></div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1">Age *</label><input type="number" name="age" value={newMember.age} onChange={handleAddMemberChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#11A8A4]" /></div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1">Gender *</label>
                <select name="gender" value={newMember.gender} onChange={handleAddMemberChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-[#11A8A4]">
                  <option value="MALE">MALE</option><option value="FEMALE">FEMALE</option><option value="OTHER">OTHER</option>
                </select>
              </div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1">Relationship *</label>
                <select name="relationship" value={newMember.relationship} onChange={handleAddMemberChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-[#11A8A4]">
                  <option value="SON">SON</option><option value="DAUGHTER">DAUGHTER</option><option value="SPOUSE">SPOUSE</option><option value="FATHER">FATHER</option><option value="MOTHER">MOTHER</option><option value="BROTHER">BROTHER</option><option value="SISTER">SISTER</option><option value="OTHER">OTHER</option>
                </select>
              </div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1">Mobile</label><input name="mobile" value={newMember.mobile} onChange={handleAddMemberChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#11A8A4]" placeholder="10 digits" /></div>
              <div className="md:col-span-2"><label className="block text-xs font-bold text-gray-600 mb-1">Email</label><input type="email" name="email" value={newMember.email} onChange={handleAddMemberChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#11A8A4]" /></div>
              <div><label className="block text-xs font-bold text-gray-600 mb-1">Photo</label><input type="file" name="photo" accept="image/*" onChange={handleAddMemberChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white text-xs" /></div>
              {/* <div><label className="block text-xs font-bold text-gray-600 mb-1">Blood Group</label>
                <select name="blood_group" value={newMember.blood_group} onChange={handleAddMemberChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-[#11A8A4]">
                  <option value="">Select</option><option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option>
                </select>
              </div> */}
            </div>
            <div className="p-4 border-t flex justify-end gap-3">
              <button onClick={()=>{setShowAddMember(false); setNewMember(emptyAddMember);}} className="cursor-pointer bg-gray-100 px-5 py-2 rounded-xl font-semibold">Cancel</button>
              <button onClick={submitAddMember} disabled={addingMember} className="cursor-pointer bg-[#11A8A4] hover:bg-[#0e8c89] text-white px-6 py-2 rounded-xl font-bold disabled:opacity-50">{addingMember ? 'Adding...' : 'Add Member'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChannelPartnerFamilyList;
