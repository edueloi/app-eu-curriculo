import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  StyleSheet, ScrollView, View, TouchableOpacity,
  Dimensions, Animated, Easing, Platform,
} from 'react-native';
import { Text, useTheme, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UserPreferencesContext } from '../context/UserPreferencesContext';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import * as Clipboard from 'expo-clipboard';

const { width } = Dimensions.get('window');
const PIX_KEY = 'cinehd.ee@gmail.com';

/* ── partícula flutuante ── */
function Particle({ size, color, x, y, duration, delay }) {
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
  const ty = anim.interpolate({ inputRange: [0,1], outputRange: [0, -18] });
  const op = anim.interpolate({ inputRange: [0,0.5,1], outputRange: [0.15, 0.45, 0.15] });
  return (
    <Animated.View style={{ position:'absolute', left:x, top:y, width:size, height:size, borderRadius:size/2, backgroundColor:color, opacity:op, transform:[{translateY:ty}] }} />
  );
}

/* ── card de feature ── */
function FeatureCard({ icon, label, gradient, delay }) {
  return (
    <Animatable.View animation="zoomIn" duration={400} delay={delay} style={fc.wrap}>
      <LinearGradient colors={gradient} start={{x:0,y:0}} end={{x:1,y:1}} style={fc.icon}>
        <MaterialCommunityIcons name={icon} size={24} color="#fff" />
      </LinearGradient>
      <Text style={fc.label}>{label}</Text>
    </Animatable.View>
  );
}

/* ── stat item ── */
function Stat({ value, label, color }) {
  return (
    <View style={st.wrap}>
      <Text style={[st.val, { color }]}>{value}</Text>
      <Text style={st.label}>{label}</Text>
    </View>
  );
}

