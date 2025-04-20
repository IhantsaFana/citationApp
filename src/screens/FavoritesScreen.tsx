"use client"

import { useState } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Trash2, Share2, Filter } from "lucide-react-native"
import { useQuote, type Quote, type Category } from "../../context/QuoteContext"
import { useTheme } from "../../context/ThemeContext"
import { Share } from "react-native"

// Category filter component
const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
  isDark,
}: {
  categories: Category[]
  selectedCategory: Category
  onSelectCategory: (category: Category) => void
  isDark: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[styles.filterButton, isDark && styles.filterButtonDark]}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Filter size={16} color={isDark ? "#d1d5db" : "#4b5563"} />
        <Text style={[styles.filterButtonText, isDark && styles.filterButtonTextDark]}>
          {selectedCategory === "all"
            ? "Toutes les catégories"
            : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
        </Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={[styles.filterDropdown, isDark && styles.filterDropdownDark]}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterItem,
                selectedCategory === category && styles.filterItemSelected,
                isDark && styles.filterItemDark,
                selectedCategory === category && isDark && styles.filterItemSelectedDark,
              ]}
              onPress={() => {
                onSelectCategory(category)
                setIsOpen(false)
              }}
            >
              <Text
                style={[
                  styles.filterItemText,
                  selectedCategory === category && styles.filterItemTextSelected,
                  isDark && styles.filterItemTextDark,
                ]}
              >
                {category === "all" ? "Toutes les catégories" : category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}

const FavoritesScreen = () => {
  const { favorites, removeFromFavorites, categories } = useQuote()
  const { isDark } = useTheme()
  const [filterCategory, setFilterCategory] = useState<Category>("all")

  // Filter favorites by category
  const filteredFavorites =
    filterCategory === "all" ? favorites : favorites.filter((quote) => quote.category === filterCategory)

  // Share quote functionality
  const shareQuote = async (quote: Quote) => {
    try {
      await Share.share({
        message: `"${quote.text}" - ${quote.author}`,
      })
    } catch (error) {
      console.error("Error sharing quote:", error)
    }
  }

  // Confirm deletion
  const confirmDelete = (quote: Quote) => {
    Alert.alert("Supprimer le favori", "Êtes-vous sûr de vouloir supprimer cette citation de vos favoris ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: () => removeFromFavorites(quote.id) },
    ])
  }

  // Render empty state
  const renderEmptyState = () => (
    <View style={[styles.emptyContainer, isDark && styles.emptyContainerDark]}>
      <Text style={[styles.emptyTitle, isDark && styles.emptyTitleDark]}>Aucun favori</Text>
      <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
        Les citations que vous aimez apparaîtront ici. Ajoutez-en depuis l'écran d'accueil !
      </Text>
    </View>
  )

  // Render quote item
  const renderQuoteItem = ({ item }: { item: Quote }) => (
    <View style={[styles.quoteItem, isDark && styles.quoteItemDark]}>
      <View style={styles.quoteContent}>
        <Text style={[styles.quoteText, isDark && styles.quoteTextDark]}>"{item.text}"</Text>
        <Text style={[styles.authorText, isDark && styles.authorTextDark]}>- {item.author}</Text>

        {item.category && item.category !== "all" && (
          <View style={[styles.categoryTag, isDark && styles.categoryTagDark]}>
            <Text style={[styles.categoryTagText, isDark && styles.categoryTagTextDark]}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.quoteActions}>
        <TouchableOpacity
          style={[styles.actionButton, isDark && styles.actionButtonDark]}
          onPress={() => shareQuote(item)}
        >
          <Share2 size={20} color={isDark ? "#d1d5db" : "#6b7280"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, isDark && styles.actionButtonDark]}
          onPress={() => confirmDelete(item)}
        >
          <Trash2 size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <CategoryFilter
        categories={categories}
        selectedCategory={filterCategory}
        onSelectCategory={setFilterCategory}
        isDark={isDark}
      />

      <FlatList
        data={filteredFavorites}
        renderItem={renderQuoteItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  // Styles remain unchanged
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  containerDark: {
    backgroundColor: "#111827",
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  quoteItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quoteItemDark: {
    backgroundColor: "#1f2937",
    shadowOpacity: 0.2,
  },
  quoteContent: {
    marginBottom: 12,
  },
  quoteText: {
    fontSize: 16,
    color: "#1f2937",
    marginBottom: 8,
    lineHeight: 24,
  },
  quoteTextDark: {
    color: "#f9fafb",
  },
  authorText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "right",
    fontStyle: "italic",
  },
  authorTextDark: {
    color: "#9ca3af",
  },
  quoteActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  actionButtonDark: {
    backgroundColor: "#374151",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    minHeight: 300,
  },
  emptyContainerDark: {
    backgroundColor: "#111827",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  emptyTitleDark: {
    color: "#f9fafb",
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
  },
  emptyTextDark: {
    color: "#9ca3af",
  },
  filterContainer: {
    padding: 16,
    paddingBottom: 8,
    position: "relative",
    zIndex: 10,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  filterButtonDark: {
    backgroundColor: "#374151",
  },
  filterButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#4b5563",
  },
  filterButtonTextDark: {
    color: "#d1d5db",
  },
  filterDropdown: {
    position: "absolute",
    top: 60,
    left: 16,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 20,
  },
  filterDropdownDark: {
    backgroundColor: "#1f2937",
  },
  filterItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  filterItemDark: {
    backgroundColor: "#1f2937",
  },
  filterItemSelected: {
    backgroundColor: "#e5e7eb",
  },
  filterItemSelectedDark: {
    backgroundColor: "#374151",
  },
  filterItemText: {
    fontSize: 14,
    color: "#4b5563",
  },
  filterItemTextDark: {
    color: "#d1d5db",
  },
  filterItemTextSelected: {
    fontWeight: "500",
    color: "#1f2937",
  },
  categoryTag: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryTagDark: {
    backgroundColor: "#374151",
  },
  categoryTagText: {
    fontSize: 12,
    color: "#4b5563",
    fontWeight: "500",
  },
  categoryTagTextDark: {
    color: "#d1d5db",
  },
})

export default FavoritesScreen
