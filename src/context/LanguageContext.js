// src/context/LanguageContext.js
import React, { createContext, useState } from "react";

export const LanguageContext = createContext();

const translations = {
  "pt-BR": {
    dashboard: "Dashboard",
    tutorials: "Tutoriais",
    history: "Histórico",
    resumes: "Meus Currículos",
    createResume: "Criar Currículo",
    settings: "Configurações",
    support: "Suporte",
    about: "Sobre",
  },
  en: {
    dashboard: "Dashboard",
    tutorials: "Tutorials",
    history: "History",
    resumes: "My Resumes",
    createResume: "Create Resume",
    settings: "Settings",
    support: "Support",
    about: "About",
  },
  es: {
    dashboard: "Panel",
    tutorials: "Tutoriales",
    history: "Historial",
    resumes: "Mis Currículos",
    createResume: "Crear Currículo",
    settings: "Configuración",
    support: "Soporte",
    about: "Acerca de",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("pt-BR");

  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
