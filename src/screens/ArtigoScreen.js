import React, { useContext } from 'react';
import { StyleSheet, ScrollView, View, useWindowDimensions, ImageBackground } from 'react-native';
import { Appbar, Title, useTheme, Chip, Divider } from 'react-native-paper';
import { UserPreferencesContext } from '../context/UserPreferencesContext';
import { articlesContent } from '../i18n/blogContent';
import RenderHtml from 'react-native-render-html';

export default function ArtigoScreen({ route, navigation }) {
  const theme = useTheme();
  const { t, locale } = useContext(UserPreferencesContext);
  const { articleKey, articleImage } = route.params;
  const styles = createStyles(theme);
  const { width } = useWindowDimensions();

  const article = articlesContent[articleKey];
  const content = article?.[locale] || article?.pt;
  const articleTitle = t(`${articleKey}Title`) || "Artigo";
  const articleCategory = t(`${articleKey}Category`) || "Categoria";

  if (!article) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Erro" />
        </Appbar.Header>
      </View>
    );
  }

  const tagsStyles = {
    body: { color: theme.colors.onSurfaceVariant, fontSize: 17, lineHeight: 28 },
    h2: { 
      color: theme.colors.primary, 
      fontSize: 22, 
      fontWeight: 'bold',
      marginVertical: 16,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
      paddingLeft: 10
    },
    p: { marginVertical: 10 },
    ul: { marginTop: 12, paddingLeft: 18 },
    li: { 
      marginBottom: 12,
      fontSize: 16,
      backgroundColor: theme.colors.surfaceVariant,
      padding: 8,
      borderRadius: 8,
    },
    b: { fontWeight: 'bold', color: theme.colors.onSurface }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={articleCategory} titleStyle={styles.appbarTitle} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ImageBackground
          source={{ uri: articleImage }}
          style={styles.headerImage}
          imageStyle={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
        >
          <View style={styles.overlay} />
          <View style={styles.headerContent}>
            <Chip style={styles.categoryChip} textStyle={{ color: "#fff" }}>
              {articleCategory}
            </Chip>
            <Title style={styles.title}>{articleTitle}</Title>
          </View>
        </ImageBackground>

        <View style={styles.content}>
          <RenderHtml
            contentWidth={width - 48}
            source={{ html: content }}
            tagsStyles={tagsStyles}
          />
          <Divider style={{ marginTop: 24, marginBottom: 12 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  appbarTitle: { fontWeight: 'bold', fontSize: 18 },
  scrollContent: { paddingBottom: 60 },
  headerImage: {
    width: '100%',
    height: 240,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24
  },
  headerContent: {
    padding: 20,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 34,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
  content: {
    padding: 24,
  }
});
