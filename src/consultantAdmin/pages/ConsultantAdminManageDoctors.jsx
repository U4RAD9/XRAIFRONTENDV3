import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { ENDPOINTS } from '../../api/endpoints';
import Modal from '../components/Modal';
import Pagination from '../../components/Pagination';

function ConsultantAdminManageDoctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    id: null,
    fullName: '',
    username: '',
    mobile: '',
    password: '',
    userType: 'Consultant',
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch only Consultant doctors
  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(ENDPOINTS.USERS, {
        params: {
          user_type: 'Consultant',
          page: currentPage,
          search: debouncedSearch.trim(),
        },
      });

      const raw = res.data.results || res.data;
      if (res.data.total_pages) {
        setTotalPages(res.data.total_pages);
      } else {
        setTotalPages(1);
      }
      if (res.data.count !== undefined) {
        setTotalCount(res.data.count);
      } else if (Array.isArray(raw)) {
        setTotalCount(raw.length);
      }

      const list = (Array.isArray(raw) ? raw : []).map((u) => ({
        id: u.id,
        username: u.user_name,
        fullName: u.full_name || u.user_name || 'Dr. Consultant',
        mobile: u.mobile_number || '',
        userType: u.user_type_name || 'Consultant',
      }));

      setDoctors(list);
    } catch (err) {
      console.error('Error fetching consultant doctors:', err);
      showToast('Error loading consultant accounts.');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Open Create Doctor Modal
  const handleOpenCreateModal = () => {
    setFormData({
      id: null,
      fullName: '',
      username: '',
      mobile: '',
      password: '',
      userType: 'Consultant',
    });
    setFormError('');
    setIsEditing(false);
    setShowModal(true);
  };

  // Open Edit Doctor Modal
  const handleOpenEditModal = (doc) => {
    setFormData({
      id: doc.id,
      fullName: doc.fullName || '',
      username: doc.username || '',
      mobile: doc.mobile || '',
      password: '', // Blank unless updating
      userType: 'Consultant',
    });
    setFormError('');
    setIsEditing(true);
    setShowModal(true);
  };

  // Submit Create or Edit
  const handleSubmitDoctor = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.fullName.trim()) {
      setFormError('Please enter doctor full name (e.g., Dr. Rajesh Kumar).');
      return;
    }
    if (!formData.username.trim()) {
      setFormError('Please enter a login username.');
      return;
    }
    if (!formData.mobile.trim()) {
      setFormError('Please enter doctor contact mobile number.');
      return;
    }
    if (!isEditing && !formData.password.trim()) {
      setFormError('Please provide a secure password for the new doctor account.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        username: formData.username.trim(),
        mobile: formData.mobile.trim(),
        userType: 'Consultant',
      };
      if (formData.password.trim()) {
        payload.password = formData.password.trim();
      }

      if (isEditing) {
        await axiosInstance.put(`${ENDPOINTS.USERS}${formData.id}/`, payload);
        showToast(`Consultant account for ${formData.fullName} updated successfully!`);
      } else {
        await axiosInstance.post(ENDPOINTS.USERS, payload);
        showToast(`New Consultant Doctor ${formData.fullName} registered successfully!`);
      }

      setShowModal(false);
      fetchDoctors();
    } catch (err) {
      console.error('Error saving doctor account:', err);
      const msg = err.response?.data?.Message || err.response?.data?.message || err.response?.data?.user_name?.[0] || 'Failed to save doctor account.';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete doctor account
  const handleDeleteDoctor = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete consultant doctor account "${name}"?`)) {
      return;
    }

    try {
      await axiosInstance.delete(`${ENDPOINTS.USERS}${id}/`);
      showToast('Doctor account deleted successfully.');
      fetchDoctors();
    } catch (err) {
      console.error('Error deleting doctor:', err);
      alert('Error deleting doctor account.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Consultant Doctors
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {totalCount} Total Registered
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Create, manage and audit dedicated login credentials for consulting doctors evaluating examination packets.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-bold rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <i className="fas fa-user-plus text-xs"></i>
          <span>Add Consultant Doctor</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-xl shadow-xs">
            <i className="fas fa-user-md"></i>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Doctors
            </div>
            <div className="text-2xl font-black text-slate-800">
              {totalCount}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center text-xl shadow-xs">
            <i className="fas fa-check-double"></i>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Portal Access
            </div>
            <div className="text-2xl font-black text-slate-800">
              Active
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center text-xl shadow-xs">
            <i className="fas fa-clipboard-list"></i>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Role Type
            </div>
            <div className="text-2xl font-black text-purple-700">
              Consultant
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, username or mobile..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        <button
          onClick={fetchDoctors}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
        >
          <i className={`fas fa-sync-alt text-xs ${loading ? 'fa-spin' : ''}`}></i>
          <span>Refresh List</span>
        </button>
      </div>

      {/* Doctors Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-4"># ID</th>
                <th className="py-3.5 px-4">Consultant Doctor</th>
                <th className="py-3.5 px-4">Login Username</th>
                <th className="py-3.5 px-4">Mobile Number</th>
                <th className="py-3.5 px-4">Role Badge</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <i className="fas fa-spinner fa-spin text-2xl text-indigo-500 mb-2 block"></i>
                    <span>Loading consultant accounts...</span>
                  </td>
                </tr>
              ) : doctors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <i className="fas fa-user-slash text-3xl mb-2 text-slate-300 block"></i>
                    <p className="font-semibold text-slate-600">No consultant doctors found</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {debouncedSearch ? 'Try a different search term.' : 'Click "Add Consultant Doctor" above to create an account.'}
                    </p>
                  </td>
                </tr>
              ) : (
                doctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400 font-semibold">
                      #{doc.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                          {doc.fullName ? doc.fullName.charAt(0).toUpperCase() : 'D'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{doc.fullName}</div>
                          <div className="text-[10px] text-slate-400">Consultant Physician</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      @{doc.username}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">
                      {doc.mobile || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        <i className="fas fa-stethoscope text-[9px]"></i>
                        Consultant
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {/* View Submissions */}
                        <button
                          onClick={() => navigate(`/consultant-admin/evaluations?search=${encodeURIComponent(doc.username)}`)}
                          className="px-2.5 py-1 text-[11px] font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 border border-indigo-200 hover:border-indigo-600 rounded-lg transition-all cursor-pointer"
                          title="View all submissions by this doctor"
                        >
                          <i className="fas fa-file-alt mr-1"></i>
                          Submissions
                        </button>

                        {/* Edit Doctor */}
                        <button
                          onClick={() => handleOpenEditModal(doc)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Doctor Credentials"
                        >
                          <i className="fas fa-edit"></i>
                        </button>

                        {/* Delete Doctor */}
                        <button
                          onClick={() => handleDeleteDoctor(doc.id, doc.fullName)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Doctor Account"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Modal: Create / Edit Consultant Doctor */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEditing ? `Edit Doctor: ${formData.fullName}` : 'Add New Consultant Doctor'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmitDoctor} className="p-6 space-y-4">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <i className="fas fa-exclamation-circle text-rose-500"></i>
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Doctor Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Dr. Rajesh Sharma, MD"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Login Username <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="e.g. dr.rajesh"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
              disabled={isEditing}
            />
            {isEditing && (
              <p className="text-[10px] text-slate-400 mt-0.5">Username cannot be changed after creation.</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mobile Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              placeholder="e.g. 9876543210"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {isEditing ? 'New Password / MPIN (Leave blank to keep current)' : 'Password / MPIN *'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={isEditing ? '••••••••' : 'Enter login password'}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required={!isEditing}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Assigned User Role
            </label>
            <div className="w-full px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-700 flex items-center justify-between">
              <span>Consultant (Doctor Portal Access Only)</span>
              <i className="fas fa-lock text-indigo-400 text-xs"></i>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-1.5"></i>
                  Saving...
                </>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Create Doctor Account'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl text-xs z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <i className="fas fa-check-circle text-emerald-400"></i>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default ConsultantAdminManageDoctors;
