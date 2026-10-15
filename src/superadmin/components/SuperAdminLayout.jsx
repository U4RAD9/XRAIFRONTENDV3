import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import SuperAdminSidebar from './SuperAdminSidebar';

function SuperAdminLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const fullName = sessionStorage.getItem('FullName') || 'Super Admin';
  const userType = sessionStorage.getItem('UserType') || 'SuperAdmin';

  useEffect(() => {
    const token = sessionStorage.getItem('Token');
    const role = sessionStorage.getItem('UserType');
    // Strictly allow only SuperAdmin
    if (!token || (role !== 'SuperAdmin' && role !== 'Superadmin')) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('Token');
    sessionStorage.removeItem('UserName');
    sessionStorage.removeItem('FullName');
    sessionStorage.removeItem('UserType');
    sessionStorage.removeItem('UserID');
    sessionStorage.removeItem('Age');
    sessionStorage.removeItem('Gender');
    sessionStorage.removeItem('MobileNumber');
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <SuperAdminSidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        handleLogout={handleLogout} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="bg-white border-b border-slate-200/80 py-3.5 px-4 md:px-8 flex justify-between items-center z-10 sticky top-0 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="text-slate-700 hover:text-slate-900 md:hidden p-1.5 rounded-md hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Open sidebar"
            >
              <i className="fas fa-bars text-lg"></i>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">SuperAdmin Portal</h1>
                <span className="hidden sm:inline-block text-[11px] font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-full">
                  DPDP Act Compliance
                </span>
              </div>
              <p className="text-[11px] md:text-xs text-slate-500 hidden sm:block">
                Digital Personal Data Protection (DPDP) Act 2023 • Regulatory Governance & Audit Logs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 pl-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-800 leading-tight">{fullName}</span>
                <span className="text-[10px] text-[#00acc1] font-bold uppercase tracking-wider">{userType}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="text-slate-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Logout"
              >
                <i className="fas fa-sign-out-alt"></i>
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-3.5 md:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default SuperAdminLayout;
