"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { useColorScheme } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

type ThemeType = "light" | "dark" | "system"

type ThemeContextType = {
  theme: ThemeType
  isDark: boolean
  setTheme: (theme: ThemeType) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme()
  const [theme, setThemeState] = useState<ThemeType>("system")

  // Determine if we should use dark mode
  const isDark = theme === "system" ? systemColorScheme === "dark" : theme === "dark"

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("theme")
        if (savedTheme) {
          setThemeState(savedTheme as ThemeType)
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error)
      }
    }

    loadTheme()
  }, [])

  // Save theme preference when it changes
  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme)
    try {
      await AsyncStorage.setItem("theme", newTheme)
    } catch (error) {
      console.error("Failed to save theme preference:", error)
    }
  }

  // Toggle between light and dark (ignoring system)
  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark"
    setTheme(newTheme)
  }

  return <ThemeContext.Provider value={{ theme, isDark, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
