import { io } from 'socket.io-client';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const APP_KEY = process.env.APP_KEY;
const API_KEY = process.env.API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
let dataBuffer = [];

// 1. Connect to AmbientWeather WebSocket
const socket = io('https://rt2.ambientweather.net', {
  query: {
    api: '1',
    applicationKey: APP_KEY,
  },
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('✅ Connected to AmbientWeather');
  socket.emit('subscribe', { apiKeys: [API_KEY] });
});

// 2. Store data every ~30s
socket.on('data', (data) => {
  const payload = {
    timestamp: new Date().toISOString(),
    tempf: data.tempf,
    windspeed: data.windspeedmph,
    windgust: data.windgustmph,
    humidity: data.humidity,
    uv: data.uv,
    aqi_pm25: data.aqi_pm25,
    hourlyrainin: data.hourlyrainin,
    lastRain: data.lastRain,
  };

  console.log(`📥 Buffered at ${payload.timestamp}`);
  dataBuffer.push(payload);
});

// 3. Flush buffer every 10 minutes
setInterval(async () => {
  if (dataBuffer.length === 0) return;

  console.log(`📤 Uploading ${dataBuffer.length} records to Supabase...`);

  const { error } = await supabase.from('weather_data').insert(dataBuffer);
  if (error) {
    console.error('❗ Error uploading:', error.message);
  } else {
    console.log('✅ Uploaded.');
    dataBuffer = [];
  }
}, 10 * 60 * 1000); // every 10 minutes
