import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, FileText, Check, Shield, Droplet, Activity } from 'lucide-react';

const PackageCard = ({
  title,
  subtitle,
  price,
  topFeatures = [],
  includes = [],
}) => {
  return (
    <div className="relative bg-white rounded-3xl py-4 md:py-2 px-4 md:px-4 shadow-[0_4px_20px_rgb(0,0,0,0.08)] w-full max-w-[450px] h-auto min-h-[520px] border border-gray-100 overflow-hidden flex flex-col text-left">
      {/* Top Border Curve (simplified with top border) */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0db9b6] to-[#049391]"></div>

      <div className="mt-3 z-10 flex flex-col h-full">
        {/* Header Row: Title on Left, Price & Button on Right */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
          <div className="flex-1">
            <h3 className="text-[20px] md:text-[22px] leading-tight font-bold text-gray-800">{title}</h3>
            <p className="text-[14px] md:text-[16px] font-bold text-[#0db9b6] mt-1">{subtitle}</p>
            <div className="w-8 h-0.5 bg-[#0db9b6] rounded my-3"></div>
          </div>
          
          <div className="flex flex-col items-start sm:items-end shrink-0">
            <h4 className="font-extrabold text-[14px] md:text-[18px] text-[#0db9b6] mb-1">₹ {price}</h4>
            <Link to="/login" className="bg-gradient-to-r from-[#17c2be] to-[#008f8d] text-white px-2 py-2 rounded-xl font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 text-xs md:text-[12px]">
              <Calendar size={14} /> BOOK NOW
            </Link>
          </div>
        </div>

        {/* Top Features */}
        {topFeatures.length > 0 && (
          <div className="bg-[#f8f9fa] rounded-xl p-2 flex flex-wrap justify-between items-center gap-x-4 gap-y-2 mb-2 border border-gray-100/50">
            {topFeatures.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-[12px] sm:text-[14px] font-bold text-[#112a46] whitespace-nowrap">
                <Activity size={12} className="text-[#0db9b6]" />
                {feat}
              </div>
            ))}
          </div>
        )}

        {/* Includes */}
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-green-100 p-1.5 rounded-lg text-green-600">
              <FileText size={16} />
            </div>
            <h4 className="text-green-600 font-bold text-[15px] md:text-base">Includes</h4>
            <div className="h-px bg-gray-200 flex-grow ml-2"></div>
          </div>

          <div className="flex flex-col gap-0 hover:cursor-pointer">
            {includes.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center  border-gray-100 last:border-0 group">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#f0faef] flex justify-center items-center text-[#5cba47] group-hover:bg-[#5cba47] group-hover:text-white transition-colors">
                    <Droplet size={14} />
                  </div>
                  <span className="text-[12px] md:text-[13px] font-bold text-[#112a46]">{item}</span>
                </div>
                <div className="w-4 h-4 bg-[#5cba47] rounded-full flex justify-center items-center text-white shadow-sm shrink-0">
                  <Check size={10} strokeWidth={3} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PDF Footer */}
      <div className="mt-2 bg-[#f8f9fa] rounded-2xl p-3 flex gap-3 items-center border border-gray-100/50">
        <div className="bg-[#0db9b6] p-1.5 rounded-lg text-white shadow-sm min-w-fit">
          <FileText size={18} />
        </div>
        <p className="text-[10px] font-semibold text-[#112a46] leading-snug">
          To access the full details of the health test package, download the <a href="/Content/Health_Check_Package.pdf" target="_blank" rel="noopener noreferrer" className="text-[#0db9b6] underline underline-offset-2 hover:text-[#049391]">PDF here</a>.
        </p>
      </div>
    </div>
  );
};

export default PackageCard;
