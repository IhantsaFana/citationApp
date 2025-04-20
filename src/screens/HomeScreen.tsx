"use client"

import { useRef, useEffect } from "react"
import { View, Text, TouchableOpacity, Share, StyleSheet, ScrollView, Animated } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Heart, RefreshCw, Share2 } from "lucide-react-native"
import { useQuote, type Category } from "../../context/QuoteContext"
import { useTheme } from "../../context/ThemeContext"
import { useTheme as useNavTheme } from "@react-navigation/native"

// Skeleton loader component
const QuoteSkeleton = ({ isDark }: { isDark: boolean }) => (
  <View style={[styles.skeletonContainer, isDark && styles.skeletonContainerDark]}>
    <View style={[styles.skeletonText, isDark && styles.skeletonTextDark]} />
    <View style={[styles.skeletonText, isDark && styles.skeletonTextDark]} />
    <View style={[styles.skeletonText, { width: "70%" }, isDark && styles.skeletonTextDark]} />
    <View style={[styles.skeletonAuthor, { width: "40%" }, isDark && styles.skeletonTextDark]} />
  </View>
)

// Category pill component
const CategoryPill = ({
  category,
  isSelected,
  onPress,
  isDark,
}: {
  category: Category
  isSelected: boolean
  onPress: () => void
  isDark: boolean
}) => {
  // Capitalize first letter
  const displayName = category.charAt(0).toUpperCase() + category.slice(1)

  return (
    <TouchableOpacity
      style={[
        styles.categoryPill,
        isSelected && styles.categoryPillSelected,
        isDark && styles.categoryPillDark,
        isSelected && isDark && styles.categoryPillSelectedDark,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.categoryText,
          isSelected && styles.categoryTextSelected,
          isDark && styles.categoryTextDark,
          isSelected && isDark && styles.categoryTextSelectedDark,
        ]}
      >
        {displayName}
      </Text>
    </TouchableOpacity>
  )
}

const HomeScreen = () => {
  const {
    currentQuote,
    isLoading,
    addToFavorites,
    refreshQuote,
    isFavorite,
    removeFromFavorites,
    categories,
    selectedCategory,
    setSelectedCategory,
  } = useQuote()

  const { isDark } = useTheme()
  const navTheme = useNavTheme()

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(20)).current

  // Run animation when quote changes or loading completes
  useEffect(() => {
    if (!isLoading && currentQuote) {
      // Reset animations
      fadeAnim.setValue(0)
      slideAnim.setValue(20)

      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [isLoading, currentQuote])

  // Share quote functionality
  const shareQuote = async () => {
    if (!currentQuote) return

    try {
      await Share.share({
        message: `"${currentQuote.text}" - ${currentQuote.author}`,
      })
    } catch (error) {
      console.error("Error sharing quote:", error)
    }
  }

  // Toggle favorite
  const toggleFavorite = () => {
    if (!currentQuote) return

    if (isFavorite(currentQuote.id)) {
      removeFromFavorites(currentQuote.id)
    } else {
      addToFavorites(currentQuote)
    }
  }

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContent}
        >
          {categories.map((category) => (
            <CategoryPill
              key={category}
              category={category}
              isSelected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              isDark={isDark}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        {isLoading ? (
          <QuoteSkeleton isDark={isDark} />
        ) : (
          <>
            <Animated.View
              style={[
                styles.quoteContainer,
                isDark && styles.quoteContainerDark,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              <Text style={[styles.quoteText, isDark && styles.quoteTextDark]}>"{currentQuote?.text}"</Text>
              <Text style={[styles.authorText, isDark && styles.authorTextDark]}>- {currentQuote?.author}</Text>

              {currentQuote?.category && currentQuote.category !== "all" && (
                <View style={[styles.quoteCategory, isDark && styles.quoteCategoryDark]}>
                  <Text style={[styles.quoteCategoryText, isDark && styles.quoteCategoryTextDark]}>
                    {currentQuote.category.charAt(0).toUpperCase() + currentQuote.category.slice(1)}
                  </Text>
                </View>
              )}
            </Animated.View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, isDark && styles.actionButtonDark]}
                onPress={toggleFavorite}
              >
                <Heart
                  size={24}
                  color={currentQuote && isFavorite(currentQuote.id) ? "#ef4444" : isDark ? "#9ca3af" : "#6b7280"}
                  fill={currentQuote && isFavorite(currentQuote.id) ? "#ef4444" : "transparent"}
                />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionButton, isDark && styles.actionButtonDark]} onPress={refreshQuote}>
                <RefreshCw size={24} color={isDark ? "#9ca3af" : "#6b7280"} />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionButton, isDark && styles.actionButtonDark]} onPress={shareQuote}>
                <Share2 size={24} color={isDark ? "#9ca3af" : "#6b7280"} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  containerDark: {
    backgroundColor: "#111827",
  },
  categoriesContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  categoriesScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    marginRight: 8,
  },
  categoryPillDark: {
    backgroundColor: "#374151",
  },
  categoryPillSelected: {
    backgroundColor: "#6366f1",
  },
  categoryPillSelectedDark: {
    backgroundColor: "#818cf8",
  },
  categoryText: {
    fontSize: 14,
    color: "#4b5563",
  },
  categoryTextDark: {
    color: "#d1d5db",
  },
  categoryTextSelected: {
    color: "#ffffff",
    fontWeight: "500",
  },
  categoryTextSelectedDark: {
    color: "#ffffff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  quoteContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: "100%",
    maxWidth: 400,
  },
  quoteContainerDark: {
    backgroundColor: "#1f2937",
    shadowColor: "#000",
    shadowOpacity: 0.3,
  },
  quoteText: {
    fontSize: 22,
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: 16,
    lineHeight: 32,
  },
  quoteTextDark: {
    color: "#f9fafb",
  },
  authorText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "right",
    fontStyle: "italic",
  },
  authorTextDark: {
    color: "#9ca3af",
  },
  quoteCategory: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quoteCategoryDark: {
    backgroundColor: "#374151",
  },
  quoteCategoryText: {
    fontSize: 12,
    color: "#4b5563",
    fontWeight: "500",
  },
  quoteCategoryTextDark: {
    color: "#d1d5db",
  },
  actionsContainer: {
    flexDirection: "row",
    marginTop: 24,
    justifyContent: "center",
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonDark: {
    backgroundColor: "#1f2937",
    shadowOpacity: 0.2,
  },
  skeletonContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: "100%",
    maxWidth: 400,
  },
  skeletonContainerDark: {
    backgroundColor: "#1f2937",
  },
  skeletonText: {
    height: 20,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    marginBottom: 12,
    width: "100%",
  },
  skeletonTextDark: {
    backgroundColor: "#374151",
  },
  skeletonAuthor: {
    height: 16,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    marginTop: 8,
    alignSelf: "flex-end",
  },
})

export default HomeScreen
