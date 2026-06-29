import React, { useState, useCallback, useContext, useRef, useEffect } from 'react';
import {
  StyleSheet, View, Alert, FlatList, TouchableOpacity,
  Dimensions, Animated, Easing,
} from 'react-native';
import { Text, useTheme, Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { UserPreferencesContext } from '../context/UserPreferencesContext';
import { curriculosExemplo } from '../utils/exemplosCurriculos';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const CARD_COLORS = [
  ['#4F46E5', '#818CF8'],
  ['#059669', '#34D399'],
  ['#DC2626', '#FB7185'],
  ['#D97706', '#FCD34D'],
  ['#7C3AED', '#C4B5FD'],
  ['#0891B2', '#67E8F9'],
];

function getInitials(name) {
  if (!name) return '?';
  const p = name.trim().split(' ');
  return p.length === 1 ? p[0][0].toUpperCase() : (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

/* ── Bolinha flutuante animada ── */
function FloatingDot({ size, color, startX, startY, duration, delay }) {
  const y = useRef(new Animated.Value(0)).current;
  const op = useRef(new Animated.Value(0.18)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(y, { toValue: -22, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(op, { toValue: 0.45, duration: duration / 2, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(y, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(op, { toValue: 0.18, duration: duration / 2, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: startX, top: startY,
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: color,
        opacity: op,
        transform: [{ translateY: y }],
      }}
    />
  );
}

/* ── Ilustração centralizada na tela vazia ── */
function EmptyIllustration({ color }) {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.07, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: pulse }], alignItems: 'center', justifyContent: 'center' }}>
      {/* anel externo */}
      <View style={{ width: 140, height: 140, borderRadius: 70, backgroundColor: color + '14', justifyContent: 'center', alignItems: 'center' }}>
        {/* anel interno */}
        <View style={{ width: 104, height: 104, borderRadius: 52, backgroundColor: color + '22', justifyContent: 'center', alignItems: 'center' }}>
          <LinearGradient
            colors={[color, color + 'BB']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ width: 76, height: 76, borderRadius: 24, justifyContent: 'center', alignItems: 'center' }}
          >
            <MaterialCommunityIcons name="file-document-multiple-outline" size={38} color="#fff" />
          </LinearGradient>
        </View>
      </View>
    </Animated.View>
  );
}

export default function ListaCurriculos({ navigation }) {
  const theme = useTheme();
  const { t } = useContext(UserPreferencesContext);

  const [curriculos, setCurriculos]     = useState([]);
  const [snackbarVisible, setSnackbar]  = useState(false);

  useFocusEffect(useCallback(() => { carregar(); }, []));

  const carregar = async () => {
    const data = await AsyncStorage.getItem('curriculos');
    setCurriculos(data ? JSON.parse(data) : []);
  };

  const carregarExemplos = async () => {
    await AsyncStorage.setItem('curriculos', JSON.stringify(curriculosExemplo));
    carregar();
  };

  const excluir = (index) => {
    Alert.alert(t('deleteResumeTitle'), t('deleteResumeConfirm'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'), style: 'destructive',
        onPress: async () => {
          const novos = curriculos.filter((_, i) => i !== index);
          setCurriculos(novos);
          await AsyncStorage.setItem('curriculos', JSON.stringify(novos));
          setSnackbar(true);
        },
      },
    ]);
  };

  const fmtDate = (ds) => {
    if (!ds) return '—';
    return new Date(ds).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  /* ── TELA VAZIA ── */
  if (curriculos.length === 0) {
    const c = theme.colors.primary;
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        {/* bolhas de fundo */}
        <FloatingDot size={90}  color={c} startX={-20}       startY={60}         duration={3200} delay={0}    />
        <FloatingDot size={55}  color={c} startX={width-60}  startY={140}        duration={2800} delay={400}  />
        <FloatingDot size={36}  color={c} startX={width*0.4} startY={300}        duration={3600} delay={900}  />
        <FloatingDot size={24}  color={c} startX={30}        startY={400}        duration={2600} delay={1200} />

        {/* conteúdo */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
          <Animatable.View animation="zoomIn" duration={700} delay={100}>
            <EmptyIllustration color={c} />
          </Animatable.View>

          <Animatable.View animation="fadeInUp" duration={600} delay={300} style={{ alignItems: 'center', marginTop: 32 }}>
            <Text style={{ fontSize: 24, fontWeight: '900', color: theme.colors.onSurface, textAlign: 'center', letterSpacing: 0.2 }}>
              {t('noResumesYet')}
            </Text>
            <Text style={{ fontSize: 15, color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 10, lineHeight: 22 }}>
              {'Crie seu primeiro currículo\ne destaque-se no mercado!'}
            </Text>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" duration={600} delay={500} style={{ width: '100%', gap: 12, marginTop: 36 }}>
            {/* botão criar */}
            <TouchableOpacity
              onPress={() => navigation.navigate('CriarCurrículo')}
              activeOpacity={0.88}
              style={{ borderRadius: 28, overflow: 'hidden', elevation: 8, shadowColor: c, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12 }}
            >
              <LinearGradient
                colors={[c, theme.colors.secondary]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 17 }}
              >
                <MaterialCommunityIcons name="plus-circle" size={22} color="#fff" />
                <Text style={{ color: '#fff', fontWeight: '900', fontSize: 16 }}>{t('createResume')}</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* botão exemplos */}
            <TouchableOpacity
              onPress={carregarExemplos}
              activeOpacity={0.8}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 28, borderWidth: 1.5, borderColor: c + '55', backgroundColor: c + '0D' }}
            >
              <MaterialCommunityIcons name="lightbulb-on-outline" size={18} color={c} />
              <Text style={{ color: c, fontWeight: '700', fontSize: 14 }}>Carregar exemplos</Text>
            </TouchableOpacity>
          </Animatable.View>

          {/* chips de dicas */}
          <Animatable.View animation="fadeInUp" duration={600} delay={700} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 32 }}>
            {['Modelos profissionais', 'Export PDF', 'Múltiplos idiomas'].map((tip, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: c + '12', borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderColor: c + '22' }}>
                <MaterialCommunityIcons name={['star-four-points', 'file-pdf-box', 'translate'][i]} size={13} color={c} />
                <Text style={{ fontSize: 12, fontWeight: '600', color: c }}>{tip}</Text>
              </View>
            ))}
          </Animatable.View>
        </View>

        <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbar(false)} duration={2000}>
          {t('deleteSuccess')}
        </Snackbar>
      </View>
    );
  }

  /* ── LISTA COM CURRÍCULOS ── */
  const renderItem = ({ item: cur, index }) => {
    const [c1, c2] = CARD_COLORS[index % CARD_COLORS.length];
    const initials  = getInitials(cur.nomeInterno || `C${index + 1}`);
    const nome      = cur.nomeInterno || `Currículo ${index + 1}`;
    const profissao = cur.dadosPessoais?.nome || '';
    const completude = calcCompletude(cur);

    return (
      <Animatable.View animation="fadeInUp" duration={500} delay={index * 70}>
        <View style={[s.card, { backgroundColor: theme.colors.surface, borderColor: c1 + '25' }]}>
          {/* faixa colorida lateral */}
          <LinearGradient colors={[c1, c2]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={s.cardStripe} />

          {/* avatar */}
          <View style={s.cardBody}>
            <View style={s.cardTop}>
              {cur.fotoBase64 ? (
                <View style={[s.avatar, { borderColor: c1 }]}>
                  <Animatable.Image animation="fadeIn" source={{ uri: cur.fotoBase64 }} style={s.avatarImg} />
                </View>
              ) : (
                <LinearGradient colors={[c1, c2]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.avatarGrad}>
                  <Text style={s.avatarInitials}>{initials}</Text>
                </LinearGradient>
              )}

              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={[s.cardName, { color: theme.colors.onSurface }]} numberOfLines={1}>{nome}</Text>
                {profissao ? <Text style={[s.cardSub, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>{profissao}</Text> : null}
                <Text style={[s.cardDate, { color: theme.colors.onSurfaceVariant }]}>
                  {`${t('updatedOn')} ${fmtDate(cur.lastUpdated)}`}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => excluir(index)}
                style={[s.deleteBtn, { backgroundColor: theme.colors.errorContainer || '#FFEBEE' }]}
              >
                <MaterialCommunityIcons name="delete-outline" size={17} color={theme.colors.error} />
              </TouchableOpacity>
            </View>

            {/* barra de completude */}
            <View style={s.progressRow}>
              <View style={[s.progressTrack, { backgroundColor: theme.colors.outlineVariant }]}>
                <LinearGradient
                  colors={[c1, c2]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[s.progressFill, { width: `${completude}%` }]}
                />
              </View>
              <Text style={[s.progressLabel, { color: c1 }]}>{`${completude}%`}</Text>
            </View>

            {/* botões */}
            <View style={[s.cardActions, { borderTopColor: theme.colors.outlineVariant }]}>
              <TouchableOpacity
                style={[s.actionBtn, { borderColor: c1 + '44', backgroundColor: c1 + '0D' }]}
                onPress={() => navigation.navigate('CriarCurrículo', { curriculo: cur, index })}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="pencil-outline" size={15} color={c1} />
                <Text style={[s.actionBtnText, { color: c1 }]}>{t('edit')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ flex: 1, borderRadius: 14, overflow: 'hidden' }}
                onPress={() => navigation.navigate('SelecionarTemplate', { curriculo: cur })}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={[c1, c2]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={s.actionBtnFilled}
                >
                  <MaterialCommunityIcons name="file-export-outline" size={15} color="#fff" />
                  <Text style={[s.actionBtnText, { color: '#fff' }]}>{t('exportAndView')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animatable.View>
    );
  };

  const ListHeader = () => (
    <Animatable.View animation="fadeInDown" duration={500} style={{ marginBottom: 20 }}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={s.header}
      >
        <View style={s.hb1} /><View style={s.hb2} />
        <Text style={s.headerTitle}>{t('myResumesTitle')}</Text>
        <Text style={s.headerCount}>{`${curriculos.length} ${t('resumes') || 'Currículos'}`}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('CriarCurrículo')}
          activeOpacity={0.85}
          style={s.headerBtn}
        >
          <MaterialCommunityIcons name="plus" size={16} color={theme.colors.primary} />
          <Text style={[s.headerBtnText, { color: theme.colors.primary }]}>{t('createResume')}</Text>
        </TouchableOpacity>
      </LinearGradient>
    </Animatable.View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <FlatList
        data={curriculos}
        renderItem={renderItem}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListHeaderComponent={<ListHeader />}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
      />
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbar(false)} duration={2500}>
        {t('deleteSuccess')}
      </Snackbar>
    </View>
  );
}

