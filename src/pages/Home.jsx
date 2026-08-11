import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PackageCard from '../components/PackageCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function Home() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="bg-[#f8f9fa] w-full font-sans">
      {/* Hero Banner Section */}
      <section className="w-full bg-[#f8f9fa]">
        <div className="container mx-auto px-6 pt-4">
          <div className="relative w-full h-[300px] md:h-[400px] bg-cover bg-center rounded-lg shadow-md overflow-hidden" 
               style={{ backgroundImage: "url('https://xraidigital.com/Content/images/slider/Xrai%20Slider%20Img4.jpg')" }}>
            
            <div className="absolute top-[40px] md:top-[60px] left-6 md:left-12">
              <h1 className="text-white text-2xl md:text-4xl font-bold max-w-2xl">
                X-Ray at Home services with XRAi digital
              </h1>
              <hr className="my-4 w-1/2 border-white/50" />
              <h4 className="text-white text-lg md:text-xl max-w-xl">
                Expert At-Home Health Test with<br />Quick and reliable provided within hours!
              </h4>
            </div>

            {/* Banner Icons */}
            <div className="absolute bottom-1.5 right-1.5 md:right-10 bg-black/60 p-4 rounded-xl flex gap-6 items-center">
              <div className="text-center text-white">
                <i className="fa fa-hospital-alt text-3xl mb-1"></i>
                <p className="text-sm font-semibold">At Home Health Test</p>
              </div>
              <div className="text-center text-white">
                <i className="fa fa-hospital-user text-3xl mb-1"></i>
                <p className="text-sm font-semibold">Health Check ups</p>
              </div>
              <div className="text-center text-white">
                <i className="fa fa-building text-3xl mb-1"></i>
                <p className="text-sm font-semibold">Corporate Health Packages</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <div className="container mx-auto mt-12 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 px-6">
          <i className="fa fa-notes-medical text-[#0F847E] mr-2"></i> Our Home Diagnostic Services
        </h2>
        
        <div className="flex flex-wrap justify-center gap-6 p-4">
          <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-[300px] text-center hover:scale-105 transition-transform duration-300 border border-white hover:cursor-pointer">
            <img src="https://xraidigital.com/Content/images/services/Xray.jpg" alt="X-Ray" className="w-full h-[200px] object-fill" />
            <h3 className="text-lg font-bold text-gray-800 mt-4 mx-2">Digital Xray At Home</h3>
            <p className="text-xs font-bold text-gray-600 m-4 mb-5">
              X-rays are quick, painless, and essential for diagnosing various conditions. With XRAi digital, you can get professional-grade digital X-rays done without stepping out of your home.
              <span className="block mt-1 text-[#11A8A4] hover:underline cursor-pointer">Read More</span>
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-[300px] text-center hover:scale-105 transition-transform duration-300 border border-white hover:cursor-pointer">
            <img src="https://xraidigital.com/Content/images/services/ECG.jpg" alt="ECG" className="w-full h-[200px] object-fill" />
            <h3 className="text-lg font-bold text-gray-800 mt-4 mx-2">ECG</h3>
            <p className="text-xs font-bold text-gray-600 m-4 mb-5">
              Monitor your heart’s electrical activity, rate, and rhythm with hospital-grade ECG services, conveniently performed at home by qualified experts.
              <span className="block mt-1 text-[#11A8A4] hover:underline cursor-pointer">Read More</span>
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-[300px] text-center hover:scale-105 transition-transform duration-300 border border-white hover:cursor-pointer">
            <img src="https://xraidigital.com/Content/images/services/xrai-holter.jpg" alt="Xray Holter" className="w-full h-[200px] object-fill" />
            <h3 className="text-lg font-bold text-gray-800 mt-4 mx-2">Holter</h3>
            <p className="text-xs font-bold text-gray-600 m-4 mb-5">
              Need continuous heart monitoring? Our portable Holter devices allow you to undergo cardiac monitoring effortlessly from home.
              <span className="block mt-1 text-[#11A8A4] hover:underline cursor-pointer">Read More</span>
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-[300px] text-center hover:scale-105 transition-transform duration-300 border border-white hover:cursor-pointer">
            <img src="https://xraidigital.com/Content/images/services/pft.jpg" alt="PFT" className="w-full h-[200px] object-fill" />
            <h3 className="text-lg font-bold text-gray-800 mt-4 mx-2">PFT</h3>
            <p className="text-xs font-bold text-gray-600 m-4 mb-5">
              Assess your lung health with ease. XRAi digital ensures accurate and efficient PFTs in the comfort of your home, with no disruption to your routine.
              <span className="block mt-1 text-[#11A8A4] hover:underline cursor-pointer">Read More</span>
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-[300px] text-center hover:scale-105 transition-transform duration-300 border border-white hover:cursor-pointer">
            <img src="https://xraidigital.com/Content/images/services/SAMPLECOLLECTION.jpg" alt="Sample collection" className="w-full h-[200px] object-fill" />
            <h3 className="text-lg font-bold text-gray-800 mt-4 mx-2">Sample Collection</h3>
            <p className="text-xs font-bold text-gray-600 m-4 mb-5">
              A home sample collection is done to make it easier if you do not wish to go to hospital or local lab to provide your blood or body fluid samples for testing time.
              <span className="block mt-1 text-[#11A8A4] hover:underline cursor-pointer">Read More</span>
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-[300px] text-center hover:scale-105 transition-transform duration-300 border border-white hover:cursor-pointer">
            <img src="https://xraidigital.com/Content/images/services/Health%20Check-Up.png" alt="Health Screening" className="w-full h-[200px] object-fill" />
            <h3 className="text-lg font-bold text-gray-800 mt-4 mx-2">Health Screening</h3>
            <p className="text-xs font-bold text-gray-600 m-4 mb-5">
              Comprehensive health screening packages for all needs in the comfort of your home, with doctor consult, medical scan and physical examination.
              <span className="block mt-1 text-[#11A8A4] hover:underline cursor-pointer">Read More</span>
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Xrai Digital Section */}
      <div className="container mx-auto mt-12 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 px-6">
          <i className="fa fa-question-circle text-[#0F847E] mr-2"></i> Why Choose XRAi digital?
        </h2>
        
        <div className="flex flex-wrap justify-center gap-6 p-4">
          <div className="relative bg-white rounded-xl shadow-md w-full md:w-[225px] min-h-[218px] p-5 text-left">
            <i className="fa fa-home absolute top-4 right-4 text-3xl text-[#11A8A4]"></i>
            <h4 className="mt-8 text-lg font-bold text-gray-800">Hospital Grade Quality</h4>
            <p className="mt-2 text-xs font-bold text-gray-600">Our tests are performed using state-of-the-art equipment and are often superior to those conducted in clinics or hospitals.</p>
          </div>

          <div className="relative bg-white rounded-xl shadow-md w-full md:w-[225px] min-h-[218px] p-5 text-left">
            <i className="fa fa-clock absolute top-4 right-4 text-3xl text-[#11A8A4]"></i>
            <h4 className="mt-8 text-lg font-bold text-gray-800">1 minute 1 hour*</h4>
            <p className="mt-2 text-xs font-bold text-gray-600">Booking health tests takes only a minute with XRAi digital and reports are provided to you within just an hour.</p>
          </div>

          <div className="relative bg-white rounded-xl shadow-md w-full md:w-[225px] min-h-[218px] p-5 text-left">
            <i className="fa fa-user-check absolute top-4 right-4 text-3xl text-[#11A8A4]"></i>
            <h4 className="mt-8 text-lg font-bold text-gray-800">Effortless Booking & Reporting</h4>
            <p className="mt-2 text-xs font-bold text-gray-600">Manage everything online with reports available instantly in your account or on whatsapp.</p>
          </div>

          <div className="relative bg-white rounded-xl shadow-md w-full md:w-[225px] min-h-[218px] p-5 text-left">
            <i className="fa fa-hand-holding-medical absolute top-4 right-4 text-3xl text-[#11A8A4]"></i>
            <h4 className="mt-8 text-lg font-bold text-gray-800">At home Diagnostics- Beyond Pathology</h4>
            <p className="mt-2 text-xs font-bold text-gray-600">All tests are conducted at your home or preferred location, eliminating the need for hospital visits.</p>
          </div>
        </div>

        <div className="px-6 text-center pt-4">
          <p className="text-[10px] font-medium text-gray-600">
            <span className="font-extrabold text-[12px]">Note* :</span> 1 minute 1 hour is applicable to selective health tests like Xray, ECG and more. Health tests like PFT and others might take longer and reports may come in due time.XRAi digital aims to provide the test results soonest possible.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-5 my-10 px-6">
        <Link to="/login" className="bg-[#11A8A4] hover:bg-[#0F847E] text-white px-8 py-4 rounded font-semibold transition-colors flex items-center gap-2">
          <i className="fas fa-syringe"></i> Book a Test Online
        </Link>
        <a href="tel:-18002702900" className="bg-[#11A8A4] hover:bg-[#0F847E] text-white px-8 py-4 rounded font-semibold transition-colors flex items-center gap-2">
          <i className="fas fa-phone"></i> Call Us
        </a>
        <a href="https://catvitals.xraidigital.com/" className="bg-[#11A8A4] hover:bg-[#0F847E] text-white px-8 py-4 rounded font-semibold transition-colors flex items-center gap-2">
          <i className="fas fa-list-alt"></i> Check Your Vitals
        </a>
      </div>

      {/* Package Overview */}
      <div className="container mx-auto mt-12 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 px-6">
          <i className="fas fa-layer-group text-[#0F847E] mr-2"></i> Package Overview
        </h2>

        <div className="px-6">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={30}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 2 },
              1280: { slidesPerView: 3 },
            }}
            className="pb-16"
          >
            <SwiperSlide className="py-4 h-auto">
              <PackageCard 
                title="Essential Package"
                subtitle="(40+ parameters)"
                price="2500"
                isPopular={true}
                topFeatures={["Chest XRAY", "ECG – 12 lead", "PFT"]}
                includes={["Detailed Diabetes test", "Heart health", "Thyroid health", "Kidney health", "Liver health", "Complete Blood Count", "Complete Urine"]}
              />
            </SwiperSlide>

            <SwiperSlide className="py-4 h-auto">
              <PackageCard 
                title="Advance Package"
                subtitle="(60+ parameters)"
                price="3500"
                isPopular={false}
                topFeatures={["Chest XRAY", "ECG – 12 lead", "PFT"]}
                includes={["Detailed Diabetes test", "Heart Detailed Profile", "Thyroid detailed profile", "Kidney detailed profile", "Liver detailed profile", "Complete Blood Count + ESR", "Complete Urine", "Bone health"]}
              />
            </SwiperSlide>

            <SwiperSlide className="py-4 h-auto">
              <PackageCard 
                title="Composite Package"
                subtitle="(75+ parameters)"
                price="4500"
                isPopular={false}
                topFeatures={["Chest XRAY", "ECG – 12 lead", "PFT"]}
                includes={["Detailed Diabetes test", "Heart Detailed Profile", "Thyroid detailed profile", "Kidney detailed profile", "Liver detailed profile", "Complete Blood Count + ESR", "Complete Urine", "Bone health", "Nervous System B12 Vitamin D"]}
              />
            </SwiperSlide>

            <SwiperSlide className="py-4 h-auto">
              <PackageCard 
                title="Dedicated Package"
                subtitle="(80+ parameters)"
                price="5500"
                isPopular={false}
                topFeatures={["Chest XRAY", "ECG – 12 lead", "PFT", "Audiometry", "Optometry"]}
                includes={["Detailed Diabetes test", "Heart Detailed Profile", "Thyroid detailed profile", "Kidney detailed profile", "Liver detailed profile", "Complete Blood Count + ESR", "Complete Urine", "Bone health", "Nervous System B12 Vitamin D", "Iron Studies"]}
              />
            </SwiperSlide>

            <SwiperSlide className="py-4 h-auto">
              <PackageCard 
                title="Platinum package"
                subtitle="(90+ parameters)"
                price="7000"
                isPopular={false}
                topFeatures={["Chest XRAY", "ECG – 12 lead", "PFT", "Audiometry", "Optometry"]}
                includes={["Detailed Diabetes test", "Heart Detailed Profile", "Thyroid detailed profile", "Kidney detailed profile", "Liver detailed profile", "Complete Blood Count + ESR", "Complete Urine", "Bone health", "Nervous System B12 Vitamin D", "Iron Studies"]}
              />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

      {/* How it Works / 3 Steps Banner */}
      <section className="bg-[#f8f9fa] mt-12 mb-6">
        <div className="w-full px-6 py-4">
          <img
            src="https://xraidigital.com/Content/images/services/3Steps.png"
            alt="3 Steps"
            className="w-full md:h-[450px] h-[150px] rounded-md"
          />
        </div>
      </section>

      {/* Steps Interaction */}
      <div className="flex justify-center items-center gap-5 p-5 bg-[#f8f9fa]">
        {[1, 2, 3].map(step => (
          <div key={step} 
               onClick={() => setActiveStep(step)}
               className={`px-5 py-2 border border-[#11A8A4] rounded cursor-pointer text-center font-bold transition-colors ${
                 activeStep === step ? 'bg-[#11A8A4] text-white' : 'text-[#11A8A4] hover:bg-[#11A8A4] hover:text-white'
               }`}>
            Step {step}
          </div>
        ))}
      </div>

      <div className="p-5 bg-white border border-gray-200 shadow-md max-w-[700px] mx-auto font-bold my-4">
        {activeStep === 1 && (
          <div>
            <h2 className="text-lg text-black">Step 1</h2>
            <p className="text-xs text-gray-600 mt-2">Schedule a test or health package online or via call. Choose a time that works for you before making the payment.</p>
          </div>
        )}
        {activeStep === 2 && (
          <div>
            <h2 className="text-lg text-black">Step 2</h2>
            <p className="text-xs text-gray-600 mt-2">Our team brings all necessary equipment to your location and conducts the test professionally.</p>
          </div>
        )}
        {activeStep === 3 && (
          <div>
            <h2 className="text-lg text-black">Step 3</h2>
            <p className="text-xs text-gray-600 mt-2">Receive your reports within an hour via WhatsApp or access them in your online account.</p>
          </div>
        )}
      </div>

      {/* Testimonials */}
      <div className="max-w-[1200px] mx-auto my-8 p-5 bg-white shadow-md rounded-lg text-center">
        <h2 className="font-bold text-2xl text-gray-700 mb-5">Testimonials</h2>
        
        <div className="py-4">
          <p className="text-base font-bold text-gray-800 mb-2">"This is an amazing service! The team was professional and exceeded expectations."</p>
          <div className="font-bold text-gray-600 mb-1">Rani Rag</div>
          <div className="text-yellow-500 mb-1">⭐⭐⭐⭐⭐</div>
          <div className="italic text-gray-500 font-bold">ECG At Home</div>
        </div>
      </div>
      
    </div>
  );
}

export default Home;
