import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  StyleSheet, View, ScrollView, Dimensions,
  TouchableOpacity, Platform, Animated, Easing,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { gerarPDF } from '../utils/pdfGenerator';
import {
  templateClassic, templateCreative, templateCorporate, templateElegant,
  templateMinimalist, templateInverted, templateSplit, templateDark,
  templateTimeline, templateSideRight, templateBold, templateCompact,
} from '../utils/pdfTemplates';
import { UserPreferencesContext } from '../context/UserPreferencesContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const A4_RATIO = 1.4142;
const { width: screenWidth } = Dimensions.get('window');
const PREVIEW_WIDTH = screenWidth - 32;

const TEMPLATE_META = {
  classic:    { icon: 'file-document-outline',  gradient: ['#1A237E','#3949AB'], label: 'Clássico'     },
  creative:   { icon: 'palette-outline',         gradient: ['#0F172A','#1E3A8A'], label: 'Criativo'     },
  corporate:  { icon: 'domain',                  gradient: ['#1E3A8A','#3B82F6'], label: 'Corporativo'  },
  elegant:    { icon: 'star-outline',             gradient: ['#831843','#BE185D'], label: 'Elegante'     },
  minimalist: { icon: 'minus-circle-outline',    gradient: ['#37474F','#607D8B'], label: 'Minimalista'  },
  inverted:   { icon: 'swap-horizontal',         gradient: ['#0277BD','#29B6F6'], label: 'Invertido'    },
  split:      { icon: 'view-column-outline',     gradient: ['#4527A0','#7E57C2'], label: 'Split'        },
  dark:       { icon: 'weather-night',            gradient: ['#212121','#424242'], label: 'Dark'         },
};

const TEMPLATE_MAP = {
  classic: templateClassic, creative: templateCreative, corporate: templateCorporate,
  elegant: templateElegant, minimalist: templateMinimalist, inverted: templateInverted,
  split: templateSplit, dark: templateDark,
  timeline: templateTimeline, sideright: templateSideRight, bold: templateBold, compact: templateCompact,
};

/* ── spinner de loading animado ── */
function LoadingOverlay({ tplMeta }) {
  const spin = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 1200, easing: Easing.linear, useNativeDriver: true })
    ).start();
    Animated.timing(progress, { toValue: 1, duration: 2800, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, []);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['15%', '85%'] });

  return (
    <Animatable.View animation="fadeIn" duration={300} style={s.loadingOverlay}>
      {/* ícone pulsante */}
      <View style={s.loadingIconArea}>
        <LinearGradient colors={tplMeta.gradient} style={s.loadingIconBg}>
          <MaterialCommunityIcons name={tplMeta.icon} size={40} color="#fff" />
        </LinearGradient>
        {/* anel girante */}
        <Animated.View style={[s.loadingRing, { borderColor: tplMeta.gradient[0], transform: [{ rotate }] }]} />
      </View>

      <Text style={[s.loadingTitle, { color: tplMeta.gradient[0] }]}>{tplMeta.label}</Text>
      <Text style={s.loadingSubtitle}>Renderizando currículo...</Text>

      {/* barra de progresso */}
      <View style={s.progressTrack}>
        <Animated.View style={{ width: barWidth, height: '100%', borderRadius: 4 }}>
          <LinearGradient colors={tplMeta.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, borderRadius: 4 }} />
        </Animated.View>
      </View>
    </Animatable.View>
  );
}

