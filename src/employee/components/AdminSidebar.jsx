import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { adminNavLinks } from './adminNavLinks';

function AdminSidebar() {
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
    <div className="w-64 shrink-0 bg-[#233560] text-white hidden md:flex flex-col shadow-xl z-10 sticky top-0 h-screen">
      <div className="p-2 border-b border-gray-700 flex flex-col items-center justify-center shrink-0">
        <img src="/Content/xraiLogo.png" alt="XRAi Logo" className="h-[48px] w-full object-contain" />
        {/* <h2 className="mt-3 text-sm font-bold tracking-widest uppercase text-gray-300 drop-shadow-sm">Admin Panel</h2> */}
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
  );
}

export default AdminSidebar;
