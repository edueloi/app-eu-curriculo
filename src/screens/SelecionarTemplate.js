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
const CARD_WIDTH = (width - 48) / 2;
const FAV_KEY = '@app_curriculos:fav_templates';

/* gradientes reais por template (par de cores) */
const TEMPLATE_META = {
  classic:    { icon: 'file-document-outline',  gradient: ['#1A237E','#3949AB'], label: 'Clássico' },
  creative:   { icon: 'palette-outline',         gradient: ['#AD1457','#E91E8C'], label: 'Criativo'  },
  corporate:  { icon: 'domain',                  gradient: ['#00695C','#00BFA5'], label: 'Corporativo' },
  elegant:    { icon: 'star-outline',             gradient: ['#6A1B9A','#AB47BC'], label: 'Elegante'  },
  minimalist: { icon: 'minus-circle-outline',    gradient: ['#37474F','#607D8B'], label: 'Minimalista' },
  inverted:   { icon: 'swap-horizontal',         gradient: ['#0277BD','#29B6F6'], label: 'Invertido' },
  split:      { icon: 'view-column-outline',     gradient: ['#4527A0','#7E57C2'], label: 'Split'     },
  dark:       { icon: 'weather-night',            gradient: ['#212121','#424242'], label: 'Dark'      },
};

/* Filtragem de categorias */
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

/* ── botão de favorito com escala ── */
function FavButton({ isFav, onPress, color }) {
  const scale = useRef(new Animated.Value(1)).current;
  const tap = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.45, duration: 120, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1,    duration: 160, useNativeDriver: true }),
    ]).start();
    onPress();
  };
  return (
    <TouchableOpacity onPress={tap} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} activeOpacity={0.7}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <MaterialCommunityIcons
          name={isFav ? 'heart' : 'heart-outline'}
          size={20}
          color={isFav ? '#F43F5E' : 'rgba(255,255,255,0.7)'}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

