import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

export default function TrendsScreen() {
  const data = {
    labels: ['6am', '9am', '12pm', '3pm', '6pm'],
    datasets: [
      {
        data: [48.2, 53.1, 58.6, 60.3, 57.0],
        color: () => '#007aff',
      },
    ],
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>📊 Temperature Trend</Text>
        <LineChart
          data={data}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundGradientFrom: '#f1f9ff',
            backgroundGradientTo: '#f1f9ff',
            color: () => '#007aff',
            labelColor: () => '#333',
            decimalPlaces: 1,
          }}
          style={styles.chart}
          bezier
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f1f9ff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  chart: {
    borderRadius: 12,
  },
});
