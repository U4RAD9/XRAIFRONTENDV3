import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

function Layout() {
  const navigate = useNavigate();

  useEffect(() => {
    const userType = sessionStorage.getItem('UserType');
    if (userType === 'Admin') {
      navigate('/admin/dashboard', { replace: true });
    } else if (userType === 'Patient') {
      navigate('/patient/dashboard', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-3">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
