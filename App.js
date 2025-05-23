import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyApi from './MyApi';
import DetailsScreen from './DetailsScreen';
import TrendsScreen from './TrendsScreen';
import SettingsScreen from './SettingsScreen';
import { WeatherProvider } from './WeatherContext';
import { Ionicons } from '@expo/vector-icons';

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
          <Tab.Screen 
            name="Home" 
            component={MyApi}
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({ color }) => (
                <Ionicons name="home" size={24} color={color} />
              ),
            }}
          />
          <Tab.Screen 
            name="Details" 
            component={DetailsScreen} 
            options={{
              tabBarLabel: 'Details',
              tabBarIcon: ({ color }) => (
                <Ionicons name="information-circle" size={24} color={color} />
              ),
            }}
          />
          <Tab.Screen 
            name="Trends" 
            component={TrendsScreen} 
            options={{
              tabBarLabel: 'Trends',
              tabBarIcon: ({ color }) => (
                <Ionicons name="bar-chart" size={24} color={color} />
              ),
            }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{
              tabBarLabel: 'Settings',
              tabBarIcon: ({ color }) => (
                <Ionicons name="settings" size={24} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </WeatherProvider>
  );
}
