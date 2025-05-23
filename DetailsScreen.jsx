import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DetailsScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>📈 Station Records</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Highest Temp:</Text>
          <Text style={styles.value}>102.5 °F / 39.2 °C</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Strongest Wind:</Text>
          <Text style={styles.value}>32.8 mph / 52.8 km/h</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Coldest Day:</Text>
          <Text style={styles.value}>12.3 °F / -11.0 °C</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Last Rain:</Text>
          <Text style={styles.value}>2 days ago</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f1f9ff' },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: { fontSize: 16, color: '#555' },
  value: { fontSize: 18, fontWeight: '600', color: '#007aff' },
});
