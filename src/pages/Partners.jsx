import React from 'react';
import { Link } from 'react-router-dom';

function Partners() {
  const partners = [
    { name: "TATA 1mg", image: "/Content/PartnersLogo/image1.jpeg" },
    { name: "Centre For Sight", image: "/Content/PartnersLogo/image6.png" },
    { name: "mFine", image: "/Content/PartnersLogo/image13.png" },
    { name: "Aurum", image: "/Content/PartnersLogo/image14.png" },
    { name: "Ortho Cure", image: "/Content/PartnersLogo/image12.png" },
    { name: "Care Continuum", image: "/Content/PartnersLogo/image8.png" },
    { name: "Dr. Lal Pathlabs", image: "/Content/PartnersLogo/image3.png" },
    { name: "Dr. Dangs Lab", image: "/Content/PartnersLogo/image5.png" },
    { name: "Guardian Angel HomeCare", image: "/Content/PartnersLogo/image9.png" },
    { name: "Redcliffe Labs", image: "/Content/PartnersLogo/image2.png" },
    { name: "Portea", image: "/Content/PartnersLogo/image11.png" },
    { name: "Mahajan Imaging & Labs", image: "/Content/PartnersLogo/image7.png" },
    { name: "MediBuddy", image: "/Content/PartnersLogo/image4.jpeg" },
    { name: "Healthians", image: "/Content/PartnersLogo/image10.png" }
  ];

  return (
    <div className=" min-h-screen pb-12">
      {/* Breadcrumb section */}
      <div className="pt-1 pb-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-2xl font-bold text-[#233560]">Our Channel Partners</h1>
            <div className="text-sm font-semibold text-gray-500 mt-2 md:mt-0">
              <Link to="/" className="text-[#0F847E] hover:underline">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700">Partners</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 text-center">
        {/* <h2 className="text-3xl font-bold text-[#233560] mb-12">Our Channel Partners</h2> */}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {partners.map((partner, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-center items-center transform transition duration-300 hover:scale-105 hover:shadow-lg">
              <img 
                src={partner.image} 
                alt={partner.name} 
                className="w-full h-24 object-contain rounded-lg mb-3" 
              />
              <h3 className="text-sm font-bold text-[#14457B]">{partner.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Partners;
