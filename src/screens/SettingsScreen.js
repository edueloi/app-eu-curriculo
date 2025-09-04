import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Title,
  List,
  Switch,
  Button,
  Card,
  Divider,
  Paragraph,
  Avatar,
  HelperText,
  TextInput,
  Snackbar,
  useTheme,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

import { ThemeContext } from "../context/ThemeContext";
import { UserPreferencesContext } from "../context/UserPreferencesContext";

export default function SettingsScreen() {
  const theme = useTheme();
  const { toggleTheme, setPrimaryColor, isDarkTheme } = useContext(ThemeContext);
  const { language, fontSize, profile, updatePreferences, t } =
    useContext(UserPreferencesContext);

  const [localProfile, setLocalProfile] = useState(profile);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  const salvarPerfil = () => {
    updatePreferences({ profile: localProfile });
    setSnackbarVisible(true);
  };

  // === Escolher da Galeria ===
  const escolherFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Ative a permissão para acessar as fotos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setLocalProfile({ ...localProfile, foto: result.assets[0].uri });
    }
  };

  // === Tirar Foto ===
  const tirarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Ative a permissão da câmera.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setLocalProfile({ ...localProfile, foto: result.assets[0].uri });
    }
  };

  const styles = createStyles(theme, fontSize);

  const cores = [
    { name: "Padrão", color: "#6200ee" },
    { name: "Azul", color: "#007bff" },
    { name: "Verde", color: "#28a745" },
    { name: "Laranja", color: "#fd7e14" },
    { name: "Rosa", color: "#e83e8c" },
  ];

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {/* --- PERFIL --- */}
        <Card style={styles.card}>
          <Card.Title
            title={t("profile")}
            subtitle={t("editInfo")}
            left={(props) =>
              localProfile.foto ? (
                <Avatar.Image {...props} source={{ uri: localProfile.foto }} />
              ) : (
                <Avatar.Icon {...props} icon="account" />
              )
            }
          />
          <Card.Content style={styles.profileContent}>
            <TextInput
              label={t("name")}
              value={localProfile.nome}
              onChangeText={(tVal) =>
                setLocalProfile({ ...localProfile, nome: tVal })
              }
              style={styles.input}
            />
            <TextInput
              label="Profissão"
              value={localProfile.profissao}
              onChangeText={(tVal) =>
                setLocalProfile({ ...localProfile, profissao: tVal })
              }
              style={styles.input}
            />
            <TextInput
              label={t("email")}
              value={localProfile.email}
              onChangeText={(tVal) =>
                setLocalProfile({ ...localProfile, email: tVal })
              }
              style={styles.input}
            />

            {/* Botões de foto */}
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Button
                mode="outlined"
                icon="image"
                onPress={escolherFoto}
                style={{ marginTop: 6, flex: 1, marginRight: 5 }}
              >
                Galeria
              </Button>
              <Button
                mode="outlined"
                icon="camera"
                onPress={tirarFoto}
                style={{ marginTop: 6, flex: 1, marginLeft: 5 }}
              >
                Câmera
              </Button>
            </View>

            <Button
              mode="contained"
              style={{ marginTop: 10 }}
              onPress={salvarPerfil}
            >
              Salvar Perfil
            </Button>
          </Card.Content>
        </Card>

        {/* --- APARÊNCIA --- */}
        <Card style={styles.card}>
          <Card.Title
            title={t("appearance")}
            subtitle={t("themeAndColors")}
            left={(props) => <Avatar.Icon {...props} icon="palette" />}
          />
          <Card.Content>
            <List.Item
              title={t("darkTheme")}
              left={() => <List.Icon icon="theme-light-dark" />}
              right={() => (
                <Switch value={isDarkTheme} onValueChange={toggleTheme} />
              )}
            />
            <Divider style={{ marginVertical: 10 }} />
            <Paragraph style={styles.paragraph}>{t("highlightColor")}</Paragraph>
            <View style={styles.colorContainer}>
              {cores.map((cor) => (
                <Button
                  key={cor.name}
                  mode="contained"
                  style={[styles.colorButton, { backgroundColor: cor.color }]}
                  onPress={() => setPrimaryColor(cor.color)}
                >
                  {cor.name}
                </Button>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* --- PREFERÊNCIAS --- */}
        <Card style={styles.card}>
          <Card.Title
            title={t("preferences")}
            subtitle={`${t("language")} & ${t("fontSize")}`}
            left={(props) => <Avatar.Icon {...props} icon="tune" />}
          />
          <Card.Content>
            <List.Accordion
              title={`${t("language")}: ${language}`}
              left={(props) => <List.Icon {...props} icon="translate" />}
            >
              <List.Item
                title="Português (Brasil)"
                onPress={() => updatePreferences({ language: "pt-BR" })}
              />
              <List.Item
                title="English"
                onPress={() => updatePreferences({ language: "en" })}
              />
              <List.Item
                title="Español"
                onPress={() => updatePreferences({ language: "es" })}
              />
            </List.Accordion>

            <List.Accordion
              title={`${t("fontSize")}: ${fontSize}`}
              left={(props) => <List.Icon {...props} icon="format-size" />}
            >
              <List.Item
                title="Pequena"
                onPress={() => updatePreferences({ fontSize: "small" })}
              />
              <List.Item
                title="Média"
                onPress={() => updatePreferences({ fontSize: "medium" })}
              />
              <List.Item
                title="Grande"
                onPress={() => updatePreferences({ fontSize: "large" })}
              />
            </List.Accordion>
          </Card.Content>
        </Card>

        {/* --- SOBRE --- */}
        <Card style={styles.card}>
          <Card.Title
            title={t("about")}
            subtitle={t("usefulInfo")}
            left={(props) => <Avatar.Icon {...props} icon="information" />}
          />
          <Card.Content>
            <Paragraph style={styles.paragraph}>
              {t("about")} - {t("usefulInfo")}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              {t("version")}: <Title style={{ fontSize: 16 }}>1.0.0</Title>
            </Paragraph>
            <HelperText type="info">{t("lastUpdate")} 01/09/2025</HelperText>
            <Button
              icon="help-circle"
              mode="outlined"
              onPress={() => console.log("Abrir suporte")}
            >
              {t("support")}
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Snackbar de feedback */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        action={{
          label: "OK",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        Perfil salvo com sucesso!
      </Snackbar>
    </>
  );
}

const createStyles = (theme, fontSize) =>
  StyleSheet.create({
    container: { padding: 16, backgroundColor: theme.colors.background },
    card: {
      backgroundColor: theme.colors.surface,
      marginBottom: 16,
      borderRadius: 12,
      elevation: 2,
    },
    profileContent: { alignItems: "center" },
    input: { marginBottom: 12, width: "100%" },
    paragraph: {
      marginBottom: 12,
      fontSize: fontSize === "small" ? 13 : fontSize === "large" ? 18 : 15,
      color: theme.colors.onSurfaceVariant,
    },
    colorContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      marginTop: 10,
    },
    colorButton: { margin: 5, borderRadius: 30 },
  });
