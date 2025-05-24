// worker/weather-worker.js
import { io } from 'socket.io-client';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const APP_KEY = process.env.APP_KEY;
const API_KEY = process.env.API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function waitForSocketData(timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    const socket = io('https://rt2.ambientweather.net', {
      query: { api: '1', applicationKey: APP_KEY },
      transports: ['websocket'],
    });

    let resolved = false;

    socket.on('connect', () => {
      socket.emit('subscribe', { apiKeys: [API_KEY] });
    });

    socket.on('data', async (data) => {
      resolved = true;
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
      await supabase.from('weather_data').insert([payload]);
      socket.disconnect();
      resolve();
    });

    setTimeout(() => {
      if (!resolved) {
        socket.disconnect();
        reject('Timed out waiting for AmbientWeather data.');
      }
    }, timeoutMs);
  });
}

waitForSocketData()
  .then(() => console.log('✅ Data sent to Supabase'))
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
