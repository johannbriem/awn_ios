import React, { useContext } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { WeatherContext } from './WeatherContext';

export default function SettingsScreen() {
  const { unit, setUnit } = useContext(WeatherContext);
  const isMetric = unit === 'metric';

  return (
    <View style={styles.container}>
      <Text style={styles.header}>⚙️ Settings</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Use Metric Units</Text>
        <Switch
          value={isMetric}
          onValueChange={() => setUnit(isMetric ? 'imperial' : 'metric')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f1f9ff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
  },
});
