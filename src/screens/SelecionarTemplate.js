import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  StyleSheet, View, FlatList, TouchableOpacity, TextInput,
  Dimensions, Animated, Easing, Platform, StatusBar,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserPreferencesContext } from '../context/UserPreferencesContext';
import { gerarPDF } from '../utils/pdfGenerator';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_W = (width - 48) / 2;
const FAV_KEY = '@app_curriculos:fav_templates';

const TEMPLATE_META = {
  classic:    { icon: 'file-document-outline',  gradient: ['#4F46E5','#818CF8'], accent: '#4F46E5' },
  creative:   { icon: 'palette-outline',         gradient: ['#EC4899','#F472B6'], accent: '#EC4899' },
  corporate:  { icon: 'domain',                  gradient: ['#0891B2','#38BDF8'], accent: '#0891B2' },
  elegant:    { icon: 'star-outline',             gradient: ['#7C3AED','#A78BFA'], accent: '#7C3AED' },
  minimalist: { icon: 'minus-circle-outline',    gradient: ['#475569','#94A3B8'], accent: '#475569' },
  inverted:   { icon: 'swap-horizontal',         gradient: ['#059669','#34D399'], accent: '#059669' },
  split:      { icon: 'view-column-outline',     gradient: ['#D97706','#FCD34D'], accent: '#D97706' },
  dark:       { icon: 'weather-night',            gradient: ['#1E293B','#475569'], accent: '#334155' },
  timeline:   { icon: 'timeline-clock-outline',  gradient: ['#0F766E','#2DD4BF'], accent: '#0F766E' },
  sideright:  { icon: 'page-layout-sidebar-right', gradient: ['#1D4ED8','#60A5FA'], accent: '#1D4ED8' },
  bold:       { icon: 'format-bold',             gradient: ['#7C3AED','#C084FC'], accent: '#7C3AED' },
  compact:    { icon: 'text-box-outline',         gradient: ['#0369A1','#38BDF8'], accent: '#0369A1' },
};

const CATS = ['all', 'fav', 'pro', 'creative'];
const CAT_LABELS = {
  'pt-BR': { all: 'Todos', fav: 'Favoritos', pro: 'Profissional', creative: 'Criativo' },
  'en':    { all: 'All',   fav: 'Favorites', pro: 'Professional', creative: 'Creative' },
  'es':    { all: 'Todos', fav: 'Favoritos', pro: 'Profesional',  creative: 'Creativo'  },
};
const TEMPLATE_CATS = {
  classic:   ['all','pro'],           creative:  ['all','creative'],
  corporate: ['all','pro'],           elegant:   ['all','pro','creative'],
  minimalist:['all','pro'],           inverted:  ['all','creative'],
  split:     ['all','creative'],      dark:      ['all','creative'],
  timeline:  ['all','pro'],           sideright: ['all','pro'],
  bold:      ['all','pro','creative'], compact:  ['all','pro'],
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
    <TouchableOpacity onPress={tap} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} activeOpacity={0.7}>
      <Animated.View style={[
        cs.favIconWrap,
        {
          transform: [{ scale }],
          backgroundColor: isFav ? '#FFF1F2' : 'rgba(0,0,0,0.28)',
          borderWidth: isFav ? 1.5 : 0,
          borderColor: isFav ? '#FDA4AF' : 'transparent',
        },
      ]}>
        <MaterialCommunityIcons name={isFav ? 'heart' : 'heart-outline'} size={18} color={isFav ? '#F43F5E' : '#fff'} />
      </Animated.View>
    </TouchableOpacity>
  );
}

