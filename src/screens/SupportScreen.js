import React, { useContext } from "react";
import { StyleSheet, ScrollView, View, Linking } from "react-native";
import { Title, Paragraph, Card, Button, useTheme, List, Avatar } from "react-native-paper";
import { UserPreferencesContext } from "../context/UserPreferencesContext";
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

export default function SupportScreen() {
  const theme = useTheme();
  const { t } = useContext(UserPreferencesContext);
  const styles = createStyles(theme);

  const faqs = [
    { key: "faq1", icon: "file-document-edit-outline" },
    { key: "faq2", icon: "folder-multiple-outline" },
    { key: "faq3", icon: "account-off-outline" },
    { key: "faq4", icon: "alert-circle-outline", color: theme.colors.error },
    { key: "faq5", icon: "cloud-upload-outline" },
    { key: "faq6", icon: "wifi-off" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={{backgroundColor: theme.colors.background}}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.header}
      >
        <Animatable.View animation="fadeInDown" duration={800}>
          <List.Icon icon="help-circle-outline" color="#fff" style={{alignSelf: 'center'}} size={60} />
          <Title style={styles.headerTitle}>{t("supportContact")}</Title>
        </Animatable.View>
      </LinearGradient>

      <View style={styles.content}>
        <Animatable.View animation="fadeInUp" duration={800} delay={200}>
          <Card style={styles.card}>
            <Card.Content style={styles.contactContent}>
              <Paragraph style={styles.text}>{t("contactDescription")}</Paragraph>
              <Button
                mode="contained"
                icon="email-outline"
                style={styles.button}
                onPress={() => Linking.openURL("mailto:eloitech.app.meucurriculo@gmail.com.br")}
              >
                {t("contactEmail")}
              </Button>
            </Card.Content>
          </Card>
        </Animatable.View>
        
        <Animatable.View animation="fadeInUp" duration={800} delay={300}>
          <Title style={styles.sectionTitle}>{t("faqTitle")}</Title>
          <Card style={styles.card}>
            <List.AccordionGroup>
              {faqs.map((faq) => (
                <List.Accordion 
                  key={faq.key} 
                  id={faq.key} 
                  title={t(faq.key)}
                  titleStyle={styles.question}
                  left={props => <List.Icon {...props} icon={faq.icon} color={faq.color || theme.colors.primary} />}
                >
                  <Paragraph style={[styles.answer, faq.key === 'faq4' && styles.answerImportant]}>
                    {t(`${faq.key}Answer`)}
                  </Paragraph>
                </List.Accordion>
              ))}
            </List.AccordionGroup>
          </Card>
        </Animatable.View>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  scrollContainer: {
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    paddingTop: 56,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 12,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.onBackground,
    marginBottom: 16,
    marginTop: 8,
  },
  card: {
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    elevation: 3,
  },
  contactContent: {
      alignItems: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.onSurface,
  },
  answer: {
    fontSize: 15,
    paddingHorizontal: 16,
    paddingBottom: 16,
    lineHeight: 22,
    color: theme.colors.onSurfaceVariant,
  },
  answerImportant: {
    color: theme.colors.error,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
  },
});