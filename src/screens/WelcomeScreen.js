import React, { useRef, useContext, useState, useEffect } from 'react';
import {
  View, StyleSheet, Dimensions, Text, TouchableOpacity,
  FlatList, Animated, Easing, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UserPreferencesContext } from '../context/UserPreferencesContext';
import * as Animatable from 'react-native-animatable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

/* ─── Configuração dos slides ─── */
const SLIDES = [
  {
    key: 'lang',
    isLanguage: true,
    gradient: ['#4F46E5', '#7C3AED'],
    accent: '#A78BFA',
  },
  {
    key: '1',
    emoji: '✍️',
    gradient: ['#0891B2', '#0E7490'],
    accent: '#67E8F9',
    image: require('../../assets/images/welcome_create-removebg-preview.png'),
    features: [
      { icon: 'account-edit-outline',    label: 'Dados pessoais completos' },
      { icon: 'briefcase-outline',       label: 'Experiências profissionais' },
      { icon: 'school-outline',          label: 'Formação acadêmica' },
    ],
  },
  {
    key: '2',
    emoji: '🎨',
    gradient: ['#DB2777', '#BE185D'],
    accent: '#FCA5A5',
    image: require('../../assets/images/welcome_customize-removebg-preview.png'),
    features: [
      { icon: 'palette-swatch-outline',  label: '8 templates profissionais' },
      { icon: 'translate',               label: 'PT, EN e ES' },
      { icon: 'theme-light-dark',        label: 'Modo claro e escuro' },
    ],
  },
  {
    key: '3',
    emoji: '📄',
    gradient: ['#7C3AED', '#6D28D9'],
    accent: '#C4B5FD',
    image: require('../../assets/images/welcome_export-removebg-preview.png'),
    features: [
      { icon: 'file-pdf-box',            label: 'Exportar em PDF' },
      { icon: 'share-variant-outline',   label: 'Compartilhar facilmente' },
      { icon: 'eye-outline',             label: 'Pré-visualização em tempo real' },
    ],
  },
  {
    key: '4',
    emoji: '🚀',
    gradient: ['#059669', '#047857'],
    accent: '#6EE7B7',
    image: require('../../assets/images/welcome_ready-removebg-preview.png'),
    isLast: true,
    features: [
      { icon: 'star-outline',            label: 'Templates favoritos' },
      { icon: 'history',                 label: 'Histórico de currículos' },
      { icon: 'trophy-outline',          label: 'Destaque-se no mercado' },
    ],
  },
];

const LANGUAGES = [
  { code: 'pt-BR', flag: '🇧🇷', label: 'Português', sub: 'Brasil' },
  { code: 'en',    flag: '🇺🇸', label: 'English',   sub: 'United States' },
  { code: 'es',    flag: '🇪🇸', label: 'Español',   sub: 'España / Latinoamérica' },
];

/* ─── Partícula flutuante ─── */
function Particle({ size, x, y, duration, delay }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -14] });
  const opacity    = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.08, 0.22, 0.08] });
  const scale      = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.1, 1] });
  return (
    <Animated.View style={[
      { position: 'absolute', width: size, height: size, borderRadius: size / 2,
        backgroundColor: '#fff', left: x, top: y },
      { opacity, transform: [{ translateY }, { scale }] },
    ]} />
  );
}

