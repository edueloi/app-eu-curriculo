import React, { useContext } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Platform } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { UserPreferencesContext } from '../context/UserPreferencesContext';
import { TIPS_DATA } from './BlogScreen';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ArtigoScreen({ route, navigation }) {
  const theme = useTheme();
  const { language } = useContext(UserPreferencesContext);
  const { tipId, catKey, lang: routeLang } = route.params;

  const lang = routeLang || (TIPS_DATA[language] ? language : 'pt-BR');
  const data = TIPS_DATA[lang] || TIPS_DATA['pt-BR'];
  const cat  = data.categories.find(c => c.key === catKey);
  const tip  = cat?.tips.find(t => t.id === tipId);

  if (!cat || !tip) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color={theme.colors.error} />
        <Text style={{ marginTop: 12, color: theme.colors.onSurface }}>Dica não encontrada</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
          <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 56 }}>

        {/* ══ HERO ══ */}
        <Animatable.View animation="fadeInDown" duration={500}>
          <LinearGradient colors={cat.gradient} start={{ x:0,y:0 }} end={{ x:1,y:1 }} style={s.hero}>
            <View style={s.hb1} /><View style={s.hb2} />

            <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
            </TouchableOpacity>

            {/* ícone da categoria */}
            <View style={s.heroIcon}>
              <MaterialCommunityIcons name={cat.icon} size={32} color="rgba(255,255,255,0.9)" />
            </View>

            {/* tag + tempo */}
            <View style={s.heroMeta}>
              <View style={s.heroTag}>
                <Text style={s.heroTagTxt}>{tip.tag}</Text>
              </View>
              <View style={s.heroTime}>
                <MaterialCommunityIcons name="clock-outline" size={13} color="rgba(255,255,255,0.85)" />
                <Text style={s.heroTimeTxt}>{tip.readTime}</Text>
              </View>
            </View>

            <Text style={s.heroTitle}>{tip.title}</Text>
            <Text style={s.heroSummary}>{tip.summary}</Text>
          </LinearGradient>
        </Animatable.View>

        {/* ══ SEÇÕES ══ */}
        <View style={s.content}>
          {tip.sections.map((sec, i) => (
            <Animatable.View key={i} animation="fadeInUp" duration={450} delay={i * 80} style={[s.section, { backgroundColor: theme.colors.surface, borderColor: cat.gradient[0] + '22' }]}>
              {/* número + título da seção */}
              <View style={s.secHeader}>
                <LinearGradient colors={cat.gradient} style={s.secNum}>
                  <Text style={s.secNumTxt}>{i + 1}</Text>
                </LinearGradient>
                <Text style={[s.secTitle, { color: theme.colors.onSurface }]}>{sec.heading}</Text>
              </View>

              {/* texto corrido */}
              {sec.body && (
                <Text style={[s.secBody, { color: theme.colors.onSurfaceVariant }]}>{sec.body}</Text>
              )}

              {/* lista de bullets */}
              {sec.bullets && (
                <View style={s.bullets}>
                  {sec.bullets.map((b, bi) => (
                    <View key={bi} style={s.bulletRow}>
                      <LinearGradient colors={cat.gradient} style={s.bulletDot} />
                      <Text style={[s.bulletTxt, { color: theme.colors.onSurface }]}>{b}</Text>
                    </View>
                  ))}
                </View>
              )}
            </Animatable.View>
          ))}

          {/* ══ RODAPÉ ══ */}
          <Animatable.View animation="fadeInUp" duration={450} delay={tip.sections.length * 80 + 100}>
            <View style={[s.footer, { backgroundColor: cat.gradient[0] + '10', borderColor: cat.gradient[0] + '30' }]}>
              <LinearGradient colors={cat.gradient} style={s.footerIcon}>
                <MaterialCommunityIcons name="check-circle" size={18} color="#fff" />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={[s.footerTitle, { color: cat.gradient[0] }]}>
                  {lang === 'en' ? 'Tip read!' : lang === 'es' ? '¡Consejo leído!' : 'Dica lida!'}
                </Text>
                <Text style={[s.footerSub, { color: theme.colors.onSurfaceVariant }]}>
                  {lang === 'en' ? 'Apply it today and see the difference.'
                    : lang === 'es' ? 'Aplícalo hoy y nota la diferencia.'
                    : 'Aplique hoje e veja a diferença.'}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.85} style={{ borderRadius: 18, overflow: 'hidden', marginTop: 14 }}>
              <LinearGradient colors={cat.gradient} start={{ x:0,y:0 }} end={{ x:1,y:0 }} style={s.backBtnBottom}>
                <MaterialCommunityIcons name="arrow-left" size={17} color="#fff" />
                <Text style={s.backBtnTxt}>
                  {lang === 'en' ? 'Back to tips' : lang === 'es' ? 'Volver a consejos' : 'Voltar para dicas'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>
        </View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  hero:        { paddingTop: Platform.OS === 'ios' ? 54 : 44, paddingBottom: 28, paddingHorizontal: 22, overflow: 'hidden' },
  hb1:         { position:'absolute', width:200, height:200, borderRadius:100, backgroundColor:'rgba(255,255,255,0.08)', top:-70, right:-50 },
  hb2:         { position:'absolute', width:80,  height:80,  borderRadius:40,  backgroundColor:'rgba(255,255,255,0.08)', bottom:-20, left:10 },
  backBtn:     { width:38, height:38, borderRadius:11, backgroundColor:'rgba(255,255,255,0.2)', justifyContent:'center', alignItems:'center', marginBottom:14 },
  heroIcon:    { width:60, height:60, borderRadius:18, backgroundColor:'rgba(255,255,255,0.18)', justifyContent:'center', alignItems:'center', marginBottom:16 },
  heroMeta:    { flexDirection:'row', alignItems:'center', gap:10, marginBottom:12 },
  heroTag:     { backgroundColor:'rgba(255,255,255,0.22)', paddingVertical:4, paddingHorizontal:12, borderRadius:14 },
  heroTagTxt:  { color:'#fff', fontSize:12, fontWeight:'800' },
  heroTime:    { flexDirection:'row', alignItems:'center', gap:4, backgroundColor:'rgba(255,255,255,0.15)', paddingVertical:4, paddingHorizontal:10, borderRadius:14 },
  heroTimeTxt: { color:'rgba(255,255,255,0.9)', fontSize:12, fontWeight:'600' },
  heroTitle:   { color:'#fff', fontSize:22, fontWeight:'900', lineHeight:30, letterSpacing:0.2 },
  heroSummary: { color:'rgba(255,255,255,0.88)', fontSize:14, marginTop:10, lineHeight:22 },

  content: { padding:16, gap:14 },

  section:   { borderRadius:18, borderWidth:1.5, padding:16, elevation:2, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.06, shadowRadius:6 },
  secHeader: { flexDirection:'row', alignItems:'center', gap:12, marginBottom:12 },
  secNum:    { width:30, height:30, borderRadius:9, justifyContent:'center', alignItems:'center', flexShrink:0 },
  secNumTxt: { color:'#fff', fontSize:14, fontWeight:'900' },
  secTitle:  { flex:1, fontSize:15, fontWeight:'800', lineHeight:22 },
  secBody:   { fontSize:14, lineHeight:23 },

  bullets:   { gap:10, marginTop:4 },
  bulletRow: { flexDirection:'row', alignItems:'flex-start', gap:10 },
  bulletDot: { width:8, height:8, borderRadius:4, marginTop:7, flexShrink:0 },
  bulletTxt: { flex:1, fontSize:14, lineHeight:22 },

  footer:     { flexDirection:'row', alignItems:'center', gap:12, padding:14, borderRadius:16, borderWidth:1 },
  footerIcon: { width:38, height:38, borderRadius:11, justifyContent:'center', alignItems:'center', flexShrink:0 },
  footerTitle:{ fontSize:15, fontWeight:'900' },
  footerSub:  { fontSize:12, marginTop:2 },

  backBtnBottom: { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, paddingVertical:14 },
  backBtnTxt:    { color:'#fff', fontWeight:'800', fontSize:14 },
});
