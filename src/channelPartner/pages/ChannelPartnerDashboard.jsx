import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChannelPartnerDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    clientId: '',
    contactNumber: '',
    userId: '',
    groups: [],
    token: '',
  });

  useEffect(() => {
    const groupsRaw = sessionStorage.getItem('Groups');
    let groups = [];
    try { groups = groupsRaw ? JSON.parse(groupsRaw) : []; } catch { groups = []; }

    setProfile({
      name: sessionStorage.getItem('FullName') || sessionStorage.getItem('UserName') || '-',
      email: sessionStorage.getItem('Email') || sessionStorage.getItem('UserName') || '-',
      clientId: sessionStorage.getItem('ClientID') || '-',
      contactNumber: sessionStorage.getItem('ContactNumber') || sessionStorage.getItem('MobileNumber') || '-',
      userId: sessionStorage.getItem('UserID') || '-',
      groups,
      token: sessionStorage.getItem('Token') || '',
    });
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#233560] to-[#11A8A4] rounded-2xl p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Channel Partner Dashboard</h2>
            <p className="mt-2 text-white/90 text-sm md:text-base">
              Welcome <span className="font-semibold">{profile.name}</span> — manage your channel operations from here.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-2 rounded-full text-sm">
              <i className="fas fa-id-badge"></i>
              <span>Client ID: <strong>{profile.clientId}</strong></span>
            </div>
          </div>
          <button
            onClick={() => navigate('/channel-partner/registration')}
            className="cursor-pointer shrink-0 bg-white text-[#233560] hover:bg-gray-100 font-bold px-8 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors"
          >
            <i className="fas fa-clipboard-list"></i> Registration
          </button>
        </div>
      </div>

      {/* Profile / Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#11A8A4]/10 flex items-center justify-center text-[#11A8A4]">
              <i className="fas fa-user"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Full Name</p>
              <p className="font-bold text-gray-800">{profile.name}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <i className="fas fa-envelope"></i>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email</p>
              <p className="font-bold text-gray-800 truncate">{profile.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <i className="fas fa-phone"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Contact</p>
              <p className="font-bold text-gray-800">{profile.contactNumber}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <i className="fas fa-users"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Group</p>
              <p className="font-bold text-gray-800">{profile.groups.length ? profile.groups.join(', ') : 'ChannelPartner'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Details Table */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Profile Details</h3>
        <div className="divide-y divide-gray-100">
          <div className="flex justify-between py-3">
            <span className="text-gray-500 font-medium">User ID</span>
            <span className="font-semibold text-gray-800">{profile.userId}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-500 font-medium">Client ID</span>
            <span className="font-semibold text-gray-800">{profile.clientId}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-500 font-medium">Email</span>
            <span className="font-semibold text-gray-800">{profile.email}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-500 font-medium">Contact Number</span>
            <span className="font-semibold text-gray-800">{profile.contactNumber}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-500 font-medium">Groups</span>
            <span className="font-semibold text-gray-800">{profile.groups.join(', ') || '-'}</span>
          </div>
        </div>
      </div>

      {/* Placeholder for future widgets */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Quick Actions</h3>
        <p className="text-sm text-gray-500 mb-4">Camp management actions will appear here. You can extend this dashboard with bookings, reports, and analytics.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-400">
            <i className="fas fa-chart-line text-2xl mb-2"></i>
            <p className="text-sm font-semibold">Reports</p>
            <p className="text-xs">Coming soon</p>
          </div>
          <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-400">
            <i className="fas fa-calendar-check text-2xl mb-2"></i>
            <p className="text-sm font-semibold">Camp Schedule</p>
            <p className="text-xs">Coming soon</p>
          </div>
          <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-400">
            <i className="fas fa-users-cog text-2xl mb-2"></i>
            <p className="text-sm font-semibold">Manage Clients</p>
            <p className="text-xs">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChannelPartnerDashboard;
