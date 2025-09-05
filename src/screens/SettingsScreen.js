import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import {
  List, Switch, Button, Card, Divider, Paragraph, Avatar, TextInput, Snackbar, useTheme
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { ThemeContext, CoresPadrao } from "../context/ThemeContext";
import { UserPreferencesContext } from "../context/UserPreferencesContext";

export default function SettingsScreen() {
  const theme = useTheme();
  const { toggleTheme, setPrimaryColor, isDarkTheme } = useContext(ThemeContext);
  const { language, fontSize, profile, updatePreferences, t } = useContext(UserPreferencesContext);

  const [localProfile, setLocalProfile] = useState(profile);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  useEffect(() => { setLocalProfile(profile); }, [profile]);

  const salvarPerfil = () => {
    updatePreferences({ profile: localProfile });
    setSnackbarVisible(true);
  };
  
  const escolherFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t("permissionNeeded"), t("permissionGallery"));
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!result.canceled) {
      setLocalProfile({ ...localProfile, foto: result.assets[0].uri });
    }
  };

  const tirarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t("permissionNeeded"), t("permissionCamera"));
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!result.canceled) {
      setLocalProfile({ ...localProfile, foto: result.assets[0].uri });
    }
  };

  const styles = createStyles(theme, fontSize);

  const cores = [
    { name: t("navyBlue"), color: CoresPadrao.azulMarinho },
    { name: t("grayishBlue"), color: CoresPadrao.azulAcinzentado },
    { name: t("green"), color: "#28a745" },
    { name: t("orange"), color: "#fd7e14" },
    { name: t("pink"), color: "#e83e8c" },
  ];

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {/* --- PERFIL --- */}
        <Card style={styles.card}>
          <Card.Title title={t("profile")} subtitle={t("editInfo")} left={(props) => 
              localProfile?.foto ? 
                <Avatar.Image {...props} source={{ uri: localProfile.foto }} /> 
                : <Avatar.Image {...props} source={require('../../assets/avatar-placeholder.png')} />
            }
          />
          <Card.Content style={styles.content}>
            <TextInput label={t("name")} value={localProfile?.nome} onChangeText={(text) => setLocalProfile({ ...localProfile, nome: text })} style={styles.input}/>
            <TextInput label={t("profession")} value={localProfile?.profissao} onChangeText={(text) => setLocalProfile({ ...localProfile, profissao: text })} style={styles.input}/>
            <TextInput label={t("email")} value={localProfile?.email} onChangeText={(text) => setLocalProfile({ ...localProfile, email: text })} style={styles.input}/>
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10, width: '100%' }}>
              <Button mode="outlined" icon="image" onPress={escolherFoto} style={{ marginTop: 6, flex: 1 }}>{t("gallery")}</Button>
              <Button mode="outlined" icon="camera" onPress={tirarFoto} style={{ marginTop: 6, flex: 1 }}>{t("camera")}</Button>
            </View>
            <Button mode="contained" style={{ marginTop: 10, width: '100%' }} onPress={salvarPerfil}>{t("saveProfile")}</Button>
          </Card.Content>
        </Card>

        {/* --- APARÊNCIA --- */}
        <Card style={styles.card}>
          <Card.Title title={t("appearance")} subtitle={t("themeAndColors")} left={(props) => <Avatar.Icon {...props} icon="palette" />} />
          <Card.Content style={styles.content}>
            <List.Item
              title={t("darkTheme")}
              left={() => <List.Icon icon="theme-light-dark" />}
              right={() => <Switch value={isDarkTheme} onValueChange={toggleTheme} />}
              style={styles.listItem}
            />
            <Divider style={{ marginVertical: 10 }} />
            <Paragraph style={styles.paragraph}>{t("highlightColor")}</Paragraph>
            <View style={styles.colorContainer}>
              {cores.map((cor) => (
                <TouchableOpacity key={cor.name} onPress={() => setPrimaryColor(cor.color)} style={[styles.colorButton, { backgroundColor: cor.color }]}>
                  {theme.colors.primary === cor.color && <Avatar.Icon size={32} icon="check" style={styles.checkIcon} />}
                </TouchableOpacity>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* --- PREFERÊNCIAS --- */}
        <Card style={styles.card}>
          <Card.Title title={t("preferences")} subtitle={`${t("language")} & ${t("fontSize")}`} left={(props) => <Avatar.Icon {...props} icon="tune" />} />
          <Card.Content style={styles.content}>
            <List.Accordion title={`${t("language")}: ${t(language)}`} left={(props) => <List.Icon {...props} icon="translate" />} id="language-accordion">
              <List.Item title="Português (Brasil)" onPress={() => updatePreferences({ language: "pt-BR" })} />
              <List.Item title="English" onPress={() => updatePreferences({ language: "en" })} />
              <List.Item title="Español" onPress={() => updatePreferences({ language: "es" })} />
            </List.Accordion>
            <List.Accordion title={`${t("fontSize")}: ${t(fontSize)}`} left={(props) => <List.Icon {...props} icon="format-size" />} id="font-accordion">
              <List.Item title={t("small")} onPress={() => updatePreferences({ fontSize: "small" })} />
              <List.Item title={t("medium")} onPress={() => updatePreferences({ fontSize: "medium" })} />
              <List.Item title={t("large")} onPress={() => updatePreferences({ fontSize: "large" })} />
            </List.Accordion>
          </Card.Content>
        </Card>
      </ScrollView>

      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={2000} action={{ label: "OK", onPress: () => setSnackbarVisible(false) }}>
        {t("profileSaved")}
      </Snackbar>
    </>
  );
}

const createStyles = (theme, fontSize) => StyleSheet.create({
    container: { padding: 16, backgroundColor: theme.colors.background },
    card: { backgroundColor: theme.colors.surface, marginBottom: 16, borderRadius: 12, elevation: 2, },
    content: { gap: 12 },
    input: { width: "100%", backgroundColor: 'transparent' },
    listItem: { paddingHorizontal: 0 },
    paragraph: { 
      paddingHorizontal: 16, 
      fontSize: fontSize === "small" ? 13 : fontSize === "large" ? 18 : 15, 
      color: theme.colors.onSurfaceVariant, 
    },
    colorContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around", marginTop: 10, paddingHorizontal: 8 },
    colorButton: { width: 48, height: 48, borderRadius: 24, margin: 5, justifyContent: 'center', alignItems: 'center', elevation: 2 },
    checkIcon: { backgroundColor: 'transparent' },
});