/* ── completude do currículo ── */
function calcCompletude(cur) {
  let filled = 0, total = 6;
  if (cur.dadosPessoais?.nome)            filled++;
  if (cur.dadosPessoais?.email)           filled++;
  if (cur.dadosPessoais?.telefone)        filled++;
  if (cur.resumoProfissional)             filled++;
  if ((cur.experiencias||[]).length > 0)  filled++;
  if ((cur.formacao||[]).length > 0)      filled++;
  return Math.round((filled / total) * 100);
}

/* ── styles ── */
const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1.5,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardStripe: { width: 5 },
  cardBody:   { flex: 1, padding: 16 },
  cardTop:    { flexDirection: 'row', alignItems: 'center' },

  avatar:         { width: 52, height: 52, borderRadius: 16, borderWidth: 2.5, overflow: 'hidden' },
  avatarImg:      { width: 52, height: 52 },
  avatarGrad:     { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  avatarInitials: { color: '#fff', fontSize: 20, fontWeight: '900' },

  cardName: { fontSize: 16, fontWeight: '800' },
  cardSub:  { fontSize: 12, marginTop: 2 },
  cardDate: { fontSize: 11, marginTop: 3, opacity: 0.7 },

  deleteBtn: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },

  progressRow:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  progressTrack:{ flex: 1, height: 5, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: 5, borderRadius: 3 },
  progressLabel:{ fontSize: 11, fontWeight: '800', minWidth: 32, textAlign: 'right' },

  cardActions: { flexDirection: 'row', gap: 10, marginTop: 14, paddingTop: 14, borderTopWidth: 1 },
  actionBtn:   { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 14, borderWidth: 1.5 },
  actionBtnFilled: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10 },
  actionBtnText:   { fontWeight: '700', fontSize: 13 },

  header: { borderRadius: 22, padding: 22, overflow: 'hidden', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.18, shadowRadius: 10 },
  hb1: { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.07)', top: -60, right: -40 },
  hb2: { position: 'absolute', width: 70,  height: 70,  borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.07)', bottom: -20, left: 20 },
  headerTitle:   { color: '#fff', fontSize: 22, fontWeight: '900' },
  headerCount:   { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4, marginBottom: 16 },
  headerBtn:     { flexDirection: 'row', alignItems: 'center', gap: 7, alignSelf: 'flex-start', backgroundColor: '#fff', borderRadius: 22, paddingVertical: 9, paddingHorizontal: 18, elevation: 2 },
  headerBtnText: { fontWeight: '800', fontSize: 13 },
});
