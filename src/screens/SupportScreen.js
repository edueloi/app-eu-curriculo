import React, { useContext } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { Card, Title, Paragraph, Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { UserPreferencesContext } from "../context/UserPreferencesContext";
import { Linking } from "react-native";

export default function SupportScreen() {
  const { t } = useContext(UserPreferencesContext);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* FAQ - Perguntas Frequentes */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{t("faqTitle")}</Title>

          {/* FAQ 1 */}
          <View style={styles.faqItem}>
            <MaterialCommunityIcons name="file-document-outline" size={22} color="#6200ee" />
            <Paragraph style={styles.question}>{t("faq1")}</Paragraph>
          </View>
          <Paragraph style={styles.answer}>{t("faq1Answer")}</Paragraph>

          {/* FAQ 2 */}
          <View style={styles.faqItem}>
            <MaterialCommunityIcons name="folder-outline" size={22} color="#6200ee" />
            <Paragraph style={styles.question}>{t("faq2")}</Paragraph>
          </View>
          <Paragraph style={styles.answer}>{t("faq2Answer")}</Paragraph>

          {/* FAQ 3 */}
          <View style={styles.faqItem}>
            <MaterialCommunityIcons name="account-off-outline" size={22} color="#6200ee" />
            <Paragraph style={styles.question}>{t("faq3")}</Paragraph>
          </View>
          <Paragraph style={styles.answer}>{t("faq3Answer")}</Paragraph>

          {/* FAQ 4 */}
          <View style={styles.faqItem}>
            <MaterialCommunityIcons name="alert-circle-outline" size={22} color="#e53935" />
            <Paragraph style={styles.question}>{t("faq4")}</Paragraph>
          </View>
          <Paragraph style={styles.answerImportant}>{t("faq4Answer")}</Paragraph>

          {/* FAQ 5 */}
          <View style={styles.faqItem}>
            <MaterialCommunityIcons name="cloud-upload-outline" size={22} color="#6200ee" />
            <Paragraph style={styles.question}>{t("faq5")}</Paragraph>
          </View>
          <Paragraph style={styles.answer}>{t("faq5Answer")}</Paragraph>

          {/* FAQ 6 */}
          <View style={styles.faqItem}>
            <MaterialCommunityIcons name="wifi-off" size={22} color="#6200ee" />
            <Paragraph style={styles.question}>{t("faq6")}</Paragraph>
          </View>
          <Paragraph style={styles.answer}>{t("faq6Answer")}</Paragraph>
        </Card.Content>
      </Card>

      {/* Contato */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{t("supportContact")}</Title>
          <Paragraph style={styles.text}>{t("contactDescription")}</Paragraph>
          <Button
            mode="contained"
            style={styles.button}
            icon="email"
            labelStyle={{ fontSize: 15, fontWeight: "600" }}
            onPress={() => Linking.openURL("mailto:gerador.curriculo.eloitech@gmail.com")}
          >
            {t("contactEmail")}
          </Button>
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
    marginBottom: 15,
    color: "#222",
  },
  faqItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  question: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
    color: "#333",
  },
  answer: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 10,
    color: "#555",
    lineHeight: 20,
  },
  answerImportant: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 10,
    color: "#e53935",
    fontWeight: "bold",
    lineHeight: 20,
  },
  text: {
    fontSize: 15,
    marginBottom: 10,
    color: "#444",
  },
  button: {
    marginTop: 12,
    borderRadius: 25,
    paddingVertical: 6,
  },
});
