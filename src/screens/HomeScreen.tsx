"use client"

import { useRef, useEffect, useState } from "react"
import { 
  View, Text, TouchableOpacity, Share, StyleSheet, ScrollView, 
  Animated, Easing, Dimensions, Pressable, Modal
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Heart, RefreshCw, Share2, ChevronDown, X, Quote } from "lucide-react-native"
import { useQuote, type Category } from "../../context/QuoteContext"
import { useTheme } from "../../context/ThemeContext"
import { LinearGradient } from "expo-linear-gradient"
import { Swipeable } from "react-native-gesture-handler"

// Enhanced Skeleton loader component with pulse animation
const QuoteSkeleton = ({ isDark }: { isDark: boolean }) => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[
      styles.skeletonContainer, 
      isDark && styles.skeletonContainerDark,
      { opacity: pulseAnim }
    ]}>
      <View style={[styles.skeletonText, isDark && styles.skeletonTextDark]} />
      <View style={[styles.skeletonText, isDark && styles.skeletonTextDark]} />
      <View style={[styles.skeletonText, { width: "70%" }, isDark && styles.skeletonTextDark]} />
      <View style={[styles.skeletonAuthor, { width: "40%" }, isDark && styles.skeletonTextDark]} />
    </Animated.View>
  )
}

