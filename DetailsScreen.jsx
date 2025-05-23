// TrendsScreen.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DetailsScreen() {
  // This screen is a placeholder for future details
  return (
    <View style={styles.container}>
      <Text style={styles.text}>📊 Trends Coming Soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
  },
});
