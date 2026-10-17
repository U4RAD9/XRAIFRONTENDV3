import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, NavLink, Link } from 'react-router-dom';

function ConsultantAdminLayout() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('Token');
    const role = (sessionStorage.getItem('UserType') || '').toLowerCase();

    // Strictly enforce Consultant Admin role isolation
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    if (role !== 'consultant admin' && role !== 'consultantadmin' && role !== 'consultant_admin') {
      // Disallow standard Admin, SuperAdmin, Patient, Technician, etc. from accessing this dedicated portal
      navigate('/login', { replace: true });
      return;
    }

    setUserName(sessionStorage.getItem('UserName') || 'admin');
    setFullName(sessionStorage.getItem('FullName') || sessionStorage.getItem('UserName') || 'Consultant Admin');
    setUserType(sessionStorage.getItem('UserType') || 'Consultant Admin');
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login', { replace: true });
  };

  const navItems = [
    {
      to: '/consultant-admin/evaluations',
      label: 'Submissions & Evaluations',
      icon: 'fas fa-clipboard-check',
      description: 'Track doctor answers, review dossiers & exports'
    },
    {
      to: '/consultant-admin/doctors',
      label: 'Consultant Doctors',
      icon: 'fas fa-user-md',
      description: 'Manage doctor logins, accounts & credentials'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0f172a] font-sans antialiased">
      {/* Top Application Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] px-4 md:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand & Portal Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <i className="fas fa-stethoscope text-lg"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base md:text-lg text-slate-900 tracking-tight">
                  XRAi Digital
                </span>
                <span className="text-[11px] font-bold tracking-wide px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-xs">
                  Consultant Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Clinical Examinations Governance • Answer Auditing • Doctor Management
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2 bg-slate-100/90 p-1 rounded-xl border border-slate-200/70">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-white text-indigo-600 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`
                }
              >
                <i className={`${item.icon} text-xs`}></i>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Header Area: Profile + Logout + Mobile Hamburger */}
          <div className="flex items-center gap-3">
            {/* User Profile Badge */}
            <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                {fullName ? fullName.charAt(0) : 'A'}
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-800 block leading-tight">
                  {fullName}
                </span>
                <span className="text-[10px] text-indigo-600 font-semibold block uppercase tracking-wider">
                  {userType}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200/80 hover:border-rose-600 rounded-lg transition-all duration-150 cursor-pointer shadow-xs"
              title="Sign out of Consultant Admin Portal"
            >
              <i className="fas fa-sign-out-alt text-xs"></i>
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-base`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-200 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <i className={`${item.icon} text-sm w-4`}></i>
                <div>
                  <div className="font-bold">{item.label}</div>
                  <div className="text-[10px] text-slate-500 font-normal">{item.description}</div>
                </div>
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {/* Main Consultant Admin View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Minimalistic Footer */}
      <footer className="border-t border-slate-200 bg-white/60 py-3 px-4 text-center text-xs text-slate-400">
        XRAi Digital • Dedicated Consultant Admin Operations • All Activities & Clinical Submissions Tracked
      </footer>
    </div>
  );
}

export default ConsultantAdminLayout;
