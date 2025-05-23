import React, { createContext, useState } from 'react';

export const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [unit, setUnit] = useState('imperial');

  return (
    <WeatherContext.Provider value={{ unit, setUnit }}>
      {children}
    </WeatherContext.Provider>
  );
};
