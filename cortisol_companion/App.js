import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import store from './store';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { View, ActivityIndicator } from 'react-native';
import { getUserTasks, initializeUserData } from './firebaseServices';
import { setTasks } from './store';
import { LinearGradient } from 'expo-linear-gradient';

import HomeScreen from './home_tab/Home';
import ExpandedProgress from './home_tab/ExpandedProgress';
import ExpandedManageTasks from './home_tab/ExpandedManageTasks';
import ExpandedSteps from './home_tab/ExpandedSteps';
import ProfileScreen from './profile_tab/Profile';
import ChatScreen from './chat_tab/Chat';
import SignInSignUpScreen from './profile_tab/SignInSignUp';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="HomeMain"
      screenOptions={{
        headerShown: false,
        presentation: 'card',
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen} 
      />
      <Stack.Screen 
        name="ExpandedProgress" 
        component={ExpandedProgress} 
      />
      <Stack.Screen 
        name="ExpandedManageTasks" 
        component={ExpandedManageTasks}
      />
      <Stack.Screen 
        name="ExpandedSteps" 
        component={ExpandedSteps}
      />
    </Stack.Navigator>
  );
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
      <ActivityIndicator size="large" color="white" />
    </View>
  );
}

// Wrap the main app content with Redux Provider
function AppContent() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadUserData = async (user) => {
      if (user && isMounted) {
        try {
          await initializeUserData();
          const userTasks = await getUserTasks();
          store.dispatch(setTasks(userTasks));
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (isMounted) {
        setUser(user);
        if (user) {
          await loadUserData(user);
        }
        setInitializing(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  if (initializing) {
    return <LoadingScreen />;
  }

  return (
    <LinearGradient
      colors={['#0000FF', '#00FFFF']}
      style={{ flex: 1 }}
    >
      <NavigationContainer theme={{
        dark: true,
        colors: {
          primary: 'white',
          background: 'transparent', // used to be black
          card: 'black',
          text: 'white',
          border: 'white',
          notification: 'white',
        },
      }}>
        {user ? (
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
              tabBarStyle: { 
                backgroundColor: 'black', 
                borderTopColor: '#333',
                height: 60,
                paddingBottom: 8,
                paddingTop: 8,
              },
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
                tabBarLabel: 'Chat' 
              }} 
            />
            <Tab.Screen 
              name="Home" 
              component={HomeStack} 
              options={{
                headerShown: false
              }}
            />
            <Tab.Screen 
              name="Profile"
              options={{ title: 'Profile' }}
            >
              {(props) => <ProfileScreen {...props} user={user} />}
            </Tab.Screen>
          </Tab.Navigator>
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SignInSignUp" component={SignInSignUpScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </LinearGradient>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}