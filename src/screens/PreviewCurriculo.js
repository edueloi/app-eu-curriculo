import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, ScrollView, Platform, Dimensions } from "react-native";
import { Button, Title, useTheme } from "react-native-paper";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
import { gerarPDF } from "../utils/pdfGenerator";
import {
  templateClassic,
  templateCreative,
  templateCorporate,
  templateElegant,
  templateMinimalist,
  templateInverted,
  templateSplit,
  templateDark,
} from "../utils/pdfTemplates";
import { UserPreferencesContext } from '../context/UserPreferencesContext';


const A4_RATIO = 1.4142;
const { width: screenWidth } = Dimensions.get('window');
const PREVIEW_WIDTH = screenWidth * 0.9; // 90% da largura da tela

export default function PreviewCurriculo({ route, navigation }) {
  const theme = useTheme();
  const { curriculo, template } = route.params;
  const [htmlContent, setHtmlContent] = useState("");
  const [webViewHeight, setWebViewHeight] = useState(PREVIEW_WIDTH * A4_RATIO);
  const styles = createStyles(theme);
  const { t } = useContext(UserPreferencesContext);


  useEffect(() => {
    switch (template) {
      case "creative":
        setHtmlContent(templateCreative(curriculo, theme.colors.primary, t));
        break;
      case "corporate":
        setHtmlContent(templateCorporate(curriculo, theme.colors.primary, t));
        break;
      case "elegant":
        setHtmlContent(templateElegant(curriculo, theme.colors.primary, t));
        break;
      case "minimalist":
        setHtmlContent(templateMinimalist(curriculo, theme.colors.primary, t));
        break;
      case "inverted":
        setHtmlContent(templateInverted(curriculo, theme.colors.primary, t));
        break;
      case "split":
        setHtmlContent(templateSplit(curriculo, theme.colors.primary, t));
        break;
      case "dark":
        setHtmlContent(templateDark(curriculo, theme.colors.primary, t));
        break;
      case "classic":
      default:
        setHtmlContent(templateClassic(curriculo, theme.colors.primary, t));
    }
  }, [curriculo, template, t]);
  
  const onMessage = (event) => {
    // Ajusta a altura do WebView com base no conteúdo do HTML
    const height = Number(event.nativeEvent.data);
    if (height) {
      setWebViewHeight(height);
    }
  };

  const injectedJavaScript = `
    setTimeout(() => {
      const height = document.documentElement.scrollHeight;
      window.ReactNativeWebView.postMessage(height);
    }, 500); // Pequeno delay para garantir que o conteúdo carregou
    true; // Necessário para o iOS
  `;


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Title style={styles.title}>{curriculo.nomeInterno}</Title>
        <ScrollView contentContainerStyle={styles.previewContainer}>
          <WebView
            originWhitelist={["*"]}
            source={{ html: htmlContent }}
            style={[styles.webview, { height: webViewHeight }]}
            injectedJavaScript={injectedJavaScript}
            onMessage={onMessage}
            javaScriptEnabled={true}
            scrollEnabled={false} // A rolagem será feita pela ScrollView do React Native
          />
        </ScrollView>

        <View style={styles.footer}>
          <Button mode="outlined" icon="arrow-left" style={styles.button} onPress={() => navigation.goBack()}>
            Voltar
          </Button>
          <Button mode="contained" icon="file-pdf-box" style={styles.button} onPress={() => gerarPDF(curriculo, template, theme.colors.primary, t)}>
            Exportar PDF
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.background },
    container: { flex: 1, backgroundColor: theme.colors.background },
    title: { paddingVertical: 12, textAlign: "center", fontSize: 20, fontWeight: "bold", color: theme.colors.primary },
    previewContainer: {
      paddingVertical: 20,
      alignItems: 'center',
    },
    webview: {
      width: PREVIEW_WIDTH,
      backgroundColor: "#fff",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 12,
      paddingBottom: 24,
      borderTopWidth: 1,
      borderColor: theme.colors.outline,
      backgroundColor: theme.colors.surface,
    },
    button: { flex: 1, marginHorizontal: 8 },
  });