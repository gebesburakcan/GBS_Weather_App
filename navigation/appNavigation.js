import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen.js';
import FavoriteScreen from '../screens/FavoriteScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import TodoScreen from '../screens/TodoScreen.js';

const Tab = createBottomTabNavigator();

const App = () => {
  // Define favorites here or wherever it's coming from
  const favorites = [];

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Icon name='home' color='black' size={30}/>
            ),
          }}
        />
        <Tab.Screen 
          name="Favorite" 
          component={FavoriteScreen} // Pass the component directly
          initialParams={{ favoriteCities: favorites }} // Pass favorites as initial params
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Icon name='heart' color='red' size={30}/>
            ),
          }}
        />
        <Tab.Screen name='Todo' component={TodoScreen}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
