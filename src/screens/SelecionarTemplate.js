import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  StyleSheet, View, FlatList, TouchableOpacity,
  Dimensions, Animated, Easing, Platform, StatusBar,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferencesContext } from '../context/UserPreferencesContext';
import { gerarPDF } from '../utils/pdfGenerator';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_W = (width - 48) / 2;
const FAV_KEY = '@app_curriculos:fav_templates';

const TEMPLATE_META = {
  classic:    { icon: 'file-document-outline', gradient: ['#4F46E5','#818CF8'], accent: '#4F46E5' },
  creative:   { icon: 'palette-outline',        gradient: ['#EC4899','#F472B6'], accent: '#EC4899' },
  corporate:  { icon: 'domain',                 gradient: ['#0891B2','#38BDF8'], accent: '#0891B2' },
  elegant:    { icon: 'star-outline',            gradient: ['#7C3AED','#A78BFA'], accent: '#7C3AED' },
  minimalist: { icon: 'minus-circle-outline',   gradient: ['#475569','#94A3B8'], accent: '#475569' },
  inverted:   { icon: 'swap-horizontal',        gradient: ['#059669','#34D399'], accent: '#059669' },
  split:      { icon: 'view-column-outline',    gradient: ['#D97706','#FCD34D'], accent: '#D97706' },
  dark:       { icon: 'weather-night',           gradient: ['#1E293B','#475569'], accent: '#334155' },
};

const CATS = ['all', 'fav', 'pro', 'creative'];
const CAT_LABELS = {
  'pt-BR': { all: 'Todos', fav: 'Favoritos', pro: 'Profissional', creative: 'Criativo' },
  'en':    { all: 'All',   fav: 'Favorites', pro: 'Professional', creative: 'Creative' },
  'es':    { all: 'Todos', fav: 'Favoritos', pro: 'Profesional',  creative: 'Creativo'  },
};
const TEMPLATE_CATS = {
  classic: ['all','pro'], creative: ['all','creative'], corporate: ['all','pro'],
  elegant: ['all','pro','creative'], minimalist: ['all','pro'], inverted: ['all','creative'],
  split: ['all','creative'], dark: ['all','creative'],
};

/* ── Botão favorito ── */
function FavButton({ isFav, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const tap = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.5, duration: 110, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
    onPress();
  };
  return (
    <TouchableOpacity onPress={tap} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} activeOpacity={0.7}>
      <Animated.View style={[cs.favIconWrap, { transform: [{ scale }], backgroundColor: isFav ? '#FFF1F2' : 'rgba(255,255,255,0.22)' }]}>
        <MaterialCommunityIcons name={isFav ? 'heart' : 'heart-outline'} size={16} color={isFav ? '#F43F5E' : '#fff'} />
      </Animated.View>
    </TouchableOpacity>
  );
}

