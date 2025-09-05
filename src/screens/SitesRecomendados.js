import React, { useContext, useState, useRef } from 'react';
import { StyleSheet, ScrollView, View, Linking, Dimensions } from 'react-native';
import { Button, Title, Paragraph, Card, useTheme, Text, Divider, List, IconButton } from 'react-native-paper';
import { UserPreferencesContext } from '../context/UserPreferencesContext';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgXml } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

const { width: screenWidth } = Dimensions.get('window');

// Objeto 'icons' com os SVGs
const icons = {
    linkedin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11H9.3v8.18h3.75v-4.47c0-1.42.86-2.12 2.06-2.12c1.21 0 1.94.7 1.94 2.12v4.47H18.5M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69.75a1.69 1.69 0 0 0 0 1.88a1.68 1.68 0 0 0 1.69.74m.25 10.03H5.62V9.45h3.75v9.14Z"/></svg>`,
    vagas: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path fill="white" d="M100 0C44.77 0 0 44.77 0 100s44.77 100 100 100s100-44.77 100-100S155.23 0 100 0zm-5.44 148.43l-34-75.14h2.15l15.3 47.38l12.78-47.38h3.8l12.78 47.38l15.3-47.38h2.15l-34 75.14h-2.82z"/></svg>`,
    indeed: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="white" d="M83.82,19.22a22.25,22.25,0,0,0-31,3.48,22.25,22.25,0,0,0-31-3.48,22.41,22.41,0,0,0-3.48,31,22.25,22.25,0,0,0,3.48,31,22.41,22.41,0,0,0,31-3.48,22.25,22.25,0,0,0,31-3.48,22.41,22.41,0,0,0,3.48-31A22.25,22.25,0,0,0,83.82,19.22ZM37.59,73.12a7.51,7.51,0,1,1,7.51-7.51A7.51,7.51,0,0,1,37.59,73.12ZM25.43,26.88a7.51,7.51,0,1,1-7.51,7.51A7.51,7.51,0,0,1,25.43,26.88Zm49.14,0a7.51,7.51,0,1,1-7.51,7.51A7.51,7.51,0,0,1,74.57,26.88Z"/></svg>`,
};

const sites = [
    { key: 'linkedin', url: 'https://www.linkedin.com/jobs', colors: ['#0A66C2', '#004182'] },
    { key: 'vagas', url: 'https://www.vagas.com.br', colors: ['#00A650', '#007036'] },
    { key: 'indeed', url: 'https://www.indeed.com', colors: ['#2557A7', '#112A52'] },
];

export default function SitesRecomendados() {
    const theme = useTheme();
    const { t } = useContext(UserPreferencesContext);
    const styles = createStyles(theme);
    const scrollViewRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / screenWidth);
        if (index !== activeIndex) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveIndex(index);
        }
    };

    const goToSlide = (index) => {
        scrollViewRef.current?.scrollTo({ x: index * screenWidth, animated: true });
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={styles.header}>
                <Animatable.View animation="fadeInDown">
                    <Title style={styles.headerTitle}>{t('recommendedSites')}</Title>
                    <Paragraph style={styles.headerSubtitle}>{t('sitesDescription')}</Paragraph>
                </Animatable.View>
            </LinearGradient>
            
            <View style={styles.carouselContainer}>
                <IconButton
                    icon="chevron-left-circle"
                    size={40}
                    iconColor="white"
                    style={[styles.navButton, styles.prevButton, { opacity: activeIndex === 0 ? 0.3 : 1 }]}
                    onPress={() => goToSlide(activeIndex - 1)}
                    disabled={activeIndex === 0}
                />
                <ScrollView 
                    ref={scrollViewRef}
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={styles.horizontalScroll}
                    pagingEnabled
                    decelerationRate="fast"
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    {sites.map((site, index) => (
                        <Card key={site.key} style={styles.card}>
                            <LinearGradient colors={site.colors} style={styles.cardHeader}>
                                <SvgXml xml={icons[site.key]} width="80" height="80" />
                                <Title style={styles.cardTitle}>{t(`${site.key}Name`)}</Title>
                            </LinearGradient>
                            <ScrollView contentContainerStyle={styles.cardContent}>
                                <Paragraph style={styles.description}>{t(`${site.key}Desc`)}</Paragraph>
                                <Divider style={styles.divider} />
                                <DicaDeSite text={t(`${site.key}Tip1`)} theme={theme} />
                                <DicaDeSite text={t(`${site.key}Tip2`)} theme={theme} />
                                <DicaDeSite text={t(`${site.key}Tip3`)} theme={theme} />
                                <DicaDeSite text={t(`${site.key}Tip4`)} theme={theme} />
                            </ScrollView>
                            <Card.Actions style={styles.actions}>
                                <Button mode="contained" icon="open-in-new" onPress={() => Linking.openURL(site.url)}>
                                    {t('accessSite')}
                                </Button>
                            </Card.Actions>
                        </Card>
                    ))}
                </ScrollView>
                <IconButton
                    icon="chevron-right-circle"
                    size={40}
                    iconColor="white"
                    style={[styles.navButton, styles.nextButton, { opacity: activeIndex === sites.length - 1 ? 0.3 : 1 }]}
                    onPress={() => goToSlide(activeIndex + 1)}
                    disabled={activeIndex === sites.length - 1}
                />
            </View>

            <View style={styles.pagination}>
                {sites.map((_, index) => (
                    <View key={index} style={[styles.dot, { backgroundColor: index === activeIndex ? theme.colors.primary : theme.colors.outline }]} />
                ))}
            </View>
        </View>
    );
}

// 👇 AQUI ESTÁ A CORREÇÃO
const DicaDeSite = ({ text, theme }) => (
    <View style={{flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12}}>
        <List.Icon icon="star-circle" color={theme.colors.secondary} style={{margin: 0}}/>
        <Paragraph style={{flex: 1, marginLeft: 8, color: theme.colors.onSurfaceVariant}}>{text}</Paragraph>
    </View>
);

const createStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { padding: 24, paddingTop: 56, alignItems: 'center' },
    headerTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold', textAlign: 'center' },
    headerSubtitle: { color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 4 },
    carouselContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    horizontalScroll: {
        alignItems: 'center',
    },
    card: {
        width: screenWidth - 60,
        height: '90%',
        maxHeight: 550,
        borderRadius: 24,
        marginHorizontal: 30,
        elevation: 8,
        backgroundColor: theme.colors.surface,
        overflow: 'hidden'
    },
    cardHeader: {
        height: '35%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    cardTitle: { 
        fontWeight: 'bold', 
        fontSize: 24, 
        color: '#fff', 
        marginTop: 8
    },
    cardContent: {
        padding: 20,
    },
    description: { 
        lineHeight: 22, 
        marginBottom: 16, 
        fontSize: 15,
        textAlign: 'center',
    },
    divider: { marginVertical: 12 },
    actions: { 
        justifyContent: 'center', 
        padding: 16, 
        borderTopWidth: 1, 
        borderColor: theme.colors.outlineVariant 
    },
    navButton: {
        position: 'absolute',
        top: '50%',
        marginTop: -25,
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    prevButton: { left: -5 },
    nextButton: { right: -5 },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
});