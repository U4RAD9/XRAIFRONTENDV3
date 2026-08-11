import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function Corporate() {
  return (
    <div className="w-full font-sans  text-[#333]">
      {/* Breadcrumb Header */}
      <div className="pt-1 pb-4 border-gray-200">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold">Corporate</h1>
          <ol className="flex text-sm text-gray-500 mt-2 md:mt-0">
            <li><a href="/" className="text-[#0F847E] hover:underline">Home</a></li>
            <li className="mx-2">/</li>
            <li className="text-gray-800">Corporate</li>
          </ol>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* Banner with absolute button */}
        <div className="relative flex justify-center items-center overflow-hidden mb-8 rounded-lg shadow-md">
          <img src="https://xraidigital.com/Content/images/Corporate%20Top%20Banner.jpg" alt="Corporate Health Testing" className="w-full h-auto block" />
          <a href="#" className="absolute bottom-2 right-2 md:bottom-5 md:right-5 bg-[#11a8a4] hover:bg-[#0F847E] text-white px-4 py-2 md:px-10 md:py-5 text-sm md:text-2xl font-bold rounded shadow-lg transition-colors">
            Pricing Tool
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-between bg-white border border-gray-100 shadow-sm rounded-lg py-5 mb-10">
          <div className="flex-1 min-w-[250px] p-5 flex items-center justify-center md:justify-center gap-4">
            <i className="fa-solid fa-suitcase-medical text-4xl text-[#11A8A4]"></i>
            <div className="flex flex-col text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">10,000+</h2>
              <p className="text-sm font-bold text-gray-500">Camps Conducted</p>
            </div>
          </div>
          <div className="flex-1 min-w-[250px] p-5 flex items-center justify-center md:justify-center gap-4">
            <i className="fa-solid fa-user-check text-4xl text-[#11A8A4]"></i>
            <div className="flex flex-col text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">2,00,000+</h2>
              <p className="text-sm font-bold text-gray-500">Employees Screened</p>
            </div>
          </div>
          <div className="flex-1 min-w-[250px] p-5 flex items-center justify-center md:justify-center gap-4">
            <i className="fa-solid fa-clock-rotate-left text-4xl text-[#11A8A4]"></i>
            <div className="flex flex-col text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">24 hr</h2>
              <p className="text-sm font-bold text-gray-500">Reports Share within 24 hours</p>
            </div>
          </div>
          <div className="flex-1 min-w-[250px] p-5 flex items-center justify-center md:justify-center gap-4">
            <i className="fa-solid fa-map-location-dot text-4xl text-[#11A8A4]"></i>
            <div className="flex flex-col text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">500+</h2>
              <p className="text-sm font-bold text-gray-500">Locations</p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10">
          <div className="flex-1 max-w-[500px] md:mr-5 mb-5 md:mb-0">
            <img src="https://xraidigital.com/Content/images/Corporate%202nd%20image%20from%20top.jpg" alt="Health Screening" className="w-full h-auto rounded-xl shadow-sm" />
          </div>
          <div className="flex-[2] max-w-[600px] text-justify font-bold text-sm text-gray-600 leading-relaxed space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">We Specialise in Corporate Health Screening</h2>
            <p>
              With a proven track record of serving over 100 corporate clients, our meticulously developed screening methodology ensures swift delivery of high-quality outcomes.
            </p>
            <p>
              Rooted in a commitment to excellence in health screening and corporate wellness, specifically offering comprehensive full body check-ups, our services are tailored to meet the exacting standards of companies seeking trustworthy health screening solutions.
            </p>
            <p>
              Central to our approach is the precision in delivering accurate and timely results, customized to the unique requirements of each partnered organization.
            </p>
            <p>
              Recognizing the critical role of proactive health management in corporate environments in different industries, we are dedicated to equipping organizations with the necessary insights to enhance their employees' well-being and in turn grow their businesses with healthier employees. Furthermore, our reach extends beyond corporations to cater to individuals in need of thorough health screening interventions.
            </p>
          </div>
        </div>

        {/* What to Expect */}
        <div className="mb-10">
          <h1 className="text-xl font-bold text-gray-800 mb-5 md:text-left text-center">
            <i className="fa fa-check-circle text-[#0F847E] mr-2"></i> What to Expect
          </h1>
          <div className="flex flex-wrap justify-center gap-5">
            
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex-[1_1_calc(25%-20px)] min-w-[250px] flex flex-col items-center text-center">
              <i className="fa-solid fa-indian-rupee-sign text-[#0F847E] text-4xl mb-4"></i>
              <div className="text-lg font-bold text-gray-800 mb-3">Transparent Pricing</div>
              <div className="text-sm font-bold text-gray-600">
                With our advanced pricing tool, calculate health package pricing based on your needs and number of personnel.
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex-[1_1_calc(25%-20px)] min-w-[250px] flex flex-col items-center text-center">
              <i className="fa-solid fa-clipboard-list text-[#0F847E] text-4xl mb-4"></i>
              <div className="text-lg font-bold text-gray-800 mb-3">Customized Health Packages</div>
              <div className="text-sm font-bold text-gray-600">
                Our advanced diagnostic services are tailored to meet the unique needs of businesses, providing convenience and confidence in health screening outcomes.
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex-[1_1_calc(25%-20px)] min-w-[250px] flex flex-col items-center text-center">
              <i className="fa-solid fa-chart-bar text-[#0F847E] text-4xl mb-4"></i>
              <div className="text-lg font-bold text-gray-800 mb-3">Effortless Booking & Reporting</div>
              <div className="text-sm font-bold text-gray-600">
                We deliver digital detailed reports and insights within 24 hours enabling timely interventions.
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex-[1_1_calc(25%-20px)] min-w-[250px] flex flex-col items-center text-center">
              <i className="fa-solid fa-notes-medical text-[#0F847E] text-4xl mb-4"></i>
              <div className="text-lg font-bold text-gray-800 mb-3">One Stop for Health and Wellness</div>
              <div className="text-sm font-bold text-gray-600">
                Beyond health tests, we specialize in delivering comprehensive educational programs and wellness services, tailored to support long-term well-being and sustainability
              </div>
            </div>

          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-10 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-sm font-bold text-gray-800">
              <strong>XRAi Digital</strong> is India’s first healthtech startup that has disrupted the country’s healthcare delivery system by digitalizing diagnostic services. They bring access to non-pathology tests at the point of patient care and organize several pan-India health camps for industry-wide organizations.
            </p>
          </div>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className="rounded-lg shadow-lg overflow-hidden pb-12"
          >
            {[
              "Corporate1.jpg",
              "Corporate2.jpg",
              "Meghalaya%20.jpg",
              "Meghalaya_3.jpg",
              "Meghalaya_4.jpg",
              "IMG-20240905-WA0015.jpg",
              "IMG-20240905-WA0022.jpg",
              "IMG-20240905-WA0073.jpg",
              "IMG-20240905-WA0079.jpg",
              "IMG-20240905-WA0084.jpg"
            ].map((img, index) => (
              <SwiperSlide key={index}>
                <img src={`https://xraidigital.com/Content/images/${img}`} alt={`Corporate Event ${index + 1}`} className="w-full max-h-[500px] object-cover" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-5 my-10 px-4">
          <a href="/login" className="bg-[#11A8A4] hover:bg-[#0F847E] text-white px-8 py-4 rounded font-semibold transition-colors flex items-center gap-2">
            Pricing Tool
          </a>
          <a href="tel:-18002702900" className="bg-[#11A8A4] hover:bg-[#0F847E] text-white px-8 py-4 rounded font-semibold transition-colors flex items-center gap-2">
            Get A Quote
          </a>
        </div>

      </div>
    </div>
  );
}

export default Corporate;
