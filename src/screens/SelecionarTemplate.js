// src/screens/SelecionarTemplate.js
import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Card, Title, Button, Avatar, useTheme } from "react-native-paper";
import { gerarPDF } from "../utils/pdfGenerator"; // ✅ só importa o generator

export default function SelecionarTemplate({ route, navigation }) {
  const theme = useTheme();
  const { curriculo } = route.params;
  const styles = createStyles(theme);

  // 🔹 Templates disponíveis
  const templates = [
    { id: "blackWhite", nome: "Preto & Branco", desc: "Tradicional e objetivo", icon: "file-document-outline" },
    { id: "marketing", nome: "Marketing", desc: "Estilo moderno e chamativo", icon: "chart-bar" },
    { id: "blueProfessional", nome: "Azul Profissional", desc: "Visual corporativo em azul", icon: "briefcase" },
    { id: "pink", nome: "Rosa", desc: "Design delicado e elegante", icon: "flower" },
  ];

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Escolha um Modelo</Title>

      {templates.map((tpl) => (
        <Card style={styles.card} key={tpl.id}>
          <Card.Title
            title={tpl.nome}
            subtitle={tpl.desc}
            left={(props) => <Avatar.Icon {...props} icon={tpl.icon} />}
          />
          <Card.Actions>
            <Button
              mode="contained"
              icon="eye"
              onPress={() =>
                navigation.navigate("PreviewCurriculo", {
                  curriculo,
                  template: tpl.id,
                })
              }
            >
              Pré-visualizar
            </Button>
            <Button
              mode="outlined"
              icon="file-pdf-box"
              onPress={() => gerarPDF(curriculo, tpl.id)}
            >
              Exportar
            </Button>
          </Card.Actions>
        </Card>
      ))}
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
    title: {
      marginBottom: 20,
      textAlign: "center",
      fontSize: 22,
      fontWeight: "bold",
      color: theme.colors.primary,
    },
    card: {
      marginBottom: 16,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
    },
  });
