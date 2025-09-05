// src/screens/BlogScreen.js
import React, { useContext } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Button, Title, Paragraph, Card, useTheme, Chip, Appbar } from 'react-native-paper';
import { UserPreferencesContext } from '../context/UserPreferencesContext';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

// 👇 LISTA DE 15 ARTIGOS COMPLETA
const articles = [
  { key: 'article1', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80' },
  { key: 'article2', image: 'https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&w=1200&q=80' },
  { key: 'article3', image: 'https://images.unsplash.com/photo-1634942537034-14c2856a2b85?auto=format&fit=crop&w=1200&q=80' },
  { key: 'article4', image: 'https://images.unsplash.com/photo-1579621970795-87f54f590095?auto=format&fit=crop&w=1200&q=80' },
  { key: 'article5', image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80' },
  { key: 'article6', image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1200&q=80' },
  { key: 'article7', image: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&w=1200&q=80' },
  { key: 'article8', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80' },
  { key: 'article9', image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80' },
  { key: 'article10', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80' },
  { key: 'article11', image: 'https://images.unsplash.com/photo-1522202801627-6e6c1b8b9e6e?auto=format&fit=crop&w=1200&q=80' },
  { key: 'article12', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80' },
  { key: 'article13', image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80' },
  { key: 'article14', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
  { key: 'article15', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80' },
];

export default function BlogScreen({ navigation }) {
  const theme = useTheme();
  const { t } = useContext(UserPreferencesContext);
  const styles = createStyles(theme);

  return (
    <View style={{flex: 1}}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface, elevation: 0 }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={t('blogScreenTitle')} titleStyle={{fontWeight: 'bold'}}/>
      </Appbar.Header>

      <ScrollView style={styles.container}>
        <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={styles.header}>
          <Animatable.View animation="fadeInDown">
            <Paragraph style={styles.headerSubtitle}>{t('blogScreenSubtitle')}</Paragraph>
          </Animatable.View>
        </LinearGradient>

        <View style={styles.content}>
          {articles.map((article, index) => (
            <Animatable.View key={article.key} animation="fadeInUp" delay={index * 150}>
              <Card 
                style={styles.card} 
                onPress={() => navigation.navigate('ArtigoScreen', { 
                  articleKey: article.key, 
                  articleImage: article.image 
                })}
              >
                <Card.Cover source={{ uri: article.image }} />
                <Card.Content style={styles.cardContent}>
                  <Chip icon="tag-outline" style={styles.chip} textStyle={styles.chipText}>
                    {t(`${article.key}Category`)}
                  </Chip>
                  <Title style={styles.cardTitle}>{t(`${article.key}Title`)}</Title>
                  <Button mode="contained" icon="arrow-right" contentStyle={{flexDirection: 'row-reverse'}}>
                    {t('readArticle')}
                  </Button>
                </Card.Content>
              </Card>
            </Animatable.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: 24, alignItems: 'center' },
  headerSubtitle: { color: 'rgba(255,255,255,0.9)', textAlign: 'center', fontSize: 16, paddingHorizontal: 16 },
  content: { padding: 16, paddingTop: 24 },
  card: { marginBottom: 24, borderRadius: 16, elevation: 4, overflow: 'hidden' },
  cardContent: { padding: 16 },
  chip: { alignSelf: 'flex-start', marginBottom: 12, backgroundColor: theme.colors.surfaceVariant },
  chipText: { color: theme.colors.onSurfaceVariant, fontWeight: 'bold' },
  cardTitle: { fontWeight: 'bold', fontSize: 22, lineHeight: 30, marginBottom: 16 },
});
