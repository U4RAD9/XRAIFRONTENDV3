import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const getLinkClass = (path) => {
    const isActive = location.pathname.startsWith(path);
    return isActive 
      ? "flex items-center px-4 py-3 bg-[#00acc1] text-white rounded-lg shadow-sm"
      : "flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors";
  };

  useEffect(() => {
    const userType = sessionStorage.getItem('UserType');
    if (userType !== 'Admin') {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('UserName');
    sessionStorage.removeItem('FullName');
    sessionStorage.removeItem('UserType');
    sessionStorage.removeItem('UserID');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#233560] text-white hidden md:flex flex-col shadow-xl z-10 sticky top-0 h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link to="/admin/dashboard" className={`flex items-center px-4 py-2 mt-2 transition-colors ${getLinkClass('/admin/dashboard')}`}>
            <i className="fas fa-home mx-4 w-5 text-center"></i>
            <span className="font-medium">Dashboard</span>
          </Link>
          <h3 className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Slot Management</h3>
          <Link to="/admin/slot-master" className={getLinkClass('/admin/slot-master')}>
            <i className="fas fa-calendar-alt mr-3 w-5 text-center"></i> Slot Master
          </Link>
          
          <h3 className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Service Management</h3>
          <Link to="/admin/locations" className={getLinkClass('/admin/locations')}>
            <i className="fas fa-map-marker-alt mr-3 w-5 text-center"></i> Locations
          </Link>
          <Link to="/admin/service-groups" className={getLinkClass('/admin/service-groups')}>
            <i className="fas fa-list-alt mr-3 w-5 text-center"></i> Service Groups
          </Link>
          <Link to="/admin/services" className={getLinkClass('/admin/services')}>
            <i className="fas fa-briefcase-medical mr-3 w-5 text-center"></i> Services
          </Link>
          <Link to="/admin/price-rate-master" className={getLinkClass('/admin/price-rate-master')}>
            <i className="fas fa-rupee-sign mr-3 w-5 text-center"></i> Price Rate Master
          </Link>
          <Link to="/admin/offers-master" className={getLinkClass('/admin/offers-master')}>
            <i className="fas fa-tags mr-3 w-5 text-center"></i> Offer Master
          </Link>
          <h3 className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Users</h3>
          <Link to="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
            <i className="fas fa-users mr-3 w-5 text-center"></i> Manage Users
          </Link>
          <Link to="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
            <i className="fas fa-user-injured mr-3 w-5 text-center"></i> Patients
          </Link>
          <Link to="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
            <i className="fas fa-key mr-3 w-5 text-center"></i> Permissions
          </Link>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        <header className="bg-white shadow-sm py-4 px-8 flex justify-between items-center z-10 sticky top-0">
          <h1 className="text-2xl font-bold text-gray-800">Booking Operations</h1>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 font-semibold flex items-center transition-colors">
            <i className="fas fa-sign-out-alt mr-2"></i> Logout
          </button>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
