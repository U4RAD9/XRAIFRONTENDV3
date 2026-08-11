import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <header className="header_area w-full z-50 sticky top-0 bg-white">
      <div className="bg-[#233560] text-white py-2 hidden md:block">
        <div className="container mx-auto px-10">
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
              {/* <Link to="/employee-login" className="hover:text-[#00acc1] border-l border-gray-500 pl-4 ml-2 ">
                <i className="fa fa-user mr-1"></i> Employee | Partner Log in
              </Link> */}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-10">
          <div className="flex justify-between items-center py-4">
            <div className="logo">
              <Link to="/">
                <img src="https://xraidigital.com/Content/images/logo.png" alt="logo" className="h-12" /> 
              </Link>
            </div>
            <div className="hidden lg:flex flex-1 justify-center items-center space-x-6 font-semibold text-gray-700 uppercase text-sm">
              <NavLink to="/" className={({ isActive }) => isActive ? "text-[#00acc1]" : "hover:text-[#00acc1]"} end>Home</NavLink>
              <NavLink to="/about" className={({ isActive }) => isActive ? "text-[#00acc1]" : "hover:text-[#00acc1]"}>About</NavLink>
              <NavLink to="/corporate" className={({ isActive }) => isActive ? "text-[#00acc1]" : "hover:text-[#00acc1]"}>Corporate</NavLink>
              <NavLink to="/services" className={({ isActive }) => isActive ? "text-[#00acc1]" : "hover:text-[#00acc1]"}>Services</NavLink>
              <NavLink to="/partners" className={({ isActive }) => isActive ? "text-[#00acc1]" : "hover:text-[#00acc1]"}>Partners</NavLink>
              <NavLink to="/contact-us" className={({ isActive }) => isActive ? "text-[#00acc1]" : "hover:text-[#00acc1]"}>Contact Us</NavLink>
            </div>
            <div className="hidden lg:flex items-center space-x-4 font-semibold uppercase text-sm">
              <Link to="/login" className="bg-[#11A8A4] text-white px-4 py-2 rounded shadow hover:bg-[#0F847E]">LOGIN & BOOK +</Link>
              {/* <Link to="/register" className="border border-[#00acc1] text-[#00acc1] px-4 py-2 rounded shadow hover:bg-gray-50">Sign Up</Link> */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
