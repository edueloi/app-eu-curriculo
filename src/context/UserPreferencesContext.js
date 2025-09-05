import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { translations } from "../i18n/translations";

export const UserPreferencesContext = createContext();

export const UserPreferencesProvider = ({ children }) => {
  const [language, setLanguage] = useState("pt-BR");
  const [fontSize, setFontSize] = useState("medium");

  const [profile, setProfile] = useState({
    nome: "Seu Nome",
    email: "email@exemplo.com",
    foto: null,
    profissao: "Profissional",
  });

  // Carregar do AsyncStorage
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("language");
        const savedFontSize = await AsyncStorage.getItem("fontSize");
        const savedProfile = await AsyncStorage.getItem("profile");

        if (savedLanguage) setLanguage(savedLanguage);
        if (savedFontSize) setFontSize(savedFontSize);
        if (savedProfile) setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.log("Erro ao carregar preferências:", e);
      }
    };
    loadPreferences();
  }, []);

  // Salvar no AsyncStorage
  const updatePreferences = async (prefs) => {
    try {
      if (prefs.language) {
        setLanguage(prefs.language);
        await AsyncStorage.setItem("language", prefs.language);
      }
      if (prefs.fontSize) {
        setFontSize(prefs.fontSize);
        await AsyncStorage.setItem("fontSize", prefs.fontSize);
      }
      if (prefs.profile) {
        setProfile(prefs.profile);
        await AsyncStorage.setItem("profile", JSON.stringify(prefs.profile));
      }
    } catch (e) {
      console.log("Erro ao salvar preferências:", e);
    }
  };

  const t = (key) => translations[language][key] || key;

  return (
    <UserPreferencesContext.Provider
      value={{
        language,
        fontSize,
        profile,
        updatePreferences,
        t,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};
