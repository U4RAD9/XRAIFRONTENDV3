import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

function TechnicianLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const isNative = typeof window !== 'undefined' && Boolean(window.Capacitor?.isNativePlatform?.());
    // In native Android APK only, restore from localStorage if process was killed in background
    if (isNative && !sessionStorage.getItem('Token')) {
      const savedToken = localStorage.getItem('Token');
      const savedType = (localStorage.getItem('UserType') || '').toLowerCase();
      if (savedToken && savedType === 'technician') {
        sessionStorage.setItem('Token', savedToken);
        sessionStorage.setItem('UserID', localStorage.getItem('UserID') || '');
        sessionStorage.setItem('UserName', localStorage.getItem('UserName') || '');
        sessionStorage.setItem('FullName', localStorage.getItem('FullName') || '');
        sessionStorage.setItem('UserType', 'technician');
      }
    }

    const token = sessionStorage.getItem('Token');
    const userType = (sessionStorage.getItem('UserType') || '').toLowerCase();
    if (!token || userType !== 'technician') {
      sessionStorage.clear();
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-[#233560]">
              Welcome {sessionStorage.getItem('FullName') || sessionStorage.getItem('UserName')}
            </h1>
            <button
              onClick={() => {
                sessionStorage.clear();
                localStorage.removeItem('Token');
                localStorage.removeItem('UserType');
                window.location.href = '/login';
              }}
              className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 cursor-pointer"
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export default TechnicianLayout;
