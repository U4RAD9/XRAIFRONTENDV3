import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';

const SessionTimeoutHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutId = useRef(null);

  const isNative = typeof Capacitor !== 'undefined' 
    && typeof Capacitor.isNativePlatform === 'function' 
    && Capacitor.isNativePlatform();

  const userType = (sessionStorage.getItem('UserType') || localStorage.getItem('UserType') || '').toLowerCase();
  const isTechnician = userType === 'technician' || location.pathname.startsWith('/technician');

  // REMOVE AUTO-LOGOUT FROM TECHNICIANS & MOBILE APK:
  // Technicians on the road/field and mobile app users must NEVER be abruptly logged out!
  // All other user roles (Admin, Consultant, SuperAdmin, Partner, Patient) on desktop web keep the 30-min security timeout.
  if (isTechnician || isNative) {
    return null;
  }

  const logoutUser = () => {
    // Only logout if they actually have a token/session active
    if (sessionStorage.getItem('Token') || sessionStorage.getItem('UserID')) {
      sessionStorage.clear();
      alert("You have been automatically logged out due to 30 minutes of inactivity.");
      navigate('/login', { replace: true });
    }
  };

  const resetTimer = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    // Set timer for 30 minutes (30 * 60 * 1000 = 1800000 ms)
    timeoutId.current = setTimeout(logoutUser, 1800000);
  };

  useEffect(() => {
    const events = ['load', 'mousemove', 'mousedown', 'click', 'scroll', 'keypress'];

    const resetTimerWrapper = () => {
      if (sessionStorage.getItem('Token') || sessionStorage.getItem('UserID')) {
        resetTimer();
      }
    };

    resetTimerWrapper();

    events.forEach((event) => {
      window.addEventListener(event, resetTimerWrapper);
    });

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimerWrapper);
      });
    };
  }, [location.pathname]);

  return null;
};

export default SessionTimeoutHandler;
