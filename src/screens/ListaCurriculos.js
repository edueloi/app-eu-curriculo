import React, { useState, useCallback, useContext } from "react";
import { StyleSheet, View, Alert, FlatList } from "react-native";
import { Card, Title, Paragraph, Button, Avatar, Divider, useTheme, Text, Snackbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as Animatable from 'react-native-animatable';
import { UserPreferencesContext } from "../context/UserPreferencesContext";

export default function ListaCurriculos({ navigation }) {
  const theme = useTheme();
  const { t } = useContext(UserPreferencesContext);
  const styles = createStyles(theme);

  const [curriculos, setCurriculos] = useState([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      carregarCurriculos();
    }, [])
  );

  const carregarCurriculos = async () => {
    const data = await AsyncStorage.getItem("curriculos");
    setCurriculos(data ? JSON.parse(data) : []);
  };

  const excluirCurriculo = (index) => {
    Alert.alert(t("deleteResumeTitle"), t("deleteResumeConfirm"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          const novos = curriculos.filter((_, i) => i !== index);
          setCurriculos(novos);
          await AsyncStorage.setItem("curriculos", JSON.stringify(novos));
          setSnackbarVisible(true); // Mostra o feedback de sucesso
        },
      },
      // BOTÃO NOVO NO ALERTA
      {
          text: t("goToHome"),
          onPress: () => navigation.navigate("Início"),
          style: "default"
      }
    ]);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  const renderItem = ({ item: curriculo, index }) => (
    <Animatable.View animation="fadeInUp" duration={600} delay={index * 100}>
        <Card style={styles.card}>
            <Card.Title
                title={curriculo.nomeInterno || `${t("resume")} ${index + 1}`}
                titleStyle={styles.titleStyle}
                subtitle={`${t("updatedOn")} ${formatDate(curriculo.lastUpdated)}`}
                subtitleStyle={styles.subtitleStyle}
                left={(props) => 
                    curriculo.fotoBase64 
                    ? <Avatar.Image {...props} size={48} source={{ uri: curriculo.fotoBase64 }} />
                    : <Avatar.Icon {...props} size={48} icon="account-circle" />
                }
                right={(props) => <Button {...props} icon="delete-outline" textColor={theme.colors.error} onPress={() => excluirCurriculo(index)}>{t("delete")}</Button>}
            />
            <Divider style={styles.divider}/>
            <Card.Actions style={styles.actions}>
                <Button
                    mode="text"
                    icon="pencil-outline"
                    onPress={() => navigation.navigate("CriarCurrículo", { curriculo, index })}
                >
                    {t("edit")}
                </Button>
                <Button
                    mode="contained"
                    icon="file-pdf-box"
                    onPress={() => navigation.navigate("SelecionarTemplate", { curriculo })}
                >
                    {t("exportAndView")} 
                </Button>
            </Card.Actions>
        </Card>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      {curriculos.length === 0 ? (
        <View style={styles.emptyContainer}>
            <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite">
                <Avatar.Icon size={80} icon="file-multiple-outline" style={{backgroundColor: theme.colors.surfaceVariant}} color={theme.colors.primary}/>
            </Animatable.View>
            <Title style={styles.emptyTitle}>{t("noResumesYet")}</Title>
            <Paragraph style={styles.emptyText}>{t("createOneNow")}</Paragraph>
            <Button
                mode="contained"
                icon="plus"
                style={{marginTop: 20}}
                onPress={() => navigation.navigate("CriarCurrculo")}
            >
                {t("createResume")}
            </Button>
        </View>
      ) : (
        <FlatList
            ListHeaderComponent={<Title style={styles.pageTitle}>📂 {t("myResumesTitle")}</Title>}
            data={curriculos}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{padding: 16}}
        />
      )}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
      >
        {t("deleteSuccess")}
      </Snackbar>
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
      marginBottom: 16,
      textAlign: "center",
      color: theme.colors.onSurface,
    },
    card: {
      marginBottom: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      elevation: 3,
      overflow: 'hidden',
    },
    titleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    subtitleStyle: {
        fontSize: 12,
        opacity: 0.7,
    },
    divider: {
        marginHorizontal: 16,
    },
    actions: {
      justifyContent: "flex-end",
      paddingVertical: 12,
      paddingHorizontal: 16,
      gap: 8,
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