/* ── Card de template ── */
function TemplateCard({ tpl, isSelected, isFav, onSelect, onPreview, onExport, onFav, index }) {
  const theme = useTheme();
  const { t, language } = useContext(UserPreferencesContext);
  const meta = TEMPLATE_META[tpl.id];

  return (
    <Animatable.View animation="fadeInUp" duration={400} delay={index * 60} style={{ width: CARD_W, marginBottom: 16 }}>
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={() => onSelect(tpl.id)}
        style={[cs.card, {
          backgroundColor: theme.colors.surface,
          borderColor: isSelected ? meta.accent : theme.colors.outlineVariant,
          borderWidth: isSelected ? 2.5 : 1,
          shadowColor: isSelected ? meta.accent : '#000',
          shadowOpacity: isSelected ? 0.28 : 0.1,
          elevation: isSelected ? 8 : 3,
        }]}
      >
        {/* ── Preview com gradiente ── */}
        <LinearGradient colors={meta.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={cs.preview}>
          {/* blobs */}
          <View style={[cs.blob, { backgroundColor: 'rgba(255,255,255,0.13)', width: 100, height: 100, top: -35, right: -25 }]} />
          <View style={[cs.blob, { backgroundColor: 'rgba(255,255,255,0.07)', width: 55, height: 55, bottom: -8, left: -12 }]} />

          {/* miniatura de documento */}
          <View style={cs.paper}>
            {/* header do doc */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 7 }}>
              <View style={[cs.paperAvatar, { backgroundColor: meta.accent + '44' }]} />
              <View style={{ flex: 1, gap: 3 }}>
                <View style={[cs.paperLine, { width: '90%', height: 5, backgroundColor: meta.accent + 'BB' }]} />
                <View style={[cs.paperLine, { width: '60%', height: 4, backgroundColor: '#CBD5E1' }]} />
              </View>
            </View>
            <View style={[cs.paperDivider]} />
            {/* corpo do doc */}
            <View style={{ gap: 4, paddingTop: 4 }}>
              <View style={[cs.paperLine, { width: '100%' }]} />
              <View style={[cs.paperLine, { width: '88%' }]} />
              <View style={[cs.paperLine, { width: '75%' }]} />
              <View style={[cs.paperDivider, { marginTop: 3 }]} />
              <View style={[cs.paperLine, { width: '95%' }]} />
              <View style={[cs.paperLine, { width: '80%' }]} />
            </View>
          </View>

          {/* ícone do estilo — canto inferior esquerdo */}
          <View style={[cs.styleIcon, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
            <MaterialCommunityIcons name={meta.icon} size={16} color="#fff" />
          </View>

          {/* coração favorito — canto superior direito, bem visível */}
          <View style={cs.favPos}>
            <FavButton isFav={isFav} onPress={() => onFav(tpl.id)} />
          </View>

          {/* check quando selecionado — canto superior esquerdo */}
          {isSelected ? (
            <Animatable.View animation="zoomIn" duration={200} style={cs.checkBadge}>
              <LinearGradient colors={meta.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={cs.checkBadgeInner}>
                <MaterialCommunityIcons name="check-bold" size={11} color="#fff" />
              </LinearGradient>
            </Animatable.View>
          ) : null}
        </LinearGradient>

        {/* ── Info ── */}
        <View style={[cs.info, { borderTopColor: meta.accent + '22' }]}>
          {/* nome + ponto de cor */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <View style={[cs.accentDot, { backgroundColor: meta.accent }]} />
            <Text style={[cs.name, { color: theme.colors.onSurface, flex: 1 }]} numberOfLines={1}>{tpl.name}</Text>
          </View>
          <Text style={[cs.desc, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>{tpl.desc}</Text>
        </View>

        {/* ── Ações ── */}
        <View style={cs.actions}>
          <TouchableOpacity
            style={[cs.btnOutline, { borderColor: meta.accent + '66', backgroundColor: meta.accent + '0D' }]}
            onPress={() => onPreview(tpl.id)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="eye-outline" size={14} color={meta.accent} />
            <Text style={[cs.btnTxt, { color: meta.accent }]}>Ver</Text>
          </TouchableOpacity>

          <TouchableOpacity style={cs.btnPdf} onPress={() => onExport(tpl.id)} activeOpacity={0.85}>
            <LinearGradient colors={meta.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={cs.btnPdfGrad}>
              <MaterialCommunityIcons name="file-pdf-box" size={14} color="#fff" />
              <Text style={[cs.btnTxt, { color: '#fff' }]}>PDF</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
}

const LANG_FLAGS = { 'pt-BR': '🇧🇷', 'en': '🇺🇸', 'es': '🇪🇸' };
const LANG_NAMES = { 'pt-BR': 'Português', 'en': 'English', 'es': 'Español' };

/* ══ TELA PRINCIPAL ══ */
export default function SelecionarTemplate({ route, navigation }) {
  const theme = useTheme();
  const { t, language } = useContext(UserPreferencesContext);
  const { curriculo } = route.params;
  const [selectedId, setSelectedId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');

  const lang = language && CAT_LABELS[language] ? language : 'pt-BR';
  const currLang = curriculo?.idiomaCurriculo;
  const currFlag = currLang ? LANG_FLAGS[currLang] : null;
  const currLangName = currLang ? LANG_NAMES[currLang] : null;

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
    { id: 'classic',    name: t('template_classic_name')    || 'Clássico',       desc: t('template_classic_desc')    || 'Design limpo, tradicional e objetivo.' },
    { id: 'creative',   name: t('template_creative_name')   || 'Criativo',       desc: t('template_creative_desc')   || 'Layout arrojado para design e marketing.' },
    { id: 'corporate',  name: t('template_corporate_name')  || 'Corporativo',    desc: t('template_corporate_desc')  || 'Seriedade e confiança com tons de azul.' },
    { id: 'elegant',    name: t('template_elegant_name')    || 'Elegante',       desc: t('template_elegant_desc')    || 'Toque delicado e sofisticado.' },
    { id: 'minimalist', name: t('template_minimalist_name') || 'Minimalista',    desc: t('template_minimalist_desc') || 'Elegância na simplicidade.' },
    { id: 'inverted',   name: t('template_inverted_name')   || 'Invertido',      desc: t('template_inverted_desc')   || 'Estilo moderno com cores invertidas.' },
    { id: 'split',      name: t('template_split_name')      || 'Split',          desc: t('template_split_desc')      || 'Layout dividido em duas colunas.' },
    { id: 'dark',       name: t('template_dark_name')       || 'Dark',           desc: t('template_dark_desc')       || 'Para quem quer se destacar.' },
    { id: 'timeline',   name: 'Timeline',                                         desc: 'Linha do tempo na margem, muito legível.' },
    { id: 'sideright',  name: 'Sidebar Direita',                                  desc: 'Conteúdo à esquerda, info de contato à direita.' },
    { id: 'bold',       name: 'Bold',                                             desc: 'Header colorido impactante, corpo organizado.' },
    { id: 'compact',    name: 'Compacto',                                         desc: 'Tipografia serif, máxima informação em pouco espaço.' },
  ];

  const normalize = (str) =>
    str.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/gi, '').toLowerCase();

  const filtered = templates.filter(tpl => {
    const q = normalize(search.trim());
    const matchSearch = !q || normalize(tpl.name).includes(q) || normalize(tpl.desc).includes(q);
    const matchFav = activeCat !== 'fav' || favorites.includes(tpl.id);
    return matchSearch && matchFav;
  });

  const HERO_TEXT = {
    'pt-BR': { title: 'Escolha um Modelo', sub: 'Modelos profissionais prontos para você.' },
    'en':    { title: 'Choose a Template',  sub: 'Professional templates ready for you.' },
    'es':    { title: 'Elige una Plantilla', sub: 'Plantillas profesionales listas para ti.' },
  };
  const hero = HERO_TEXT[lang] || HERO_TEXT['pt-BR'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>

      {/* ── HEADER FIXO ── */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary || '#7C3AED']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={s.header}
      >
        <View style={[s.blob, { width: 180, height: 180, top: -70, right: -50, backgroundColor: 'rgba(255,255,255,0.08)' }]} />
        <View style={[s.blob, { width: 90, height: 90, bottom: -30, left: -20, backgroundColor: 'rgba(255,255,255,0.06)' }]} />
        <View style={s.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={s.headerBackBtn}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.headerTitle}>{hero.title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <Text style={s.headerSub}>{hero.sub}</Text>
              {currFlag ? (
                <View style={s.langPill}>
                  <Text style={s.langPillFlag}>{currFlag}</Text>
                  <Text style={s.langPillTxt}>{currLangName}</Text>
                </View>
              ) : null}
            </View>
          </View>
          <View style={s.headerIconBox}>
            <MaterialCommunityIcons name="palette-swatch-outline" size={22} color={theme.colors.primary} />
          </View>
        </View>
      </LinearGradient>

      {/* ── BUSCA + FAVORITOS ── */}
      <View style={[s.searchRow, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.outlineVariant }]}>
        <View style={[s.searchBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]}>
          <MaterialCommunityIcons name="magnify" size={18} color={theme.colors.onSurfaceVariant} />
          <TextInput
            style={[s.searchInput, { color: theme.colors.onSurface }]}
            placeholder="Buscar modelo..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialCommunityIcons name="close-circle" size={16} color={theme.colors.onSurfaceVariant} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          onPress={() => setActiveCat(activeCat === 'fav' ? 'all' : 'fav')}
          activeOpacity={0.8}
          style={[s.favFilterBtn, {
            backgroundColor: activeCat === 'fav' ? '#FFF1F2' : theme.colors.surface,
            borderColor: activeCat === 'fav' ? '#FDA4AF' : theme.colors.outlineVariant,
          }]}
        >
          <MaterialCommunityIcons
            name={activeCat === 'fav' ? 'heart' : 'heart-outline'}
            size={20}
            color={activeCat === 'fav' ? '#F43F5E' : theme.colors.onSurfaceVariant}
          />
        </TouchableOpacity>
      </View>

      {/* ── LISTA ── */}
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
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 120 }}
        ListEmptyComponent={() => (
          <Animatable.View animation="fadeIn" duration={400} style={s.empty}>
            <MaterialCommunityIcons
              name={activeCat === 'fav' ? 'heart-outline' : 'text-search'}
              size={52}
              color={theme.colors.outlineVariant}
            />
            <Text style={[s.emptyTxt, { color: theme.colors.onSurfaceVariant }]}>
              {activeCat === 'fav'
                ? 'Nenhum favorito ainda.\nToque ♡ em qualquer modelo!'
                : `Nenhum modelo encontrado\npara "${search}"`}
            </Text>
          </Animatable.View>
        )}
      />

    </SafeAreaView>
  );
}

/* ── Estilos header / filtros ── */
const s = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    overflow: 'hidden',
  },
  blob:          { position: 'absolute', borderRadius: 999 },
  headerRow:     { flexDirection: 'row', alignItems: 'center' },
  headerBackBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle:   { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: 0.2 },
  headerSub:     { color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: '500' },
  langPill:      { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(255,255,255,0.22)', paddingVertical: 2, paddingHorizontal: 7, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)' },
  langPillFlag:  { fontSize: 12 },
  langPillTxt:   { color: '#fff', fontSize: 10, fontWeight: '700' },
  headerIconBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6 },

  searchRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1 },
  searchBox:   { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 14, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 14, padding: 0, margin: 0 },
  favFilterBtn:{ width: 44, height: 44, borderRadius: 14, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },

  empty:    { alignItems: 'center', paddingVertical: 48, gap: 14, paddingHorizontal: 32 },
  emptyTxt: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
});

/* ── Estilos do card ── */
const cs = StyleSheet.create({
  card: {
    borderRadius: 22,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },

  /* Preview */
  preview:  { height: 158, overflow: 'hidden', position: 'relative' },
  blob:     { position: 'absolute', borderRadius: 999 },

  /* Papel simulado */
  paper: {
    position: 'absolute',
    top: 16, left: 16, right: 16, bottom: -4,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 11,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  paperAvatar:  { width: 26, height: 26, borderRadius: 7, backgroundColor: '#E2E8F0' },
  paperLine:    { height: 5, borderRadius: 3, backgroundColor: '#E2E8F0' },
  paperDivider: { height: 1, backgroundColor: '#EEF2F7', marginVertical: 5 },

  /* Ícone estilo — canto inferior esquerdo */
  styleIcon: {
    position: 'absolute',
    bottom: 10, left: 10,
    width: 30, height: 30,
    borderRadius: 9,
    justifyContent: 'center', alignItems: 'center',
  },

  /* Favorito — canto superior direito, grande e claro */
  favPos:      { position: 'absolute', top: 8, right: 8 },
  favIconWrap: { width: 34, height: 34, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },

  /* Check selecionado — canto superior esquerdo */
  checkBadge:      { position: 'absolute', top: 8, left: 8, borderRadius: 10, overflow: 'hidden', borderWidth: 2, borderColor: '#fff' },
  checkBadgeInner: { width: 26, height: 26, justifyContent: 'center', alignItems: 'center' },

  /* Info */
  info:      { paddingHorizontal: 13, paddingTop: 11, paddingBottom: 5, borderTopWidth: 1 },
  accentDot: { width: 8, height: 8, borderRadius: 4 },
  name:      { fontSize: 13, fontWeight: '800' },
  desc:      { fontSize: 10, lineHeight: 14, marginTop: 1 },

  /* Ações */
  actions:    { flexDirection: 'row', gap: 7, paddingHorizontal: 10, paddingBottom: 12, paddingTop: 4 },
  btnOutline: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 9, borderRadius: 12, borderWidth: 1.5 },
  btnPdf:     { flex: 1, borderRadius: 12, overflow: 'hidden' },
  btnPdfGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 9 },
  btnTxt:     { fontSize: 12, fontWeight: '800' },
});