/* ── Card de template ── */
function TemplateCard({ tpl, isSelected, isFav, onSelect, onPreview, onExport, onFav, index }) {
  const theme = useTheme();
  const { t, language } = useContext(UserPreferencesContext);
  const meta = TEMPLATE_META[tpl.id];

  const PREVIEW_LABEL = { 'pt-BR': 'Ver', en: 'View', es: 'Ver' };
  const lbl = PREVIEW_LABEL[language] || 'Ver';

  return (
    <Animatable.View animation="fadeInUp" duration={400} delay={index * 60} style={{ width: CARD_W, marginBottom: 16 }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onSelect(tpl.id)}
        style={[
          cs.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: isSelected ? meta.accent : theme.colors.outlineVariant,
            borderWidth: isSelected ? 2.5 : 1,
            shadowColor: meta.accent,
          },
        ]}
      >
        {/* ── Preview visual ── */}
        <LinearGradient colors={meta.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={cs.preview}>
          {/* blob decorativo */}
          <View style={[cs.blob, { backgroundColor: 'rgba(255,255,255,0.12)', width: 90, height: 90, top: -30, right: -20 }]} />
          <View style={[cs.blob, { backgroundColor: 'rgba(255,255,255,0.08)', width: 60, height: 60, bottom: -10, left: -10 }]} />

          {/* papel simulado */}
          <View style={cs.paper}>
            <View style={cs.paperAvatar} />
            <View style={{ flex: 1, gap: 4 }}>
              <View style={[cs.paperLine, { width: '80%', backgroundColor: meta.accent }]} />
              <View style={[cs.paperLine, { width: '55%', backgroundColor: '#CBD5E1' }]} />
            </View>
            <View style={[cs.paperDivider]} />
            <View style={{ gap: 5, paddingTop: 2 }}>
              <View style={[cs.paperLine, { width: '100%' }]} />
              <View style={[cs.paperLine, { width: '85%' }]} />
              <View style={[cs.paperLine, { width: '90%' }]} />
              <View style={[cs.paperLine, { width: '70%' }]} />
            </View>
          </View>

          {/* ícone do estilo */}
          <View style={cs.styleIcon}>
            <MaterialCommunityIcons name={meta.icon} size={18} color="rgba(255,255,255,0.95)" />
          </View>

          {/* favorito */}
          <View style={cs.favPos}>
            <FavButton isFav={isFav} onPress={() => onFav(tpl.id)} />
          </View>

          {/* badge selecionado */}
          {isSelected && (
            <Animatable.View animation="zoomIn" duration={220} style={[cs.checkBadge, { backgroundColor: meta.accent }]}>
              <MaterialCommunityIcons name="check-bold" size={12} color="#fff" />
            </Animatable.View>
          )}
        </LinearGradient>

        {/* ── Info ── */}
        <View style={cs.info}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 2 }}>
            <View style={[cs.accentDot, { backgroundColor: meta.accent }]} />
            <Text style={[cs.name, { color: theme.colors.onSurface }]} numberOfLines={1}>{tpl.name}</Text>
          </View>
          <Text style={[cs.desc, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>{tpl.desc}</Text>
        </View>

        {/* ── Ações — dois botões lado a lado sem texto longo ── */}
        <View style={cs.actions}>
          {/* Botão preview: ícone + label curto */}
          <TouchableOpacity
            style={[cs.btnOutline, { borderColor: meta.accent }]}
            onPress={() => onPreview(tpl.id)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="eye-outline" size={15} color={meta.accent} />
            <Text style={[cs.btnTxt, { color: meta.accent }]} numberOfLines={1}>{lbl}</Text>
          </TouchableOpacity>

          {/* Botão PDF: gradiente */}
          <TouchableOpacity
            style={[cs.btnPdf, { overflow: 'hidden' }]}
            onPress={() => onExport(tpl.id)}
            activeOpacity={0.8}
          >
            <LinearGradient colors={meta.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={cs.btnPdfGrad}>
              <MaterialCommunityIcons name="file-pdf-box" size={15} color="#fff" />
              <Text style={[cs.btnTxt, { color: '#fff' }]}>PDF</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
}

/* ══ TELA PRINCIPAL ══ */
export default function SelecionarTemplate({ route, navigation }) {
  const theme = useTheme();
  const { t, language } = useContext(UserPreferencesContext);
  const { curriculo } = route.params;
  const [selectedId, setSelectedId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [activeCat, setActiveCat] = useState('all');

  const lang = language && CAT_LABELS[language] ? language : 'pt-BR';

  useEffect(() => {
    AsyncStorage.getItem(FAV_KEY).then(raw => {
      if (raw) setFavorites(JSON.parse(raw));
    });
  }, []);

  const toggleFav = async (id) => {
    const next = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(next);
    await AsyncStorage.setItem(FAV_KEY, JSON.stringify(next));
  };

  const templates = [
    { id: 'classic',    name: t('template_classic_name')    || 'Clássico',    desc: t('template_classic_desc')    || 'Design limpo, tradicional e objetivo.' },
    { id: 'creative',   name: t('template_creative_name')   || 'Criativo',    desc: t('template_creative_desc')   || 'Layout arrojado para design e marketing.' },
    { id: 'corporate',  name: t('template_corporate_name')  || 'Corporativo', desc: t('template_corporate_desc')  || 'Seriedade e confiança com tons de azul.' },
    { id: 'elegant',    name: t('template_elegant_name')    || 'Elegante',    desc: t('template_elegant_desc')    || 'Toque delicado e sofisticado.' },
    { id: 'minimalist', name: t('template_minimalist_name') || 'Minimalista', desc: t('template_minimalist_desc') || 'Elegância na simplicidade.' },
    { id: 'inverted',   name: t('template_inverted_name')   || 'Invertido',   desc: t('template_inverted_desc')   || 'Estilo moderno com cores invertidas.' },
    { id: 'split',      name: t('template_split_name')      || 'Split',       desc: t('template_split_desc')      || 'Layout dividido em duas colunas.' },
    { id: 'dark',       name: t('template_dark_name')       || 'Dark',        desc: t('template_dark_desc')       || 'Para quem quer se destacar.' },
  ];

  const filtered = templates.filter(tpl => {
    if (activeCat === 'fav') return favorites.includes(tpl.id);
    return TEMPLATE_CATS[tpl.id]?.includes(activeCat);
  });

  const HERO_TEXT = {
    'pt-BR': { title: 'Escolha um Modelo', sub: 'Modelos profissionais prontos para você.' },
    'en':    { title: 'Choose a Template',  sub: 'Professional templates ready for you.' },
    'es':    { title: 'Elige una Plantilla', sub: 'Plantillas profesionales listas para ti.' },
  };
  const hero = HERO_TEXT[lang] || HERO_TEXT['pt-BR'];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <FlatList
        data={filtered}
        renderItem={({ item, index }) => (
          <TemplateCard
            tpl={item}
            index={index}
            isSelected={selectedId === item.id}
            isFav={favorites.includes(item.id)}
            onSelect={setSelectedId}
            onPreview={(id) => navigation.navigate('PreviewCurriculo', { curriculo, template: id })}
            onExport={(id) => gerarPDF(curriculo, id, TEMPLATE_META[id].gradient[0], t)}
            onFav={toggleFav}
          />
        )}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListHeaderComponent={() => (
          <>
            {/* ── HERO ── */}
            <Animatable.View animation="fadeInDown" duration={550}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary || '#7C3AED']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={s.hero}
              >
                {/* blobs decorativos */}
                <View style={[s.blob, { width: 180, height: 180, top: -70, right: -50, backgroundColor: 'rgba(255,255,255,0.09)' }]} />
                <View style={[s.blob, { width: 100, height: 100, bottom: -30, left: -20, backgroundColor: 'rgba(255,255,255,0.07)' }]} />

                {/* botão voltar */}
                <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} activeOpacity={0.8}>
                  <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
                </TouchableOpacity>

                {/* ícone central */}
                <Animatable.View animation="bounceIn" duration={700} delay={200} style={s.heroIconWrap}>
                  <MaterialCommunityIcons name="palette-swatch-outline" size={34} color="#fff" />
                </Animatable.View>

                <Text style={s.heroTitle}>{hero.title}</Text>
                <Text style={s.heroSub}>{hero.sub}</Text>

                {/* stats */}
                <View style={s.statsRow}>
                  <View style={s.stat}>
                    <Text style={s.statVal}>8</Text>
                    <Text style={s.statLabel}>{lang === 'en' ? 'Models' : 'Modelos'}</Text>
                  </View>
                  <View style={s.statDiv} />
                  <View style={s.stat}>
                    <Text style={s.statVal}>{favorites.length}</Text>
                    <Text style={s.statLabel}>{lang === 'en' ? 'Favorites' : 'Favoritos'}</Text>
                  </View>
                  <View style={s.statDiv} />
                  <View style={s.stat}>
                    <Text style={s.statVal}>PDF</Text>
                    <Text style={s.statLabel}>{lang === 'en' ? 'Export' : 'Export'}</Text>
                  </View>
                </View>
              </LinearGradient>
            </Animatable.View>

            {/* ── Filtros ── */}
            <Animatable.View animation="fadeInUp" duration={450} delay={150}>
              <View style={s.catRow}>
                {CATS.map(cat => {
                  const active = activeCat === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setActiveCat(cat)}
                      activeOpacity={0.8}
                      style={{ borderRadius: 24, overflow: 'hidden' }}
                    >
                      {active ? (
                        <LinearGradient
                          colors={[theme.colors.primary, theme.colors.secondary || '#7C3AED']}
                          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                          style={s.catActive}
                        >
                          {cat === 'fav' && <MaterialCommunityIcons name="heart" size={12} color="#fff" />}
                          <Text style={s.catActiveTxt}>{CAT_LABELS[lang][cat]}</Text>
                        </LinearGradient>
                      ) : (
                        <View style={[s.catInactive, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]}>
                          {cat === 'fav' && <MaterialCommunityIcons name="heart-outline" size={12} color="#F43F5E" />}
                          <Text style={[s.catInactiveTxt, { color: theme.colors.onSurfaceVariant }]}>{CAT_LABELS[lang][cat]}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Animatable.View>

            {/* empty state */}
            {activeCat === 'fav' && filtered.length === 0 && (
              <Animatable.View animation="fadeIn" duration={400} style={s.empty}>
                <MaterialCommunityIcons name="heart-outline" size={52} color={theme.colors.outlineVariant} />
                <Text style={[s.emptyTxt, { color: theme.colors.onSurfaceVariant }]}>
                  {lang === 'en' ? 'No favorites yet.\nTap ♡ on any template!' : lang === 'es' ? 'Sin favoritos.\n¡Toca ♡!' : 'Nenhum favorito ainda.\nToque ♡ em qualquer modelo!'}
                </Text>
              </Animatable.View>
            )}
          </>
        )}
      />
    </View>
  );
}

/* ── Estilos hero / filtros ── */
const s = StyleSheet.create({
  hero: {
    margin: 16,
    marginTop: Platform.OS === 'ios' ? 54 : (StatusBar.currentHeight || 24) + 8,
    borderRadius: 28,
    padding: 24,
    paddingTop: 56,
    alignItems: 'center',
    gap: 6,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
  },
  blob:        { position: 'absolute', borderRadius: 999 },
  backBtn:     { position: 'absolute', top: 16, left: 16, width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.22)', justifyContent: 'center', alignItems: 'center' },
  heroIconWrap:{ width: 70, height: 70, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 6, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)' },
  heroTitle:   { color: '#fff', fontSize: 22, fontWeight: '900', textAlign: 'center', letterSpacing: 0.2 },
  heroSub:     { color: 'rgba(255,255,255,0.78)', fontSize: 13, textAlign: 'center', lineHeight: 20 },
  statsRow:    { flexDirection: 'row', alignItems: 'center', marginTop: 18, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 18, paddingVertical: 12, paddingHorizontal: 8, width: '100%', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  stat:        { flex: 1, alignItems: 'center' },
  statVal:     { color: '#fff', fontSize: 18, fontWeight: '900' },
  statLabel:   { color: 'rgba(255,255,255,0.72)', fontSize: 10, marginTop: 2, fontWeight: '600' },
  statDiv:     { width: 1, height: 26, backgroundColor: 'rgba(255,255,255,0.28)' },

  catRow:       { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginVertical: 12, flexWrap: 'wrap' },
  catActive:    { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 8, paddingHorizontal: 16 },
  catActiveTxt: { fontSize: 12, fontWeight: '800', color: '#fff' },
  catInactive:  { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 24, borderWidth: 1 },
  catInactiveTxt:{ fontSize: 12, fontWeight: '600' },

  empty:    { alignItems: 'center', paddingVertical: 48, gap: 14, paddingHorizontal: 32 },
  emptyTxt: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
});

/* ── Estilos do card ── */
const cs = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
  },

  /* Preview */
  preview:  { height: 148, overflow: 'hidden', position: 'relative' },
  blob:     { position: 'absolute', borderRadius: 999 },

  /* Papel simulado */
  paper: {
    position: 'absolute',
    top: 14, left: 14, right: 14, bottom: -6,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    paddingTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    flexDirection: 'column',
    gap: 0,
  },
  paperAvatar:  { width: 28, height: 28, borderRadius: 8, backgroundColor: '#E2E8F0', marginBottom: 6 },
  paperLine:    { height: 6, borderRadius: 3, backgroundColor: '#E2E8F0', marginBottom: 3 },
  paperDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 6 },

  /* Ícone estilo */
  styleIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Favorito */
  favPos:    { position: 'absolute', top: 10, right: 10 },
  favIconWrap: { width: 30, height: 30, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },

  /* Check selecionado */
  checkBadge: { position: 'absolute', top: 10, left: 10, width: 26, height: 26, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },

  /* Info */
  info:      { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 4, gap: 3 },
  accentDot: { width: 8, height: 8, borderRadius: 4 },
  name:      { fontSize: 13, fontWeight: '800', flex: 1 },
  desc:      { fontSize: 10.5, lineHeight: 15 },

  /* Ações */
  actions:   { flexDirection: 'row', gap: 7, paddingHorizontal: 10, paddingBottom: 12, paddingTop: 6 },
  btnOutline: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 9, borderRadius: 12, borderWidth: 1.5 },
  btnPdf:    { flex: 1, borderRadius: 12, overflow: 'hidden' },
  btnPdfGrad:{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 9 },
  btnTxt:    { fontSize: 12, fontWeight: '800' },
});
