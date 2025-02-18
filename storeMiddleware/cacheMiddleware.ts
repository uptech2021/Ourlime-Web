// storeMiddleware/cacheMiddleware.ts
export const cacheMiddleware = (config) => (set, get, api) => {
  return {
    ...config(set, get, api),
    clearCache: () => {
      localStorage.removeItem('profile-storage');
    },
    getCachedData: (key) => {
      const cached = localStorage.getItem(key);
      return cached ? JSON.parse(cached) : null;
    },
    setCachedData: (key, data) => {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };
};