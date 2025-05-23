import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { io } from 'socket.io-client';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext } from 'react';
import { WeatherContext } from './WeatherContext'; // Assuming you have a WeatherContext
import { formatTemp, formatRain, formatSpeed } from './utils';

export default function MyApi() {
  const [weatherData, setWeatherData] = useState(null);
  const { unit } = useContext(WeatherContext);

  useEffect(() => {
    const socket = io('https://rt2.ambientweather.net', {
      query: {
        api: '1',
        applicationKey: '66ea184d1e7b42009e69df31a647d56281ab7c8057df477782e4b912cc553d9a',
      },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      socket.emit('subscribe', {
        apiKeys: ['cddb83d67bcf46b8acee134f1102c62a8494c05d9d2647849746f158ec0222a2'],
      });
    });

    socket.on('data', (data) => {
      setWeatherData(data);
    });

    return () => socket.disconnect();
  }, []);

  const toC = (f) => ((f - 32) * 5 / 9).toFixed(1);

  const getWeatherSummary = () => {
    const uv = weatherData?.uv;
    const rain = weatherData?.hourlyrainin;
    const emoji = uv >= 5 ? '😎' : rain > 0 ? '🌧️' : '🌤️';
    let message = '';

    if (uv >= 6) {
      message = "UV is high – sunscreen is your best friend!";
    } else if (rain > 0) {
      message = "Some rain coming in – might want an umbrella.";
    } else {
      message = "Looks like a great day ahead!";
    }

    return { emoji, message };
  };

  if (!weatherData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={styles.loadingText}>Loading weather...</Text>
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
          <InfoTile label="Last Rain" value={new Date(weatherData.lastRain).toLocaleTimeString()} icon="🌧️" />
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
});
