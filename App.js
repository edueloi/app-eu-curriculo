import React, { useEffect, useState, useContext } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemeProvider, ThemeContext } from "./src/context/ThemeContext";
import { UserPreferencesProvider } from "./src/context/UserPreferencesContext";
import RootNavigator from "./src/navigation/RootNavigator"; // ✅ Usa RootNavigator
import WelcomeScreen from "./src/screens/WelcomeScreen";

const AppContent = () => {
  const { theme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null); 

  useEffect(() => {
    const checkWelcome = async () => {
      try {
        const value = await AsyncStorage.getItem("hasSeenWelcome");
        setIsFirstLaunch(value === null);
      } catch (e) {
        console.log("Erro ao verificar tela de boas-vindas:", e);
        setIsFirstLaunch(false);
      } finally {
        setLoading(false);
      }
    };
    checkWelcome();
  }, []);

  const finishWelcome = async () => {
    await AsyncStorage.setItem("hasSeenWelcome", "true");
    setIsFirstLaunch(false);
  };
  
  const styles = createStyles(theme);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme?.colors?.primary || '#6200ee'} />
      </View>
    );
  }

  // O PaperProvider agora envolve a navegação
  return (
    <PaperProvider theme={theme}>
      {isFirstLaunch ? (
        <WelcomeScreen onFinish={finishWelcome} />
      ) : (
        <RootNavigator /> // A nossa navegação completa
      )}
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
});