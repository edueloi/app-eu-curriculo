// src/context/UserPreferencesContext.js

import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { translations } from "../i18n/translations";

export const UserPreferencesContext = createContext();

export const UserPreferencesProvider = ({ children }) => {
  const [language, setLanguage] = useState("pt-BR");
  const [fontSize, setFontSize] = useState("medium");
  const [profile, setProfile] = useState({
    nome: "Usuário",
    email: "email@exemplo.com",
    foto: null,
    profissao: "Profissional",
  });
  
  // --- NOVOS ESTADOS ---
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("language");
        const savedFontSize = await AsyncStorage.getItem("fontSize");
        const savedProfile = await AsyncStorage.getItem("profile");
        
        // Verifica se a tela de boas-vindas já foi vista
        const hasSeenWelcome = await AsyncStorage.getItem("hasSeenWelcome");
        setIsFirstLaunch(hasSeenWelcome === null);

        if (savedLanguage) setLanguage(savedLanguage);
        if (savedFontSize) setFontSize(savedFontSize);
        if (savedProfile) setProfile(JSON.parse(savedProfile));

      } catch (e) {
        console.log("Erro ao carregar preferências:", e);
        setIsFirstLaunch(false); // Em caso de erro, não mostra a tela de boas-vindas
      } finally {
        setIsLoading(false);
      }
    };
    loadPreferences();
  }, []);

  const updatePreferences = async (prefs) => {
    try {
      if (prefs.language !== undefined) {
        setLanguage(prefs.language);
        await AsyncStorage.setItem("language", prefs.language);
      }
      if (prefs.fontSize !== undefined) {
        setFontSize(prefs.fontSize);
        await AsyncStorage.setItem("fontSize", prefs.fontSize);
      }
      if (prefs.profile !== undefined) {
        setProfile(prefs.profile);
        await AsyncStorage.setItem("profile", JSON.stringify(prefs.profile));
      }
    } catch (e) {
      console.log("Erro ao salvar preferências:", e);
    }
  };
  
  // --- NOVAS FUNÇÕES ---
  const finishWelcome = async () => {
    setIsFirstLaunch(false);
    await AsyncStorage.setItem("hasSeenWelcome", "true");
  };

  const triggerWelcomeScreen = () => {
    setIsFirstLaunch(true);
  };

  const t = (key) => {
    if (!key) return '';
    const keys = key.split('.');
    let result = translations[language];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) return key; // Retorna a chave original se não encontrar
    }
    return result || key;
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        language,
        fontSize,
        profile,
        updatePreferences,
        t,
        // --- EXPORTANDO OS NOVOS VALORES ---
        isFirstLaunch,
        isLoading,
        finishWelcome,
        triggerWelcomeScreen,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};