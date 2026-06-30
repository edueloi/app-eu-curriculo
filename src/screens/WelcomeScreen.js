import React, { useRef, useContext, useState, useEffect } from 'react';
import {
  View, StyleSheet, Dimensions, Text, TouchableOpacity,
  FlatList, Animated, Easing, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { UserPreferencesContext } from '../context/UserPreferencesContext';
import * as Animatable from 'react-native-animatable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    key: '0',
    icon: 'translate',
    emoji: '🌍',
    gradient: ['#6366F1', '#8B5CF6'],
    accentColor: '#A78BFA',
    image: null,
    isLanguage: true,
  },
  {
    key: '1',
    icon: 'file-plus-outline',
    emoji: '✍️',
    gradient: ['#0891B2', '#06B6D4'],
    accentColor: '#67E8F9',
    image: require('../../assets/images/welcome_create-removebg-preview.png'),
  },
  {
    key: '2',
    icon: 'palette-outline',
    emoji: '🎨',
    gradient: ['#EC4899', '#F43F5E'],
    accentColor: '#FDA4AF',
    image: require('../../assets/images/welcome_customize-removebg-preview.png'),
  },
  {
    key: '3',
    icon: 'file-pdf-box',
    emoji: '📄',
    gradient: ['#7C3AED', '#6D28D9'],
    accentColor: '#C4B5FD',
    image: require('../../assets/images/welcome_export-removebg-preview.png'),
  },
  {
    key: '4',
    icon: 'rocket-launch-outline',
    emoji: '🚀',
    gradient: ['#059669', '#10B981'],
    accentColor: '#6EE7B7',
    image: require('../../assets/images/welcome_ready-removebg-preview.png'),
  },
];

const LANGUAGES = [
  { code: 'pt-BR', flag: '🇧🇷', label: 'Português', sub: 'Brasil' },
  { code: 'en',    flag: '🇺🇸', label: 'English',   sub: 'United States' },
  { code: 'es',    flag: '🇪🇸', label: 'Español',   sub: 'España' },
];

/* ── Partícula flutuante ── */
function Particle({ color, size, x, y, duration, delay }) {
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
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -30] });
  const opacity    = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.15, 0.55, 0.15] });
  const scale      = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.3, 1] });
  return (
    <Animated.View style={[
      ps.particle,
      { width: size, height: size, borderRadius: size / 2, backgroundColor: color, left: x, top: y },
      { opacity, transform: [{ translateY }, { scale }] },
    ]} />
  );
}

