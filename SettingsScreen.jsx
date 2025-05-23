import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch } from 'react-native';
import { saveKeys, loadKeys } from './storage'; // <- your helper file
import { SafeAreaView } from 'react-native-safe-area-context';
import { WeatherContext } from './WeatherContext'; // Assuming you have a WeatherContext


export default function SettingsScreen() {
  const [appKey, setAppKey] = useState('');
  const [apiKey, setApiKey] = useState('');
  const { unit, setUnit } = useContext(WeatherContext);
  const isMetric = unit === 'metric';

  useEffect(() => {
    (async () => {
      const { appKey, apiKey } = await loadKeys();
      if (appKey) setAppKey(appKey);
      if (apiKey) setApiKey(apiKey);
    })();
  }, []);

  const handleSave = async () => {
    await saveKeys(appKey, apiKey);
    alert('API keys saved!');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.unitToggleRow}>
        <Text style={styles.label}>Use Metric Units</Text>
        <Switch
          value={unit === 'metric'}
          onValueChange={(value) => setUnitAndSave(value ? 'metric' : 'imperial')}
        />
      </View>
      <View style={styles.container}>
        <Text style={styles.header}>🔐 API Key Setup</Text>
        <TextInput
          style={styles.input}
          placeholder="Ambient App Key"
          value={appKey}
          onChangeText={setAppKey}
          secureTextEntry={appKey.length > 10}
        />
        <TextInput
          style={styles.input}
          placeholder="Ambient API Key"
          value={apiKey}
          onChangeText={setApiKey}
          secureTextEntry={apiKey.length > 10}
        />
        <Button title="Save Keys" onPress={handleSave} />
        <Text style={styles.help}>Need help? Tap here for setup guide (coming soon)</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderColor: '#ccc', borderWidth: 1, padding: 10, marginBottom: 16, borderRadius: 8,
  },
  help: {
    marginTop: 20,
    color: '#007aff',
    textDecorationLine: 'underline',
  },
  unitToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});
