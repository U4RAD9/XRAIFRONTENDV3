import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

function AdminLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const userType = sessionStorage.getItem('UserType');
    if (userType !== 'Admin') {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('UserName');
    sessionStorage.removeItem('FullName');
    sessionStorage.removeItem('UserType');
    sessionStorage.removeItem('UserID');
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <AdminSidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        handleLogout={handleLogout} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="bg-white shadow-sm py-4 px-4 md:px-8 flex justify-between items-center z-10 sticky top-0">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="text-gray-800 md:hidden mr-3 focus:outline-none cursor-pointer"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Operations Dashboard</h1>
          </div>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 font-semibold flex items-center transition-colors">
            <i className="fas fa-sign-out-alt mr-2"></i> Logout
          </button>
        </header>

        <main className="flex-1 p-3 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
