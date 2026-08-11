import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

function PatientLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const userType = sessionStorage.getItem('UserType');
    if (userType !== 'Patient') {
      navigate('/login');
      return;
    }
    const storedName = sessionStorage.getItem('FullName') || sessionStorage.getItem('UserName') || 'Patient';
    setUserName(storedName);
  }, [navigate]);

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return isActive 
      ? "flex items-center px-4 py-3 bg-[#11A8A4] text-white rounded-lg shadow-sm"
      : "flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors";
  };

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
      <div className="w-64 bg-[#233560] text-white hidden md:flex flex-col shadow-xl z-40 sticky top-0 h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Patient Panel</h2>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link to="/patient/dashboard" className={`flex items-center mt-2 transition-colors ${getLinkClass('/patient/dashboard')}`}>
            <i className="fas fa-home mr-4 w-5 text-center"></i>
            <span className="font-medium">Patient Dashboard</span>
          </Link>
          
          <Link to="/patient/book-slot" className={`mt-2 ${getLinkClass('/patient/book-slot')}`}>
            <i className="fas fa-calendar-alt mr-4 w-5 text-center"></i>
            <span className="font-medium">Book</span>
          </Link>
        </nav>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-transparent z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar (Right Side) */}
      <div className={`fixed inset-y-0 right-0 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} w-64 bg-[#233560] text-white z-50 transition-transform duration-300 ease-in-out md:hidden flex flex-col shadow-2xl`}>
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-300 hover:text-white focus:outline-none">
            <i className="fas fa-times text-2xl"></i>
          </button>
          <h2 className="text-xl font-bold">Patient Panel</h2>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link to="/patient/dashboard" onClick={() => setIsSidebarOpen(false)} className={`mt-2 ${getLinkClass('/patient/dashboard')}`}>
            <i className="fas fa-home mr-4 w-5 text-center"></i>
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link to="/patient/book-slot" onClick={() => setIsSidebarOpen(false)} className={`mt-2 ${getLinkClass('/patient/book-slot')}`}>
            <i className="fas fa-calendar-alt mr-4 w-5 text-center"></i>
            <span className="font-medium">Book</span>
          </Link>
          <button onClick={handleLogout} className="w-full text-left mt-4 flex items-center px-4 py-2 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg transition-colors">
            <i className="fas fa-sign-out-alt mr-4 w-5 text-center"></i>
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
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

export default PatientLayout;

