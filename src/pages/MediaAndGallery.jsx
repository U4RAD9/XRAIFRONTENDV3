import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const workImages = [
  "WhatsApp Image 2026-09-24 at 1.06.45 PM.jpeg",
  "WhatsApp Image 2026-09-24 at 1.06.46 PM (1).jpeg",
  "WhatsApp Image 2026-09-24 at 1.06.46 PM.jpeg",
  "WhatsApp Image 2026-09-24 at 1.06.47 PM (1).jpeg",
  "WhatsApp Image 2026-09-24 at 1.06.47 PM.jpeg",
  "WhatsApp Image 2026-09-24 at 1.36.42 PM.jpeg",
  "WhatsApp Image 2026-09-24 at 1.36.43 PM (1).jpeg",
  "WhatsApp Image 2026-09-24 at 1.36.43 PM (2).jpeg",
  "WhatsApp Image 2026-09-24 at 1.36.43 PM.jpeg",
  "WhatsApp Image 2026-09-24 at 1.36.44 PM (1).jpeg",
  "WhatsApp Image 2026-09-24 at 1.36.44 PM (2).jpeg",
  "WhatsApp Image 2026-09-24 at 1.36.44 PM.jpeg",
  "WhatsApp Image 2026-09-24 at 1.36.45 PM.jpeg",
  "WhatsApp Image 2026-09-25 at 1.55.39 AM.jpeg",
  "WhatsApp Image 2026-09-25 at 1.55.51 AM.jpeg",
  "WhatsApp Image 2026-09-25 at 1.55.52 AM (1).jpeg",
  "champion.jpeg",
  "discussion.jpeg",
  "WhatsApp Image 2026-09-25 at 1.55.52 AM (2).jpeg",
  "WhatsApp Image 2026-09-25 at 1.55.52 AM.jpeg",
  "WhatsApp Image 2026-09-25 at 1.55.54 AM (1).jpeg",
  "WhatsApp Image 2026-09-25 at 1.55.54 AM (2).jpeg",
  "WhatsApp Image 2026-09-25 at 1.55.54 AM.jpeg",
  "WhatsApp Image 2026-09-25 at 1.55.55 AM (1).jpeg",
  "WhatsApp Image 2026-09-25 at 1.55.55 AM (2).jpeg",
  "WhatsApp Image 2026-09-25 at 1.55.55 AM.jpeg",
  "WhatsApp Image 2026-09-25 at 1.55.56 AM (1).jpeg",
  "WhatsApp Image 2026-09-25 at 1.55.56 AM.jpeg",
  "WhatsApp Image 2026-09-25 at 1.55.57 AM.jpeg",
  "WhatsApp Image 2026-09-25 at 1.55.58 AM.jpeg",
  "WhatsApp Image 2026-09-25 at 1.55.59 AM (1).jpeg",
  "WhatsApp Image 2026-09-25 at 1.55.59 AM.jpeg",
  "WhatsApp Image 2026-09-25 at 1.56.00 AM.jpeg",
  "WhatsApp Image 2026-09-25 at 1.56.01 AM (1).jpeg",
  "WhatsApp Image 2026-09-25 at 1.56.01 AM.jpeg",
  "WhatsApp Image 2026-09-25 at 1.56.02 AM.jpeg",
  "WhatsApp Image 2026-09-25 at 1.56.06 AM (1).jpeg",
  "WhatsApp Image 2026-09-25 at 1.56.06 AM.jpeg",
  "WhatsApp Image 2026-09-25 at 1.56.08 AM.jpeg",
  "WhatsApp Image 2026-09-25 at 1.56.09 AM.jpeg",
  "WhatsApp Image 2026-09-25 at 1.56.10 AM.jpeg",
  "WhatsApp Image 2026-09-25 at 1.56.11 AM (1).jpeg",
  "WhatsApp Image 2026-09-25 at 1.56.11 AM.jpeg",
  "WhatsApp Image 2026-09-26 at 2.20.12 PM (1).jpeg",
  "WhatsApp Image 2026-09-26 at 2.20.12 PM.jpeg",
  "WhatsApp Image 2026-09-26 at 2.20.13 PM.jpeg",
  "WhatsApp Image 2026-09-26 at 2.20.14 PM (1).jpeg",
  "WhatsApp Image 2026-09-26 at 2.20.14 PM.jpeg",
  "WhatsApp Image 2026-09-26 at 2.20.15 PM (1).jpeg",
  "WhatsApp Image 2026-09-26 at 2.20.15 PM.jpeg",
  "WhatsApp Image 2026-09-26 at 2.20.16 PM.jpeg",
  "WhatsApp Image 2026-09-26 at 2.20.17 PM.jpeg",
  "WhatsApp Image 2026-09-26 at 2.20.18 PM (1).jpeg",
  "WhatsApp Image 2026-09-26 at 2.20.18 PM.jpeg",
  "WhatsApp Image 2026-09-26 at 2.20.20 PM.jpeg",
  "WhatsApp Image 2026-09-26 at 2.20.21 PM (1).jpeg",
  "WhatsApp Image 2026-09-26 at 2.20.21 PM (2).jpeg",
  "WhatsApp Image 2026-09-26 at 2.20.21 PM.jpeg",
  "WhatsApp Image 2026-09-26 at 2.20.22 PM (1).jpeg",
  "WhatsApp Image 2026-09-26 at 2.20.22 PM.jpeg",
  "WhatsApp Image 2026-09-26 at 2.20.23 PM (1).jpeg",
  "WhatsApp Image 2026-09-26 at 2.20.23 PM.jpeg",
  "WhatsApp Image 2026-09-26 at 2.20.24 PM (1).jpeg",
  "WhatsApp Image 2026-09-26 at 2.20.24 PM.jpeg",
  "WhatsApp Image 2026-09-26 at 2.20.25 PM (1).jpeg",
  "WhatsApp Image 2026-09-26 at 2.20.25 PM (2).jpeg",
  "WhatsApp Image 2026-09-26 at 2.20.25 PM.jpeg",
  "WhatsApp Image 2026-09-26 at 2.20.26 PM.jpeg"
];

