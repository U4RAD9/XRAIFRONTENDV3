import React from 'react';
import { Outlet } from 'react-router-dom';

function TechnicianLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-[#233560]">
              Welcome {sessionStorage.getItem('FullName') || sessionStorage.getItem('UserName')}
            </h1>
            <button 
              onClick={() => {
                sessionStorage.clear();
                window.location.href = '/login';
              }}
              className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 py-8 px-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export default TechnicianLayout;
