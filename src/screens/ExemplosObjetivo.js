import React, { useState, useMemo, useContext } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import {
  Appbar,
  List,
  Card,
  Button,
  Dialog,
  Portal,
  Paragraph,
  Searchbar,
  Text,
  useTheme,
  Title,
} from "react-native-paper";
import * as Animatable from "react-native-animatable";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { UserPreferencesContext } from "../context/UserPreferencesContext";
import { translationsFormsExemple } from "../i18n/translationsFormsExemple";

export default function ExemplosObjetivo({ navigation, route }) {
  const theme = useTheme();
  const styles = getStyles(theme);

  const { locale, t } = useContext(UserPreferencesContext);
  const [selecionado, setSelecionado] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const confirmarSelecao = (frase) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelecionado(frase);
    setDialogVisible(true);
  };

  const aplicarExemplo = () => {
    if (selecionado) {
      route.params?.onSelect(selecionado);
    }
    setDialogVisible(false);
    navigation.goBack();
  };

  const filteredData = useMemo(() => {
    const data = Object.entries(translationsFormsExemple)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([area, dados]) => ({
        area,
        icon: dados.icon,
        frases: dados[locale] || dados.pt,
      }));

    if (!searchQuery) return data;
    return data.filter((item) =>
      item.area.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, locale]);

  const renderItem = ({ item, index }) => (
    <Animatable.View animation="fadeInUp" duration={500} delay={index * 80}>
      <List.Accordion
        key={item.area}
        title={item.area}
        titleStyle={styles.sectionTitle}
        left={(props) => (
          <List.Icon {...props} color={theme.colors.primary} icon={item.icon} />
        )}
        style={styles.accordion}
      >
        {item.frases.map((frase, idx) => (
          <Animatable.View
            key={idx}
            animation="fadeInRight"
            delay={idx * 60}
          >
            <Card
              style={[
                styles.card,
                selecionado === frase && styles.cardSelected,
              ]}
              onPress={() => confirmarSelecao(frase)}
            >
              <Card.Content style={styles.cardContent}>
                <List.Icon
                  icon="format-quote-open"
                  color={theme.colors.primary}
                  style={styles.quoteIcon}
                />
                <Paragraph style={styles.cardText}>{frase}</Paragraph>
              </Card.Content>
            </Card>
          </Animatable.View>
        ))}
      </List.Accordion>
    </Animatable.View>
  );

  return (
    <>
      {/* 🔹 Appbar */}
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color={theme.colors.onSurface}
        />
        <Appbar.Content
          title={t("objectiveExamples")}
          titleStyle={styles.appbarTitle}
        />
        <Appbar.Action icon="lightbulb-on-outline" color={theme.colors.primary} />
      </Appbar.Header>

      {/* 🔹 Header destacado */}
      <LinearGradient colors={["#7C4DFF", "#448AFF"]} style={styles.gradient}>
        <Title style={styles.headerTitle}>{t("inspirationTitle")}</Title>
        <Paragraph style={styles.headerSubtitle}>
          {t("inspirationSubtitle")}
        </Paragraph>
        <Searchbar
          placeholder={t("filterPlaceholder")}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          icon="magnify"
        />
      </LinearGradient>

      {/* 🔹 Lista */}
      <View style={styles.container}>
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.area}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.emptyStateContainer}>
              <Animatable.View
                animation="pulse"
                easing="ease-out"
                iterationCount="infinite"
              >
                <List.Icon
                  icon="emoticon-sad-outline"
                  size={70}
                  color={theme.colors.disabled}
                />
              </Animatable.View>
              <Text style={styles.emptyStateText}>{t("noAreaFound")}</Text>
              <Paragraph>{t("tryDifferentSearch")}</Paragraph>
            </View>
          }
        />
      </View>

      {/* 🔹 Dialog */}
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Title>{t("confirmObjective")}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{t("applyObjective")}</Paragraph>
            <Paragraph style={styles.selectedText}>{selecionado}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)} textColor={theme.colors.primary}>
              {t("cancel")}
            </Button>
            <Button onPress={aplicarExemplo} mode="contained">
              {t("add")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    appbar: { backgroundColor: theme.colors.surface, elevation: 2 },
    appbarTitle: { fontWeight: "bold", color: theme.colors.onSurface },
    gradient: {
      padding: 20,
      paddingBottom: 32,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      elevation: 6,
    },
    headerTitle: {
      fontSize: 26,
      fontWeight: "bold",
      color: "#fff",
      textAlign: "center",
    },
    headerSubtitle: {
      fontSize: 16,
      color: "#EDE7F6",
      marginBottom: 16,
      textAlign: "center",
    },
    searchbar: {
      borderRadius: 30,
      backgroundColor: "#fff",
      elevation: 2,
      marginTop: 10,
    },
    listContent: { 
      paddingHorizontal: 16, 
      paddingBottom: 46
    },
    accordion: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      marginBottom: 12,
      elevation: 2,
    },
    sectionTitle: {
      fontWeight: "bold",
      fontSize: 16,
      color: theme.colors.onSurface,
    },
    card: {
      marginVertical: 6,
      marginHorizontal: 12,
      borderRadius: 12,
      backgroundColor: "#FAFAFA",
      elevation: 1,
    },
    cardSelected: {
      borderWidth: 2,
      borderColor: theme.colors.primary,
      backgroundColor: "#EDE7F6",
    },
    cardContent: { flexDirection: "row", alignItems: "center" },
    quoteIcon: { marginRight: 8 },
    cardText: {
      flex: 1,
      lineHeight: 22,
      color: theme.colors.onSurfaceVariant,
    },
    selectedText: {
      marginTop: 12,
      fontStyle: "italic",
      fontWeight: "bold",
      color: theme.colors.primary,
    },
    emptyStateContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
      marginTop: 64,
    },
    emptyStateText: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
      color: theme.colors.onBackground,
    },
    dialog: {
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
    },
  });
