export const formatTemp = (tempF, unit) =>
  unit === 'metric' ? `${((tempF - 32) * 5 / 9).toFixed(1)} °C` : `${tempF} °F`;

export const formatSpeed = (mph, unit) =>
  unit === 'metric' ? `${(mph * 0.44704).toFixed(1)} m/s` : `${mph} mph`;

export const formatRain = (inches, unit) =>
  unit === 'metric' ? `${(inches * 25.4).toFixed(1)} mm` : `${inches}"`

export const timeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - new Date(timestamp)) / 1000);
  const intervals = [
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];
  for (let i of intervals) {
    const count = Math.floor(seconds / i.seconds);
    if (count >= 1) return `${count} ${i.label}${count > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
};
