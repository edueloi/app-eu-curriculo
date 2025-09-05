import React, { useState, useContext, useMemo } from 'react';
import { StyleSheet, ScrollView, View, Linking } from 'react-native';
import { Button, Title, Paragraph, Card, Avatar, useTheme, Text, Divider, List } from 'react-native-paper';
import { UserPreferencesContext } from '../context/UserPreferencesContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TelaInicial({ navigation }) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { t, profile } = useContext(UserPreferencesContext);

  const [totalCurriculos, setTotalCurriculos] = useState(0);
  const [ultimoCurriculo, setUltimoCurriculo] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const carregarDados = async () => {
        const data = await AsyncStorage.getItem("curriculos");
        if (data) {
          const lista = JSON.parse(data);
          setTotalCurriculos(lista.length);
          const ultimo = lista.length > 0 ? { curriculo: lista[lista.length - 1], index: lista.length - 1 } : null;
          setUltimoCurriculo(ultimo);
        } else {
          setTotalCurriculos(0);
          setUltimoCurriculo(null);
        }
      };
      carregarDados();
    }, [])
  );

  const nomeUsuario = profile?.nome?.split(' ')[0] || t("user");
  
  const dicas = [t("tip1"), t("tip2"), t("tip3"), t("tip4"), t("tip5"), t("tip6"), t("tip7"), t("tip8")];
  const dicaDoDia = useMemo(() => {
    const diaDoAno = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return dicas[diaDoAno % dicas.length];
  }, [t]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Animatable.View animation="fadeInDown" duration={800}>
          <Title style={styles.welcomeTitle}>{`${t("welcome")}, ${nomeUsuario}!`}</Title>
          <Paragraph style={styles.welcomeSubtitle}>{t("welcomeSubtitle")}</Paragraph>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={800} delay={200}>
          <Card style={styles.summaryCard}>
            <Card.Content style={styles.summaryContent}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{totalCurriculos}</Text>
                <Paragraph style={styles.summaryLabel}>{t("resumesSaved")}</Paragraph>
              </View>
              <View style={styles.summarySeparator} />
              <View style={styles.summaryItem}>
                <Avatar.Icon size={32} icon="account-tie" style={{ backgroundColor: 'transparent' }} color={theme.colors.secondary} />
                <Paragraph style={styles.summaryLabel} numberOfLines={2}>{profile?.profissao || t("yourProfession")}</Paragraph>
              </View>
            </Card.Content>
          </Card>
        </Animatable.View>

        {ultimoCurriculo && (
          <Animatable.View animation="fadeInUp" duration={800} delay={300}>
             <Title style={styles.sectionTitle}>{t("continueWhereYouLeftOff")}</Title>
            <Card style={styles.card}>
              <Card.Title 
                title={ultimoCurriculo.curriculo.nomeInterno || t('lastEdited')}
                titleStyle={{fontWeight: 'bold'}}
                left={(props) => <Avatar.Icon {...props} icon="file-clock-outline" />}
              />
              <Card.Actions style={styles.actions}>
                <Button icon="pencil-outline" onPress={() => navigation.navigate('CriarCurrículo', ultimoCurriculo)}>{t("edit")}</Button>
                <Button icon="file-eye-outline" mode="contained" onPress={() => navigation.navigate('MeusCurriculos', { 
                    screen: 'SelecionarTemplate', 
                    params: { curriculo: ultimoCurriculo.curriculo } 
                  })}>{t("view")}</Button>
              </Card.Actions>
            </Card>
          </Animatable.View>
        )}

        <Title style={styles.sectionTitle}>{t("quickActions")}</Title>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
             <CardAcao icon="folder-multiple-outline" label={t("myResumes")} onPress={() => navigation.navigate('MeusCurriculos')} styles={styles} theme={theme} />
             <CardAcao icon="plus-circle-outline" label={t("createResume")} onPress={() => navigation.navigate('CriarCurrículo')} styles={styles} theme={theme} />
             <CardAcao icon="school-outline" label={t("tutorials")} onPress={() => navigation.navigate('Tutoriais')} styles={styles} theme={theme} />
             <CardAcao icon="cog-outline" label={t("settings")} onPress={() => navigation.navigate('Configurações')} styles={styles} theme={theme} />
        </ScrollView>

        <Animatable.View animation="fadeInUp" duration={800} delay={500}>
            <Title style={styles.sectionTitle}>{t("usefulResources")}</Title>
            <Card style={styles.card}>
                <List.Item
                    title={t("findJobs")}
                    description={t("findJobsDesc")}
                    left={props => <List.Icon {...props} icon="briefcase-search-outline" />}
                    right={props => <List.Icon {...props} icon="open-in-new" />}
                    onPress={() => navigation.navigate('SitesRecomendados')}
                />
                <Divider/>
                 <List.Item
                    title={t("blogTips")}
                    description={t("blogTipsDesc")}
                    left={props => <List.Icon {...props} icon="post-outline" />}
                    right={props => <List.Icon {...props} icon="open-in-new" />}
                    onPress={() => navigation.navigate('BlogScreen')}
                />
            </Card>
        </Animatable.View>
        
        <Title style={styles.sectionTitle}>{t("cardOfTheDay")}</Title>
        <Animatable.View animation="fadeInUp" duration={800} delay={600}>
          <Card style={styles.card}>
             <Card.Title 
               title={t("didYouKnow")}
               left={(props) => <Avatar.Icon {...props} icon="lightbulb-on-outline" style={{backgroundColor: 'transparent'}} color={theme.colors.primary}/>}
             />
             <Divider/>
            <Card.Content style={{paddingTop: 16}}>
              <Dica icon="check-circle" text={dicaDoDia} styles={styles} />
            </Card.Content>
          </Card>
        </Animatable.View>
      </ScrollView>

      <Animatable.View animation="zoomIn" duration={500} delay={1000}>
        <Button 
          icon="plus" 
          mode="contained" 
          style={styles.fab}
          onPress={() => navigation.navigate('CriarCurrículo')}
          contentStyle={styles.fabContent}
        >
          {t("create")}
        </Button>
      </Animatable.View>
    </View>
  );
}

