import React, { useRef, useContext, useState } from 'react';
import {
  View, StyleSheet, Dimensions, Text, TouchableOpacity,
  FlatList, Animated, Image, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { UserPreferencesContext } from '../context/UserPreferencesContext';
import * as Animatable from 'react-native-animatable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const slides = [
  { key: '0', icon: 'translate', image: null },
  { key: '1', icon: 'file-plus', image: require('../../assets/images/welcome_create-removebg-preview.png') },
  { key: '2', icon: 'brush', image: require('../../assets/images/welcome_customize-removebg-preview.png') },
  { key: '3', icon: 'file-pdf-box', image: require('../../assets/images/welcome_export-removebg-preview.png') },
  { key: '4', icon: 'check-circle-outline', image: require('../../assets/images/welcome_ready-removebg-preview.png') },
];

const SLIDE_GRADIENTS = [
  ['#1A237E', '#3949AB'],
  ['#00695C', '#00897B'],
  ['#AD1457', '#E91E63'],
  ['#4527A0', '#7B1FA2'],
  ['#0277BD', '#0288D1'],
];

const LANGUAGES = [
  { code: 'pt-BR', flag: '🇧🇷', label: 'Português' },
  { code: 'en', flag: '🇺🇸', label: 'English' },
  { code: 'es', flag: '🇪🇸', label: 'Español' },
];

export default function WelcomeScreen({ onFinish }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const theme = useTheme();
  const { t, updatePreferences } = useContext(UserPreferencesContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();

  const handleFinish = async () => {
    await AsyncStorage.setItem('hasSeenWelcome', 'true');
    if (onFinish) onFinish();
  };

  const handleLanguageSelect = (lang) => {
    updatePreferences({ language: lang });
    flatListRef.current?.scrollToIndex({ index: 1 });
  };

  const goNext = () => {
    flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const currentColors = SLIDE_GRADIENTS[currentIndex] || SLIDE_GRADIENTS[0];

  return (
    <View style={s.container}>
      {/* Animated background */}
      <Animated.View style={[StyleSheet.absoluteFillObject]}>
        {SLIDE_GRADIENTS.map((colors, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View key={i} style={[StyleSheet.absoluteFillObject, { opacity }]}>
              <LinearGradient colors={colors} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
            </Animated.View>
          );
        })}
      </Animated.View>

      {/* Dark overlay */}
      <View style={s.overlay} />

      {/* Skip */}
      <Animatable.View animation="fadeInDown" duration={800} delay={400} style={[s.skipWrap, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={s.skipButton} onPress={handleFinish} activeOpacity={0.8}>
          <Text style={s.skipText}>{t('skip')}</Text>
          <MaterialCommunityIcons name="close" size={14} color="rgba(255,255,255,0.85)" />
        </TouchableOpacity>
      </Animatable.View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
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
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          const imageScale = scrollX.interpolate({
            inputRange,
            outputRange: [0.7, 1, 0.7],
            extrapolate: 'clamp',
          });
          const contentOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
            extrapolate: 'clamp',
          });
          const isLastSlide = index === slides.length - 1;

          if (item.key === '0') {
            return (
              <View style={[s.slide, { paddingTop: insets.top + 70 }]}>
                <Animatable.View animation="bounceIn" duration={1000} style={s.slideIconWrap}>
                  <MaterialCommunityIcons name={item.icon} size={48} color="rgba(255,255,255,0.95)" />
                </Animatable.View>
                <Animatable.Text animation="fadeInDown" duration={800} delay={300} style={s.title}>
                  Selecione seu Idioma
                </Animatable.Text>
                <Animatable.Text animation="fadeInDown" duration={800} delay={500} style={s.subtitle}>
                  Choose your language · Selecciona tu idioma
                </Animatable.Text>

                <Animatable.View animation="fadeInUp" duration={800} delay={700} style={s.langContainer}>
                  {LANGUAGES.map((lang) => (
                    <TouchableOpacity
                      key={lang.code}
                      style={s.langButton}
                      onPress={() => handleLanguageSelect(lang.code)}
                      activeOpacity={0.8}
                    >
                      <Text style={s.langFlag}>{lang.flag}</Text>
                      <Text style={s.langLabel}>{lang.label}</Text>
                      <MaterialCommunityIcons name="chevron-right" size={18} color="rgba(255,255,255,0.7)" />
                    </TouchableOpacity>
                  ))}
                </Animatable.View>
              </View>
            );
          }

          return (
            <View style={[s.slide, { paddingTop: insets.top + 60 }]}>
              {item.image && (
                <Animated.Image
                  source={item.image}
                  style={[s.slideImage, { transform: [{ scale: imageScale }], opacity: contentOpacity }]}
                  resizeMode="contain"
                />
              )}

              <Animated.View style={[s.textBlock, { opacity: contentOpacity }]}>
                <View style={s.slideIconWrap}>
                  <MaterialCommunityIcons name={item.icon} size={32} color="rgba(255,255,255,0.95)" />
                </View>
                <Text style={s.title}>{t(`welcome_title_${item.key}`)}</Text>
                <Text style={s.subtitle}>{t(`welcome_text_${item.key}`)}</Text>
              </Animated.View>

              {isLastSlide && (
                <Animatable.View animation="fadeInUp" duration={800} delay={400} style={s.startWrap}>
                  <TouchableOpacity style={s.startButton} onPress={handleFinish} activeOpacity={0.85}>
                    <LinearGradient
                      colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.12)']}
                      style={s.startBg}
                    >
                      <Text style={s.startText}>{t('startNow')}</Text>
                      <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                </Animatable.View>
              )}
            </View>
          );
        }}
      />

      {/* Pagination */}
      <View style={[s.pagination, { paddingBottom: insets.bottom + 80 }]}>
        {slides.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });
          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={i}
              style={[s.dot, { width: dotWidth, opacity: dotOpacity }]}
            />
          );
        })}
      </View>

      {/* Next Button */}
      {currentIndex < slides.length - 1 && (
        <Animatable.View animation="fadeInUp" duration={600} delay={500} style={[s.nextWrap, { bottom: insets.bottom + 24 }]}>
          <TouchableOpacity style={s.nextButton} onPress={goNext} activeOpacity={0.85}>
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={s.nextBg}
            >
              <Text style={s.nextText}>{t('next') || 'Próximo'}</Text>
              <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },

  skipWrap: {
    position: 'absolute',
    top: 0,
    right: 20,
    zIndex: 10,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  skipText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
  },

  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  slideIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },

  slideImage: {
    width: width * 0.72,
    height: height * 0.32,
    marginBottom: 24,
  },

  textBlock: { alignItems: 'center' },

  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.82)',
    textAlign: 'center',
    lineHeight: 24,
  },

  langContainer: { marginTop: 32, width: '100%', gap: 12 },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    gap: 14,
  },
  langFlag: { fontSize: 26 },
  langLabel: { flex: 1, color: '#fff', fontSize: 17, fontWeight: '700' },

  pagination: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },

  startWrap: { marginTop: 32, width: '100%' },
  startButton: { borderRadius: 30, overflow: 'hidden' },
  startBg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 30,
    gap: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  startText: { color: '#fff', fontWeight: '900', fontSize: 18 },

  nextWrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  nextButton: { borderRadius: 30, overflow: 'hidden' },
  nextBg: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  nextText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
