import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyApi from './MyApi';
import DetailsScreen from './DetailsScreen';
import TrendsScreen from './TrendsScreen';
import SettingsScreen from './SettingsScreen';
import { WeatherProvider } from './WeatherContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <WeatherProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#007aff',
            tabBarLabelStyle: { fontSize: 12 },
          }}
        >
          <Tab.Screen name="Home" component={MyApi} />
          <Tab.Screen name="Details" component={DetailsScreen} />
          <Tab.Screen name="Trends" component={TrendsScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </WeatherProvider>
  );
}
