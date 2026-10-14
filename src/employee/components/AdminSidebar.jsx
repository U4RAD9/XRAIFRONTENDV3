import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { adminNavLinks } from './adminNavLinks';

function AdminSidebar({ isSidebarOpen = false, setIsSidebarOpen = () => {}, handleLogout = () => {} }) {
  const location = useLocation();

  const getLinkClass = (path) => {
    if (path === '#') {
      return "flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors";
    }
    const isActive = location.pathname.startsWith(path);
    return isActive 
      ? "flex items-center px-4 py-3 bg-[#00acc1] text-white rounded-lg shadow-sm"
      : "flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors";
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="w-64 shrink-0 bg-[#233560] text-white hidden md:flex flex-col shadow-xl z-10 sticky top-0 h-screen">
        <div className="p-2 border-b border-gray-700 flex flex-col items-center justify-center shrink-0">
          <img src="/Content/xraiLogo.png" alt="XRAi Logo" className="h-[48px] w-full object-contain" />
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {adminNavLinks.map((link, index) => {
            return (
              <Link 
                key={index} 
                to={link.path} 
                className={`${getLinkClass(link.path)} ${link.name === 'Dashboard' ? 'mt-2' : ''}`}
              >
                <i className={`${link.icon} mr-3 w-5 text-center`}></i> 
                <span className={link.name === 'Dashboard' ? 'font-medium' : ''}>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 bg-[#233560] text-white z-50 transition-transform duration-300 ease-in-out md:hidden flex flex-col shadow-2xl`}>
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <img src="/Content/xraiLogo.png" alt="XRAi Logo" className="h-8 object-contain" />
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-300 hover:text-white focus:outline-none">
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {adminNavLinks.map((link, index) => (
            <Link 
              key={index} 
              to={link.path} 
              onClick={() => setIsSidebarOpen(false)}
              className={`${getLinkClass(link.path)} ${link.name === 'Dashboard' ? 'mt-2' : ''}`}
            >
              <i className={`${link.icon} mr-3 w-5 text-center`}></i> 
              <span className={link.name === 'Dashboard' ? 'font-medium' : ''}>{link.name}</span>
            </Link>
          ))}
          <button onClick={handleLogout} className="w-full text-left mt-4 flex items-center px-4 py-2 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg transition-colors">
            <i className="fas fa-sign-out-alt mr-3 w-5 text-center"></i>
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
}

export default AdminSidebar;
