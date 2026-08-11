import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function About() {
  return (
    <div className=" min-h-screen">
      {/* Breadcrumb section */}
      <div className="pt-1 pb-4">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-2xl font-bold text-[#233560]">About us</h1>
            <div className="text-sm font-semibold text-gray-500 mt-2 md:mt-0">
              <Link to="/" className="text-[#0F847E] hover:underline">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700">About us</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* Hero Image */}
        <div className="relative mb-12 rounded-xl overflow-hidden shadow-lg">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="w-full h-auto"
          >
            <SwiperSlide>
              <img src="https://xraidigital.com/Content/images/slider/About%20US%20banner1.jpg" alt="Family with health expert" className="w-full h-[500px] object-fill" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="https://xraidigital.com/Content/images/slider/6.jpg" alt="Diagnostics" className="w-full h-[500px] object-fill" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="https://xraidigital.com/Content/images/slider/5.jpg" alt="Care" className="w-full  h-[500px] object-fill" />
            </SwiperSlide>
          </Swiper>
        </div>

        {/* Vision & Mission */}
        <div className="mb-20 mt-10">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="h-px w-8 bg-gray-400"></span>
              <span className="text-[#11A8A4] font-semibold text-sm tracking-widest uppercase">Our Purpose</span>
              <span className="h-px w-8 bg-gray-400"></span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#112a46] mb-4">
              Vision <span className="text-[#11A8A4]">&</span> Mission
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm">
              At Xrai Digital, we aim to revolutionize healthcare by delivering advanced, reliable diagnostics to your doorstep. Combining cutting-edge technology with expert medical technicians, we ensure accurate, efficient, and convenient services for all.
            </p>
          </div>

          <div className="flex flex-col xl:flex-row gap-6">
            {/* Vision Card */}
            <div className="flex-1 bg-[#f8fbfa] rounded-2xl overflow-hidden flex shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all border border-gray-100">
              {/* Left Color Bar */}
              <div className="w-10 md:w-12 bg-[#11A8A4] shrink-0"></div>
              
              <div className="p-6 md:p-8 flex-1">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8">
                  {/* Icon Circle */}
                  <div className="w-20 h-20 rounded-full bg-[#11A8A4] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#0F847E]/30">
                    <i className="fa-solid fa-eye text-3xl"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#11A8A4] mb-3">Vision</h3>
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                     Our goal is to empower individuals with seamless, home-based healthcare using state-of-the-art diagnostics and patient-centered care, setting new standards in convenience and quality.
                    </p>
                  </div>
                </div>
                
                <hr className="border-gray-200 mb-6" />
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-bullseye text-[#0F847E] text-lg mt-0.5"></i>
                    <div>
                      <h4 className="font-bold text-[#112a46] text-xs mb-1">Accuracy</h4>
                      <p className="text-[11px] text-gray-500 font-semibold leading-tight">Precise results you can trust</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <i className="fa-regular fa-lightbulb text-[#0F847E] text-lg mt-0.5"></i>
                    <div>
                      <h4 className="font-bold text-[#112a46] text-xs mb-1">Innovation</h4>
                      <p className="text-[11px] text-gray-500 font-semibold leading-tight">Advanced technology for better care</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-hand-holding-heart text-[#0F847E] text-lg mt-0.5"></i>
                    <div>
                      <h4 className="font-bold text-[#112a46] text-xs mb-1">Impact</h4>
                      <p className="text-[11px] text-gray-500 font-semibold leading-tight">Improving lives every day</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Card */}
            <div className="flex-1 bg-[#f8fbfa] rounded-2xl overflow-hidden flex shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all border border-gray-100">
              {/* Left Color Bar */}
              <div className="w-10 md:w-12 bg-[#11A8A4] shrink-0"></div>
              
              <div className="p-6 md:p-8 flex-1">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8">
                  {/* Icon Circle */}
                  <div className="w-20 h-20 rounded-full bg-[#11A8A4] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#0F847E]/30">
                    <i className="fa-solid fa-mountain-sun text-3xl"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#11A8A4] mb-3">Mission</h3>
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                      To empower individuals with seamless, home-based healthcare using state-of-the-art diagnostics and patient-centered care.
                    </p>
                  </div>
                </div>
                
                <hr className="border-gray-200 mb-6" />
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-house-medical text-[#0F847E] text-lg mt-0.5"></i>
                    <div>
                      <h4 className="font-bold text-[#112a46] text-xs mb-1">Accessible Care</h4>
                      <p className="text-[11px] text-gray-500 font-semibold leading-tight">Healthcare at your doorstep</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-microscope text-[#0F847E] text-lg mt-0.5"></i>
                    <div>
                      <h4 className="font-bold text-[#112a46] text-xs mb-1">Advanced Diagnostics</h4>
                      <p className="text-[11px] text-gray-500 font-semibold leading-tight">State-of-the-art technology</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-users text-[#0F847E] text-lg mt-0.5"></i>
                    <div>
                      <h4 className="font-bold text-[#112a46] text-xs mb-1">Patient First</h4>
                      <p className="text-[11px] text-gray-500 font-semibold leading-tight">Care that puts you first</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meet The Team */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#233560] mb-2">Meet The Team</h1>
          <h2 className="text-2xl font-semibold text-[#11A8A4] mb-6">Leadership</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-sm leading-relaxed mb-8">
            Our leadership team comprises of some of the best minds and hearts in the healthcare industry.
            They have come together to make quick and reliable home diagnostics possible for everyone.
            They aim to deliver trust, care, and a promise of excellence in every diagnosis. Together,
            they envision a future where accessible, high-quality healthcare is the norm, not the exception.
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-60 text-center transform transition hover:scale-105 hover:cursor-pointer">
              <img src="https://xraidigital.com/Content/images/team/CEO.png" alt="Partha Dey" className="w-full h-56 object-fill" />
              <div className="p-4">
                <h4 className="font-bold text-gray-800 text-lg">Partha Dey</h4>
                <p className="text-sm text-[#11A8A4] font-semibold mt-1">Founder & CEO</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-60 text-center transform transition hover:scale-105 hover:cursor-pointer">
              <img src="https://xraidigital.com/Content/images/team/Director.png" alt="Dr Vivek Sahi" className="w-full h-56 object-fill" />
              <div className="p-4">
                <h4 className="font-bold text-gray-800 text-lg">Dr Vivek Sahi</h4>
                <p className="text-sm text-[#11A8A4] font-semibold mt-1">Managing Director</p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Team */}
        <div className="text-center mb-16">
          <h2 className="text-2xl font-semibold text-[#11A8A4] mb-6">Core Team</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-sm leading-relaxed mb-8">
            The core team at U4RAD Technologies brings a unique blend of expertise and experience,
            driving innovation in healthcare. With a strong background in healthcare operations management,
            product development, technician training, and pre-sales functions, the team ensures smooth and
            efficient execution across all verticals.
          </p>
          
          <div className="flex flex-wrap justify-center gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-60 text-center transform transition hover:scale-105 hover:cursor-pointer">
              <img src="https://xraidigital.com/Content/images/team/Ruchi_mam.jpg" alt="Dr. Ruchi Jangra" className="w-full h-56 object-fill" />
              <div className="p-4">
                <h4 className="font-bold text-gray-800 text-md">Dr. Ruchi Jangra</h4>
                <p className="text-xs text-[#11A8A4] font-semibold mt-1">Manager - Business Operations and Founder’s office representative</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-60 text-center transform transition hover:scale-105 hover:cursor-pointer">
              <img src="https://xraidigital.com/Content/images/team/ManagerPreSales.png" alt="Pooja Singh" className="w-full h-56 object-fill" />
              <div className="p-4">
                <h4 className="font-bold text-gray-800 text-md">Pooja Singh</h4>
                <p className="text-xs text-[#11A8A4] font-semibold mt-1">Manager - Product and Pre-Sales</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-60 text-center transform transition hover:scale-105 hover:cursor-pointer">
              <img src="https://xraidigital.com/Content/images/team/Captain.png" alt="Aradhana Dutt" className="w-full h-56 object-fill" />
              <div className="p-4">
                <h4 className="font-bold text-gray-800 text-md">Aradhana Dutt</h4>
                <p className="text-xs text-[#11A8A4] font-semibold mt-1">Captain - New Initiatives</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-60 text-center transform transition hover:scale-105 hover:cursor-pointer">
              <img src="https://xraidigital.com/Content/images/team/BD.png" alt="Mr Dipanjan Paul" className="w-full h-56 object-fill" />
              <div className="p-4">
                <h4 className="font-bold text-gray-800 text-md">Mr Dipanjan Paul</h4>
                <p className="text-xs text-[#11A8A4] font-semibold mt-1">Strategy & BD</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
