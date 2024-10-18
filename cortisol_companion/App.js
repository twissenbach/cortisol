import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import store from './store';
import { auth } from './firebaseConfig';  // Import the configured Firebase auth
import { onAuthStateChanged } from 'firebase/auth';  // Import onAuthStateChanged

import HomeScreen from './home_tab/Home';
import ExpandedProgress from './home_tab/ExpandedProgress';
import ProfileScreen from './profile_tab/Profile';
import ChatScreen from './chat_tab/Chat';

const Tab = createBottomTabNavigator();
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

    return () => unsubscribe();  // Cleanup subscription on unmount
  }, [initializing]);

  if (initializing) return null;  // Optionally add a loading state here

  return (
    <Provider store={store}>
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
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
              } else if (route.name === 'Chat') {
                iconName = focused ? 'chatbubble' : 'chatbubble-outline';
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
          <Tab.Screen 
            name="Chat" 
            component={ChatScreen} 
            options={{ 
              title: 'Chat with AI',
              tabBarLabel: 'Chat' }}
          />
          <Tab.Screen name="Home" component={HomeStack} />
          <Tab.Screen name="Profile">
            {(props) => <ProfileScreen {...props} user={user} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
