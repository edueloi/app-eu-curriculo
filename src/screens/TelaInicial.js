import React, { useState, useContext, useMemo, useRef } from 'react';
import {
  StyleSheet, ScrollView, View, TouchableOpacity,
  Dimensions, Animated,
} from 'react-native';
import { Text, useTheme, Divider } from 'react-native-paper';
import { UserPreferencesContext } from '../context/UserPreferencesContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

/* ─── paleta de ações rápidas ─── */
const ACTION_CARDS = [
  { icon: 'file-document-multiple', label_key: 'myResumes',    route: 'MeusCurriculos', colors: ['#4F46E5','#818CF8'], shape: 'circle' },
  { icon: 'plus-circle',            label_key: 'createResume', route: 'CriarCurrículo', colors: ['#059669','#34D399'], shape: 'square' },
  { icon: 'school',                 label_key: 'tutorials',    route: 'Tutoriais',      colors: ['#DC2626','#FB7185'], shape: 'triangle' },
  { icon: 'cog',                    label_key: 'settings',     route: 'Configurações',  colors: ['#D97706','#FCD34D'], shape: 'diamond' },
];

/* ─── dicas (scroll horizontal) ─── */
const TIP_ICONS = ['lightbulb-on','star-four-points','rocket-launch','trophy','fire','check-all'];

