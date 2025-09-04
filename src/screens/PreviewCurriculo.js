// src/screens/PreviewCurriculo.js
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { Button, Title, useTheme } from "react-native-paper";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
import { gerarPDF } from "../utils/pdfGenerator";
import {
  templateBlackWhite,
  templateMarketing,
  templateBlueProfessional,
  templatePink,
} from "../utils/pdfTemplates";

const A4_RATIO = 1.414; // altura / largura do A4

export default function PreviewCurriculo({ route, navigation }) {
  const theme = useTheme();
  const { curriculo, template } = route.params;
  const [htmlContent, setHtmlContent] = useState("");
  const styles = createStyles(theme);

  const screenWidth = Dimensions.get("window").width;
  const pageWidth = screenWidth * 0.95; // ocupa quase toda a largura da tela
  const pageHeight = pageWidth * A4_RATIO;

  useEffect(() => {
    switch (template) {
      case "marketing":
        setHtmlContent(templateMarketing(curriculo));
        break;
      case "blueProfessional":
        setHtmlContent(templateBlueProfessional(curriculo));
        break;
      case "pink":
        setHtmlContent(templatePink(curriculo));
        break;
      default:
        setHtmlContent(templateBlackWhite(curriculo));
    }
  }, [curriculo, template]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Title style={styles.title}>Pré-visualização ({template})</Title>

        {/* Ajusta tamanho do preview mantendo proporção A4 */}
        <WebView
          originWhitelist={["*"]}
          source={{ html: htmlContent }}
          style={[styles.webview, { width: pageWidth, height: pageHeight }]}
          scalesPageToFit={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          androidHardwareAccelerationDisabled={false}
          contentMode="mobile"
        />

        {/* Footer com botões */}
        <View style={styles.footer}>
          <Button
            mode="outlined"
            icon="arrow-left"
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            Voltar
          </Button>
          <Button
            mode="contained"
            icon="file-pdf-box"
            style={styles.button}
            onPress={() => gerarPDF(curriculo, template)}
          >
            Exportar PDF
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingBottom: 24,
    },
    title: {
      margin: 12,
      textAlign: "center",
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.primary,
    },
    webview: {
      alignSelf: "center",
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 6,
      marginBottom: 20,
      backgroundColor: "#fff",
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 12,
      paddingBottom: 30,
      borderTopWidth: 1,
      borderColor: "#ddd",
      backgroundColor: theme.colors.surface,
    },
    button: {
      flex: 1,
      marginHorizontal: 6,
    },
  });
