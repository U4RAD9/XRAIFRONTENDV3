import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';

function ConsultantLayout() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [fullName, setFullName] = useState('');
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'error'
  const [lastSaved, setLastSaved] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('Token');
    const uType = (sessionStorage.getItem('UserType') || '').toLowerCase();
    
    // Auth check
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    if (uType !== 'consultant' && uType !== 'admin' && uType !== 'superadmin') {
      // If patient, partner, technician tries to access consultant portal
      navigate('/login', { replace: true });
      return;
    }

    setUserName(sessionStorage.getItem('UserName') || 'Consultant');
    setFullName(sessionStorage.getItem('FullName') || sessionStorage.getItem('UserName') || 'Clinical Consultant');

    // Custom window event listener for real-time save status updates
    const handleSaveEvent = (e) => {
      if (e.detail?.status) {
        setSaveStatus(e.detail.status);
      }
      if (e.detail?.time) {
        setLastSaved(e.detail.time);
      }
    };
    window.addEventListener('consultant-save-status', handleSaveEvent);
    return () => window.removeEventListener('consultant-save-status', handleSaveEvent);
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f7] text-[#1b2a2f]">
      {/* Top Application Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#d5dde0] shadow-xs px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand & Portal Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0f6f7a] to-[#5cc0cc] flex items-center justify-center text-white shadow-xs">
            <i className="fas fa-user-md text-base"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base md:text-lg text-[#1b2a2f] tracking-tight">
                XRAi Digital
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#dff0f2] text-[#0f6f7a] border border-[#0f6f7a]/20">
                Consultant Portal
              </span>
            </div>
            <p className="text-[11px] text-[#5b6c72] hidden sm:block">
              Clinical Assessment & Case Evaluation Engine
            </p>
          </div>
        </div>

        {/* Right side: Save indicator, User info, Logout */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Live Cloud Save Indicator */}
          <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg bg-[#f4f6f7] border border-[#d5dde0]">
            {saveStatus === 'saving' ? (
              <>
                <i className="fas fa-spinner fa-spin text-[#0f6f7a]"></i>
                <span className="text-[#0f6f7a]">Saving to server...</span>
              </>
            ) : saveStatus === 'error' ? (
              <>
                <i className="fas fa-exclamation-circle text-rose-600"></i>
                <span className="text-rose-600">Offline (saved locally)</span>
              </>
            ) : (
              <>
                <i className="fas fa-check-circle text-emerald-600"></i>
                <span className="text-[#5b6c72]">
                  {lastSaved ? `Saved (${lastSaved})` : 'All changes saved to backend'}
                </span>
              </>
            )}
          </div>

          {/* Consultant Profile Badge */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0f6f7a] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
              {fullName ? fullName.charAt(0) : 'C'}
            </div>
            <div className="hidden md:block text-left">
              <span className="text-xs font-bold text-[#1b2a2f] block leading-tight">
                Dr. {fullName}
              </span>
              <span className="text-[10px] text-[#5b6c72] block font-mono">
                @{userName}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-lg transition-colors cursor-pointer"
            title="Sign out of Consultant Portal"
          >
            <i className="fas fa-sign-out-alt text-xs"></i>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Consultant Portal Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default ConsultantLayout;
