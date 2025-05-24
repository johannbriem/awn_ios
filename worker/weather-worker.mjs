// worker/weather-worker.js
import { io } from 'socket.io-client';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const APP_KEY = process.env.APP_KEY;
const API_KEY = process.env.API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function waitForSocketData(timeoutMs = 90000) {
  return new Promise((resolve, reject) => {
    const socket = io('https://rt2.ambientweather.net', {
      query: { api: '1', applicationKey: APP_KEY },
      transports: ['websocket'],
    });

    let resolved = false;

    socket.on('connect', () => {
      console.log('✅ Connected to AmbientWeather');
      socket.emit('subscribe', { apiKeys: [API_KEY] });
    });

    socket.on('data', async (data) => {
      if (resolved) return; // prevent double send
      resolved = true;

      console.log('📡 Received data, sending to Supabase...');

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

      const { error } = await supabase.from('weather_data').insert([payload]);
      if (error) {
        console.error('❌ Failed to insert into Supabase:', error.message);
        reject(error);
      } else {
        console.log('✅ Data saved to Supabase');
        resolve();
      }

      socket.disconnect();
    });

    setTimeout(() => {
      if (!resolved) {
        console.log('⏱ Timeout reached. Disconnecting.');
        socket.disconnect();
        reject(new Error('Timed out waiting for AmbientWeather data.'));
      }
    }, timeoutMs);
  });
}

async function runWithRetries(retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔁 Attempt ${attempt} to fetch data`);
      await waitForSocketData();
      return;
    } catch (err) {
      console.error(`⚠️ Attempt ${attempt} failed: ${err.message}`);
      if (attempt === retries) process.exit(1);
      await new Promise(r => setTimeout(r, 5000)); // wait before retry
    }
  }
}

runWithRetries();


waitForSocketData()
  .then(() => console.log('✅ Data sent to Supabase'))
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
