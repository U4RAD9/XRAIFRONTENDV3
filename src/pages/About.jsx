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
              <img src="/images/parthadey.jpg" alt="Partha Dey" className="w-full h-56 object-fill" />
              <div className="p-4">
                <h4 className="font-bold text-gray-800 text-lg">
                  <a href="https://linkedin.com/in/partha-dey-8519a88" target="_blank" rel="noopener noreferrer" className="hover:text-[#11A8A4] transition-colors">Partha Dey</a>
                </h4>
                <p className="text-sm text-[#11A8A4] font-semibold mt-1">Founder & CEO</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-60 text-center transform transition hover:scale-105 hover:cursor-pointer">
              <img src="/images/viveksahi.jpg" alt="Dr Vivek Sahi" className="w-full h-56 object-fill" />
              <div className="p-4">
                <h4 className="font-bold text-gray-800 text-lg">
                  <a href="https://linkedin.com/in/drviveksahi" target="_blank" rel="noopener noreferrer" className="hover:text-[#11A8A4] transition-colors">Dr Vivek Sahi</a>
                </h4>
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
              <img src="/images/pooja.png" alt="Pooja Singh" className="w-full h-56 object-fill" />
              <div className="p-4">
                <h4 className="font-bold text-gray-800 text-md">Pooja Singh</h4>
                <p className="text-xs text-[#11A8A4] font-semibold mt-1">Manager - Product and Pre-Sales</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-60 text-center transform transition hover:scale-105 hover:cursor-pointer">
              <img src="/images/aradhna.png" alt="Aradhana Dutt" className="w-full h-56 object-fill" />
              <div className="p-4">
                <h4 className="font-bold text-gray-800 text-md">Aradhana Dutt</h4>
                <p className="text-xs text-[#11A8A4] font-semibold mt-1">Captain - New Initiatives</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-60 text-center transform transition hover:scale-105 hover:cursor-pointer">
              <img src="/images/aakash.jpeg" alt="Aakash Dwivedi" className="w-full h-56 object-fill" />
              <div className="p-4">
                <h4 className="font-bold text-gray-800 text-md">
                  <a href="https://www.linkedin.com/in/akash-d-96174318b" target="_blank" rel="noopener noreferrer" className="hover:text-[#11A8A4] transition-colors">Aakash Dwivedi</a>
                </h4>
                <p className="text-xs text-[#11A8A4] font-semibold mt-1">Team Lead -IT</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-60 text-center transform transition hover:scale-105 hover:cursor-pointer">
              <img src="/images/seema.jpeg" alt="Seema Singh" className="w-full h-56 object-fill" />
              <div className="p-4">
                <h4 className="font-bold text-gray-800 text-md">
                  <a href="https://www.linkedin.com/in/seemakapur6" target="_blank" rel="noopener noreferrer" className="hover:text-[#11A8A4] transition-colors">Seema Kapur</a>
                </h4>
                <p className="text-xs text-[#11A8A4] font-semibold mt-1">Head Retail Operations PAN India</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-60 text-center transform transition hover:scale-105 hover:cursor-pointer">
              <img src="/images/manas.jpeg" alt="Manas Bid" className="w-full h-56 object-fill" />
              <div className="p-4">
                <h4 className="font-bold text-gray-800 text-md">
                  <a href="https://www.linkedin.com/in/manas-kumar-bid-7ba744a/" target="_blank" rel="noopener noreferrer" className="hover:text-[#11A8A4] transition-colors">Manas Bid</a>
                </h4>
                <p className="text-xs text-[#11A8A4] font-semibold mt-1">VP- Finance and Accounts</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-60 text-center transform transition hover:scale-105 hover:cursor-pointer">
              <img src="/images/ragib.jpeg" alt="Ragib" className="w-full h-56 object-fill" />
              <div className="p-4">
                <h4 className="font-bold text-gray-800 text-md">
                  <a href="https://www.linkedin.com/in/md-ragib-9b5a4a230" target="_blank" rel="noopener noreferrer" className="hover:text-[#11A8A4] transition-colors">Md Ragib</a>
                </h4>
                <p className="text-xs text-[#11A8A4] font-semibold mt-1">Assistant Operations Manager</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-60 text-center transform transition hover:scale-105 hover:cursor-pointer">
              <img src="/images/shalini.jpeg" alt="Shalini" className="w-full h-56 object-fill" />
              <div className="p-4">
                <h4 className="font-bold text-gray-800 text-md">Shalini Chauhan</h4>
                <p className="text-xs text-[#11A8A4] font-semibold mt-1">Camp Coordinator</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-60 text-center transform transition hover:scale-105 hover:cursor-pointer">
              <img src="/images/rajendra.jpeg" alt="Rajendra" className="w-full h-56 object-fill" />
              <div className="p-4">
                <h4 className="font-bold text-gray-800 text-md">Rajendra</h4>
                <p className="text-xs text-[#11A8A4] font-semibold mt-1">Regional sales manager</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-60 text-center transform transition hover:scale-105 hover:cursor-pointer">
              <img src="/images/kausik.jpeg" alt="Mr Kausik" className="w-full h-56 object-fill" />
              <div className="p-4">
                <h4 className="font-bold text-gray-800 text-md">Kaushik Bose</h4>
                <p className="text-xs text-[#11A8A4] font-semibold mt-1">Key account manager ( International+ Domestic)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
