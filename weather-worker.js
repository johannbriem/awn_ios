// weather-worker.js
import { io } from 'socket.io-client';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://supabase.com/dashboard/project/ahjxirfaryfpansbpjii';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoanhpcmZhcnlmcGFuc2JwamlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODAzMzM2NywiZXhwIjoyMDYzNjA5MzY3fQ.dG65TyOWd6XVjhu9-bnFuSeisOKVMlLjYRYjizzehWE';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const APP_KEY = '66ea184d1e7b42009e69df31a647d56281ab7c8057df477782e4b912cc553d9a';
const API_KEY = 'cddb83d67bcf46b8acee134f1102c62a8494c05d9d2647849746f158ec0222a2';

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
    windspeedmph: data.windspeedmph,
    windgustmph: data.windgustmph,
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
