import React from 'react';

const Modal = ({ isOpen, onClose, title, maxWidth = 'max-w-md', children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity" 
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-xl shadow-2xl w-full ${maxWidth} max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex-shrink-0 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#35435e]">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
