# 🌤️ Ambient Weather Worker

This small Node.js script connects to AmbientWeather and pushes data to Supabase every 10 minutes.

## Setup (Render Free Plan)

1. Fork or clone this repo
2. Create a `.env` file in `/worker` (use `.env.example`)
3. Deploy to [https://render.com](https://render.com)
   - Service type: **Background Worker**
   - Runtime: **Node**
   - Start command: `node weather-worker.js`
4. Set your environment variables via the Render dashboard

That’s it! Your weather station will stream data to Supabase every 10 minutes.