/* ─── Slide: seleção de idioma ─── */
function LangSlide({ onSelect, insets }) {
  return (
    <View style={[ss.slide, { paddingTop: insets.top + 70 }]}>
      <Animatable.View animation="bounceIn" duration={900} delay={200} style={ss.emojiWrap}>
        <Text style={ss.emojiLg}>🌍</Text>
      </Animatable.View>

      <Animatable.Text animation="fadeInDown" duration={700} delay={400} style={ss.slideTitle}>
        Selecione seu Idioma
      </Animatable.Text>
      <Animatable.Text animation="fadeInDown" duration={700} delay={550} style={ss.slideSub}>
        Choose your language · Elige tu idioma
      </Animatable.Text>

      <Animatable.View animation="fadeInUp" duration={700} delay={700} style={ss.langList}>
        {LANGUAGES.map((lang, i) => (
          <Animatable.View key={lang.code} animation="fadeInUp" duration={500} delay={800 + i * 100}>
            <TouchableOpacity style={ss.langBtn} onPress={() => onSelect(lang.code)} activeOpacity={0.82}>
              <View style={ss.langFlagBox}>
                <Text style={{ fontSize: 26 }}>{lang.flag}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={ss.langName}>{lang.label}</Text>
                <Text style={ss.langSub}>{lang.sub}</Text>
              </View>
              <View style={ss.langChevron}>
                <MaterialCommunityIcons name="chevron-right" size={20} color="rgba(255,255,255,0.9)" />
              </View>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </Animatable.View>
    </View>
  );
}

/* ─── Slide: feature ─── */
function FeatureSlide({ slide, index, scrollX, t, insets, onFinish, onNext }) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const imgScale   = scrollX.interpolate({ inputRange, outputRange: [0.78, 1, 0.78], extrapolate: 'clamp' });
  const imgOpacity = scrollX.interpolate({ inputRange, outputRange: [0, 1, 0], extrapolate: 'clamp' });
  const txtY       = scrollX.interpolate({ inputRange, outputRange: [32, 0, -32], extrapolate: 'clamp' });
  const txtOpacity = scrollX.interpolate({ inputRange, outputRange: [0, 1, 0], extrapolate: 'clamp' });

  return (
    <View style={[ss.slide, { paddingTop: insets.top + 20 }]}>

      {/* imagem */}
      {slide.image && (
        <Animated.Image
          source={slide.image}
          style={[ss.slideImg, { transform: [{ scale: imgScale }], opacity: imgOpacity }]}
          resizeMode="contain"
        />
      )}

      {/* bloco de texto + features */}
      <Animated.View style={[ss.textBlock, { opacity: txtOpacity, transform: [{ translateY: txtY }] }]}>
        <View style={ss.emojiWrap}>
          <Text style={ss.emojiMd}>{slide.emoji}</Text>
        </View>

        <Text style={ss.slideTitle}>{t(`welcome_title_${slide.key}`)}</Text>
        <Text style={ss.slideSub}>{t(`welcome_text_${slide.key}`)}</Text>

        {/* chips de recursos */}
        <View style={ss.featureRow}>
          {slide.features.map((f, i) => (
            <View key={i} style={[ss.featureChip, { backgroundColor: 'rgba(255,255,255,0.18)', borderColor: 'rgba(255,255,255,0.28)' }]}>
              <MaterialCommunityIcons name={f.icon} size={14} color="#fff" />
              <Text style={ss.featureChipTxt}>{f.label}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* botão final */}
      {slide.isLast && (
        <Animatable.View animation="fadeInUp" duration={700} delay={300} style={ss.startWrap}>
          <TouchableOpacity onPress={onFinish} activeOpacity={0.88} style={{ borderRadius: 30, overflow: 'hidden' }}>
            <LinearGradient
              colors={['rgba(255,255,255,0.32)', 'rgba(255,255,255,0.14)']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={ss.startBtnInner}
            >
              <Text style={ss.startBtnTxt}>{t('startNow') || 'Começar Agora'}</Text>
              <MaterialCommunityIcons name="rocket-launch" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
      )}
    </View>
  );
}

/* ─── Tela principal ─── */
export default function WelcomeScreen({ onFinish }) {
  const scrollX     = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const { t, updatePreferences } = useContext(UserPreferencesContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();

  const handleFinish = async () => {
    await AsyncStorage.setItem('hasSeenWelcome', 'true');
    if (onFinish) onFinish();
  };

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1)
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
  };

  const handleLangSelect = (lang) => {
    updatePreferences({ language: lang });
    flatListRef.current?.scrollToIndex({ index: 1, animated: true });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;

  const isLast   = currentIndex === SLIDES.length - 1;
  const isLang   = currentIndex === 0;
  const curSlide = SLIDES[currentIndex];

  const PARTICLES = [
    { size: 110, x: -35,         y: 70,             dur: 7000, delay: 0    },
    { size: 65,  x: width - 75,  y: 150,            dur: 8500, delay: 1200 },
    { size: 42,  x: width * 0.5, y: 260,            dur: 9000, delay: 2500 },
    { size: 26,  x: 40,          y: height * 0.58,  dur: 7500, delay: 800  },
    { size: 18,  x: width * 0.72,y: height * 0.48,  dur: 8000, delay: 3000 },
    { size: 80,  x: width * 0.25,y: height * 0.72,  dur: 9500, delay: 1800 },
  ];

  return (
    <View style={{ flex: 1 }}>

      {/* ── fundos com transição suave ── */}
      {SLIDES.map((slide, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const opacity = scrollX.interpolate({ inputRange, outputRange: [0, 1, 0], extrapolate: 'clamp' });
        return (
          <Animated.View key={i} style={[StyleSheet.absoluteFillObject, { opacity }]}>
            <LinearGradient colors={slide.gradient} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
          </Animated.View>
        );
      })}

      {/* partículas */}
      {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

      {/* overlay levíssimo */}
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.06)' }} />

      {/* ── barra de progresso (só nos slides de feature) ── */}
      {!isLang && (
        <View style={[ss.progressBar, { top: insets.top + 8 }]}>
          {SLIDES.slice(1).map((_, i) => {
            const realIndex = i + 1;
            const active = currentIndex === realIndex;
            const done   = currentIndex > realIndex;
            return (
              <View key={i} style={[
                ss.progressSeg,
                done  && { backgroundColor: 'rgba(255,255,255,0.9)' },
                active && { backgroundColor: 'rgba(255,255,255,0.9)', flex: 1.6 },
                !done && !active && { backgroundColor: 'rgba(255,255,255,0.25)' },
              ]} />
            );
          })}
        </View>
      )}

      {/* ── botão pular ── */}
      {!isLast && (
        <Animatable.View animation="fadeInDown" duration={600} delay={400}
          style={[ss.skipWrap, { top: insets.top + (isLang ? 14 : 40) }]}>
          <TouchableOpacity onPress={handleFinish} activeOpacity={0.8} style={ss.skipBtn}>
            <Text style={ss.skipTxt}>Pular</Text>
            <MaterialCommunityIcons name="close" size={13} color="rgba(255,255,255,0.9)" />
          </TouchableOpacity>
        </Animatable.View>
      )}

      {/* ── slides ── */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        keyExtractor={(item) => item.key}
        renderItem={({ item, index }) =>
          item.isLanguage
            ? <LangSlide onSelect={handleLangSelect} insets={insets} />
            : <FeatureSlide slide={item} index={index} scrollX={scrollX} t={t} insets={insets} onFinish={handleFinish} onNext={goNext} />
        }
      />

      {/* ── paginação por dots ── */}
      <View style={[ss.pagination, { bottom: insets.bottom + 86 }]}>
        {SLIDES.map((slide, i) => {
          const dotW = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [6, 26, 6], extrapolate: 'clamp',
          });
          const dotOp = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [0.3, 1, 0.3], extrapolate: 'clamp',
          });
          return (
            <Animated.View key={i} style={[ss.dot, { width: dotW, opacity: dotOp, backgroundColor: slide.accent || '#fff' }]} />
          );
        })}
      </View>

      {/* ── botão próximo ── */}
      {!isLang && !isLast && (
        <View style={[ss.nextWrap, { bottom: insets.bottom + 24 }]}>
          <TouchableOpacity onPress={goNext} activeOpacity={0.88} style={{ borderRadius: 30, overflow: 'hidden' }}>
            <LinearGradient
              colors={['rgba(255,255,255,0.26)', 'rgba(255,255,255,0.12)']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={ss.nextBtnInner}
            >
              <Text style={ss.nextBtnTxt}>{t('next') || 'Próximo'}</Text>
              <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
}

/* ─── Estilos ─── */
const ss = StyleSheet.create({

  /* progresso */
  progressBar: {
    position: 'absolute', left: 20, right: 90,
    flexDirection: 'row', gap: 5, zIndex: 20,
  },
  progressSeg: { flex: 1, height: 3.5, borderRadius: 2 },

  /* pular */
  skipWrap: { position: 'absolute', right: 18, zIndex: 20 },
  skipBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 13, paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)',
  },
  skipTxt: { color: '#fff', fontSize: 13, fontWeight: '700' },

  /* slide */
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 26,
    paddingBottom: 140,
  },

  /* emojis */
  emojiWrap: {
    width: 88, height: 88, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
  },
  emojiLg: { fontSize: 46 },
  emojiMd: { fontSize: 36 },

  /* imagem */
  slideImg: {
    width: width * 0.72,
    height: height * 0.26,
    marginBottom: 8,
  },

  textBlock: { alignItems: 'center', width: '100%' },

  slideTitle: {
    fontSize: 26, fontWeight: '900', color: '#fff',
    textAlign: 'center', marginBottom: 10, letterSpacing: 0.2,
    textShadowColor: 'rgba(0,0,0,0.18)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
  },
  slideSub: {
    fontSize: 14, color: 'rgba(255,255,255,0.82)',
    textAlign: 'center', lineHeight: 22, marginBottom: 20,
  },

  /* chips de recursos */
  featureRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', width: '100%' },
  featureChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 7, paddingHorizontal: 12,
    borderRadius: 20, borderWidth: 1,
  },
  featureChipTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },

  /* idioma */
  langList: { width: '100%', gap: 10, marginTop: 24 },
  langBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 18, paddingVertical: 13, paddingHorizontal: 16,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.28)',
  },
  langFlagBox: {
    width: 46, height: 46, borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  langName: { color: '#fff', fontSize: 16, fontWeight: '800' },
  langSub:  { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 1 },
  langChevron: {
    width: 32, height: 32, borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },

  /* paginação */
  pagination: {
    position: 'absolute', left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6,
  },
  dot: { height: 7, borderRadius: 4 },

  /* próximo */
  nextWrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  nextBtnInner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 14, paddingHorizontal: 40,
    borderRadius: 30, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)',
  },
  nextBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },

  /* começar */
  startWrap: { width: '100%', marginTop: 20 },
  startBtnInner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 17, borderRadius: 30,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.45)',
  },
  startBtnTxt: { color: '#fff', fontWeight: '900', fontSize: 18, letterSpacing: 0.3 },
});
