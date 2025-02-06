// storeMiddleware/sessionMiddleware.ts
export const sessionMiddleware = (config) => (set, get, api) => {
  if (typeof window !== 'undefined') {
      // Set initial timestamp when tab is opened
      localStorage.setItem('lastActiveTime', Date.now().toString());

      // Check timestamp when tab is opened
      const lastActiveTime = parseInt(localStorage.getItem('lastActiveTime') || '0');
      const inactiveTime = Date.now() - lastActiveTime;
      
      if (inactiveTime > 10000) { // 10 seconds
          localStorage.clear();
          window.location.href = '/login';
      }

      // Update timestamp when tab is closed/hidden
      window.addEventListener('beforeunload', () => {
          localStorage.setItem('lastActiveTime', Date.now().toString());
      });

      document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
              localStorage.setItem('lastActiveTime', Date.now().toString());
          }
      });
  }

  return {
      ...config(set, get, api)
  };
};
