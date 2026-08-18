import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { partnerNavLinks } from './partnerNavLinks';

function PartnerSidebar({ isSidebarOpen, setIsSidebarOpen, handleLogout }) {
  const location = useLocation();

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return isActive 
      ? "flex items-center px-4 py-3 bg-[#11A8A4] text-white rounded-lg shadow-sm"
      : "flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors";
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="w-64 shrink-0 bg-[#233560] text-white hidden md:flex flex-col shadow-xl z-40 sticky top-0 h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Partner Panel</h2>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {partnerNavLinks.map((link, index) => (
            <Link 
              key={index} 
              to={link.path} 
              className={`mt-2 ${getLinkClass(link.path)}`}
            >
              <i className={`${link.icon} mr-4 w-5 text-center`}></i>
              <span className="font-medium">{link.name}</span>
            </Link>
          ))}
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
          <h2 className="text-xl font-bold">Partner Panel</h2>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {partnerNavLinks.map((link, index) => (
            <Link 
              key={index} 
              to={link.path} 
              onClick={() => setIsSidebarOpen(false)}
              className={`mt-2 ${getLinkClass(link.path)}`}
            >
              <i className={`${link.icon} mr-4 w-5 text-center`}></i>
              <span className="font-medium">{link.name}</span>
            </Link>
          ))}
          <button onClick={handleLogout} className="w-full text-left mt-4 flex items-center px-4 py-2 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg transition-colors">
            <i className="fas fa-sign-out-alt mr-4 w-5 text-center"></i>
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
}

export default PartnerSidebar;