/* ── Slide de idioma ── */
function LanguageSlide({ onSelect, insets }) {
  return (
    <View style={[ss.slide, { paddingTop: insets.top + 80 }]}>
      <Animatable.View animation="bounceIn" duration={900} delay={200} style={ss.iconWrap}>
        <Text style={{ fontSize: 44 }}>🌍</Text>
      </Animatable.View>

      <Animatable.Text animation="fadeInDown" duration={700} delay={400} style={ss.title}>
        Selecione seu Idioma
      </Animatable.Text>
      <Animatable.Text animation="fadeInDown" duration={700} delay={550} style={ss.subtitle}>
        Choose your language · Elige tu idioma
      </Animatable.Text>

      <Animatable.View animation="fadeInUp" duration={700} delay={700} style={ss.langList}>
        {LANGUAGES.map((lang, i) => (
          <Animatable.View key={lang.code} animation="fadeInUp" duration={500} delay={800 + i * 100}>
            <TouchableOpacity style={ss.langBtn} onPress={() => onSelect(lang.code)} activeOpacity={0.8}>
              <View style={ss.langFlagWrap}>
                <Text style={{ fontSize: 28 }}>{lang.flag}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={ss.langLabel}>{lang.label}</Text>
                <Text style={ss.langSub}>{lang.sub}</Text>
              </View>
              <View style={ss.langArrow}>
                <MaterialCommunityIcons name="arrow-right" size={18} color="rgba(255,255,255,0.9)" />
              </View>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </Animatable.View>
    </View>
  );
}

/* ── Slide de feature ── */
function FeatureSlide({ item, index, scrollX, isLast, onFinish, onNext, t, insets }) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const imageScale = scrollX.interpolate({ inputRange, outputRange: [0.75, 1, 0.75], extrapolate: 'clamp' });
  const imageOpacity = scrollX.interpolate({ inputRange, outputRange: [0, 1, 0], extrapolate: 'clamp' });
  const textY = scrollX.interpolate({ inputRange, outputRange: [40, 0, -40], extrapolate: 'clamp' });
  const textOpacity = scrollX.interpolate({ inputRange, outputRange: [0, 1, 0], extrapolate: 'clamp' });

  return (
    <View style={[ss.slide, { paddingTop: insets.top + 40 }]}>
      {item.image && (
        <Animated.Image
          source={item.image}
          style={[ss.image, { transform: [{ scale: imageScale }], opacity: imageOpacity }]}
          resizeMode="contain"
        />
      )}

      <Animated.View style={[ss.textBlock, { opacity: textOpacity, transform: [{ translateY: textY }] }]}>
        <View style={[ss.iconWrap, { backgroundColor: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.3)' }]}>
          <Text style={{ fontSize: 32 }}>{item.emoji}</Text>
        </View>
        <Text style={ss.title}>{t(`welcome_title_${item.key}`)}</Text>
        <Text style={ss.subtitle}>{t(`welcome_text_${item.key}`)}</Text>
      </Animated.View>

      {isLast && (
        <Animatable.View animation="fadeInUp" duration={700} delay={300} style={ss.startWrap}>
          <TouchableOpacity onPress={onFinish} activeOpacity={0.88} style={ss.startBtn}>
            <LinearGradient
              colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.15)']}
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

export default function WelcomeScreen({ onFinish }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const { t, updatePreferences } = useContext(UserPreferencesContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();

  const handleFinish = async () => {
    await AsyncStorage.setItem('hasSeenWelcome', 'true');
    if (onFinish) onFinish();
  };

  const handleLanguageSelect = (lang) => {
    updatePreferences({ language: lang });
    flatListRef.current?.scrollToIndex({ index: 1, animated: true });
  };

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;

  const currentSlide = SLIDES[currentIndex];

  /* partículas */
  const PARTICLES = [
    { size: 100, x: -30, y: 80,  dur: 3400, delay: 0    },
    { size: 60,  x: width - 70, y: 160, dur: 2800, delay: 500  },
    { size: 40,  x: width * 0.5, y: 280, dur: 3800, delay: 900  },
    { size: 24,  x: 40, y: height * 0.6, dur: 2600, delay: 1200 },
    { size: 16,  x: width * 0.7, y: height * 0.5, dur: 3100, delay: 300  },
    { size: 70,  x: width * 0.3, y: height * 0.75, dur: 4000, delay: 700  },
  ];

  return (
    <View style={ss.root}>

      {/* ── Fundo com transição de gradiente ── */}
      {SLIDES.map((slide, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const opacity = scrollX.interpolate({ inputRange, outputRange: [0, 1, 0], extrapolate: 'clamp' });
        return (
          <Animated.View key={i} style={[StyleSheet.absoluteFillObject, { opacity }]}>
            <LinearGradient colors={slide.gradient} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
          </Animated.View>
        );
      })}

      {/* ── Partículas ── */}
      {PARTICLES.map((p, i) => (
        <Particle key={i} color="#fff" size={p.size} x={p.x} y={p.y} duration={p.dur} delay={p.delay} />
      ))}

      {/* ── Overlay suave ── */}
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.08)' }} />

      {/* ── Botão Pular ── */}
      {currentIndex < SLIDES.length - 1 && (
        <Animatable.View animation="fadeInDown" duration={600} delay={300} style={[ss.skipWrap, { top: insets.top + 12 }]}>
          <TouchableOpacity onPress={handleFinish} activeOpacity={0.8} style={ss.skipBtn}>
            <Text style={ss.skipTxt}>Pular</Text>
            <MaterialCommunityIcons name="close" size={13} color="rgba(255,255,255,0.9)" />
          </TouchableOpacity>
        </Animatable.View>
      )}

      {/* ── Slides ── */}
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
        renderItem={({ item, index }) => {
          if (item.isLanguage) {
            return <LanguageSlide onSelect={handleLanguageSelect} insets={insets} />;
          }
          return (
            <FeatureSlide
              item={item}
              index={index}
              scrollX={scrollX}
              isLast={index === SLIDES.length - 1}
              onFinish={handleFinish}
              onNext={goNext}
              t={t}
              insets={insets}
            />
          );
        }}
      />

      {/* ── Paginação ── */}
      <View style={[ss.pagination, { bottom: insets.bottom + 90 }]}>
        {SLIDES.map((_, i) => {
          const dotWidth = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [7, 28, 7],
            extrapolate: 'clamp',
          });
          const dotOpacity = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [0.35, 1, 0.35],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View key={i} style={[ss.dot, { width: dotWidth, opacity: dotOpacity, backgroundColor: SLIDES[i]?.accentColor || '#fff' }]} />
          );
        })}
      </View>

      {/* ── Botão Próximo ── */}
      {currentIndex > 0 && currentIndex < SLIDES.length - 1 && (
        <View style={[ss.nextWrap, { bottom: insets.bottom + 24 }]}>
          <TouchableOpacity onPress={goNext} activeOpacity={0.88} style={ss.nextBtn}>
            <LinearGradient
              colors={['rgba(255,255,255,0.28)', 'rgba(255,255,255,0.14)']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={ss.nextBtnInner}
            >
              <Text style={ss.nextBtnTxt}>{t('next') || 'Próximo'}</Text>
              <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Indicador de progresso no topo ── */}
      {currentIndex > 0 && (
        <View style={[ss.progressBar, { top: insets.top + 6 }]}>
          {SLIDES.slice(1).map((_, i) => {
            const filled = i < currentIndex;
            return (
              <View key={i} style={[ss.progressSeg, { backgroundColor: filled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.25)' }]} />
            );
          })}
        </View>
      )}

    </View>
  );
}

const ps = StyleSheet.create({
  particle: { position: 'absolute' },
});

const ss = StyleSheet.create({
  root: { flex: 1 },

  skipWrap: { position: 'absolute', right: 20, zIndex: 20 },
  skipBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  skipTxt: { color: '#fff', fontSize: 13, fontWeight: '700' },

  progressBar: {
    position: 'absolute', left: 20, right: 20,
    flexDirection: 'row', gap: 4, zIndex: 10,
  },
  progressSeg: { flex: 1, height: 3, borderRadius: 2 },

  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  iconWrap: {
    width: 88, height: 88, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
  },

  image: {
    width: width * 0.75,
    height: height * 0.3,
    marginBottom: 16,
  },

  textBlock: { alignItems: 'center', width: '100%' },

  title: {
    fontSize: 28, fontWeight: '900', color: '#fff',
    textAlign: 'center', marginBottom: 12, letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 15, color: 'rgba(255,255,255,0.85)',
    textAlign: 'center', lineHeight: 23,
  },

  /* idioma */
  langList: { width: '100%', gap: 12, marginTop: 28 },
  langBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 18, paddingVertical: 14, paddingHorizontal: 18,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
  },
  langFlagWrap: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  langLabel: { color: '#fff', fontSize: 17, fontWeight: '800' },
  langSub:   { color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 1 },
  langArrow: {
    width: 34, height: 34, borderRadius: 10,
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
  nextBtn: { borderRadius: 30, overflow: 'hidden' },
  nextBtnInner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 14, paddingHorizontal: 36,
    borderRadius: 30, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)',
  },
  nextBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },

  /* começar */
  startWrap: { width: '100%', marginTop: 28 },
  startBtn: { borderRadius: 30, overflow: 'hidden' },
  startBtnInner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 18, paddingHorizontal: 36,
    borderRadius: 30, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)',
  },
  startBtnTxt: { color: '#fff', fontWeight: '900', fontSize: 18, letterSpacing: 0.3 },
});
