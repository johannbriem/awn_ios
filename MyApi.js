import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { io } from 'socket.io-client';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext } from 'react';
import { WeatherContext } from './WeatherContext'; // Assuming you have a WeatherContext
import { formatTemp, formatRain, formatSpeed } from './utils';
import { saveKeys, loadKeys } from './storage'; // <- your helper file
import { timeAgo } from './utils';

export default function MyApi() {
  const [weatherData, setWeatherData] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('Loading weather data...');
  const [errorMessage, setErrorMessage] = useState(null);
  const { unit } = useContext(WeatherContext);
  const appKey = process.env.EXPO_PUBLIC_AMBIENT_APP_KEY;
  const apiKey = process.env.EXPO_PUBLIC_AMBIENT_API_KEY;

  useEffect(() => {
  let timeout;

  (async () => {
    const { appKey, apiKey, usedFallback } = await loadKeys();

    if (!appKey || !apiKey) {
      setErrorMessage('❗ No API keys found. Please enter them in Settings.');
      return;
    }

    if (usedFallback) {
      setLoadingMessage('Using fallback API keys...');
    }

    const socket = io('https://rt2.ambientweather.net', {
      query: {
        api: '1',
        applicationKey: appKey,
      },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      socket.emit('subscribe', { apiKeys: [apiKey] });

      // set a timeout in case no data is returned
      timeout = setTimeout(() => {
        setErrorMessage('⚠️ No data received from station. Check your keys.');
        socket.disconnect();
      }, 30000);
    });

    socket.on('data', (data) => {
      clearTimeout(timeout);
      setWeatherData(data);
    });

    return () => {
      clearTimeout(timeout);
      socket.disconnect();
    };
  })();
}, []);


  const toC = (f) => ((f - 32) * 5 / 9).toFixed(1);

  const getWeatherSummary = () => {
    const uv = weatherData?.uv;
    const rain = weatherData?.hourlyrainin;
    const wind = weatherData?.windspeedmph ?? 0;

    if (rain > 0.05) return { emoji: '🌧️', message: 'Rain expected soon. Grab a jacket!' };
    if (uv >= 7) return { emoji: '😎', message: 'UV is high — sunscreen time!' };
    if (wind > 20) return { emoji: '🌬️', message: 'Windy conditions today — hold your hat!' };
    return { emoji: '🌤️', message: 'Looks like a great day ahead!' };
  };
  const triggerRefresh = () => {
    setWeatherData(null);
    setErrorMessage(null);
    setLoadingMessage('Loading weather data...');
  };
  const triggerRefresh = () => {
    setWeatherData(null);
    setErrorMessage(null);
    setLoadingMessage('Loading weather data...');
  };

  if (errorMessage) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{errorMessage}</Text>
        <Text style={styles.loadingText}>You can try again below.</Text>
        <View style={{ marginTop: 20 }}>
          <ActivityIndicator size="small" color="#007aff" />
        </View>
        <View style={{ marginTop: 30 }}>
          <Text style={{ color: '#007aff', fontWeight: 'bold' }} onPress={triggerRefresh}>
            🔄 Try Again
          </Text>
        </View>
      </View>
    );
  }


  if (!weatherData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={styles.loadingText}>{loadingMessage}</Text>
      </View>
    );
  }

  const summary = getWeatherSummary();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Weather Summary */}
        <View style={styles.summary}>
          <Text style={styles.emoji}>{summary.emoji}</Text>
          <Text style={styles.summaryText}>{summary.message}</Text>
        </View>

        {/* Info Tiles */}
        <View style={styles.grid}>
          <InfoTile 
            label="Temperature"
            icon="🌡️"
            value={formatTemp(weatherData.tempf, unit)}
          />
          <InfoTile label="Humidity" value={`${weatherData.humidity}%`} icon="💧" />
          <InfoTile label="Wind Speed" value={formatSpeed(weatherData.windspeedmph, unit)} icon="💨" />
          <InfoTile label="Wind Gust" value={formatSpeed(weatherData.windgustmph || 'N/A', unit)} icon="🌬️" />
          <InfoTile label="UV Index" value={`${weatherData.uv}`} icon="☀️" />
          <InfoTile label="AQI PM2.5" value={`${weatherData.aqi_pm25}`} icon="🧪" />
          <InfoTile label="Last Rain" value={timeAgo(weatherData.lastRain)} icon="🌧️" />
          <InfoTile label="Today's Rain" value={formatRain(weatherData.hourlyrainin, unit)} icon="🌦️" />
        </View>
      </ScrollView>
    </SafeAreaView>
    );
}

function InfoTile({ label, value, icon }) {
  return (
    <View style={styles.tile}>
      <Text style={styles.tileIcon}>{icon}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
      <Text style={styles.tileValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f1f9ff',
    alignItems: 'center',
  },
  summary: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 42,
  },
  summaryText: {
    fontSize: 16,
    marginTop: 4,
    color: '#444',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
    columnGap: 10,
  },
  tile: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tileIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tileLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  tileValue: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 4,
    color: '#007aff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f9ff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
  color: 'red',
  fontSize: 16,
  textAlign: 'center',
  padding: 20,
},
});
