import React, { useContext } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Card, Title, Button, Paragraph, useTheme } from "react-native-paper";
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from "expo-linear-gradient";
import { UserPreferencesContext } from "../context/UserPreferencesContext";
import { gerarPDF } from "../utils/pdfGenerator";

export default function SelecionarTemplate({ route, navigation }) {
  const theme = useTheme();
  const { t } = useContext(UserPreferencesContext);
  const { curriculo } = route.params;
  const styles = createStyles(theme);

  const templates = [
    { id: "classic", name: t("template_classic_name"), desc: t("template_classic_desc"), image: `https://picsum.photos/seed/classic/400/565` },
    { id: "creative", name: t("template_creative_name"), desc: t("template_creative_desc"), image: `https://picsum.photos/seed/creative/400/565` },
    { id: "corporate", name: t("template_corporate_name"), desc: t("template_corporate_desc"), image: `https://picsum.photos/seed/corporate/400/565` },
    { id: "elegant", name: t("template_elegant_name"), desc: t("template_elegant_desc"), image: `https://picsum.photos/seed/elegant/400/565` },
    { id: "minimalist", name: t("template_minimalist_name"), desc: t("template_minimalist_desc"), image: `https://picsum.photos/seed/minimalist/400/565` },
    { id: "inverted", name: t("template_inverted_name"), desc: t("template_inverted_desc"), image: `https://picsum.photos/seed/inverted/400/565` },
    { id: "split", name: t("template_split_name"), desc: t("template_split_desc"), image: `https://picsum.photos/seed/split/400/565` },
    { id: "dark", name: t("template_dark_name"), desc: t("template_dark_desc"), image: `https://picsum.photos/seed/dark/400/565` },
  ];

  const renderHeader = () => (
    <Animatable.View animation="fadeInDown" duration={800}>
      <LinearGradient 
        colors={[theme.colors.primary, theme.colors.secondary]} 
        style={styles.gradientHeader}
      >
        <Title style={styles.headerTitle}>{t("selectTemplate")}</Title>
        <Paragraph style={styles.headerSubtitle}>
          {t("exploreTemplates")}
        </Paragraph>
      </LinearGradient>
    </Animatable.View>
  );

  const renderItem = ({ item: tpl, index }) => (
    <Animatable.View animation="fadeInUp" duration={600} delay={index * 100}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: tpl.image }} />
        <Card.Title
          title={tpl.name}
          subtitle={tpl.desc}
          titleStyle={styles.cardTitle}
          subtitleStyle={styles.cardSubtitle}
          subtitleNumberOfLines={2}
        />
        <Card.Actions style={styles.actions}>
          <Button
            mode="text"
            icon="eye-outline"
            onPress={() => {
              console.log("📄 Ver PDF (PreviewCurriculo) -> Currículo JSON:", JSON.stringify(curriculo, null, 2));
              navigation.navigate("PreviewCurriculo", { curriculo, template: tpl.id });
            }}
          >
            {t("preview")}
          </Button>
          <Button
            mode="contained"
            icon="file-pdf-box"
            onPress={() => {
              console.log("📤 Exportar PDF -> Currículo JSON:", JSON.stringify(curriculo, null, 2));
              gerarPDF(curriculo, tpl.id);
            }}
          >
            {t("export")}
          </Button>
        </Card.Actions>
      </Card>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={templates}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    gradientHeader: {
      paddingHorizontal: 20,
      paddingVertical: 30,
      marginBottom: 24,
      borderRadius: 24,
      elevation: 4,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: "#fff",
      textAlign: "center",
    },
    headerSubtitle: {
      fontSize: 16,
      color: "rgba(255, 255, 255, 0.8)",
      marginTop: 8,
      textAlign: "center",
    },
    listContent: {
      padding: 16,
      paddingTop: 0,
    },
    card: {
      marginBottom: 24,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      elevation: 4,
      overflow: 'hidden',
    },
    cardTitle: {
      fontWeight: 'bold',
      fontSize: 18,
    },
    cardSubtitle: {
      fontSize: 14,
      lineHeight: 20,
    },
    actions: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      justifyContent: 'flex-end',
      gap: 8,
    }
  });
