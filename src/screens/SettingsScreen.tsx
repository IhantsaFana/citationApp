"use client"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "../../context/ThemeContext"
import { Moon, Sun, Smartphone } from "lucide-react-native"
import { useQuote } from "../../context/QuoteContext"

const SettingsScreen = () => {
  const { theme, isDark, setTheme } = useTheme()
  const { refreshQuote } = useQuote()

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.content}>
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Apparence</Text>

          <TouchableOpacity
            style={[
              styles.optionItem,
              theme === "light" && styles.selectedOption,
              isDark && styles.optionItemDark,
              theme === "light" && isDark && styles.selectedOptionDark,
            ]}
            onPress={() => setTheme("light")}
          >
            <View style={styles.optionIcon}>
              <Sun size={20} color={isDark ? "#d1d5db" : "#4b5563"} />
            </View>
            <Text style={[styles.optionText, isDark && styles.optionTextDark]}>Thème clair</Text>
            {theme === "light" && <View style={[styles.checkmark, isDark && styles.checkmarkDark]} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionItem,
              theme === "dark" && styles.selectedOption,
              isDark && styles.optionItemDark,
              theme === "dark" && isDark && styles.selectedOptionDark,
            ]}
            onPress={() => setTheme("dark")}
          >
            <View style={styles.optionIcon}>
              <Moon size={20} color={isDark ? "#d1d5db" : "#4b5563"} />
            </View>
            <Text style={[styles.optionText, isDark && styles.optionTextDark]}>Thème sombre</Text>
            {theme === "dark" && <View style={[styles.checkmark, isDark && styles.checkmarkDark]} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionItem,
              theme === "system" && styles.selectedOption,
              isDark && styles.optionItemDark,
              theme === "system" && isDark && styles.selectedOptionDark,
            ]}
            onPress={() => setTheme("system")}
          >
            <View style={styles.optionIcon}>
              <Smartphone size={20} color={isDark ? "#d1d5db" : "#4b5563"} />
            </View>
            <Text style={[styles.optionText, isDark && styles.optionTextDark]}>Système</Text>
            {theme === "system" && <View style={[styles.checkmark, isDark && styles.checkmarkDark]} />}
          </TouchableOpacity>
        </View>

        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>À propos</Text>
          <Text style={[styles.versionText, isDark && styles.versionTextDark]}>Version 2.0.0</Text>
          <Text style={[styles.copyrightText, isDark && styles.copyrightTextDark]}>© 2024 Citation App</Text>
        </View>
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
  content: {
    padding: 16,
  },
  section: {
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
  sectionDark: {
    backgroundColor: "#1f2937",
    shadowOpacity: 0.2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  sectionTitleDark: {
    color: "#f9fafb",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  optionItemDark: {
    backgroundColor: "#1f2937",
  },
  selectedOption: {
    backgroundColor: "#f3f4f6",
  },
  selectedOptionDark: {
    backgroundColor: "#374151",
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: "#4b5563",
    flex: 1,
    marginLeft: 8,
  },
  optionTextDark: {
    color: "#d1d5db",
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#6366f1",
  },
  checkmarkDark: {
    backgroundColor: "#818cf8",
  },
  versionText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  versionTextDark: {
    color: "#9ca3af",
  },
  copyrightText: {
    fontSize: 14,
    color: "#9ca3af",
  },
  copyrightTextDark: {
    color: "#6b7280",
  },
})

export default SettingsScreen