export default function TelaInicial({ navigation }) {
  const theme   = useTheme();
  const { t, profile } = useContext(UserPreferencesContext);

  const [totalCurriculos, setTotalCurriculos]   = useState(0);
  const [ultimoCurriculo, setUltimoCurriculo]   = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const data = await AsyncStorage.getItem('curriculos');
        if (data) {
          const lista = JSON.parse(data);
          setTotalCurriculos(lista.length);
          setUltimoCurriculo(lista.length > 0
            ? { curriculo: lista[lista.length - 1], index: lista.length - 1 }
            : null);
        } else {
          setTotalCurriculos(0);
          setUltimoCurriculo(null);
        }
      })();
    }, [])
  );

  const nomeUsuario = profile?.nome?.split(' ')[0] || t('user');
  const hora        = new Date().getHours();
  const saudacao    = hora < 12
    ? (t('goodMorning')   || 'Bom dia')
    : hora < 18
      ? (t('goodAfternoon') || 'Boa tarde')
      : (t('goodEvening')   || 'Boa noite');

  const allDicas = [t('tip1'),t('tip2'),t('tip3'),t('tip4'),t('tip5'),t('tip6'),t('tip7'),t('tip8')];
  const dicaDoDia = useMemo(() => {
    const diaDoAno = Math.floor(
      (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
    );
    return allDicas[diaDoAno % allDicas.length];
  }, [t]);

  /* progresso do perfil */
  const profileProgress = useMemo(() => {
    const fields = [profile?.nome, profile?.profissao, profile?.email, profile?.foto];
    const filled  = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [profile]);

  const s = createStyles(theme);

  return (
    <View style={s.root}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ══════════ HERO ══════════ */}
        <Animatable.View animation="fadeInDown" duration={600} easing="ease-out-expo">
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.hero}
          >
            {/* bolhas decorativas */}
            <View style={[s.bubble, s.bubble1]} />
            <View style={[s.bubble, s.bubble2]} />
            <View style={[s.bubble, s.bubble3]} />

            <View style={s.heroContent}>
              <View style={{ flex: 1 }}>
                <Text style={s.heroGreeting}>{saudacao} 👋</Text>
                <Text style={s.heroName}>{nomeUsuario}!</Text>
                <Text style={s.heroSub}>{t('welcomeSubtitle')}</Text>
              </View>

              {/* bolinha de stat */}
              <Animatable.View animation="zoomIn" duration={700} delay={300} style={s.statBubble}>
                <Text style={s.statNum}>{totalCurriculos}</Text>
                <Text style={s.statLabel}>{t('resumesSaved')}</Text>
              </Animatable.View>
            </View>

            {/* botão CTA */}
            <Animatable.View animation="fadeInUp" duration={600} delay={400}>
              <TouchableOpacity
                style={s.heroCta}
                onPress={() => navigation.navigate('CriarCurrículo')}
                activeOpacity={0.85}
              >
                <MaterialCommunityIcons name="plus-circle" size={18} color={theme.colors.primary} />
                <Text style={[s.heroCtaText, { color: theme.colors.primary }]}>
                  {t('createResume')}
                </Text>
              </TouchableOpacity>
            </Animatable.View>
          </LinearGradient>
        </Animatable.View>

        {/* ══════════ PROGRESSO DO PERFIL ══════════ */}
        <Animatable.View animation="fadeInUp" duration={500} delay={150} style={[s.profileCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.cardBorder }]}>
          <View style={s.profileCardLeft}>
            <View style={[s.profileIconBox, { backgroundColor: theme.colors.primaryContainer }]}>
              <MaterialCommunityIcons name="account-check-outline" size={22} color={theme.colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.profileCardTitle, { color: theme.colors.onSurface }]}>
                {profileProgress === 100 
                  ? t('profileComplete') 
                  : t('profileProgress').replace('{progress}', profileProgress)}
              </Text>
              <View style={[s.progressTrack, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Animatable.View
                  animation="slideInLeft"
                  duration={800}
                  delay={400}
                  style={[s.progressBar, { width: `${profileProgress}%`, backgroundColor: profileProgress === 100 ? '#059669' : theme.colors.primary }]}
                />
              </View>
            </View>
          </View>
          {profileProgress < 100 && (
            <TouchableOpacity
              onPress={() => navigation.navigate('Configurações')}
              style={[s.profileCta, { backgroundColor: theme.colors.primary + '15', borderColor: theme.colors.primary }]}
            >
              <Text style={[s.profileCtaText, { color: theme.colors.primary }]}>{t('btnComplete')}</Text>
            </TouchableOpacity>
          )}
        </Animatable.View>

        {/* ══════════ CONTINUAR ONDE PAROU ══════════ */}
        {ultimoCurriculo && (
          <Animatable.View animation="fadeInUp" duration={500} delay={200}>
            <SectionLabel label={t('continueWhereYouLeftOff')} theme={theme} />
            <TouchableOpacity
              style={[s.continueCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.cardBorder }]}
              onPress={() => navigation.navigate('CriarCurrículo', ultimoCurriculo)}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[theme.colors.primary + '22', theme.colors.secondary + '11']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.continueBg}
              />
              <View style={[s.continueIconBox, { backgroundColor: theme.colors.primary }]}>
                <MaterialCommunityIcons name="file-clock" size={24} color="#fff" />
              </View>
              <View style={s.continueInfo}>
                <Text style={[s.continueName, { color: theme.colors.onSurface }]} numberOfLines={1}>
                  {ultimoCurriculo.curriculo.nomeInterno || t('lastEdited')}
                </Text>
                <Text style={[s.continueDate, { color: theme.colors.onSurfaceVariant }]}>
                  {formatDate(ultimoCurriculo.curriculo.lastUpdated)}
                </Text>
              </View>
              <View style={[s.continueArrow, { backgroundColor: theme.colors.primary }]}>
                <MaterialCommunityIcons name="arrow-right" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
          </Animatable.View>
        )}

        {/* ══════════ AÇÕES RÁPIDAS (grid 2×2 com gradientes) ══════════ */}
        <SectionLabel label={t('quickActions')} theme={theme} />
        <View style={s.actionsGrid}>
          {ACTION_CARDS.map((card, i) => (
            <Animatable.View
              key={card.route}
              animation="zoomIn"
              duration={400}
              delay={250 + i * 70}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate(card.route)}
                activeOpacity={0.82}
                style={s.actionCard}
              >
                <LinearGradient
                  colors={card.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={s.actionGradient}
                >
                  {/* formas decorativas */}
                  <View style={[s.actionDeco, s.actionDeco1, { backgroundColor: 'rgba(255,255,255,0.12)' }]} />
                  <View style={[s.actionDeco, s.actionDeco2, { backgroundColor: 'rgba(255,255,255,0.08)' }]} />

                  <View style={s.actionIconWrap}>
                    <MaterialCommunityIcons name={card.icon} size={28} color="#fff" />
                  </View>
                  <Text style={s.actionLabel}>{t(card.label_key)}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animatable.View>
          ))}
        </View>

        {/* ══════════ DICAS (scroll horizontal) ══════════ */}
        <Animatable.View animation="fadeInUp" duration={500} delay={500}>
          <SectionLabel label={t('careerTips')} theme={theme} />
        </Animatable.View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.tipsScroll}
          snapToInterval={272} // width (260) + gap (12)
          decelerationRate="fast"
        >
          {allDicas.map((dica, i) => (
            <Animatable.View
              key={i}
              animation="fadeInRight"
              duration={400}
              delay={500 + i * 60}
            >
              <TouchableOpacity activeOpacity={0.85} style={[s.tipChip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]}>
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.secondary || theme.colors.primary]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={s.tipChipGrad}
                >
                  <MaterialCommunityIcons
                    name={TIP_ICONS[i % TIP_ICONS.length]}
                    size={22}
                    color="#fff"
                  />
                </LinearGradient>
                <Text style={[s.tipText, { color: theme.colors.onSurface }]} numberOfLines={4}>{dica}</Text>
              </TouchableOpacity>
            </Animatable.View>
          ))}
        </ScrollView>

        {/* ══════════ FERRAMENTAS DE CARREIRA ══════════ */}
        <Animatable.View animation="fadeInUp" duration={500} delay={520}>
          <SectionLabel label="Ferramentas de carreira" theme={theme} />

          {/* Card grande — Quiz Perfil */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => navigation.navigate('QuizPerfil')}
            style={s.careerCardLarge}
          >
            <LinearGradient
              colors={['#4F46E5', '#7C3AED', '#BE185D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.careerCardGrad}
            >
              <View style={[s.bubble, { width: 180, height: 180, top: -60, right: -50 }]} />
              <View style={[s.bubble, { width: 90,  height: 90,  bottom: -25, left: -20 }]} />
              <View style={s.careerCardInner}>
                <View style={s.careerIconWrap}>
                  <MaterialCommunityIcons name="brain" size={28} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.careerTag}>QUIZ INTERATIVO</Text>
                  <Text style={s.careerTitle}>Perfil Profissional</Text>
                  <Text style={s.careerSub}>20 perguntas · 6 perfis · 5 min</Text>
                </View>
                <View style={s.careerArrow}>
                  <MaterialCommunityIcons name="arrow-right" size={16} color="#fff" />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Card grande — Simulador de Entrevistas */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => navigation.navigate('QuizEntrevista')}
            style={[s.careerCardLarge, { marginTop: 10 }]}
          >
            <LinearGradient
              colors={['#0C4A6E', '#0369A1', '#0EA5E9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.careerCardGrad}
            >
              <View style={[s.bubble, { width: 180, height: 180, top: -60, right: -50 }]} />
              <View style={[s.bubble, { width: 90,  height: 90,  bottom: -25, left: -20 }]} />
              <View style={s.careerCardInner}>
                <View style={s.careerIconWrap}>
                  <MaterialCommunityIcons name="account-tie-voice" size={28} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.careerTag}>SIMULADOR</Text>
                  <Text style={s.careerTitle}>Entrevistas</Text>
                  <Text style={s.careerSub}>60+ perguntas · 10 áreas</Text>
                </View>
                <View style={s.careerArrow}>
                  <MaterialCommunityIcons name="arrow-right" size={16} color="#fff" />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>

        {/* ══════════ RECURSOS ÚTEIS ══════════ */}
        <Animatable.View animation="fadeInUp" duration={500} delay={550}>
          <SectionLabel label={t('usefulResources')} theme={theme} />
          <View style={[s.resourcesCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.cardBorder }]}>
            <ResourceRow
              icon="briefcase-search"
              colors={['#4F46E5','#818CF8']}
              title={t('findJobs')}
              desc={t('findJobsDesc')}
              onPress={() => navigation.navigate('SitesRecomendados')}
              theme={theme}
            />
            <Divider style={{ marginHorizontal: 16, opacity: 0.4 }} />
            <ResourceRow
              icon="newspaper-variant"
              colors={['#059669','#34D399']}
              title={t('blogTips')}
              desc={t('blogTipsDesc')}
              onPress={() => navigation.navigate('BlogScreen')}
              theme={theme}
            />
          </View>
        </Animatable.View>

        {/* ══════════ DICA DO DIA ══════════ */}
        <Animatable.View animation="fadeInUp" duration={500} delay={600}>
          <SectionLabel label={t('cardOfTheDay')} theme={theme} />
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.tipOfDay}
          >
            <View style={s.tipOfDayBubble} />
            <MaterialCommunityIcons name="lightbulb-on" size={32} color="rgba(255,255,255,0.9)" style={{ marginBottom: 12 }} />
            <Text style={s.tipOfDayText}>{dicaDoDia}</Text>
          </LinearGradient>
        </Animatable.View>

      </ScrollView>
    </View>
  );
}

