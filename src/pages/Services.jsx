import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const staticServices = [
  {
    title: "X-Ray at Home",
    description: "X-rays are a type of radiation that when directed at a person's body creates pictures of the inside of their body. Your doctor may prescribe an X-ray for multiple health conditions – bone fractures, soft tissue abnormalities, problems to do with your lungs, or for a routine checkup.",
    linkText: "Click here",
    linkAction: "to book your x-ray now or you can call us at 1800-270-2900.",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400&h=250",
  },
  {
    title: "ECG (Electrocardiography) at Home",
    description: "An electrocardiogram (ECG or EKG) is a simple test that records the electrical currents & impulses generated from the heart, to check for different heart conditions. Your doctor may prescribe an ECG to detect heart abnormalities or for regular checkup.",
    linkText: "Click here",
    linkAction: "to book your ECG now or you can call us at 1800-270-2900.",
    image: "https://images.unsplash.com/photo-1628348070889-cb656235b4eb?auto=format&fit=crop&q=80&w=400&h=250",
  },
  {
    title: "Holter at Home",
    description: "A Holter monitor (often simply Holter) is a portable & wearable device used for cardiac monitoring and records the electrical activity of the heart for 24-72 hours. You may be prescribed a Holter to detect heart abnormalities.",
    linkText: "Click here",
    linkAction: "to book your Holter now or you can call us at 1800-270-2900.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400&h=250",
  },
  {
    title: "Sample Collection at Home",
    description: "A home sample collection, this is done if the person does not want to go to hospital or local lab to provide their blood or body fluid samples for testing. It involves a trained person going to the patient's home, and taking their blood/fluid samples from the patient, and delivering them to a lab for testing & reporting.",
    linkText: "Click here",
    linkAction: "to book your blood sample collection now or you can call us at 1800-270-2900.",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=400&h=250",
  },
  {
    title: "PFT at Home",
    description: "A complete health checkup is a collective package of multiple health tests to evaluate one's health and fitness. It consists ofdifferent tests, such as radiological, blood, and lung function tests. Types of tests, and test packages depend on, the persons age, gender, and general medical condition",
    linkText: "Click here",
    linkAction: "to book your health checkup now or you can call us at 1800-270-2900.",
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=400&h=250",
  },
  {
    title: "Health Check-Up at Home",
    description: "A complete health checkup is a collective package of multiple health tests to evaluate one's health and fitness. It consists ofdifferent tests, such as radiological, blood, and lung function tests. Types of tests, and test packages depend on, the persons age, gender, and general medical condition",
    linkText: "Click here",
    linkAction: "to book your health checkup now or you can call us at 1800-270-2900.",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=400&h=250",
  },
  {
    title: "Audiometry at Home",
    description: "A hearing test provides an evaluation of the sensitivity of a person's sense of hearing and is most often performed by an audiologist using an audiometer. An audiometer is used to determine a person's hearing sensitivity at different frequencies. Hearing screening is therefore conducted when a hearing loss is suspected, to isolate possible hearing loss in newborn children, in first year schoolchildren, or in industrial hearing screening. Pure tone audiometry is the most common choice to evaluate hearing at a number of set frequencies.",
    linkText: "Click here",
    linkAction: "to book your Audiometry checkup now or you can call us at 1800-270-2900.",
    image: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?auto=format&fit=crop&q=80&w=400&h=250",
  }
];

const TiltCard = ({ service }) => {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;

    const mouseX = localX - width / 2;
    const mouseY = localY - height / 2;
    
    // Calculate rotation: negative for X to tilt "away" from the cursor at the top, positive for Y
    const rotateX = -(mouseY / (height / 2)) * 6; 
    const rotateY = (mouseX / (width / 2)) * 6;
    
    setRotation({ x: rotateX, y: rotateY });
    setCursorPos({ x: localX, y: localY });
  };

  const handleMouseEnter = () => setIsHovering(true);
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 }); // Smoothly snap back
  };

  return (
    <div className="w-full h-full" style={{ perspective: '1000px' }}>
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`group cursor-pointer overflow-hidden relative flex flex-col sm:flex-row bg-white rounded-2xl border border-slate-100/60 shadow-sm h-full ${isHovering ? 'shadow-[0_20px_40px_-15px_rgba(17,168,164,0.15)]' : ''}`}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(${isHovering ? 1.02 : 1}, ${isHovering ? 1.02 : 1}, 1)`,
          transition: isHovering ? 'transform 0.1s ease-out, box-shadow 0.3s ease-out' : 'transform 0.5s ease-out, box-shadow 0.3s ease-out',
          transformStyle: 'preserve-3d',
          willChange: 'transform'
        }}
      >
        {/* Glow effect tracking cursor */}
        <div 
          className="pointer-events-none absolute w-64 h-64 rounded-full bg-[#11A8A4]/15 blur-3xl transition-opacity duration-300 z-0"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            transform: 'translate(-50%, -50%)',
            opacity: isHovering ? 1 : 0
          }}
        />

        {/* Highlight bar on hover */}
        <div className="absolute top-0 left-0 w-1 h-full bg-[#11A8A4] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-20 rounded-l-2xl"></div>
        
        <div className="w-full sm:w-[40%] flex-shrink-0 relative overflow-hidden bg-slate-50 rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/0 to-slate-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
          <img 
            src={service.image} 
            alt={service.title} 
            className="w-full h-full aspect-[4/3] sm:aspect-auto object-cover transform group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 ease-in-out" 
          />
        </div>
        
        <div className="w-full sm:w-[60%] p-6 sm:p-8 flex flex-col justify-between relative z-10 rounded-b-2xl sm:rounded-r-2xl sm:rounded-bl-none">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-600 shadow-sm">
                <i className="fas fa-heartbeat text-sm"></i>
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight group-hover:text-[#11A8A4] transition-colors">{service.title}</h3>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              {service.description}
            </p>
          </div>
          
          <div className="mt-auto flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-t border-slate-50 pt-5">
            <p className="text-slate-400 text-xs leading-snug xl:max-w-[180px]">
              {service.linkAction}
            </p>
            
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-teal-50 text-teal-700 font-semibold text-sm hover:bg-[#11A8A4] hover:text-white hover:shadow-md hover:shadow-teal-500/30 transition-all duration-300 group/btn shrink-0"
            >
              Book Appointment
              <svg className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

function Services() {
  return (
    <div className="min-h-screen pb-16 px-2">
      <div className="pt-2">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-2xl font-bold text-[#233560]">Our Services</h1>
            <div className="text-sm font-semibold text-gray-500 mt-2 md:mt-0">
              <Link to="/" className="text-[#0F847E] hover:underline">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700">Services</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-2">
        <h2 className="text-2xl font-medium text-center text-gray-800 mb-4">Safe and Reliable Health Services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {staticServices.map((service, index) => (
            <TiltCard key={index} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Services;
