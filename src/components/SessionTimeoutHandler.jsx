import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SessionTimeoutHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutId = useRef(null);

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
    // Events that signify user activity
    const events = ['load', 'mousemove', 'mousedown', 'click', 'scroll', 'keypress'];

    const resetTimerWrapper = () => {
      // Only reset timer if user is currently logged in to avoid running in background for public visitors unnecessarily
      if (sessionStorage.getItem('Token') || sessionStorage.getItem('UserID')) {
        resetTimer();
      }
    };

    // Initialize timer on mount or route change
    resetTimerWrapper();

    // Attach event listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimerWrapper);
    });

    // Cleanup on unmount
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimerWrapper);
      });
    };
  }, [location.pathname]);

  return null; // This is a logic-only component, it renders nothing visible
};

export default SessionTimeoutHandler;
