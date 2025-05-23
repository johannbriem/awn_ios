import React, { createContext, useState } from 'react';

export const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [unit, setUnit] = useState('imperial');
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <WeatherContext.Provider value={{ unit, setUnit, refreshKey, triggerRefresh }}>
      {children}
    </WeatherContext.Provider>
  );
};
