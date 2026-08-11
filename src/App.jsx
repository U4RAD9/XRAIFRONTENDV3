import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import AdminLayout from './employee/components/AdminLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Registration from './pages/Registration';
import AdminDashboard from './employee/pages/AdminDashboard';
import PatientDashboard from './patients/pages/PatientDashboard';
import PatientLayout from './patients/components/PatientLayout';
import Pricing from './pages/Pricing';
import Corporate from './pages/Corporate';
import SlotBooking from './patients/pages/SlotBooking';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import Services from './pages/Services';
import Partners from './pages/Partners';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AdminLocations from './employee/pages/AdminLocations';
import AdminServiceGroups from './employee/pages/AdminServiceGroups';
import AdminServices from './employee/pages/AdminServices';
import AdminPriceRateMaster from './employee/pages/AdminPriceRateMaster';
import AdminOffersMaster from './employee/pages/AdminOffersMaster';
import AdminSlotMaster from './employee/pages/AdminSlotMaster';

// Set up global Axios interceptor for Authentication
axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('Token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="corporate" element={<Corporate />} />
          <Route path="about" element={<About />} />
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="services" element={<Services />} />
          <Route path="partners" element={<Partners />} />
          <Route path="terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Registration />} />
        </Route>

        <Route path="/patient" element={<PatientLayout />}>
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="book-slot" element={<SlotBooking />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="locations" element={<AdminLocations />} />
          <Route path="service-groups" element={<AdminServiceGroups />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="price-rate-master" element={<AdminPriceRateMaster />} />
          <Route path="offers-master" element={<AdminOffersMaster />} />
          <Route path="slot-master" element={<AdminSlotMaster />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
