"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Alert } from "react-native"

// Types
export type Category = "motivation" | "success" | "wisdom" | "happiness" | "life" | "all"

export type Quote = {
  id: string
  text: string
  author: string
  category: Category
}

type QuoteContextType = {
  currentQuote: Quote | null
  favorites: Quote[]
  isLoading: boolean
  categories: Category[]
  selectedCategory: Category
  setSelectedCategory: (category: Category) => void
  addToFavorites: (quote: Quote) => void
  removeFromFavorites: (id: string) => void
  refreshQuote: () => void
  isFavorite: (id: string) => boolean
}

// API URL
const QUOTE_API_URL = "https://type.fit/api/quotes"

// Catégories perso
const categories: Category[] = ["all", "motivation", "success", "wisdom", "happiness", "life"]

// Attribution des catégories selon les mots-clés
const assignCategory = (quote: string): Category => {
  const lower = quote.toLowerCase()
  if (lower.includes("success")) return "success"
  if (lower.includes("wisdom")) return "wisdom"
  if (lower.includes("happy") || lower.includes("joy")) return "happiness"
  if (lower.includes("life")) return "life"
  if (lower.includes("motivation") || lower.includes("inspire")) return "motivation"
  return "wisdom"
}

// Contexte
const QuoteContext = createContext<QuoteContextType | undefined>(undefined)

export const QuoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null)
  const [favorites, setFavorites] = useState<Quote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<Category>("all")
  const [allQuotes, setAllQuotes] = useState<Quote[]>([])

  // Load favorites and cached quotes
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem("favorites")
        if (storedFavorites) setFavorites(JSON.parse(storedFavorites))

        const storedQuotes = await AsyncStorage.getItem("cachedQuotes")
        if (storedQuotes) {
          setAllQuotes(JSON.parse(storedQuotes))
        } else {
          // Fetch from API
          const response = await fetch(QUOTE_API_URL)
          const data = await response.json()

          const quotes: Quote[] = data
            .filter((q: any) => q.text && q.author)
            .map((q: any, index: number) => ({
              id: String(index),
              text: q.text,
              author: q.author,
              category: assignCategory(q.text),
            }))

          setAllQuotes(quotes)
          await AsyncStorage.setItem("cachedQuotes", JSON.stringify(quotes))
        }
      } catch (err) {
        Alert.alert("Erreur", "Impossible de charger les données")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const refreshQuote = () => {
    if (allQuotes.length === 0) return

    const filtered = selectedCategory === "all"
      ? allQuotes
      : allQuotes.filter(q => q.category === selectedCategory)

    const random = filtered[Math.floor(Math.random() * filtered.length)]
    setCurrentQuote(random)
  }

  const addToFavorites = async (quote: Quote) => {
    if (!favorites.find(fav => fav.id === quote.id)) {
      const updated = [...favorites, quote]
      setFavorites(updated)
      await AsyncStorage.setItem("favorites", JSON.stringify(updated))
    }
  }

  const removeFromFavorites = async (id: string) => {
    const updated = favorites.filter(q => q.id !== id)
    setFavorites(updated)
    await AsyncStorage.setItem("favorites", JSON.stringify(updated))
  }

  const isFavorite = (id: string) => {
    return favorites.some(q => q.id === id)
  }

  // Rafraîchissement initial
  useEffect(() => {
    if (allQuotes.length > 0) refreshQuote()

    const interval = setInterval(() => {
      refreshQuote()
    }, 120000) // toutes les 2 minutes

    return () => clearInterval(interval)
  }, [selectedCategory, allQuotes])

  return (
    <QuoteContext.Provider
      value={{
        currentQuote,
        favorites,
        isLoading,
        categories,
        selectedCategory,
        setSelectedCategory,
        addToFavorites,
        removeFromFavorites,
        refreshQuote,
        isFavorite,
      }}
    >
      {children}
    </QuoteContext.Provider>
  )
}

export const useQuote = () => {
  const context = useContext(QuoteContext)
  if (context === undefined) {
    throw new Error("useQuote must be used within a QuoteProvider")
  }
  return context
}
