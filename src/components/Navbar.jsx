import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <header className="header_area w-full z-50 sticky top-0 bg-white">
      {/* Top Bar (Hidden on small screens) */}
      <div className="bg-[#233560] text-white py-1 md:py-2 hidden md:block">
        <div className="container mx-auto px-2 md:px-10">
          <div className="flex flex-row justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <a href="tel:-18002702900" className="flex items-center hover:text-[#00acc1]">
                <i className="fas fa-phone mr-2"></i>
                <span>18002702900</span>
              </a>
              <a href="mailto:info@xraidigital.com" className="flex items-center hover:text-[#00acc1]">
                <i className="fas fa-envelope mr-2"></i>
                <span>info@xraidigital.com</span>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="hover:text-[#00acc1]"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" className="hover:text-[#00acc1]"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="hover:text-[#00acc1]"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Navbar */}
      <div className="bg-white shadow-md relative z-50">
        <div className="container mx-auto px-2 md:px-10">
          <div className="flex justify-between items-center py-2 md:py-4">
            {/* Logo */}
            <div className="logo z-50 relative">
              <Link to="/" onClick={closeSidebar}>
                <img src="https://xraidigital.com/Content/images/logo.png" alt="logo" className="h-10 md:h-12" /> 
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex flex-1 justify-center items-center space-x-6 font-semibold text-gray-700 uppercase text-sm">
              <NavLink to="/" className={({ isActive }) => isActive ? "text-[#00acc1]" : "hover:text-[#00acc1]"} end>Home</NavLink>
              <NavLink to="/about" className={({ isActive }) => isActive ? "text-[#00acc1]" : "hover:text-[#00acc1]"}>About</NavLink>
              <NavLink to="/corporate" className={({ isActive }) => isActive ? "text-[#00acc1]" : "hover:text-[#00acc1]"}>Corporate</NavLink>
              <NavLink to="/services" className={({ isActive }) => isActive ? "text-[#00acc1]" : "hover:text-[#00acc1]"}>Services</NavLink>
              <NavLink to="/partners" className={({ isActive }) => isActive ? "text-[#00acc1]" : "hover:text-[#00acc1]"}>Partners</NavLink>
              <NavLink to="/contact-us" className={({ isActive }) => isActive ? "text-[#00acc1]" : "hover:text-[#00acc1]"}>Contact Us</NavLink>
            </div>

            {/* Desktop Login Button */}
            <div className="hidden lg:flex items-center space-x-4 font-semibold uppercase text-sm">
              <Link to="/login" className="bg-[#11A8A4] text-white px-4 py-2 rounded shadow hover:bg-[#0F847E] transition-colors">LOGIN & BOOK +</Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button 
              className="lg:hidden text-gray-700 hover:text-[#00acc1] focus:outline-none z-50 relative"
              onClick={toggleSidebar}
              aria-label="Toggle navigation"
            >
              <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'} text-2xl transition-transform duration-300`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300" 
          onClick={closeSidebar}
        ></div>
      )}

      {/* Mobile Sidebar Menu */}
      <div 
        className={`fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col pt-24 pb-8 px-6 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col space-y-6 font-semibold text-gray-700 uppercase text-sm flex-grow">
          <NavLink to="/" onClick={closeSidebar} className={({ isActive }) => isActive ? "text-[#00acc1]" : "hover:text-[#00acc1]"}>Home</NavLink>
          <NavLink to="/about" onClick={closeSidebar} className={({ isActive }) => isActive ? "text-[#00acc1]" : "hover:text-[#00acc1]"}>About</NavLink>
          <NavLink to="/corporate" onClick={closeSidebar} className={({ isActive }) => isActive ? "text-[#00acc1]" : "hover:text-[#00acc1]"}>Corporate</NavLink>
          <NavLink to="/services" onClick={closeSidebar} className={({ isActive }) => isActive ? "text-[#00acc1]" : "hover:text-[#00acc1]"}>Services</NavLink>
          <NavLink to="/partners" onClick={closeSidebar} className={({ isActive }) => isActive ? "text-[#00acc1]" : "hover:text-[#00acc1]"}>Partners</NavLink>
          <NavLink to="/contact-us" onClick={closeSidebar} className={({ isActive }) => isActive ? "text-[#00acc1]" : "hover:text-[#00acc1]"}>Contact Us</NavLink>
          
          <hr className="border-gray-100 my-4" />
          
          <Link to="/login" onClick={closeSidebar} className="bg-[#11A8A4] text-white px-4 py-3 rounded text-center shadow hover:bg-[#0F847E] transition-colors mt-4">
            LOGIN & BOOK +
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