const funAtWorkImages = [
  "WhatsApp Image 2026-09-25 at 1.55.53 AM (1).jpeg",
  "WhatsApp Image 2026-09-25 at 1.56.03 AM (1).jpeg",
  "WhatsApp Image 2026-09-25 at 1.56.03 AM.jpeg",
  "WhatsApp Image 2026-09-25 at 1.56.04 AM.jpeg",
  "WhatsApp Image 2026-09-25 at 1.56.06 AM (2).jpeg",
  "it team.jpeg",
  "team.jpeg"
];

function MediaAndGallery() {
  const [activeTab, setActiveTab] = useState('work');

  const currentImages = activeTab === 'work' ? workImages : funAtWorkImages;
  const currentFolder = activeTab === 'work' ? 'gallery' : 'funatwork';

  return (
    <div className="bg-[#f4f7f6] w-full min-h-screen font-sans">
      <Helmet>
        <title>Media and Gallery | XRAi Digital</title>
      </Helmet>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#1A2A4D] to-[#11A8A4] text-white py-16 md:py-24 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-md">
            Media & <span className="text-[#a5ece9]">Gallery</span>
          </h1>
          <div className="w-24 h-1 bg-white/50 mx-auto rounded-full mb-6"></div>
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto font-medium">
            Take a visual journey through our company events, milestones, and daily operations.
          </p>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="container mx-auto px-4 md:px-10 py-16">

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <button
            onClick={() => setActiveTab('work')}
            className={`px-8 py-3 rounded-full font-bold text-sm md:text-base transition-all duration-300 ${
              activeTab === 'work'
                ? 'bg-[#1A2A4D] text-white shadow-lg shadow-[#1A2A4D]/30 scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-100 shadow'
            }`}
          >
            Work
          </button>
          <button
            onClick={() => setActiveTab('fun')}
            className={`px-8 py-3 rounded-full font-bold text-sm md:text-base transition-all duration-300 ${
              activeTab === 'fun'
                ? 'bg-[#11A8A4] text-white shadow-lg shadow-[#11A8A4]/30 scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-100 shadow'
            }`}
          >
            Fun at Work
          </button>
        </div>

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
          {currentImages.map((img, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 bg-white border border-gray-100 break-inside-avoid"
            >
              <img
                src={`/${currentFolder}/${encodeURI(img)}`}
                alt={`${activeTab === 'work' ? 'Work' : 'Fun at work'} image ${index + 1}`}
                loading="lazy"
                className="w-full h-auto transform transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://xraidigital.com/Content/images/logo.png' }}
              />
            </div>
          ))}
        </div>

        {currentImages.length === 0 && (
           <div className="text-center py-20 text-gray-500">
             <p className="text-lg">No images found for this category.</p>
           </div>
        )}
      </div>

    </div>
  );
}

export default MediaAndGallery;
