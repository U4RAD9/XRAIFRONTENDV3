import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { superadminNavLinks } from './superadminNavLinks';

function SuperAdminSidebar({ isSidebarOpen = false, setIsSidebarOpen = () => {}, handleLogout = () => {} }) {
  const location = useLocation();
  const fullName = sessionStorage.getItem('FullName') || 'Super Administrator';
  const userName = sessionStorage.getItem('UserName') || 'superadmin';

  const getLinkClass = (path) => {
    const isActive = location.pathname === path || (path === '/superadmin/consents' && (location.pathname === '/superadmin' || location.pathname === '/superadmin/dashboard'));
    return isActive 
      ? "flex items-center px-4 py-3 bg-[#00acc1] text-white rounded-lg shadow-sm font-medium transition-all"
      : "flex items-center px-4 py-2.5 text-gray-300 hover:bg-[#1a294d] hover:text-white rounded-lg transition-colors";
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="w-64 shrink-0 bg-[#233560] text-white hidden md:flex flex-col shadow-xl z-20 sticky top-0 h-screen border-r border-[#1a294d]">
        <div className="p-4 border-b border-gray-700/60 flex flex-col items-center justify-center shrink-0 bg-[#1c2c52]">
          <img src="/Content/xraiLogo.png" alt="XRAi Logo" className="h-10 w-full object-contain" />
          <div className="mt-2.5 px-3 py-0.5 text-[11px] font-semibold tracking-wider uppercase rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Super Admin
          </div>
        </div>

        <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Governance & Privacy
          </div>
          {superadminNavLinks.map((link, index) => {
            return (
              <Link 
                key={index} 
                to={link.path} 
                className={getLinkClass(link.path)}
              >
                <i className={`${link.icon} mr-3 w-5 text-center text-sm`}></i> 
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout in Sidebar Footer */}
        <div className="p-3.5 border-t border-gray-700/60 bg-[#1c2c52]/80">
          <div className="flex items-center gap-2.5 mb-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-[#00acc1]/20 border border-[#00acc1]/40 flex items-center justify-center text-[#00acc1] font-bold text-xs shrink-0">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{fullName}</p>
              <p className="text-[11px] text-gray-400 truncate">{userName}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-red-300 hover:text-white bg-red-900/20 hover:bg-red-700/50 rounded-lg transition-colors border border-red-500/30"
          >
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar Drawer */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-72 bg-[#233560] text-white z-50 transition-transform duration-300 ease-in-out md:hidden flex flex-col shadow-2xl`}>
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-[#1c2c52]">
          <div className="flex items-center gap-2">
            <img src="/Content/xraiLogo.png" alt="XRAi Logo" className="h-8 object-contain" />
            <span className="text-[11px] font-bold text-cyan-300 bg-cyan-900/40 px-2 py-0.5 rounded border border-cyan-500/40">SUPERADMIN</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="text-gray-300 hover:text-white p-1 rounded-md hover:bg-gray-700/50"
            aria-label="Close menu"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Governance & Privacy
          </div>
          {superadminNavLinks.map((link, index) => (
            <Link 
              key={index} 
              to={link.path} 
              onClick={() => setIsSidebarOpen(false)}
              className={getLinkClass(link.path)}
            >
              <i className={`${link.icon} mr-3 w-5 text-center`}></i> 
              <span>{link.name}</span>
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-700 mt-4">
            <button 
              onClick={handleLogout} 
              className="w-full text-left flex items-center px-4 py-2.5 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors font-medium text-sm"
            >
              <i className="fas fa-sign-out-alt mr-3 w-5 text-center"></i>
              Logout
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}

export default SuperAdminSidebar;
