// App.js

import React, { useContext } from "react"; // Removido useState e useEffect
import { ActivityIndicator, View, StyleSheet, Platform, StatusBar } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// Removido AsyncStorage daqui

import { ThemeProvider, ThemeContext } from "./src/context/ThemeContext";
import { UserPreferencesProvider, UserPreferencesContext } from "./src/context/UserPreferencesContext"; // Importa o contexto
import RootNavigator from "./src/navigation/RootNavigator";
import WelcomeScreen from "./src/screens/WelcomeScreen";

const AppContent = () => {
  const { theme, isDarkTheme } = useContext(ThemeContext);
  // --- CONSUMINDO O CONTEXTO ATUALIZADO ---
  const { isLoading, isFirstLaunch, finishWelcome } = useContext(UserPreferencesContext);
  
  const styles = createStyles(theme);

  // A lógica de loading agora vem do contexto
  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme?.colors?.primary || '#6200ee'} />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <StatusBar
          translucent={false}
          backgroundColor={theme?.colors?.background || '#F5F7FA'}
          barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        />
        <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      {isFirstLaunch ? (
        // Passa a função 'finishWelcome' do contexto
        <WelcomeScreen onFinish={finishWelcome} />
      ) : (
        <RootNavigator />
      )}
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default function App() {
  return (
    <UserPreferencesProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </UserPreferencesProvider>
  );
}

const createStyles = (theme) => StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme?.colors?.background || '#fff',
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme?.colors?.background || "#F0F4F8",
    paddingBottom: Platform.OS === "android" ? 0 : 0,
  },
});