export default function PreviewCurriculo({ route, navigation }) {
  const theme = useTheme();
  const { curriculo, template } = route.params;
  const [htmlContent, setHtmlContent] = useState(null);
  const [webViewHeight, setWebViewHeight] = useState(PREVIEW_WIDTH * A4_RATIO);
  const [isLoading, setIsLoading] = useState(true);
  const { t, language } = useContext(UserPreferencesContext);
  const loadingTimerRef = useRef(null);

  const meta = TEMPLATE_META[template] || TEMPLATE_META.classic;
  const [g1] = meta.gradient;

  const lang = language || 'pt-BR';
  const LABELS = {
    'pt-BR': { back: 'Voltar', export: 'Exportar PDF' },
    'en':    { back: 'Back',   export: 'Export PDF'   },
    'es':    { back: 'Volver', export: 'Exportar PDF' },
  };
  const lbl = LABELS[lang] || LABELS['pt-BR'];

  useEffect(() => {
    const fn = TEMPLATE_MAP[template] || templateClassic;
    let html = fn(curriculo, g1, t);

    html = html.replace(
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
      '<meta name="viewport" content="width=794">'
    );

    setHtmlContent(html);
    // fallback garantido: remove o loading após 5s independente do que acontecer
    loadingTimerRef.current = setTimeout(() => setIsLoading(false), 5000);
    return () => clearTimeout(loadingTimerRef.current);
  }, []);

  const onMessage = (event) => {
    clearTimeout(loadingTimerRef.current);
    const contentHeight = Number(event.nativeEvent.data);
    if (contentHeight > 0) {
      const scale = PREVIEW_WIDTH / 794;
      setWebViewHeight(contentHeight * scale);
    }
    setIsLoading(false);
  };

  const injectedJavaScript = `
    (function() {
      var height = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      window.ReactNativeWebView.postMessage(String(height));
    })();
    true;
  `;

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>

      {/* ── barra superior ── */}
      <Animatable.View animation="fadeInDown" duration={400} style={[s.toolbar, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.outlineVariant }]}>
        <LinearGradient colors={meta.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.toolbarBadge}>
          <MaterialCommunityIcons name={meta.icon} size={14} color="#fff" />
          <Text style={s.toolbarBadgeTxt}>{meta.label}</Text>
        </LinearGradient>
        <Text style={[s.toolbarName, { color: theme.colors.onSurface }]} numberOfLines={1}>
          {curriculo.nomeInterno || t('preview') || 'Pré-visualizar'}
        </Text>
      </Animatable.View>

      {/* ── área de preview ── */}
      <View style={{ flex: 1, position: 'relative' }}>
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* moldura do documento */}
          <Animatable.View animation="fadeIn" duration={500} delay={100} style={[s.docFrame, { borderColor: g1 + '44', shadowColor: g1 }]}>
            {/* cabeçalho de moldura */}
            <LinearGradient colors={[g1 + 'CC', g1 + '88']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.docFrameHeader}>
              <View style={s.docFrameDots}>
                <View style={[s.dot, { backgroundColor: '#FF5F57' }]} />
                <View style={[s.dot, { backgroundColor: '#FEBC2E' }]} />
                <View style={[s.dot, { backgroundColor: '#28C840' }]} />
              </View>
              <Text style={s.docFrameLabel}>{curriculo.nomeInterno || meta.label}</Text>
              <MaterialCommunityIcons name="file-pdf-box" size={16} color="rgba(255,255,255,0.7)" />
            </LinearGradient>

            {/* webview — só monta quando o HTML estiver gerado */}
            {htmlContent ? (
              <WebView
                originWhitelist={['*']}
                source={{ html: htmlContent }}
                style={[s.webview, { height: webViewHeight, opacity: isLoading ? 0 : 1 }]}
                injectedJavaScript={injectedJavaScript}
                onMessage={onMessage}
                onLoad={() => {
                  clearTimeout(loadingTimerRef.current);
                  setIsLoading(false);
                }}
                onError={() => {
                  clearTimeout(loadingTimerRef.current);
                  setIsLoading(false);
                }}
                javaScriptEnabled
                scrollEnabled={false}
                scalesPageToFit={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                bounces={false}
              />
            ) : null}
          </Animatable.View>
        </ScrollView>

        {/* loading overlay sobre o webview */}
        {isLoading && <LoadingOverlay tplMeta={meta} />}
      </View>

      {/* ── rodapé ── */}
      <Animatable.View animation="fadeInUp" duration={400} delay={200} style={[s.footer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outlineVariant }]}>
        <TouchableOpacity
          style={[s.footerBtn, s.footerBtnRow, { borderColor: theme.colors.outline, borderWidth: 1.5 }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="arrow-left" size={18} color={theme.colors.onSurface} />
          <Text style={[s.footerBtnTxt, { color: theme.colors.onSurface }]}>{lbl.back}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.footerBtn, { flex: 1.5, overflow: 'hidden' }]}
          onPress={() => gerarPDF(curriculo, template, g1, t)}
          activeOpacity={0.85}
        >
          <LinearGradient colors={meta.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.footerBtnGrad}>
            <MaterialCommunityIcons name="file-pdf-box" size={18} color="#fff" />
            <Text style={[s.footerBtnTxt, { color: '#fff' }]}>{lbl.export}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animatable.View>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },

  toolbar:         { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 11, borderBottomWidth: 1 },
  toolbarBadge:    { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 5, paddingHorizontal: 11, borderRadius: 20 },
  toolbarBadgeTxt: { color: '#fff', fontSize: 12, fontWeight: '800', textTransform: 'capitalize' },
  toolbarName:     { flex: 1, fontSize: 15, fontWeight: '700' },

  scroll: { alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, paddingBottom: 12 },

  docFrame:        { width: PREVIEW_WIDTH, borderRadius: 12, borderWidth: 1.5, overflow: 'hidden', elevation: 10, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.22, shadowRadius: 12, backgroundColor: '#fff' },
  docFrameHeader:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 9, gap: 8 },
  docFrameDots:    { flexDirection: 'row', gap: 5 },
  dot:             { width: 10, height: 10, borderRadius: 5 },
  docFrameLabel:   { flex: 1, color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '700' },

  webview: { width: PREVIEW_WIDTH, backgroundColor: '#fff' },

  /* loading */
  loadingOverlay:  { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.96)', gap: 14 },
  loadingIconArea: { position: 'relative', width: 90, height: 90, justifyContent: 'center', alignItems: 'center' },
  loadingIconBg:   { width: 72, height: 72, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  loadingRing:     { position: 'absolute', width: 88, height: 88, borderRadius: 44, borderWidth: 3, borderTopColor: 'transparent', borderRightColor: 'transparent' },
  loadingTitle:    { fontSize: 18, fontWeight: '900' },
  loadingSubtitle: { fontSize: 13, color: '#64748B' },
  progressTrack:   { width: 200, height: 6, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden' },

  footer:        { flexDirection: 'row', gap: 12, padding: 16, paddingBottom: Platform.OS === 'ios' ? 20 : 16, borderTopWidth: 1 },
  footerBtn:     { flex: 1, borderRadius: 14, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  footerBtnRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
  footerBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 10 },
  footerBtnTxt:  { fontSize: 14, fontWeight: '800' },
});