/* ─── sub-componentes ─── */
const SectionLabel = ({ label, theme }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 28, marginBottom: 14, paddingHorizontal: 2 }}>
    <View style={{ width: 4, height: 16, borderRadius: 2, backgroundColor: theme.colors.primary }} />
    <Text style={{ fontSize: 13, fontWeight: '800', color: theme.colors.onSurface, letterSpacing: 0.8, textTransform: 'uppercase' }}>
      {label}
    </Text>
  </View>
);

const ResourceRow = ({ icon, colors, title, desc, onPress, theme }) => (
  <TouchableOpacity style={rs.row} onPress={onPress} activeOpacity={0.75}>
    <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={rs.iconBox}>
      <MaterialCommunityIcons name={icon} size={20} color="#fff" />
    </LinearGradient>
    <View style={rs.text}>
      <Text style={[rs.title, { color: theme.colors.onSurface }]}>{title}</Text>
      <Text style={[rs.desc,  { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>{desc}</Text>
    </View>
    <View style={[rs.arrow, { backgroundColor: theme.colors.surfaceVariant }]}>
      <MaterialCommunityIcons name="chevron-right" size={18} color={theme.colors.onSurfaceVariant} />
    </View>
  </TouchableOpacity>
);

function formatDate(ds) {
  if (!ds) return '';
  return new Date(ds).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

/* ─── styles ─── */
const CARD_W = (width - 32 - 12) / 2;

const createStyles = (theme) => StyleSheet.create({
  root:   { flex: 1, backgroundColor: theme.colors.background },
  scroll: { paddingHorizontal: 16, paddingBottom: 40, paddingTop: 8 },

  /* HERO */
  hero: {
    borderRadius: 28,
    padding: 24,
    overflow: 'hidden',
    marginBottom: 4,
    elevation: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
  },
  bubble: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.08)' },
  bubble1: { width: 160, height: 160, top: -60, right: -40 },
  bubble2: { width: 90,  height: 90,  bottom: -30, left: -20 },
  bubble3: { width: 50,  height: 50,  top: 10, right: 80 },

  heroContent:  { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  heroGreeting: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500' },
  heroName:     { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: 0.2, marginTop: 2 },
  heroSub:      { color: 'rgba(255,255,255,0.72)', fontSize: 13, marginTop: 6, lineHeight: 18 },

  statBubble: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    width: 76,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  statNum:   { color: '#fff', fontSize: 30, fontWeight: '900', lineHeight: 34 },
  statLabel: { color: 'rgba(255,255,255,0.82)', fontSize: 10, fontWeight: '600', textAlign: 'center', marginTop: 2 },

  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 11,
    paddingHorizontal: 22,
    alignSelf: 'flex-start',
    marginTop: 22,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  heroCtaText: { fontWeight: '800', fontSize: 14 },

  /* PROFILE CARD */
  profileCard: {
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  profileCardLeft:  { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  profileIconBox:   { width: 44, height: 44, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  profileCardTitle: { fontSize: 13, fontWeight: '700', marginBottom: 8 },
  progressTrack:    { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressBar:      { height: 6, borderRadius: 3 },
  profileCta: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  profileCtaText: { fontSize: 12, fontWeight: '800' },

  /* CONTINUAR */
  continueCard: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  continueBg: { ...StyleSheet.absoluteFillObject },
  continueIconBox: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  continueInfo:    { flex: 1 },
  continueName:    { fontSize: 15, fontWeight: '800' },
  continueDate:    { fontSize: 12, marginTop: 3 },
  continueArrow:   { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },

  /* AÇÕES (grid) */
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard:  { width: CARD_W, borderRadius: 22, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 8 },
  actionGradient: { padding: 20, paddingBottom: 18, minHeight: 120, justifyContent: 'flex-end', position: 'relative', overflow: 'hidden' },
  actionDeco:  { position: 'absolute', borderRadius: 999 },
  actionDeco1: { width: 90, height: 90, top: -30, right: -20 },
  actionDeco2: { width: 50, height: 50, top: 10, right: 60 },
  actionIconWrap: { marginBottom: 10 },
  actionLabel: { color: '#fff', fontSize: 14, fontWeight: '800', lineHeight: 18 },

  /* DICAS scroll */
  tipsScroll: { paddingRight: 16, paddingLeft: 4, gap: 12, paddingBottom: 8 },
  tipChip: {
    width: 260,
    minHeight: 140,
    borderRadius: 22,
    overflow: 'hidden',
    padding: 20,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    justifyContent: 'flex-start'
  },
  tipChipGrad: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  tipText: { fontSize: 14, lineHeight: 22, fontWeight: '700' },

  /* CAREER CARDS */
  careerCardLarge: {
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  careerCardGrad: {
    paddingVertical: 22,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  careerCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  careerIconWrap: {
    width: 54, height: 54,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.22)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.32)',
    flexShrink: 0,
  },
  careerTag: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 3,
  },
  careerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 3,
    letterSpacing: 0.2,
  },
  careerSub: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    fontWeight: '600',
  },
  careerArrow: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.22)',
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },

  /* legado mantido para não quebrar referências antigas */
  quizCard: { borderRadius: 22, overflow: 'hidden' },
  quizGradient: { padding: 20, overflow: 'hidden' },
  quizContent: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  quizIconBox: { width: 58, height: 58, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  quizTitle: { color: '#fff', fontSize: 16, fontWeight: '900', marginBottom: 4 },
  quizSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '600' },
  quizArrow: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },

  /* RECURSOS */
  resourcesCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },

  /* DICA DO DIA */
  tipOfDay: {
    borderRadius: 24,
    padding: 26,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    elevation: 6,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  tipOfDayBubble: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -80,
    right: -60,
  },
  tipOfDayText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
  },
});

const rs = StyleSheet.create({
  row:    { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  iconBox:{ width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  text:   { flex: 1 },
  title:  { fontSize: 14, fontWeight: '700' },
  desc:   { fontSize: 12, marginTop: 3, lineHeight: 16 },
  arrow:  { width: 32, height: 32, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
});
