import React, { useState, useEffect, useContext } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Title, Paragraph, useTheme, List, Button, Checkbox, Text } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferencesContext } from "../context/UserPreferencesContext";
import { gerarPDF } from "../utils/pdfGenerator";

// Conteúdo de exemplo para os guias em PDF
const tutorialPDFs = {
  summary: { dadosPessoais: { nome: "Guia - Resumo Profissional" }, resumoProfissional: "Conteúdo completo do guia sobre como escrever um resumo profissional..." },
  experience: { dadosPessoais: { nome: "Guia - Descrevendo Experiências" }, resumoProfissional: "Conteúdo completo do guia sobre como transformar tarefas em resultados..." },
  skills: { dadosPessoais: { nome: "Guia - Habilidades e Competências" }, resumoProfissional: "Conteúdo completo do guia sobre Hard e Soft skills..." },
};

export default function TelaTutoriais() {
  const theme = useTheme();
  const { t } = useContext(UserPreferencesContext);
  const styles = createStyles(theme);

  const [checked, setChecked] = useState({});

  useEffect(() => {
    const loadCheckedState = async () => {
      const savedState = await AsyncStorage.getItem('checklist_tutoriais');
      if (savedState) setChecked(JSON.parse(savedState));
    };
    loadCheckedState();
  }, []);

  const toggleCheck = async (id) => {
    const newState = { ...checked, [id]: !checked[id] };
    setChecked(newState);
    await AsyncStorage.setItem('checklist_tutoriais', JSON.stringify(newState));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.header}
      >
        <Animatable.Text animation="fadeInDown" style={styles.title}>📚 {t("tutorialsTitle")}</Animatable.Text>
        <Animatable.Text animation="fadeInUp" delay={200} style={styles.subtitle}>{t("tutorialsDescription")}</Animatable.Text>
      </LinearGradient>
      
      <View style={styles.content}>
        <TutorialCard
          title={t("summaryModuleTitle")}
          description={t("summaryModuleDesc")}
          icon="account-star-outline"
          delay={100}
        >
          <Paragraph style={styles.sectionText}>{t("summaryModuleContent")}</Paragraph>
          <ChecklistItem id="resumo1" text={t("summaryCheck1")} checked={checked["resumo1"]} onPress={toggleCheck} />
          <ChecklistItem id="resumo2" text={t("summaryCheck2")} checked={checked["resumo2"]} onPress={toggleCheck} />
          <ChecklistItem id="resumo3" text={t("summaryCheck3")} checked={checked["resumo3"]} onPress={toggleCheck} />
          <Button
            mode="contained"
            icon="download-outline"
            style={styles.button}
            onPress={() => gerarPDF(tutorialPDFs.summary, 'classic')}>
            {t("downloadGuide")}
          </Button>
        </TutorialCard>

        <TutorialCard
          title={t("experienceModuleTitle")}
          description={t("experienceModuleDesc")}
          icon="briefcase-edit-outline"
          delay={200}
        >
          <Paragraph style={styles.sectionText}>{t("experienceModuleContent")}</Paragraph>
          <ChecklistItem id="exp1" text={t("experienceCheck1")} checked={checked["exp1"]} onPress={toggleCheck} />
          <ChecklistItem id="exp2" text={t("experienceCheck2")} checked={checked["exp2"]} onPress={toggleCheck} />
          <ChecklistItem id="exp3" text={t("experienceCheck3")} checked={checked["exp3"]} onPress={toggleCheck} />
           <Button
            mode="contained"
            icon="download-outline"
            style={styles.button}
            onPress={() => gerarPDF(tutorialPDFs.experience, 'classic')}>
            {t("downloadGuide")}
          </Button>
        </TutorialCard>
        
        <TutorialCard 
          title={t("skillsModuleTitle")} 
          description={t("skillsModuleDesc")} 
          icon="star-outline" 
          delay={300}
        >
            <Paragraph style={styles.sectionText}>{t("skillsModuleContent")}</Paragraph>
            <ChecklistItem id="skill1" text={t("skillsCheck1")} checked={checked["skill1"]} onPress={toggleCheck} />
            <ChecklistItem id="skill2" text={t("skillsCheck2")} checked={checked["skill2"]} onPress={toggleCheck} />
            <ChecklistItem id="skill3" text={t("skillsCheck3")} checked={checked["skill3"]} onPress={toggleCheck} />
            <Button
              mode="contained"
              icon="download-outline"
              style={styles.button}
              onPress={() => gerarPDF(tutorialPDFs.skills, 'classic')}>
              {t("downloadGuide")}
            </Button>
        </TutorialCard>

        <TutorialCard 
            title={t("commonErrorsTitle")} 
            description={t("commonErrorsDesc")} 
            icon="alert-circle-outline" 
            delay={400}
        >
            <Paragraph style={styles.sectionText}>{t("errorsModuleContent")}</Paragraph>
            <ChecklistItem id="err1" text={t("errorCheck1")} checked={checked["err1"]} onPress={toggleCheck} />
            <ChecklistItem id="err2" text={t("errorCheck2")} checked={checked["err2"]} onPress={toggleCheck} />
            <ChecklistItem id="err3" text={t("errorCheck3")} checked={checked["err3"]} onPress={toggleCheck} />
            <ChecklistItem id="err4" text={t("errorCheck4")} checked={checked["err4"]} onPress={toggleCheck} />
            <ChecklistItem id="err5" text={t("errorCheck5")} checked={checked["err5"]} onPress={toggleCheck} />
        </TutorialCard>
      </View>
    </ScrollView>
  );
}

const TutorialCard = ({ title, description, icon, delay, children }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  return (
    <Animatable.View animation="fadeInUp" duration={600} delay={delay}>
      <List.Accordion
        title={title}
        description={description}
        titleStyle={styles.accordionTitle}
        descriptionStyle={styles.accordionDescription}
        style={styles.accordion}
        left={(props) => <List.Icon {...props} icon={icon} color={theme.colors.primary} />}
      >
        <View style={styles.innerContent}>
          {children}
        </View>
      </List.Accordion>
    </Animatable.View>
  );
};

const ChecklistItem = ({ id, text, checked, onPress }) => (
    <List.Item
        title={text}
        titleNumberOfLines={3}
        left={() => <Checkbox status={checked ? "checked" : "unchecked"} onPress={() => onPress(id)} />}
        onPress={() => onPress(id)}
    />
);


const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    header: {
      padding: 24,
      paddingTop: 48,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
    },
    title: {
      fontSize: 26,
      fontWeight: "bold",
      color: "#fff",
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      color: "rgba(255, 255, 255, 0.8)",
      textAlign: "center",
      marginTop: 8,
    },
    content: {
      padding: 16,
    },
    accordion: {
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        marginBottom: 12,
        elevation: 3,
    },
    accordionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    accordionDescription: {
        fontSize: 14,
        opacity: 0.7
    },
    innerContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    sectionText: {
      marginBottom: 12,
      fontSize: 15,
      lineHeight: 22,
      color: theme.colors.onSurfaceVariant,
    },
    button: {
      marginTop: 16,
      alignSelf: 'flex-start'
    },
  });