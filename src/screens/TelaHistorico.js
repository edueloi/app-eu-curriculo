import React, { useState, useCallback, useContext } from "react";
import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import {
  Card, Title, Paragraph, useTheme, List, Button, Menu, Avatar, Text, Chip
} from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Animatable from 'react-native-animatable';
import { UserPreferencesContext } from "../context/UserPreferencesContext";
import { gerarPDF } from "../utils/pdfGenerator";

import { MaterialCommunityIcons } from "@expo/vector-icons";

// Helper para mapear IDs de template para ícones e cores principais (g1)
const templateInfo = {
  classic:    { icon: 'file-document-outline',  color: '#3949AB' },
  creative:   { icon: 'palette-outline',         color: '#E91E8C' },
  corporate:  { icon: 'domain',                  color: '#00BFA5' },
  elegant:    { icon: 'star-outline',             color: '#AB47BC' },
  minimalist: { icon: 'minus-circle-outline',    color: '#607D8B' },
  inverted:   { icon: 'swap-horizontal',         color: '#29B6F6' },
  split:      { icon: 'view-column-outline',     color: '#7E57C2' },
  dark:       { icon: 'weather-night',            color: '#424242' },
  default:    { icon: 'file-question-outline',   color: '#9E9E9E' }
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
        <View style={[styles.card, { borderLeftWidth: 6, borderLeftColor: info.color }]}>
          <View style={styles.cardContent}>
            <View style={[styles.iconWrap, { backgroundColor: info.color + '22' }]}>
              <MaterialCommunityIcons name={info.icon} size={26} color={info.color} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.nome || 'Currículo'}</Text>
              <Text style={styles.cardSubtitle}>{formatDate(item.data)}</Text>
            </View>
          </View>
          <View style={[styles.actionsRow, { borderTopColor: theme.colors.outlineVariant, borderTopWidth: 1 }]}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("PreviewCurriculo", { curriculo: item.curriculo, template: item.templateId })}>
              <MaterialCommunityIcons name="eye-outline" size={16} color={theme.colors.primary} />
              <Text style={[styles.actionBtnTxt, { color: theme.colors.primary }]}>{t("view")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.colors.primaryContainer }]} onPress={() => gerarPDF(item.curriculo, item.templateId, info.color, t)}>
              <MaterialCommunityIcons name="file-pdf-box" size={16} color={theme.colors.primary} />
              <Text style={[styles.actionBtnTxt, { color: theme.colors.primary }]}>{t("reExport")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtnIcon} onPress={() => deletarRegistro(item.id)}>
              <MaterialCommunityIcons name="trash-can-outline" size={20} color="#F43F5E" />
            </TouchableOpacity>
          </View>
        </View>
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
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      overflow: 'hidden'
    },
    cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    iconWrap: {
      width: 50,
      height: 50,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textContainer: {
      flex: 1,
      marginLeft: 14,
      justifyContent: 'center',
    },
    cardTitle: {
      fontWeight: '800',
      fontSize: 16,
      color: theme.colors.onSurface,
      marginBottom: 2,
    },
    cardSubtitle: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
    },
    actionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      paddingHorizontal: 14,
      gap: 10,
    },
    actionBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant
    },
    actionBtnTxt: {
      fontSize: 13,
      fontWeight: '700'
    },
    actionBtnIcon: {
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
      backgroundColor: '#FFE4E6'
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