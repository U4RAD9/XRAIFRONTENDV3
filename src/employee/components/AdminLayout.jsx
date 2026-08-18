import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

function AdminLayout() {
  const navigate = useNavigate();

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
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="bg-white shadow-sm py-4 px-8 flex justify-between items-center z-10 sticky top-0">
          <h1 className="text-2xl font-bold text-gray-800">Booking Operations</h1>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 font-semibold flex items-center transition-colors">
            <i className="fas fa-sign-out-alt mr-2"></i> Logout
          </button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
