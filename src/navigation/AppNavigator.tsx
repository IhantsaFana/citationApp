// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import AboutScreen from '../screens/AboutScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Citation du jour' }} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favoris' }} />
        <Stack.Screen name="About" component={AboutScreen} options={{ title: 'À propos' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
