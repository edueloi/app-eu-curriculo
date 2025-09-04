import React, { useContext } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { Title, Paragraph, Card, Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { UserPreferencesContext } from "../context/UserPreferencesContext";
import { Linking } from "react-native";

export default function AboutScreen() {
  const { t } = useContext(UserPreferencesContext);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Sobre o App */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{t("aboutAppTitle")}</Title>
          <Paragraph style={styles.text}>{t("aboutAppDescription")}</Paragraph>
        </Card.Content>
      </Card>

      {/* Recursos */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{t("featuresTitle")}</Title>

          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="file-document-outline" size={22} color="#6200ee" />
            <Paragraph style={styles.featureText}>{t("feature1")}</Paragraph>
          </View>

          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="layers-outline" size={22} color="#6200ee" />
            <Paragraph style={styles.featureText}>{t("feature2")}</Paragraph>
          </View>

          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="file-pdf-box" size={22} color="#6200ee" />
            <Paragraph style={styles.featureText}>{t("feature3")}</Paragraph>
          </View>

          <View style={styles.featureItem}>
            <MaterialCommunityIcons name="history" size={22} color="#6200ee" />
            <Paragraph style={styles.featureText}>{t("feature4")}</Paragraph>
          </View>
        </Card.Content>
      </Card>

      {/* Informações extras */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{t("usefulInfo")}</Title>
          <Paragraph style={styles.text}>{t("version")}: 1.0.0</Paragraph>
          <Paragraph style={styles.text}>{t("lastUpdate")}: 03/09/2025</Paragraph>
          <Paragraph style={styles.highlight}>{t("developedBy")}</Paragraph>
        </Card.Content>
      </Card>

      {/* Suporte */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{t("supportContact")}</Title>
          <Paragraph style={styles.text}>{t("contactDescription")}</Paragraph>

          {/* E-mail */}
          <View style={styles.contactItem}>
            <MaterialCommunityIcons name="email-outline" size={22} color="#6200ee" />
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => Linking.openURL("mailto:gerador.curriculo.eloitech@gmail.com")}
            >
              {t("contactEmail")}
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#f5f6fa",
  },
  card: {
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
  },
  text: {
    marginBottom: 10,
    fontSize: 15,
    lineHeight: 22,
    color: "#555",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  featureText: {
    fontSize: 15,
    marginLeft: 8,
    color: "#444",
  },
  highlight: {
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 8,
    color: "#6200ee",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  button: {
    marginLeft: 10,
    borderRadius: 25,
    paddingVertical: 6,
    flex: 1,
  },
});