/* ── card de template ── */
function TemplateCard({ tpl, isSelected, isFav, onSelect, onPreview, onExport, onFav, index }) {
  const theme = useTheme();
  const meta = TEMPLATE_META[tpl.id];
  const [g1, g2] = meta.gradient;

  return (
    <Animatable.View animation="zoomIn" duration={380} delay={index * 55} style={cs.wrapper}>
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => onSelect(tpl.id)}
        style={[cs.card, { backgroundColor: theme.colors.surface, borderColor: isSelected ? g1 : theme.colors.outlineVariant, borderWidth: isSelected ? 2.5 : 1 }]}
      >
        {/* ── mock preview padronizado (Tema) ── */}
        <LinearGradient colors={[theme.colors.primary, theme.colors.secondary || theme.colors.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={cs.mock}>
          {/* papel sutil central */}
          <View style={{ position: 'absolute', top: 20, left: 16, right: 16, bottom: -10, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 6 }} />
          <View style={{ position: 'absolute', top: 12, left: 24, right: 24, bottom: -10, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 8, elevation: 4 }}>
            {/* linhas de mock de currículo simulando tinta no papel branco */}
            <View style={[cs.mockAvatar, { backgroundColor: theme.colors.primary, opacity: 0.8, top: 10, left: 10 }]} />
            <View style={{ gap: 4, marginLeft: 46, marginTop: 12 }}>
              <View style={[cs.mockLine, { width: '65%', backgroundColor: theme.colors.primary, opacity: 0.9 }]} />
              <View style={[cs.mockLine, { width: '45%', backgroundColor: '#64748B' }]} />
            </View>
            <View style={[cs.mockDiv, { backgroundColor: '#CBD5E1', marginVertical: 8 }]} />
            <View style={{ gap: 5, paddingHorizontal: 10 }}>
              <View style={[cs.mockLine, { width: '85%', backgroundColor: '#94A3B8' }]} />
              <View style={[cs.mockLine, { width: '70%', backgroundColor: '#94A3B8' }]} />
              <View style={[cs.mockLine, { width: '90%', backgroundColor: '#94A3B8' }]} />
            </View>
          </View>

          {/* ícone identificador do estilo */}
          <View style={cs.mockIconBg}>
            <MaterialCommunityIcons name={meta.icon} size={22} color="rgba(255,255,255,0.95)" />
          </View>

          {/* favorito */}
          <View style={cs.favBtn}>
            <FavButton isFav={isFav} onPress={() => onFav(tpl.id)} color={theme.colors.primary} />
          </View>

          {/* badge selecionado */}
          {isSelected && (
            <Animatable.View animation="zoomIn" duration={250} style={[cs.selectedBadge, { backgroundColor: theme.colors.primary }]}>
              <MaterialCommunityIcons name="check" size={14} color="#fff" />
            </Animatable.View>
          )}
        </LinearGradient>

        {/* ── info ── */}
        <View style={cs.info}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={[cs.name, { color: theme.colors.onSurface }]} numberOfLines={1}>{tpl.name}</Text>
            {isFav && <MaterialCommunityIcons name="heart" size={12} color="#F43F5E" />}
          </View>
          <Text style={[cs.desc, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>{tpl.desc}</Text>
        </View>

        {/* ── ações ── */}
        <View style={cs.actions}>
          <TouchableOpacity
            style={[cs.btn, { borderColor: theme.colors.primary, borderWidth: 1.5 }]}
            onPress={() => onPreview(tpl.id)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="eye-outline" size={13} color={theme.colors.primary} />
            <Text style={[cs.btnTxt, { color: theme.colors.primary }]}>Ver</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[cs.btn, { backgroundColor: theme.colors.primary, flex: 1.4 }]}
            onPress={() => onExport(tpl.id)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="file-pdf-box" size={13} color="#fff" />
            <Text style={[cs.btnTxt, { color: '#fff' }]}>PDF</Text>
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
    { id: 'classic',    name: t('template_classic_name')    || 'Clássico Profissional', desc: t('template_classic_desc')    || 'Design limpo, tradicional e objetivo.' },
    { id: 'creative',   name: t('template_creative_name')   || 'Criativo Moderno',      desc: t('template_creative_desc')   || 'Layout arrojado para design e marketing.' },
    { id: 'corporate',  name: t('template_corporate_name')  || 'Azul Corporativo',      desc: t('template_corporate_desc')  || 'Seriedade e confiança com tons de azul.' },
    { id: 'elegant',    name: t('template_elegant_name')    || 'Rosa Elegante',         desc: t('template_elegant_desc')    || 'Um toque delicado e sofisticado.' },
    { id: 'minimalist', name: t('template_minimalist_name') || 'Minimalista',           desc: t('template_minimalist_desc') || 'Elegância na simplicidade.' },
    { id: 'inverted',   name: t('template_inverted_name')   || 'Invertido',             desc: t('template_inverted_desc')   || 'Estilo moderno com cores invertidas.' },
    { id: 'split',      name: t('template_split_name')      || 'Split',                 desc: t('template_split_desc')      || 'Layout dividido em duas colunas.' },
    { id: 'dark',       name: t('template_dark_name')       || 'Dark Mode',             desc: t('template_dark_desc')       || 'Para quem quer se destacar.' },
  ];

  const filtered = templates.filter(tpl => {
    if (activeCat === 'fav') return favorites.includes(tpl.id);
    return TEMPLATE_CATS[tpl.id]?.includes(activeCat);
  });

  const HERO_TEXT = {
    'pt-BR': { title: 'Escolha um Modelo', sub: 'Explore modelos profissionais e modernos para se destacar.' },
    'en':    { title: 'Choose a Template',  sub: 'Explore professional and modern templates to stand out.' },
    'es':    { title: 'Elige una Plantilla', sub: 'Explora plantillas profesionales y modernas para destacar.' },
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
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 120 : 130 }}
        ListHeaderComponent={() => (
          <>
            {/* ── HERO ── */}
            <Animatable.View animation="fadeInDown" duration={600}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={s.hero}
              >
                <View style={s.heroHb} />
                {/* botão voltar */}
                <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={s.backBtn}>
                  <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
                </TouchableOpacity>
                <Animatable.View animation="bounceIn" duration={700} delay={200} style={s.heroIconWrap}>
                  <MaterialCommunityIcons name="palette-swatch-outline" size={36} color="#fff" />
                </Animatable.View>
                <Text style={s.heroTitle}>{hero.title}</Text>
                <Text style={s.heroSub}>{hero.sub}</Text>
                {/* contadores */}
                <View style={s.heroStats}>
                  <View style={s.heroStat}>
                    <Text style={s.heroStatVal}>8</Text>
                    <Text style={s.heroStatLabel}>{lang === 'en' ? 'Templates' : 'Modelos'}</Text>
                  </View>
                  <View style={s.heroStatDiv} />
                  <View style={s.heroStat}>
                    <Text style={s.heroStatVal}>{favorites.length}</Text>
                    <Text style={s.heroStatLabel}>{lang === 'en' ? 'Favorites' : lang === 'es' ? 'Favoritos' : 'Favoritos'}</Text>
                  </View>
                  <View style={s.heroStatDiv} />
                  <View style={s.heroStat}>
                    <Text style={s.heroStatVal}>PDF</Text>
                    <Text style={s.heroStatLabel}>{lang === 'en' ? 'Export' : 'Export'}</Text>
                  </View>
                </View>
              </LinearGradient>
            </Animatable.View>

            {/* ── filtro de categorias ── */}
            <Animatable.View animation="fadeInUp" duration={500} delay={200}>
              <View style={s.catRow}>
                {CATS.map(cat => {
                  const active = activeCat === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setActiveCat(cat)}
                      activeOpacity={0.8}
                      style={{ borderRadius: 22, overflow: 'hidden' }}
                    >
                      {active ? (
                        <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.catChipActive}>
                          {cat === 'fav' && <MaterialCommunityIcons name="heart" size={13} color="#fff" />}
                          <Text style={s.catChipTxtActive}>{CAT_LABELS[lang][cat]}</Text>
                        </LinearGradient>
                      ) : (
                        <View style={[s.catChip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]}>
                          {cat === 'fav' && <MaterialCommunityIcons name="heart-outline" size={13} color="#F43F5E" />}
                          <Text style={[s.catChipTxt, { color: theme.colors.onSurfaceVariant }]}>{CAT_LABELS[lang][cat]}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Animatable.View>

            {/* empty state para favoritos */}
            {activeCat === 'fav' && filtered.length === 0 && (
              <Animatable.View animation="fadeIn" duration={400} style={s.emptyFav}>
                <MaterialCommunityIcons name="heart-outline" size={48} color={theme.colors.outlineVariant} />
                <Text style={[s.emptyFavTxt, { color: theme.colors.onSurfaceVariant }]}>
                  {lang === 'en' ? 'No favorites yet.\nTap ♡ on any template!' : lang === 'es' ? 'Sin favoritos.\n¡Toca ♡ en cualquier plantilla!' : 'Nenhum favorito ainda.\nToque ♡ em qualquer modelo!'}
                </Text>
              </Animatable.View>
            )}
          </>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  hero:          { margin: 16, marginTop: Platform.OS === 'ios' ? 54 : (StatusBar.currentHeight || 24) + 8, borderRadius: 24, padding: 24, alignItems: 'center', gap: 8, overflow: 'hidden', elevation: 6, shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.22, shadowRadius: 10 },
  backBtn:       { position: 'absolute', top: 16, left: 16, width: 36, height: 36, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  heroHb:        { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.08)', top: -60, right: -40 },
  heroIconWrap:  { width: 72, height: 72, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.18)', justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  heroTitle:     { color: '#fff', fontSize: 22, fontWeight: '900', textAlign: 'center' },
  heroSub:       { color: 'rgba(255,255,255,0.82)', fontSize: 13, textAlign: 'center', lineHeight: 20 },
  heroStats:     { flexDirection: 'row', alignItems: 'center', marginTop: 16, backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 18, paddingVertical: 12, paddingHorizontal: 8, width: '100%' },
  heroStat:      { flex: 1, alignItems: 'center' },
  heroStatVal:   { color: '#fff', fontSize: 18, fontWeight: '900' },
  heroStatLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 10, marginTop: 2, fontWeight: '600' },
  heroStatDiv:   { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.3)' },

  catRow:        { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 12, flexWrap: 'wrap' },
  catChip:       { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 7, paddingHorizontal: 14, borderRadius: 22, borderWidth: 1 },
  catChipTxt:    { fontSize: 12, fontWeight: '700' },
  catChipActive: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 7, paddingHorizontal: 14 },
  catChipTxtActive: { fontSize: 12, fontWeight: '800', color: '#fff' },

  emptyFav:      { alignItems: 'center', paddingVertical: 40, gap: 12, paddingHorizontal: 32 },
  emptyFavTxt:   { fontSize: 14, textAlign: 'center', lineHeight: 22 },
});

const cs = StyleSheet.create({
  wrapper: { width: CARD_WIDTH, marginBottom: 16 },
  card:    { borderRadius: 18, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.09, shadowRadius: 6 },

  mock:       { height: 155, padding: 14, paddingTop: 14, gap: 5, position: 'relative', overflow: 'hidden' },
  mockAvatar: { position: 'absolute', top: 12, left: 12, width: 32, height: 32, borderRadius: 9 },
  mockLine:   { height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.55)' },
  mockDiv:    { height: 1, backgroundColor: 'rgba(255,255,255,0.22)', marginVertical: 3 },
  mockIconBg: { position: 'absolute', bottom: 10, right: 10, width: 38, height: 38, borderRadius: 11, backgroundColor: 'rgba(0,0,0,0.22)', justifyContent: 'center', alignItems: 'center' },
  favBtn:     { position: 'absolute', top: 10, right: 10 },
  selectedBadge: { position: 'absolute', top: 10, left: 10, width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },

  info:    { padding: 11, gap: 3 },
  name:    { fontSize: 13, fontWeight: '800' },
  desc:    { fontSize: 10, lineHeight: 15 },

  actions: { flexDirection: 'row', gap: 6, paddingHorizontal: 10, paddingBottom: 11 },
  btn:     { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 8, borderRadius: 10 },
  btnTxt:  { fontSize: 11, fontWeight: '800' },
});
