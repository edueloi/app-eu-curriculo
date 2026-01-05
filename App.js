// App.js

import React, { useContext } from "react"; // Removido useState e useEffect
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
// Removido AsyncStorage daqui

import { ThemeProvider, ThemeContext } from "./src/context/ThemeContext";
import { UserPreferencesProvider, UserPreferencesContext } from "./src/context/UserPreferencesContext"; // Importa o contexto
import RootNavigator from "./src/navigation/RootNavigator";
import WelcomeScreen from "./src/screens/WelcomeScreen";

const AppContent = () => {
  const { theme } = useContext(ThemeContext);
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
      {isFirstLaunch ? (
        // Passa a função 'finishWelcome' do contexto
        <WelcomeScreen onFinish={finishWelcome} />
      ) : (
        <RootNavigator />
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