"use client"

import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { Home, Heart, Info, Settings } from "lucide-react-native"
import { useTheme } from "./context/ThemeContext"
import { ThemeProvider } from "./context/ThemeContext"

// Screens
import HomeScreen from "./src/screens/HomeScreen"
import FavoritesScreen from "./src/screens/FavoritesScreen"
import AboutScreen from "./src/screens/AboutScreen"
import SettingsScreen from "./src/screens/SettingsScreen"

// Context
import { QuoteProvider } from "./context/QuoteContext"

const Tab = createBottomTabNavigator()

function AppContent() {
  const { isDark } = useTheme()

  // Create custom themes that match our app's design
  const MyLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#6366f1",
      background: "#f9fafb",
      card: "#ffffff",
      text: "#1f2937",
      border: "#e5e7eb",
    },
  }

  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: "#818cf8",
      background: "#111827",
      card: "#1f2937",
      text: "#f9fafb",
      border: "#374151",
    },
  }

  return (
    <SafeAreaProvider>
      <QuoteProvider>
        <NavigationContainer theme={isDark ? MyDarkTheme : MyLightTheme}>
          <StatusBar style={isDark ? "light" : "dark"} />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                if (route.name === "Accueil") {
                  return <Home size={size} color={color} />
                } else if (route.name === "Favoris") {
                  return <Heart size={size} color={color} />
                } else if (route.name === "À propos") {
                  return <Info size={size} color={color} />
                } else if (route.name === "Paramètres") {
                  return <Settings size={size} color={color} />
                }
              },
              tabBarActiveTintColor: isDark ? "#818cf8" : "#6366f1",
              tabBarInactiveTintColor: isDark ? "#9ca3af" : "#6b7280",
              headerShown: true,
              tabBarStyle: {
                backgroundColor: isDark ? "#1f2937" : "#ffffff",
                borderTopColor: isDark ? "#374151" : "#e5e7eb",
              },
              headerStyle: {
                backgroundColor: isDark ? "#1f2937" : "#ffffff",
              },
              headerTintColor: isDark ? "#f9fafb" : "#1f2937",
            })}
          >
            <Tab.Screen name="Accueil" component={HomeScreen} />
            <Tab.Screen name="Favoris" component={FavoritesScreen} />
            <Tab.Screen name="À propos" component={AboutScreen} />
            <Tab.Screen name="Paramètres" component={SettingsScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </QuoteProvider>
    </SafeAreaProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
