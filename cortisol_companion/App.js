import 'react-native-gesture-handler';

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';

import HomeScreen from './home_tab/Home';
import ExpandedProgress from './home_tab/ExpandedProgress';
import ChartScreen from './chart_tab/chart';
import ProfileScreen from './profile_tab/Profile';
import Tab1Screen from './tab_1/Tab1';
import ChatScreen from './chat_tab/Chat';

const Tab = createBottomTabNavigator();
// const Stack = createStackNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="ExpandedProgress" component={ExpandedProgress} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  if (initializing) return null;

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
            title: 'Chat with AI',
            tabBarLabel: 'Chat' }}
        />
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Progress" component={ChartScreen} />
        <Tab.Screen name="Profile">
          {(props) => <ProfileScreen {...props} user={user} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}