// Category pill component
const CategoryPill = ({
  category,
  isSelected,
  onPress,
  isDark,
  count = 0,
}: {
  category: Category
  isSelected: boolean
  onPress: () => void
  isDark: boolean
  count?: number
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
      {count > 0 && (
        <View style={[
          styles.categoryCount, 
          isDark && styles.categoryCountDark,
          isSelected && styles.categoryCountSelected
        ]}>
          <Text style={[
            styles.categoryCountText,
            isDark && styles.categoryCountTextDark,
            isSelected && styles.categoryCountTextSelected
          ]}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

// Category modal component
const CategoryModal = ({
  visible,
  onClose,
  categories,
  selectedCategory,
  onSelectCategory,
  isDark,
  categoryCounts
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[
          styles.modalContent,
          isDark && styles.modalContentDark
        ]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>
              Select Category
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={isDark ? "#d1d5db" : "#6b7280"} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.categoryList}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryItem,
                  selectedCategory === category && styles.categoryItemSelected,
                  isDark && styles.categoryItemDark,
                  selectedCategory === category && isDark && styles.categoryItemSelectedDark,
                ]}
                onPress={() => {
                  onSelectCategory(category);
                  onClose();
                }}
              >
                <Text
                  style={[
                    styles.categoryItemText,
                    selectedCategory === category && styles.categoryItemTextSelected,
                    isDark && styles.categoryItemTextDark,
                  ]}
                >
                  {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
                <View style={[
                  styles.categoryItemCount,
                  isDark && styles.categoryItemCountDark
                ]}>
                  <Text style={[
                    styles.categoryItemCountText,
                    isDark && styles.categoryItemCountTextDark
                  ]}>
                    {categoryCounts[category] || 0}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

// Decorative Quotation Marks
const QuotationMark = ({ isDark, isOpening = true }) => (
  <View style={[
    styles.quotationMark,
    isOpening ? styles.openingQuote : styles.closingQuote
  ]}>
    <Quote 
      size={48} 
      color={isDark ? "rgba(209, 213, 219, 0.1)" : "rgba(75, 85, 99, 0.1)"} 
      fill={isDark ? "rgba(209, 213, 219, 0.1)" : "rgba(75, 85, 99, 0.1)"}
    />
  </View>
);

// App Header Component
const AppHeader = ({ title, isDark }) => (
  <View style={[styles.header, isDark && styles.headerDark]}>
    <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
      {title}
    </Text>
  </View>
);

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
    favorites
  } = useQuote()

  const { isDark } = useTheme()
  
  // State for modal
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  
  // Calculate category counts
  const categoryCounts = categories.reduce((counts, category) => {
    if (category === 'all') {
      counts[category] = favorites.length;
    } else {
      counts[category] = favorites.filter(q => q.category === category).length;
    }
    return counts;
  }, {});

  // Animation values with additional ones for staggered animation
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(20)).current
  const fadeAuthorAnim = useRef(new Animated.Value(0)).current
  const scaleHeart = useRef(new Animated.Value(1)).current
  
  // Swipe ref for gestures
  const swipeableRef = useRef(null);

  // Run animation when quote changes or loading completes
  useEffect(() => {
    if (!isLoading && currentQuote) {
      // Reset animations
      fadeAnim.setValue(0)
      slideAnim.setValue(20)
      fadeAuthorAnim.setValue(0)

      // Start staggered animations
      Animated.sequence([
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
        ]),
        Animated.timing(fadeAuthorAnim, {
          toValue: 1,
          duration: 300,
          delay: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [isLoading, currentQuote])

  // Heart animation for favorite toggle
  const animateHeart = () => {
    Animated.sequence([
      Animated.timing(scaleHeart, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleHeart, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start()
  }

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

  // Toggle favorite with animation
  const toggleFavorite = () => {
    if (!currentQuote) return

    animateHeart()
    
    if (isFavorite(currentQuote.id)) {
      removeFromFavorites(currentQuote.id)
    } else {
      addToFavorites(currentQuote)
    }
  }
  
  // Handle right swipe - next quote
  const rightSwipeActions = () => {
    return null; // Empty view, we just want the swipe action
  };
  
  // Handle left swipe - previous quote (could be implemented if you keep quote history)
  const leftSwipeActions = () => {
    return null; // Empty view for swipe action
  };
  
  // Handle swipe action
  const onSwipe = (direction) => {
    if (direction === 'right') {
      refreshQuote();
    }
    // Handle left swipe if you implement history
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <AppHeader title="Daily Quotes" isDark={isDark} />
      
      <View style={styles.categorySection}>
        <TouchableOpacity 
          style={[styles.categoryDropdown, isDark && styles.categoryDropdownDark]}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Text style={[styles.categoryDropdownText, isDark && styles.categoryDropdownTextDark]}>
            {selectedCategory === "all" ? "All Categories" : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
          </Text>
          <ChevronDown size={18} color={isDark ? "#d1d5db" : "#6b7280"} />
        </TouchableOpacity>
        
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
              count={categoryCounts[category] || 0}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        {isLoading ? (
          <QuoteSkeleton isDark={isDark} />
        ) : (
          <>
            <Swipeable
              ref={swipeableRef}
              renderRightActions={rightSwipeActions}
              renderLeftActions={leftSwipeActions}
              onSwipeableOpen={(direction) => {
                onSwipe(direction);
                swipeableRef.current?.close();
              }}
            >
              <LinearGradient
                colors={isDark ? 
                  ['#1e293b', '#0f172a'] : 
                  ['#ffffff', '#f8fafc']}
                style={[styles.quoteContainer]}
              >
                <QuotationMark isDark={isDark} isOpening={true} />
                
                <Animated.Text 
                  style={[
                    styles.quoteText, 
                    isDark && styles.quoteTextDark,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                  ]}
                >
                  {currentQuote?.text}
                </Animated.Text>
                
                <Animated.Text 
                  style={[
                    styles.authorText, 
                    isDark && styles.authorTextDark,
                    { opacity: fadeAuthorAnim }
                  ]}
                >
                  - {currentQuote?.author}
                </Animated.Text>
                
                <QuotationMark isDark={isDark} isOpening={false} />

                {currentQuote?.category && currentQuote.category !== "all" && (
                  <View style={[styles.quoteCategory, isDark && styles.quoteCategoryDark]}>
                    <Text style={[styles.quoteCategoryText, isDark && styles.quoteCategoryTextDark]}>
                      {currentQuote.category.charAt(0).toUpperCase() + currentQuote.category.slice(1)}
                    </Text>
                  </View>
                )}
              </LinearGradient>
            </Swipeable>

            <View style={styles.actionsContainer}>
              <Animated.View style={{ transform: [{ scale: scaleHeart }] }}>
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
              </Animated.View>

              <TouchableOpacity 
                style={[styles.actionButton, isDark && styles.actionButtonDark]} 
                onPress={refreshQuote}
              >
                <RefreshCw size={24} color={isDark ? "#9ca3af" : "#6b7280"} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, isDark && styles.actionButtonDark]} 
                onPress={shareQuote}
              >
                <Share2 size={24} color={isDark ? "#9ca3af" : "#6b7280"} />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.swipeHint, isDark && styles.swipeHintDark]}>
              Swipe to see a new quote
            </Text>
          </>
        )}
      </View>
      
      <CategoryModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        isDark={isDark}
        categoryCounts={categoryCounts}
      />
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    alignItems: "center",
  },
  headerDark: {
    borderBottomColor: "#374151",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  headerTitleDark: {
    color: "#f9fafb",
  },
  categorySection: {
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  categoryDropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  categoryDropdownDark: {
    backgroundColor: "#374151",
  },
  categoryDropdownText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#4b5563",
  },
  categoryDropdownTextDark: {
    color: "#d1d5db",
  },
  categoriesScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
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
  categoryCount: {
    backgroundColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
    minWidth: 20,
    alignItems: "center",
  },
  categoryCountDark: {
    backgroundColor: "#4b5563",
  },
  categoryCountSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  categoryCountText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#4b5563",
  },
  categoryCountTextDark: {
    color: "#e5e7eb",
  },
  categoryCountTextSelected: {
    color: "#ffffff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  quoteContainer: {
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: "100%",
    maxWidth: 400,
    position: "relative",
    overflow: "hidden",
  },
  quotationMark: {
    position: "absolute",
    opacity: 0.7,
  },
  openingQuote: {
    top: 4,
    left: 4,
  },
  closingQuote: {
    bottom: 4,
    right: 4,
    transform: [{ rotate: "180deg" }],
  },
  quoteText: {
    fontSize: 22,
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: 16,
    lineHeight: 32,
    textAlign: "center",
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
    backgroundColor: "rgba(229, 231, 235, 0.8)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quoteCategoryDark: {
    backgroundColor: "rgba(55, 65, 81, 0.8)",
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
  swipeHint: {
    marginTop: 16,
    fontSize: 13,
    color: "#9ca3af",
    textAlign: "center",
  },
  swipeHintDark: {
    color: "#6b7280",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: Dimensions.get("window").height * 0.7,
  },
  modalContentDark: {
    backgroundColor: "#1f2937",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  modalTitleDark: {
    color: "#f9fafb",
  },
  closeButton: {
    padding: 4,
  },
  categoryList: {
    marginBottom: 20,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  categoryItemDark: {
    backgroundColor: "#1f2937",
  },
  categoryItemSelected: {
    backgroundColor: "#f3f4f6",
  },
  categoryItemSelectedDark: {
    backgroundColor: "#374151",
  },
  categoryItemText: {
    fontSize: 16,
    color: "#4b5563",
  },
  categoryItemTextDark: {
    color: "#d1d5db",
  },
  categoryItemTextSelected: {
    fontWeight: "500",
    color: "#1f2937",
  },
  categoryItemCount: {
    backgroundColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
  },
  categoryItemCountDark: {
    backgroundColor: "#4b5563",
  },
  categoryItemCountText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4b5563",
  },
  categoryItemCountTextDark: {
    color: "#e5e7eb",
  },
})

export default HomeScreen