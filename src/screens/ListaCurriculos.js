// src/screens/ListaCurriculos.js
import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View, Alert } from "react-native";
import { Card, Title, Paragraph, Button, Avatar, Divider, useTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ListaCurriculos({ navigation }) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [curriculos, setCurriculos] = useState([]);

  useEffect(() => {
    carregarCurriculos();
  }, []);

  const carregarCurriculos = async () => {
    const data = await AsyncStorage.getItem("curriculos");
    if (data) {
      setCurriculos(JSON.parse(data));
    }
  };

  const excluirCurriculo = async (index) => {
    Alert.alert("Excluir Currículo", "Deseja realmente excluir este currículo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          const novos = curriculos.filter((_, i) => i !== index);
          setCurriculos(novos);
          await AsyncStorage.setItem("curriculos", JSON.stringify(novos));
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.pageTitle}>📂 Meus Currículos</Title>

      {curriculos.length === 0 ? (
        <Paragraph style={styles.emptyText}>Nenhum currículo salvo ainda.</Paragraph>
      ) : (
        curriculos.map((curriculo, index) => (
          <Card key={index} style={styles.card}>
            <Card.Title
              title={curriculo.nomeInterno || `Currículo ${index + 1}`}
              subtitle={`Atualizado em ${new Date().toLocaleDateString("pt-BR")}`}
              left={(props) => <Avatar.Icon {...props} icon="file-document-outline" />}
            />
            <Divider />
            <Card.Actions style={styles.actions}>
              <Button
                mode="outlined"
                icon="pencil"
                onPress={() =>
                  navigation.navigate("CriarCurrículo", { curriculo, index })
                }
              >
                Editar
              </Button>
              <Button
                mode="contained"
                icon="file-pdf-box"
                onPress={() =>
                  navigation.navigate("SelecionarTemplate", { curriculo })
                }
              >
                Ver Modelos
              </Button>
              <Button
                mode="text"
                icon="delete"
                textColor={theme.colors.error}
                onPress={() => excluirCurriculo(index)}
              >
                Excluir
              </Button>
            </Card.Actions>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    pageTitle: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 16,
      textAlign: "center",
      color: theme.colors.primary,
    },
    card: {
      marginBottom: 16,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
      elevation: 2,
    },
    actions: {
      justifyContent: "space-around",
      padding: 8,
    },
    emptyText: {
      textAlign: "center",
      marginTop: 40,
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
    },
  });
