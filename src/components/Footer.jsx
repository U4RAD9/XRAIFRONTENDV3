import { Link } from 'react-router-dom';

function Footer() {
  const scrollToTop = () => window.scrollTo(0, 0);

  return (
    <footer className="footer_area bg-[#233560] text-white pt-12 pb-6 mt-auto">
      <div className="container mx-auto px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="footer_widget">
            <div className="logo_before mb-4">
              <img src="https://xraidigital.com/Content/images/logo-footer.png" alt="footer logo" className="h-16" />
            </div>
            <p className="mb-4">Experience safe and reliable diagnostic services at comfort of your home with XRAi Digital</p>
            <div className="footer_social_menu mb-6 flex gap-2">
                <a className="bg-[#0F847E] w-8 h-8 rounded-full flex items-center justify-center text-white" target="_blank" rel="noreferrer" href="https://www.facebook.com/XRAi.Digital"><i className="fab fa-facebook-f"></i></a>
                <a className="bg-[#0F847E] w-8 h-8 rounded-full flex items-center justify-center text-white" target="_blank" rel="noreferrer" href="https://instagram.com/xraidigital?utm_medium-copy_link"><i className="fab fa-instagram"></i></a>
                <a className="bg-[#0F847E] w-8 h-8 rounded-full flex items-center justify-center text-white" target="_blank" rel="noreferrer" href="https://www.linkedin.com/company/xrai-digital"><i className="fab fa-linkedin-in"></i></a>
            </div>
            
            <div className="font-semibold space-y-3 mt-4 text-sm">
                <div className="flex flex-col space-y-1">
                    <a className="hover:text-gray-300" href="https://u4rad.com/" target="_blank" rel="noreferrer">A Unit of U4RAD Technologies Pvt Ltd,</a>
                    <a className="hover:text-gray-300" href="https://u4rad.com/" target="_blank" rel="noreferrer">CIN Number : U86100HR2024PTC120732</a>
                    <a className="hover:text-gray-300 mt-2 flex items-start" href="https://u4rad.com/" target="_blank" rel="noreferrer">
                        <i className="fa fa-map-pin mt-1 mr-2"></i> 
                        <span>C 406, Nirvana Courtyard, Sec 50, Gurgaon, Haryana, India, 122018,</span>
                    </a>
                    <a className="hover:text-gray-300 mt-2 flex items-center" href="tel:01244254012">
                        <i className="fa fa-phone mr-2"></i> ph 0124 425 4012
                    </a>
                    <a className="hover:text-gray-300 mt-2 flex items-start" href="https://u4rad.com/" target="_blank" rel="noreferrer">
                        <i className="fa fa-map-pin mt-1 mr-2"></i> 
                        <span>Room No W109, IIM Calcutta Innovation Park, IIM Calcutta, Diamond Harbour Road, P.O. Joka, Kolkata- 700104</span>
                    </a>
                </div>

                <div className="mt-6">
                    <p className="mb-2">Grievance / Complaints:</p>
                    <div className="flex flex-col space-y-1">
                        <span className="font-bold">Grievance Officer: Dr. Ruchi Jangra</span>
                        <span>Designation: Manager – Operations</span>
                        <a className="hover:text-gray-300 flex items-center mt-2" href="mailto:drruchi@u4rad.com">
                            <i className="fa fa-envelope mr-2"></i> drruchi@u4rad.com
                        </a>
                        <a className="hover:text-gray-300 flex items-center mt-1" href="tel:+911244254012">
                            <i className="fa fa-phone mr-2"></i> 0124 425 4012
                        </a>
                    </div>
                </div>
            </div>
          </div>
          
          <div className="footer_widget 2xl:pl-12 xl:pl-12 lg:pl-12">
            <h3 className="text-xl font-bold mb-6 border-b border-gray-600 pb-2 inline-block">Home</h3>
            <ul className="space-y-3 font-semibold text-sm">
                <li><Link to="/login" onClick={scrollToTop} className="hover:text-[#91D537] flex items-center"><i className="fa-solid fa-angle-right mr-2 text-[#91D537]"></i> Partner's Login</Link></li>
                <li><Link to="/services" onClick={scrollToTop} className="hover:text-[#91D537] flex items-center"><i className="fa-solid fa-angle-right mr-2 text-[#91D537]"></i> Services</Link></li>
                <li><Link to="/about" onClick={scrollToTop} className="hover:text-[#91D537] flex items-center"><i className="fa-solid fa-angle-right mr-2 text-[#91D537]"></i> About</Link></li>
                <li><Link to="/contact-us" onClick={scrollToTop} className="hover:text-[#91D537] flex items-center"><i className="fa-solid fa-angle-right mr-2 text-[#91D537]"></i> Contact Us</Link></li>
                <li><Link to="/login" onClick={scrollToTop} className="hover:text-[#91D537] flex items-center"><i className="fa-solid fa-angle-right mr-2 text-[#91D537]"></i> Book Your Slot</Link></li>
                <li><Link to="/terms-and-conditions" onClick={scrollToTop} className="hover:text-[#91D537] flex items-center"><i className="fa-solid fa-angle-right mr-2 text-[#91D537]"></i> Terms And Condition</Link></li>
                <li><Link to="/pricing" onClick={scrollToTop} className="hover:text-[#91D537] flex items-center"><i className="fa-solid fa-angle-right mr-2 text-[#91D537]"></i> Pricing</Link></li>
                <li><a href="https://docs.google.com/forms/d/14NQeWLvMBjttijecvVkCggIKkenoZ0lzrOsFPq1bLXM/edit?ts=60c716a9" className="hover:text-[#91D537] flex items-center" target="_blank" rel="noreferrer"><i className="fa-solid fa-angle-right mr-2 text-[#91D537]"></i> Join Us</a></li>
                <li><Link to="/privacy-policy" onClick={scrollToTop} className="hover:text-[#91D537] flex items-center"><i className="fa-solid fa-shield-alt mr-2 text-[#91D537]"></i> Privacy And Policy</Link></li>
            </ul>
          </div>
          
          <div className="footer_widget">
            <h3 className="text-xl font-bold mb-6 border-b border-gray-600 pb-2 inline-block">Services</h3>
            <ul className="space-y-3 font-semibold text-sm">
                <li><Link to="/services" onClick={scrollToTop} className="hover:text-[#91D537] flex items-center"><i className="fa-solid fa-angle-right mr-2 text-[#91D537]"></i> XRAY</Link></li>
                <li><Link to="/services" onClick={scrollToTop} className="hover:text-[#91D537] flex items-center"><i className="fa-solid fa-angle-right mr-2 text-[#91D537]"></i> ECG</Link></li>
                <li><Link to="/services" onClick={scrollToTop} className="hover:text-[#91D537] flex items-center"><i className="fa-solid fa-angle-right mr-2 text-[#91D537]"></i> HOLTER MONITORING</Link></li>
                <li><Link to="/services" onClick={scrollToTop} className="hover:text-[#91D537] flex items-center"><i className="fa-solid fa-angle-right mr-2 text-[#91D537]"></i> SAMPLE COLLECTION</Link></li>
                <li><Link to="/services" onClick={scrollToTop} className="hover:text-[#91D537] flex items-center"><i className="fa-solid fa-angle-right mr-2 text-[#91D537]"></i> HEALTH CHECK UP</Link></li>
                <li><Link to="/services" onClick={scrollToTop} className="hover:text-[#91D537] flex items-center"><i className="fa-solid fa-angle-right mr-2 text-[#91D537]"></i> PFT</Link></li>
            </ul>
          </div>
          
          <div className="footer_widget">
            <h3 className="text-xl font-bold mb-6 border-b border-gray-600 pb-2 inline-block">Mobile App</h3>
            <div>
              <p className="text-gray-300 mb-4 text-sm">Scan the QR code or click below to download</p>
              <div className="bg-white inline-block p-2 rounded-xl mb-4">
                <img src="https://xraidigital.com/Content/images/My_QR_Code_2-1024.png" alt="QR Code" className="w-24 h-24 sm:w-32 sm:h-32" />
              </div>
              <br/>
              <a href="https://play.google.com/store/apps/details?id=com.xraidigital.patient" target="_blank" rel="noreferrer" className="inline-block transition transform hover:scale-105">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="w-32 sm:w-40" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
