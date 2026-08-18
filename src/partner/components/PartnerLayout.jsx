import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import PartnerSidebar from './PartnerSidebar';

function PartnerLayout() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Optionally check if the user is a Partner, or remove check for dummy setup
    /*
    const userType = sessionStorage.getItem('UserType');
    if (userType !== 'Partner') {
      navigate('/login');
      return;
    }
    */
    const storedName = sessionStorage.getItem('FullName') || sessionStorage.getItem('UserName') || 'Partner';
    setUserName(storedName);
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
      <PartnerSidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        handleLogout={handleLogout} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="bg-white shadow-sm py-4 px-6 md:px-8 flex justify-between items-center z-50 sticky top-0">
          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-center w-full">
            <h1 className="text-xl font-bold text-gray-800">Welcome {userName}</h1>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 font-semibold flex items-center transition-colors">
              <i className="fas fa-sign-out-alt mr-2"></i> Logout
            </button>
          </div>
          
          {/* Mobile Header */}
          <div className="flex md:hidden justify-between items-center w-full">
            <div className="text-gray-800 leading-tight">
              Welcome <br />
              <span className="text-[#11A8A4] font-bold">{userName}</span>
            </div>
            <button onClick={() => setIsSidebarOpen(true)} className="text-gray-800 focus:outline-none">
               <i className="fas fa-bars text-2xl"></i>
            </button>
          </div>
        </header>

        <main className="flex-1 2xl:p-8 xl:p-8 lg:p-8 md:p-8 p-2 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default PartnerLayout;
