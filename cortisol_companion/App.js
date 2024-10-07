import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './home_tab/Home';
import ChartScreen from './chart_tab/chart';
import ProfileScreen from './profile_tab/Profile';
import Tab1Screen from './tab_1/Tab1';
import ChatScreen from './chat_tab/Chat';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer theme={{
      dark: true,
      colors: {
        primary: 'white',
        background: 'black',
        card: 'black',
        text: 'white',
        border: 'white',
        notification: 'white',
      },
    }}>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Progress') {
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Chat') {
              iconName = focused ? 'chatbubble' : 'chatbubble-outline';
            } else if (route.name === 'Tab1') {
              iconName = focused ? 'checkbox' : 'checkbox-outline';
            }
            else {
              iconName = 'help-circle-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { backgroundColor: 'black', borderTopColor: '#333' },
          headerStyle: { backgroundColor: 'black' },
          headerTintColor: 'white',
          headerTitleAlign: 'center',
        })}
      >
        <Tab.Screen name="Tab1" component={Tab1Screen} />
        <Tab.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={{ 
            title: 'Chat with AI', // top bar screen title
            tabBarLabel: 'Chat' }} // bottom tab icon label
        />
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Progress" component={ChartScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}