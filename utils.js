export const formatTemp = (tempF, unit) =>
  unit === 'metric' ? `${((tempF - 32) * 5 / 9).toFixed(1)} °C` : `${tempF} °F`;

export const formatSpeed = (mph, unit) =>
  unit === 'metric' ? `${(mph * 0.44704).toFixed(1)} m/s` : `${mph} mph`;

export const formatRain = (inches, unit) =>
  unit === 'metric' ? `${(inches * 25.4).toFixed(1)} mm` : `${inches}"`
