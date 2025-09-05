import React, { useContext, useState } from "react";
import { StyleSheet, ScrollView, View, Linking } from "react-native";
import { Title, Paragraph, Card, Button, useTheme, List, Divider, Text, Surface, Snackbar } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { UserPreferencesContext } from "../context/UserPreferencesContext";
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import * as Clipboard from 'expo-clipboard';

export default function AboutScreen() {
  const theme = useTheme();
  const { t } = useContext(UserPreferencesContext);
  const styles = createStyles(theme);

  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const copiarChavePix = async () => {
    await Clipboard.setStringAsync("eloitech.app.meucurriculo@gmail.com.br");
    setSnackbarVisible(true);
  };

  const features = [
    { key: "feature1", icon: "fast-forward-outline" },
    { key: "feature2", icon: "layers-triple-outline" },
    { key: "feature3", icon: "file-pdf-box" },
    { key: "feature4", icon: "history" },
  ];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer} style={{backgroundColor: theme.colors.background}}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          style={styles.header}
        >
          <Animatable.View animation="fadeInDown" duration={800}>
            <MaterialCommunityIcons name="rocket-launch-outline" size={60} color="#fff" />
            <Title style={styles.headerTitle}>{t("aboutAppTitle")}</Title>
          </Animatable.View>
        </LinearGradient>

        <View style={styles.content}>
          <Animatable.View animation="fadeInUp" duration={800} delay={200}>
            <Card style={styles.card}>
              <Card.Content>
                <Paragraph style={styles.text}>{t("aboutAppDescription")}</Paragraph>
              </Card.Content>
            </Card>
          </Animatable.View>

          {/* LISTA DE RECURSOS REDESENHADA */}
          <Animatable.View animation="fadeInUp" duration={800} delay={300}>
            <Card style={styles.card}>
              <Card.Title 
                title={t("featuresTitle")}
                titleStyle={styles.cardTitle}
                left={(props) => <List.Icon {...props} icon="star-circle-outline" color={theme.colors.primary} />}
              />
              <Card.Content>
                {features.map((feature, index) => (
                  <React.Fragment key={feature.key}>
                    <List.Item
                      title={t(feature.key)}
                      left={() => <List.Icon icon={feature.icon} color={theme.colors.primary} />}
                      titleStyle={styles.featureText}
                    />
                    {index < features.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </Card.Content>
            </Card>
          </Animatable.View>
          
          {/* NOVO CARD DE DOAÇÃO PIX */}
          <Animatable.View animation="fadeInUp" duration={800} delay={400}>
            <Card style={styles.card}>
              <Card.Title 
                title={t("supportProject")}
                titleStyle={styles.cardTitle}
                left={(props) => <List.Icon {...props} icon="gift-outline" color={theme.colors.primary} />}
              />
              <Card.Content>
                <Paragraph style={styles.text}>{t("supportMessage")}</Paragraph>
                <Surface style={styles.pixContainer} elevation={1}>
                    <View style={{flex: 1}}>
                        <Text style={styles.pixLabel}>{t("pixKey")}</Text>
                        <Text style={styles.pixKey}>eloitech.app.meucurriculo@gmail.com.br</Text>
                    </View>
                    <Button icon="content-copy" mode="contained" onPress={copiarChavePix}>
                        {t("copyKey")}
                    </Button>
                </Surface>
              </Card.Content>
            </Card>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" duration={800} delay={500}>
            <Card style={styles.card}>
              <Card.Title 
                title={t("usefulInfo")}
                titleStyle={styles.cardTitle}
                left={(props) => <List.Icon {...props} icon="information-outline" color={theme.colors.primary} />}
              />
              <Card.Content>
                <List.Item title={t("version")} description="1.0.0" descriptionStyle={styles.infoDescription} />
                <List.Item title={t("lastUpdate")} description="04/09/2025" descriptionStyle={styles.infoDescription} />
                <Paragraph style={styles.highlight}>{t("developedBy")}</Paragraph>
              </Card.Content>
            </Card>
          </Animatable.View>

          {/* O AGRADECIMENTO FINAL */}
          <Animatable.View animation="fadeInUp" duration={800} delay={600} style={styles.footer}>
              <MaterialCommunityIcons name="heart" size={32} color={theme.colors.secondary} />
              <Title style={styles.footerTitle}>{t("acknowledgmentsTitle")}</Title>
              <Paragraph style={styles.footerText}>{t("specialThanks")}</Paragraph>
          </Animatable.View>
        </View>
      </ScrollView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{backgroundColor: theme.colors.primaryContainer}}
      >
        {t("keyCopied")}
      </Snackbar>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
    scrollContainer: { paddingBottom: 40 },
    header: { alignItems: 'center', justifyContent: 'center', padding: 32, paddingTop: 56, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
    headerTitle: { fontSize: 26, fontWeight: "bold", color: "#fff", textAlign: "center", marginTop: 12 },
    content: { padding: 16 },
    sectionTitle: { fontSize: 22, fontWeight: '700', color: theme.colors.onBackground, marginBottom: 16, marginTop: 8 },
    card: { marginBottom: 24, borderRadius: 16, backgroundColor: theme.colors.surface, elevation: 3 },
    cardTitle: { fontSize: 20, fontWeight: '700', color: theme.colors.onSurface },
    text: { fontSize: 15, lineHeight: 22, color: theme.colors.onSurfaceVariant, paddingTop: 4 },
    infoDescription: { fontWeight: 'bold', color: theme.colors.primary },
    featureText: { fontSize: 16, color: theme.colors.onSurface },
    highlight: { fontWeight: "bold", fontStyle: 'italic', fontSize: 15, marginTop: 8, textAlign: 'center', padding: 8, color: theme.colors.secondary },
    pixContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        backgroundColor: theme.colors.surfaceVariant,
        marginTop: 16,
    },
    pixLabel: {
        fontSize: 12,
        color: theme.colors.onSurfaceVariant,
        marginBottom: 2,
    },
    pixKey: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.onSurface,
        flexWrap: 'wrap'
    },
    footer: { marginTop: 24, alignItems: 'center', padding: 16, },
    footerTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 8, color: theme.colors.onSurface },
    footerText: { textAlign: 'center', lineHeight: 22, color: theme.colors.onSurfaceVariant },
});