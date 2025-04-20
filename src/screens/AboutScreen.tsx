"use client"
import { View, Text, StyleSheet, ScrollView, Linking } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "../../context/ThemeContext"

const AboutScreen = () => {
  const { isDark } = useTheme()

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.title, isDark && styles.titleDark]}>Citation</Text>
          <Text style={[styles.version, isDark && styles.versionDark]}>Version 2.0.0</Text>

          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>À propos de l'application</Text>
          <Text style={[styles.paragraph, isDark && styles.paragraphDark]}>
            Citation est une application qui vous permet de découvrir des citations inspirantes, de les enregistrer dans
            vos favoris et de les consulter même sans connexion internet.
          </Text>
        </View>

        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Technologies utilisées</Text>
          <View style={styles.techItem}>
            <Text style={[styles.techName, isDark && styles.techNameDark]}>• React Native avec Expo</Text>
            <Text style={[styles.techDescription, isDark && styles.techDescriptionDark]}>
              Pour construire l'application mobile
            </Text>
          </View>
          <View style={styles.techItem}>
            <Text style={[styles.techName, isDark && styles.techNameDark]}>• TypeScript</Text>
            <Text style={[styles.techDescription, isDark && styles.techDescriptionDark]}>
              Pour avoir un code typé et plus sûr
            </Text>
          </View>
          <View style={styles.techItem}>
            <Text style={[styles.techName, isDark && styles.techNameDark]}>• AsyncStorage</Text>
            <Text style={[styles.techDescription, isDark && styles.techDescriptionDark]}>
              Pour stocker les favoris localement
            </Text>
          </View>
          <View style={styles.techItem}>
            <Text style={[styles.techName, isDark && styles.techNameDark]}>• React Navigation</Text>
            <Text style={[styles.techDescription, isDark && styles.techDescriptionDark]}>
              Pour naviguer entre les écrans
            </Text>
          </View>
          <View style={styles.techItem}>
            <Text style={[styles.techName, isDark && styles.techNameDark]}>• API Quotable</Text>
            <Text style={[styles.techDescription, isDark && styles.techDescriptionDark]}>
              Pour récupérer des citations en ligne
            </Text>
          </View>
        </View>

        <View style={[styles.section, isDark && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Fonctionnalités</Text>
          <Text style={[styles.feature, isDark && styles.featureDark]}>• Affichage d'une citation aléatoire</Text>
          <Text style={[styles.feature, isDark && styles.featureDark]}>
            • Changement automatique toutes les 10 secondes
          </Text>
          <Text style={[styles.feature, isDark && styles.featureDark]}>• Sauvegarde des citations favorites</Text>
          <Text style={[styles.feature, isDark && styles.featureDark]}>• Partage de citations</Text>
          <Text style={[styles.feature, isDark && styles.featureDark]}>• Mode hors ligne</Text>
          <Text style={[styles.feature, isDark && styles.featureDark]}>• Catégories de citations</Text>
          <Text style={[styles.feature, isDark && styles.featureDark]}>• Thème clair et sombre</Text>
          <Text style={[styles.feature, isDark && styles.featureDark]}>• Animations fluides</Text>
        </View>

        <View style={[styles.footer, isDark && styles.footerDark]}>
            <Text style={[styles.footerText, isDark && styles.footerTextDark]}>
            Développé avec ❤️ en {new Date().getFullYear()}
            </Text>
          <Text style={[styles.link, isDark && styles.linkDark]} onPress={() => Linking.openURL("https://github.com/IhantsaFana/citationApp")}>
            Voir le code source
          </Text>
        </View>
      </ScrollView>
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
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6366f1",
    textAlign: "center",
    marginBottom: 4,
  },
  titleDark: {
    color: "#818cf8",
  },
  version: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  versionDark: {
    color: "#9ca3af",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
  sectionTitleDark: {
    color: "#f9fafb",
  },
  paragraph: {
    fontSize: 16,
    color: "#4b5563",
    lineHeight: 24,
  },
  paragraphDark: {
    color: "#d1d5db",
  },
  techItem: {
    marginBottom: 12,
  },
  techName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
  },
  techNameDark: {
    color: "#f9fafb",
  },
  techDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 16,
  },
  techDescriptionDark: {
    color: "#9ca3af",
  },
  feature: {
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 8,
  },
  featureDark: {
    color: "#d1d5db",
  },
  footer: {
    marginTop: 12,
    alignItems: "center",
  },
  footerDark: {
    backgroundColor: "transparent",
  },
  footerText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  footerTextDark: {
    color: "#9ca3af",
  },
  link: {
    fontSize: 14,
    color: "#6366f1",
    textDecorationLine: "underline",
  },
  linkDark: {
    color: "#818cf8",
  },
})

export default AboutScreen