/* ── TELA PRINCIPAL ── */
export default function AboutScreen() {
  const theme = useTheme();
  const { t } = useContext(UserPreferencesContext);
  const [snack, setSnack] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyPix = async () => {
    await Clipboard.setStringAsync(PIX_KEY);
    setCopied(true);
    setSnack(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const FEATURES = [
    { icon: 'lightning-bolt',        gradient: ['#4F46E5','#818CF8'], label: t('feature1') || 'Criação Rápida' },
    { icon: 'file-multiple',         gradient: ['#059669','#34D399'], label: t('feature2') || 'Modelos Pro' },
    { icon: 'file-pdf-box',          gradient: ['#DC2626','#FB7185'], label: t('feature3') || 'Export PDF' },
    { icon: 'history',               gradient: ['#D97706','#FCD34D'], label: t('feature4') || 'Histórico' },
    { icon: 'translate',             gradient: ['#7C3AED','#C4B5FD'], label: t('multiLanguage') || 'Multilíngue' },
    { icon: 'palette',               gradient: ['#0891B2','#67E8F9'], label: t('customization') || 'Temas' },
  ];

  return (
    <>
      <ScrollView
        style={{ flex:1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ paddingBottom: 56 }}
        showsVerticalScrollIndicator={false}
      >

        {/* ══ HERO ══ */}
        <Animatable.View animation="fadeIn" duration={600}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            start={{x:0,y:0}} end={{x:1,y:1}}
            style={s.hero}
          >
            {/* partículas de fundo */}
            <Particle size={110} color="#fff" x={-30}      y={-20}   duration={3400} delay={0}    />
            <Particle size={60}  color="#fff" x={width-70} y={10}    duration={2800} delay={600}  />
            <Particle size={40}  color="#fff" x={width*.5} y={120}   duration={3200} delay={1100} />
            <Particle size={25}  color="#fff" x={40}       y={160}   duration={2600} delay={400}  />

            {/* logo animado */}
            <Animatable.View animation="bounceIn" duration={900} delay={200} style={s.logoWrap}>
              <LinearGradient colors={['rgba(255,255,255,0.25)','rgba(255,255,255,0.1)']} style={s.logoOuter}>
                <View style={s.logoInner}>
                  <MaterialCommunityIcons name="file-account" size={48} color="#fff" />
                </View>
              </LinearGradient>
              {/* anel pulsante */}
              <Animatable.View animation="pulse" iterationCount="infinite" duration={2000} style={s.logoRing} />
            </Animatable.View>

            <Animatable.View animation="fadeInUp" duration={600} delay={400} style={{ alignItems:'center' }}>
              <Text style={s.heroTitle}>{t('aboutAppTitle') || 'Currículo Expresso'}</Text>
              <Text style={s.heroSub}>{t('aboutAppDescription') || 'Crie currículos profissionais em minutos'}</Text>
              <View style={s.versionBadge}>
                <MaterialCommunityIcons name="tag" size={12} color="#fff" />
                <Text style={s.versionTxt}>v1.0.0</Text>
              </View>
            </Animatable.View>

            {/* stats */}
            <Animatable.View animation="fadeInUp" duration={600} delay={600} style={s.statsRow}>
              <Stat value="8+"   label={t('templates') || 'Modelos'} color="#fff" />
              <View style={s.statDiv} />
              <Stat value="3"    label={t('languages') || 'Idiomas'} color="#fff" />
              <View style={s.statDiv} />
              <Stat value="∞"    label={t('resumes') || 'Currículos'} color="#fff" />
              <View style={s.statDiv} />
              <Stat value="100%" label={t('free') || 'Grátis'} color="#fff" />
            </Animatable.View>
          </LinearGradient>
        </Animatable.View>

        <View style={{ padding:16, gap:20 }}>

          {/* ══ FEATURES ══ */}
          <Animatable.View animation="fadeInUp" duration={500} delay={200}>
            <View style={[s.sectionHeader, { borderColor: theme.colors.outlineVariant }]}>
              <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={s.sectionIcon}>
                <MaterialCommunityIcons name="star-shooting" size={18} color="#fff" />
              </LinearGradient>
              <Text style={[s.sectionTitle, { color: theme.colors.onSurface }]}>{t('featuresTitle') || 'Recursos'}</Text>
            </View>
            <View style={s.featureGrid}>
              {FEATURES.map((f,i) => (
                <FeatureCard key={i} icon={f.icon} gradient={f.gradient} label={f.label} delay={i*60} />
              ))}
            </View>
          </Animatable.View>

          {/* ══ SOBRE O CRIADOR ══ */}
          <Animatable.View animation="fadeInUp" duration={500} delay={350}>
            <View style={[s.card, { backgroundColor: theme.colors.surface, borderColor: '#4F46E5'+'28' }]}>
              <LinearGradient colors={['#4F46E5','#818CF8']} start={{x:0,y:0}} end={{x:0,y:1}} style={s.cardStripe} />
              <View style={s.cardContent}>
                <View style={s.cardHead}>
                  <LinearGradient colors={['#4F46E5','#818CF8']} style={s.cardIcon}>
                    <MaterialCommunityIcons name="account-star" size={20} color="#fff" />
                  </LinearGradient>
                  <Text style={[s.cardTitle, { color: theme.colors.onSurface }]}>{t('developedBy') || 'Desenvolvido por Eduardo Eloi'}</Text>
                </View>

                {/* linha do dev */}
                <View style={[s.devRow, { backgroundColor: '#4F46E5'+'0D', borderColor: '#4F46E5'+'30' }]}>
                  <View style={s.devAvatar}>
                    <Text style={s.devAvatarTxt}>EE</Text>
                  </View>
                  <View style={{ flex:1 }}>
                    <Text style={[s.devName, { color: theme.colors.onSurface }]}>Eduardo Eloi</Text>
                    <Text style={[s.devRole, { color: theme.colors.onSurfaceVariant }]}>Mobile Developer • React Native</Text>
                  </View>
                  <MaterialCommunityIcons name="code-braces" size={20} color="#4F46E5" />
                </View>

                <Text style={[s.bodyText, { color: theme.colors.onSurfaceVariant }]}>
                  {t('specialThanks') || 'Criado com dedicação para ajudar profissionais a conquistar novas oportunidades de carreira.'}
                </Text>
              </View>
            </View>
          </Animatable.View>

          {/* ══ INFO ══ */}
          <Animatable.View animation="fadeInUp" duration={500} delay={430}>
            <View style={[s.card, { backgroundColor: theme.colors.surface, borderColor: '#059669'+'28' }]}>
              <LinearGradient colors={['#059669','#34D399']} start={{x:0,y:0}} end={{x:0,y:1}} style={s.cardStripe} />
              <View style={s.cardContent}>
                <View style={s.cardHead}>
                  <LinearGradient colors={['#059669','#34D399']} style={s.cardIcon}>
                    <MaterialCommunityIcons name="information" size={20} color="#fff" />
                  </LinearGradient>
                  <Text style={[s.cardTitle, { color: theme.colors.onSurface }]}>{t('usefulInfo') || 'Informações Úteis'}</Text>
                </View>
                {[
                  { icon:'tag-outline',     label: t('version') || 'Versão',            value: '1.0.0',      color: '#059669' },
                  { icon:'calendar-check',  label: t('lastUpdate') || 'Atualização',     value: '2025',       color: '#059669' },
                  { icon:'cellphone',       label: 'Plataforma',                          value: 'Android & iOS', color: '#059669' },
                  { icon:'translate',       label: t('languages') || 'Idiomas',          value: 'PT · EN · ES', color: '#059669' },
                ].map((item, i, arr) => (
                  <View key={i} style={[s.infoRow, i < arr.length-1 && { borderBottomWidth:1, borderBottomColor: theme.colors.outlineVariant }]}>
                    <MaterialCommunityIcons name={item.icon} size={16} color={item.color} />
                    <Text style={[s.infoLabel, { color: theme.colors.onSurfaceVariant }]}>{item.label}</Text>
                    <Text style={[s.infoVal, { color: item.color }]}>{item.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Animatable.View>

          {/* ══ PIX ══ */}
          <Animatable.View animation="fadeInUp" duration={500} delay={510}>
            <View style={[s.card, { backgroundColor: theme.colors.surface, borderColor: '#D97706'+'40' }]}>
              <LinearGradient colors={['#D97706','#FCD34D']} start={{x:0,y:0}} end={{x:0,y:1}} style={s.cardStripe} />
              <View style={s.cardContent}>
                <View style={s.cardHead}>
                  <LinearGradient colors={['#D97706','#FCD34D']} style={s.cardIcon}>
                    <MaterialCommunityIcons name="heart" size={20} color="#fff" />
                  </LinearGradient>
                  <Text style={[s.cardTitle, { color: theme.colors.onSurface }]}>{t('supportProject') || 'Apoie o Projeto'}</Text>
                </View>

                <Text style={[s.bodyText, { color: theme.colors.onSurfaceVariant }]}>
                  {t('supportMessage') || 'Se o app te ajudou, considere fazer uma contribuição via PIX. Qualquer valor é muito bem-vindo!'}
                </Text>

                {/* visual PIX */}
                <LinearGradient colors={['#D97706','#F59E0B']} start={{x:0,y:0}} end={{x:1,y:1}} style={s.pixBanner}>
                  <View style={s.pixBannerHb} />
                  <View style={s.pixLeft}>
                    <View style={s.pixLogoWrap}>
                      <MaterialCommunityIcons name="qrcode-scan" size={28} color="#fff" />
                    </View>
                    <View>
                      <Text style={s.pixBannerLabel}>Chave PIX</Text>
                      <Text style={s.pixBannerKey}>{PIX_KEY}</Text>
                    </View>
                  </View>
                </LinearGradient>

                {/* botão copiar */}
                <TouchableOpacity onPress={copyPix} activeOpacity={0.85} style={{ borderRadius:16, overflow:'hidden', marginTop:2 }}>
                  <LinearGradient
                    colors={copied ? ['#059669','#34D399'] : ['#D97706','#F59E0B']}
                    start={{x:0,y:0}} end={{x:1,y:0}}
                    style={s.pixCopyBtn}
                  >
                    <MaterialCommunityIcons name={copied ? 'check-circle' : 'content-copy'} size={18} color="#fff" />
                    <Text style={s.pixCopyTxt}>
                      {copied ? (t('keyCopied') || 'Chave copiada!') : (t('copyKey') || 'Copiar Chave PIX')}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* note de agradecimento */}
                <View style={[s.pixNote, { backgroundColor:'#FFF7ED', borderColor:'#D97706'+'44' }]}>
                  <Text style={[s.pixNoteText, { color:'#92400E' }]}>
                    💛  Sua contribuição ajuda a manter e melhorar o app para todos!
                  </Text>
                </View>
              </View>
            </View>
          </Animatable.View>

          {/* ══ AGRADECIMENTOS ══ */}
          <Animatable.View animation="fadeInUp" duration={500} delay={600}>
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.secondary]}
              start={{x:0,y:0}} end={{x:1,y:1}}
              style={s.thanksCard}
            >
              <View style={s.thanksHb} />
              <Animatable.View animation="pulse" iterationCount="infinite" duration={2200}>
                <MaterialCommunityIcons name="heart-multiple" size={42} color="rgba(255,255,255,0.9)" />
              </Animatable.View>
              <Text style={s.thanksTitle}>{t('acknowledgmentsTitle') || 'Obrigado!'}</Text>
              <Text style={s.thanksBody}>
                {t('specialThanks') || 'Obrigado por usar o Currículo Expresso. Que ele te ajude a alcançar seus objetivos profissionais!'}
              </Text>
              {/* tech stack pills */}
              <View style={s.techRow}>
                {['React Native','Expo','AsyncStorage','PDF Export'].map((tech, i) => (
                  <View key={i} style={s.techPill}>
                    <Text style={s.techTxt}>{tech}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </Animatable.View>

        </View>
      </ScrollView>

      <Snackbar
        visible={snack}
        onDismiss={() => setSnack(false)}
        duration={3000}
        action={{ label:'OK', onPress: () => setSnack(false) }}
      >
        {t('keyCopied') || 'Chave PIX copiada!'}
      </Snackbar>
    </>
  );
}

/* ─── styles ─── */
const s = StyleSheet.create({
  hero:        { paddingTop: Platform.OS === 'ios' ? 54 : 44, paddingBottom: 32, alignItems:'center', overflow:'hidden', paddingHorizontal:20 },
  logoWrap:    { position:'relative', marginBottom:20, alignItems:'center', justifyContent:'center' },
  logoOuter:   { width:110, height:110, borderRadius:30, justifyContent:'center', alignItems:'center' },
  logoInner:   { width:88, height:88, borderRadius:24, backgroundColor:'rgba(255,255,255,0.15)', justifyContent:'center', alignItems:'center' },
  logoRing:    { position:'absolute', width:126, height:126, borderRadius:38, borderWidth:2, borderColor:'rgba(255,255,255,0.2)' },
  heroTitle:   { color:'#fff', fontSize:24, fontWeight:'900', letterSpacing:0.3, textAlign:'center' },
  heroSub:     { color:'rgba(255,255,255,0.85)', fontSize:13, marginTop:6, textAlign:'center', lineHeight:20, paddingHorizontal:10 },
  versionBadge:{ flexDirection:'row', alignItems:'center', gap:5, marginTop:12, backgroundColor:'rgba(255,255,255,0.2)', paddingVertical:5, paddingHorizontal:14, borderRadius:20 },
  versionTxt:  { color:'#fff', fontSize:12, fontWeight:'700' },
  statsRow:    { flexDirection:'row', alignItems:'center', marginTop:24, backgroundColor:'rgba(255,255,255,0.15)', borderRadius:20, paddingVertical:14, paddingHorizontal:10, width:'100%' },
  statDiv:     { width:1, height:30, backgroundColor:'rgba(255,255,255,0.3)' },

  sectionHeader:{ flexDirection:'row', alignItems:'center', gap:10, paddingBottom:14, borderBottomWidth:1, marginBottom:14 },
  sectionIcon:  { width:36, height:36, borderRadius:11, justifyContent:'center', alignItems:'center' },
  sectionTitle: { fontSize:17, fontWeight:'900' },

  featureGrid: { flexDirection:'row', flexWrap:'wrap', gap:12 },

  card:        { flexDirection:'row', borderRadius:20, borderWidth:1.5, overflow:'hidden', elevation:3, shadowColor:'#000', shadowOffset:{width:0,height:3}, shadowOpacity:0.07, shadowRadius:8 },
  cardStripe:  { width:5 },
  cardContent: { flex:1, padding:16, gap:12 },
  cardHead:    { flexDirection:'row', alignItems:'center', gap:12 },
  cardIcon:    { width:40, height:40, borderRadius:12, justifyContent:'center', alignItems:'center', flexShrink:0 },
  cardTitle:   { fontSize:16, fontWeight:'900', flex:1 },
  bodyText:    { fontSize:13, lineHeight:21 },

  devRow:    { flexDirection:'row', alignItems:'center', gap:12, padding:12, borderRadius:14, borderWidth:1 },
  devAvatar: { width:46, height:46, borderRadius:14, backgroundColor:'#4F46E5', justifyContent:'center', alignItems:'center' },
  devAvatarTxt:{ color:'#fff', fontSize:16, fontWeight:'900' },
  devName:   { fontSize:15, fontWeight:'800' },
  devRole:   { fontSize:12, marginTop:2 },

  infoRow:   { flexDirection:'row', alignItems:'center', gap:10, paddingVertical:11 },
  infoLabel: { flex:1, fontSize:13 },
  infoVal:   { fontSize:13, fontWeight:'800' },

  pixBanner:    { borderRadius:16, padding:16, marginBottom:4, overflow:'hidden', flexDirection:'row', alignItems:'center' },
  pixBannerHb:  { position:'absolute', width:100, height:100, borderRadius:50, backgroundColor:'rgba(255,255,255,0.1)', right:-20, top:-20 },
  pixLeft:      { flexDirection:'row', alignItems:'center', gap:14, flex:1 },
  pixLogoWrap:  { width:48, height:48, borderRadius:14, backgroundColor:'rgba(255,255,255,0.2)', justifyContent:'center', alignItems:'center' },
  pixBannerLabel:{ color:'rgba(255,255,255,0.8)', fontSize:11, fontWeight:'700', textTransform:'uppercase' },
  pixBannerKey: { color:'#fff', fontSize:13, fontWeight:'900', marginTop:2 },
  pixCopyBtn:   { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, paddingVertical:14 },
  pixCopyTxt:   { color:'#fff', fontWeight:'900', fontSize:14 },
  pixNote:      { borderRadius:12, borderWidth:1, padding:12, marginTop:2 },
  pixNoteText:  { fontSize:12, lineHeight:19, textAlign:'center', fontWeight:'600' },

  thanksCard:  { borderRadius:24, padding:24, alignItems:'center', overflow:'hidden', elevation:5 },
  thanksHb:    { position:'absolute', width:200, height:200, borderRadius:100, backgroundColor:'rgba(255,255,255,0.07)', top:-60, right:-50 },
  thanksTitle: { color:'#fff', fontSize:22, fontWeight:'900', marginTop:12, marginBottom:8 },
  thanksBody:  { color:'rgba(255,255,255,0.88)', fontSize:14, lineHeight:22, textAlign:'center' },
  techRow:     { flexDirection:'row', flexWrap:'wrap', gap:8, marginTop:18, justifyContent:'center' },
  techPill:    { backgroundColor:'rgba(255,255,255,0.18)', borderRadius:20, paddingVertical:5, paddingHorizontal:14, borderWidth:1, borderColor:'rgba(255,255,255,0.25)' },
  techTxt:     { color:'#fff', fontSize:11, fontWeight:'700' },
});

const fc = StyleSheet.create({
  wrap:  { width:(width-16*2-12*2)/3, alignItems:'center', gap:8, padding:14, borderRadius:16, backgroundColor:'transparent' },
  icon:  { width:52, height:52, borderRadius:16, justifyContent:'center', alignItems:'center', elevation:3, shadowColor:'#000', shadowOffset:{width:0,height:3}, shadowOpacity:0.15, shadowRadius:6 },
  label: { fontSize:11, fontWeight:'700', textAlign:'center', color:'#475569' },
});

const st = StyleSheet.create({
  wrap:  { flex:1, alignItems:'center' },
  val:   { fontSize:18, fontWeight:'900' },
  label: { fontSize:10, color:'rgba(255,255,255,0.8)', marginTop:2, textAlign:'center', fontWeight:'600' },
});
