import React, { useContext } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Card, Title, Button, Appbar, useTheme } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import * as Animatable from 'react-native-animatable';
import { UserPreferencesContext } from "../context/UserPreferencesContext";
import { gerarPDF } from "../utils/pdfGenerator";

export default function SelecionarTemplate({ route, navigation }) {
  const theme = useTheme();
  const { t } = useContext(UserPreferencesContext);
  const { curriculo } = route.params;
  const styles = createStyles(theme);

  const templates = [
    { id: "classic", name: t("template_classic_name"), desc: t("template_classic_desc"), image: 'URL_DA_IMAGEM_AQUI' },
    { id: "creative", name: t("template_creative_name"), desc: t("template_creative_desc"), image: 'URL_DA_IMAGEM_AQUI' },
    { id: "corporate", name: t("template_corporate_name"), desc: t("template_corporate_desc"), image: 'URL_DA_IMAGEM_AQUI' },
    { id: "elegant", name: t("template_elegant_name"), desc: t("template_elegant_desc"), image: 'URL_DA_IMAGEM_AQUI' },
    { id: "minimalist", name: t("template_minimalist_name"), desc: t("template_minimalist_desc"), image: 'URL_DA_IMAGEM_AQUI' },
    { id: "inverted", name: t("template_inverted_name"), desc: t("template_inverted_desc"), image: 'URL_DA_IMAGEM_AQUI' },
    { id: "split", name: t("template_split_name"), desc: t("template_split_desc"), image: 'URL_DA_IMAGEM_AQUI' },
    { id: "dark", name: t("template_dark_name"), desc: t("template_dark_desc"), image: 'URL_DA_IMAGEM_AQUI' },
  ];

  const renderItem = ({ item: tpl, index }) => (
    <Animatable.View animation="fadeInUp" duration={600} delay={index * 150}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: tpl.image }} />
        <Card.Title
          title={tpl.name}
          subtitle={tpl.desc}
          titleStyle={styles.cardTitle}
          subtitleStyle={styles.cardSubtitle}
        />
        <Card.Actions style={styles.actions}>
          <Button
            mode="text"
            icon="eye-outline"
            onPress={() => navigation.navigate("PreviewCurriculo", { curriculo, templateId: tpl.id })}
          >
            {t("preview")}
          </Button>
          <Button
            mode="contained"
            icon="file-pdf-box"
            onPress={() => gerarPDF(curriculo, tpl.id)}
          >
            {t("export")}
          </Button>
        </Card.Actions>
      </Card>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={t("selectTemplate")} titleStyle={styles.appbarTitle} />
        <Appbar.Action icon="home-outline" onPress={() => navigation.navigate("Início")} />
      </Appbar.Header>

      <FlatList
        data={templates}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
    appbar: {
        backgroundColor: theme.colors.surface,
    },
    appbarTitle: {
        fontWeight: 'bold',
    },
    listContent: {
      padding: 16,
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
    },
    actions: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        justifyContent: 'flex-end',
        gap: 8,
    }
  });