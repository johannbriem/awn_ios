import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [unit, setUnit] = useState('imperial');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    (async () => {
      const storedUnit = await AsyncStorage.getItem('unitPreference');
      if (storedUnit) setUnit(storedUnit);
    })();
  }, []);

  const setUnitAndSave = async (newUnit) => {
    setUnit(newUnit);
    await AsyncStorage.setItem('unitPreference', newUnit);
  };

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <WeatherContext.Provider value={{ unit, setUnit: setUnitAndSave, refreshKey, triggerRefresh }}>
      {children}
    </WeatherContext.Provider>
  );
};