const CardAcao = ({ icon, label, onPress, styles, theme }) => (
  <Card style={styles.actionCard} onPress={onPress}>
    <Card.Content style={styles.actionContent}>
      <Avatar.Icon size={40} icon={icon} style={{ backgroundColor: theme.colors.surfaceVariant }} />
      <Text style={styles.actionLabel} numberOfLines={2}>{label}</Text>
    </Card.Content>
  </Card>
);

const Dica = ({ icon, text, styles }) => (
  <View style={styles.tipContainer}>
    <MaterialCommunityIcons name={icon} size={20} style={styles.tipIcon} />
    <Paragraph style={styles.tipText}>{text}</Paragraph>
  </View>
);

const createStyles = (theme) => StyleSheet.create({
  container: { 
    paddingHorizontal: 16, 
    paddingVertical: 8,
    paddingBottom: 100,
    backgroundColor: theme.colors.background 
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800', // Mais forte
    color: theme.colors.onBackground,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: 20,
    elevation: 4,
    marginBottom: 24,
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
  },
  summaryItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  summaryValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.colors.onPrimaryContainer,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.onPrimaryContainer,
    textAlign: 'center'
  },
  summarySeparator: {
    width: 1,
    height: '80%',
    backgroundColor: theme.colors.onPrimaryContainer,
    opacity: 0.3,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 16,
    color: theme.colors.onBackground,
  },
  horizontalScroll: {
    paddingLeft: 16, // Espaçamento inicial para o scroll horizontal
    paddingRight: 8,  // Espaçamento final
    marginHorizontal: -16, // Compensa o padding do container
  },
  actionCard: {
    width: 130,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    elevation: 2,
  },
  actionContent: {
    alignItems: 'center',
    padding: 16,
    gap: 12, // Aumenta o espaçamento interno
    minHeight: 120,
  },
  actionLabel: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: theme.colors.onSurface
  },
  card: { 
    borderRadius: 16, 
    backgroundColor: theme.colors.surface, 
    elevation: 2, 
    marginBottom: 24, 
  },
  actions: { 
    justifyContent: 'flex-end', 
    paddingHorizontal: 16, 
    paddingBottom: 16 
  },
  tipContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  tipIcon: { 
    marginRight: 16, 
    color: theme.colors.primary, 
  },
  tipText: { 
    flex: 1, 
    color: theme.colors.onSurfaceVariant, 
    lineHeight: 22 
  },
  fab: { 
    position: 'absolute', 
    right: 16, 
    bottom: 50, 
    borderRadius: 30, 
    elevation: 8, 
  },
  fabContent: { 
    paddingHorizontal: 8, 
    height: 56, 
  },
  inspirationCover: { 
    borderTopLeftRadius: 16, 
    borderTopRightRadius: 16, 
    height: 120 
  },
  inspirationContent: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 16 
  },
});