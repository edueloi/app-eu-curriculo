// src/context/UserProfileContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    nome: "Seu Nome",
    idade: "",
    profissao: "",
    foto: null,
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await AsyncStorage.getItem("userProfile");
        if (data) setProfile(JSON.parse(data));
      } catch (e) {
        console.log("Erro ao carregar perfil:", e);
      }
    };
    loadProfile();
  }, []);

  const updateProfile = async (newProfile) => {
    setProfile(newProfile);
    await AsyncStorage.setItem("userProfile", JSON.stringify(newProfile));
  };

  return (
    <UserProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};
