// src/screens/TelaHistorico.js
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  useTheme,
  List,
  Button,
  Divider,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { gerarPDF } from "../utils/pdfGenerator";
import { EXEMPLOS_CURRICULOS } from "../data/exemplosCurriculos";

export default function TelaHistorico() {
  const theme = useTheme();
  const navigation = useNavigation();
  const styles = createStyles(theme);

  const [historico, setHistorico] = useState([
    {
      id: 1,
      nome: "Currículo Ana Souza.pdf",
      data: "01/09/2025",
      tamanho: "250 KB",
      status: "Exportado",
      curriculo: EXEMPLOS_CURRICULOS[0], // 🔹 associa dados reais
      template: "marketing",
    },
    {
      id: 2,
      nome: "Currículo Carlos Oliveira.pdf",
      data: "28/08/2025",
      tamanho: "310 KB",
      status: "Exportado",
      curriculo: EXEMPLOS_CURRICULOS[1],
      template: "blueProfessional",
    },
    {
      id: 3,
      nome: "Currículo Juliana Martins.pdf",
      data: "20/08/2025",
      tamanho: "280 KB",
      status: "Reexportado",
      curriculo: EXEMPLOS_CURRICULOS[2],
      template: "pink",
    },
  ]);

  const deletarRegistro = (id) => {
    setHistorico((prev) => prev.filter((item) => item.id !== id));
  };

  const visualizar = (item) => {
    navigation.navigate("PreviewCurriculo", {
      curriculo: item.curriculo,
      template: item.template,
    });
  };

  const reexportar = (item) => {
    gerarPDF(item.curriculo, item.template);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>📑 Histórico de Exportações</Title>

      {historico.length === 0 ? (
        <Paragraph style={styles.empty}>
          Nenhum currículo exportado ainda.
        </Paragraph>
      ) : (
        historico.map((item) => (
          <Card key={item.id} style={styles.card}>
            <List.Item
              title={item.nome}
              description={`📅 ${item.data}   •   💾 ${item.tamanho}`}
              left={(props) => <List.Icon {...props} icon="file-pdf-box" />}
              right={() => (
                <Paragraph
                  style={[
                    styles.status,
                    {
                      color:
                        item.status === "Exportado"
                          ? theme.colors.primary
                          : theme.colors.secondary,
                    },
                  ]}
                >
                  {item.status}
                </Paragraph>
              )}
            />

            <Divider />

            <View style={styles.actions}>
              <Button
                mode="outlined"
                icon="eye"
                compact
                style={styles.actionButton}
                onPress={() => visualizar(item)}
              >
                Visualizar
              </Button>
              <Button
                mode="outlined"
                icon="refresh"
                compact
                style={styles.actionButton}
                onPress={() => reexportar(item)}
              >
                Reexportar
              </Button>
              <Button
                mode="contained"
                icon="delete"
                compact
                style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
                labelStyle={{ color: "#fff" }}
                onPress={() => deletarRegistro(item.id)}
              >
                Deletar
              </Button>
            </View>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: theme.colors.background,
      paddingBottom: 60,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 16,
      textAlign: "center",
      color: theme.colors.primary,
    },
    card: {
      marginBottom: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      elevation: 3,
    },
    actions: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 10,
    },
    actionButton: {
      flex: 1,
      marginHorizontal: 4,
    },
    status: {
      fontSize: 13,
      fontWeight: "600",
      marginRight: 10,
      alignSelf: "center",
    },
    empty: {
      textAlign: "center",
      marginTop: 40,
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
    },
  });
