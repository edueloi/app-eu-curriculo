import React, { useState, useCallback, useContext } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import {
  Card, Title, Paragraph, useTheme, List, Button, Menu, Avatar, Text, Chip
} from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Animatable from 'react-native-animatable';
import { UserPreferencesContext } from "../context/UserPreferencesContext";
import { gerarPDF } from "../utils/pdfGenerator";

// Helper para mapear IDs de template para ícones e cores
const templateInfo = {
  classic: { icon: 'file-document-outline', color: '#424242' },
  creative: { icon: 'creation', color: '#EF5350' },
  corporate: { icon: 'briefcase-outline', color: '#42A5F5' },
  elegant: { icon: 'flower-tulip-outline', color: '#EC407A' },
  default: { icon: 'file-question-outline', color: '#9E9E9E' }
};

export default function TelaHistorico({ navigation }) {
  const theme = useTheme();
  const { t } = useContext(UserPreferencesContext);
  const styles = createStyles(theme);

  const [historico, setHistorico] = useState([]);
  const [menuVisivel, setMenuVisivel] = useState({});

  useFocusEffect(
    useCallback(() => {
      carregarHistorico();
    }, [])
  );

  const carregarHistorico = async () => {
    try {
      const data = await AsyncStorage.getItem('historico_pdfs');
      setHistorico(data ? JSON.parse(data) : []);
    } catch (e) {
      console.error("Erro ao carregar histórico:", e);
    }
  };

  const deletarRegistro = async (id) => {
    const novaLista = historico.filter((item) => item.id !== id);
    setHistorico(novaLista);
    await AsyncStorage.setItem('historico_pdfs', JSON.stringify(novaLista));
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  const renderItem = ({ item, index }) => {
    const info = templateInfo[item.templateId] || templateInfo.default;
    
    return (
      <Animatable.View animation="fadeInUp" duration={600} delay={index * 100}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Avatar.Icon size={48} icon={info.icon} style={{ backgroundColor: info.color }} color="#fff" />
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.nome}</Text>
              <Paragraph style={styles.cardSubtitle}>{formatDate(item.data)}</Paragraph>
            </View>
            <Menu
              visible={menuVisivel[item.id]}
              onDismiss={() => setMenuVisivel({ ...menuVisivel, [item.id]: false })}
              anchor={
                <Button icon="dots-vertical" onPress={() => setMenuVisivel({ ...menuVisivel, [item.id]: true })} />
              }>
              <Menu.Item onPress={() => { navigation.navigate("PreviewCurriculo", { curriculo: item.curriculo, templateId: item.templateId }); setMenuVisivel({}); }} title={t("view")} leadingIcon="eye-outline" />
              <Menu.Item onPress={() => { gerarPDF(item.curriculo, item.templateId); setMenuVisivel({}); }} title={t("reExport")} leadingIcon="refresh" />
              <Menu.Item onPress={() => { deletarRegistro(item.id); setMenuVisivel({}); }} title={t("delete")} titleStyle={{color: theme.colors.error}} leadingIcon="delete-outline" />
            </Menu>
          </Card.Content>
        </Card>
      </Animatable.View>
    );
  };

  return (
    <View style={styles.container}>
      {historico.length === 0 ? (
        <View style={styles.emptyContainer}>
            <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite">
                <List.Icon icon="history" size={80} color={theme.colors.onSurfaceDisabled} />
            </Animatable.View>
            <Title style={styles.emptyTitle}>{t("noExportsYet")}</Title>
            <Paragraph style={styles.emptyText}>{t("exportToGetStarted")}</Paragraph>
        </View>
      ) : (
        <FlatList
            ListHeaderComponent={<Title style={styles.pageTitle}>📑 {t("exportHistory")}</Title>}
            data={historico}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{padding: 16}}
        />
      )}
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    pageTitle: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 24,
      textAlign: "center",
      color: theme.colors.onSurface,
    },
    card: {
      marginBottom: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      elevation: 3,
    },
    cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    textContainer: {
      flex: 1,
      marginLeft: 16,
      justifyContent: 'center',
    },
    cardTitle: {
      fontWeight: 'bold',
      fontSize: 16,
      color: theme.colors.onSurface,
    },
    cardSubtitle: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyTitle: {
        marginTop: 24,
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    emptyText: {
      textAlign: "center",
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
      marginTop: 8,
    },
  });