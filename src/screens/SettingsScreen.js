import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  View, StyleSheet, ScrollView, Alert, TouchableOpacity,
  Image, Platform, Dimensions, Animated,
} from 'react-native';
import { TextInput, Snackbar, useTheme, Portal, Dialog, Button, Switch, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { ThemeContext, CoresPadrao } from '../context/ThemeContext';
import { UserPreferencesContext } from '../context/UserPreferencesContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

/* ── nomes dos idiomas ── */
const LANG_NAMES = { 'pt-BR': 'Português (Brasil)', en: 'English', es: 'Español' };
const LANG_FLAGS = { 'pt-BR': '🇧🇷', en: '🇺🇸', es: '🇪🇸' };

/* ── tamanhos de fonte ── */
const FONT_SIZE_ICONS = { small: 'format-font-size-decrease', medium: 'format-size', large: 'format-font-size-increase' };

/* ── paleta de cores ── */
const COLOR_HEX = [
  { color: CoresPadrao.azulMarinho,    key: 'navyBlue' },
  { color: CoresPadrao.azulAcinzentado,key: 'grayishBlue' },
  { color: '#059669',                  key: 'green' },
  { color: '#DC2626',                  key: 'red' },
  { color: '#D97706',                  key: 'amber' },
  { color: '#7C3AED',                  key: 'purple' },
  { color: '#BE185D',                  key: 'pink' },
  { color: '#0891B2',                  key: 'cyan' },
];

/* ─────────── sub-componentes ─────────── */
function SectionCard({ icon, title, subtitle, color, gradient, children, theme, delay = 0 }) {
  return (
    <Animatable.View animation="fadeInUp" duration={450} delay={delay} style={[sc.card, { backgroundColor: theme.colors.surface, borderColor: color + '25' }]}>
      <View style={sc.header}>
        <LinearGradient colors={gradient} style={sc.iconBox}>
          <MaterialCommunityIcons name={icon} size={20} color="#fff" />
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Text style={[sc.title, { color: theme.colors.onSurface }]}>{title}</Text>
          {subtitle ? <Text style={[sc.sub, { color: theme.colors.onSurfaceVariant }]}>{subtitle}</Text> : null}
        </View>
      </View>
      <View style={sc.body}>{children}</View>
    </Animatable.View>
  );
}

function OptionRow({ icon, label, value, onPress, theme, color, last }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={[or.row, !last && { borderBottomWidth: 1, borderBottomColor: theme.colors.outlineVariant }]}>
      {icon && <MaterialCommunityIcons name={icon} size={18} color={color || theme.colors.onSurfaceVariant} style={{ marginRight: 10 }} />}
      <Text style={[or.label, { color: theme.colors.onSurface }]}>{label}</Text>
      {value !== undefined && <Text style={[or.val, { color: color || theme.colors.primary }]}>{value}</Text>}
      <MaterialCommunityIcons name="chevron-right" size={18} color={theme.colors.onSurfaceVariant} />
    </TouchableOpacity>
  );
}

/* ─────────── TELA PRINCIPAL ─────────── */
export default function SettingsScreen({ navigation }) {
  const theme = useTheme();
  const { toggleTheme, setPrimaryColor, isDarkTheme } = useContext(ThemeContext);
  const { language, fontSize, profile, updatePreferences, t, triggerWelcomeScreen } = useContext(UserPreferencesContext);

  const [localProfile, setLocalProfile] = useState(profile || {});
  const [snackMsg, setSnackMsg]         = useState('');
  const [snackVisible, setSnackVisible] = useState(false);
  const [resetDialog, setResetDialog]   = useState(false);
  const [langSheet, setLangSheet]       = useState(false);
  const [fontSheet, setFontSheet]       = useState(false);

  // Paleta com labels traduzidos dinamicamente
  const COLOR_PALETTE = COLOR_HEX.map(c => ({ ...c, label: t(c.key) || c.key }));

  useEffect(() => { setLocalProfile(profile || {}); }, [profile]);

  const showSnack = (msg) => { setSnackMsg(msg); setSnackVisible(true); };

  const salvar = () => {
    updatePreferences({ profile: localProfile });
    showSnack(t('profileSaved') || 'Perfil salvo!');
  };

  const pickGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert(t('permissionNeeded'), t('permissionGallery')); return; }
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1,1], quality: 0.8 });
    if (!r.canceled) setLocalProfile(p => ({ ...p, foto: r.assets[0].uri }));
  };

  const pickCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert(t('permissionNeeded'), t('permissionCamera')); return; }
    const r = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1,1], quality: 0.8 });
    if (!r.canceled) setLocalProfile(p => ({ ...p, foto: r.assets[0].uri }));
  };

  const confirmReset = async () => {
    setResetDialog(false);
    await AsyncStorage.multiRemove(['curriculos','profile','language','fontSize','hasSeenWelcome']);
    triggerWelcomeScreen();
  };

  const FONT_LABELS = {
    small:  t('small')  || 'Pequeno',
    medium: t('medium') || 'Médio',
    large:  t('large')  || 'Grande',
  };

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ══ HERO ══ */}
        <Animatable.View animation="fadeInDown" duration={500}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            start={{ x:0,y:0 }} end={{ x:1,y:1 }}
            style={s.hero}
          >
            <View style={s.hb1} /><View style={s.hb2} />

            {/* avatar */}
            <View style={s.avatarWrap}>
              {localProfile?.foto ? (
                <Image source={{ uri: localProfile.foto }} style={s.avatarImg} />
              ) : (
                <View style={s.avatarEmpty}>
                  <MaterialCommunityIcons name="account" size={40} color="rgba(255,255,255,0.85)" />
                </View>
              )}
              <TouchableOpacity style={s.avatarBadge} onPress={pickGallery}>
                <MaterialCommunityIcons name="camera-plus" size={14} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={s.heroName}>{localProfile?.nome || t('user') || 'Seu nome'}</Text>
            <Text style={s.heroRole}>{localProfile?.profissao || t('profile') || 'Perfil'}</Text>
          </LinearGradient>
        </Animatable.View>

        <View style={{ padding: 16, gap: 16 }}>

          {/* ══ PERFIL ══ */}
          <SectionCard
            icon="account-edit" title={t('profile') || 'Perfil'} subtitle={t('editInfo') || 'Edite suas informações'}
            color="#4F46E5" gradient={['#4F46E5','#818CF8']} theme={theme} delay={100}
          >
            <TextInput
              label={t('name') || 'Nome'}
              value={localProfile?.nome || ''}
              onChangeText={v => setLocalProfile(p => ({ ...p, nome: v }))}
              mode="outlined" style={fi.input} left={<TextInput.Icon icon="account-outline" />}
            />
            <TextInput
              label={t('profession') || 'Profissão'}
              value={localProfile?.profissao || ''}
              onChangeText={v => setLocalProfile(p => ({ ...p, profissao: v }))}
              mode="outlined" style={fi.input} left={<TextInput.Icon icon="briefcase-outline" />}
            />
            <TextInput
              label={t('email') || 'E-mail'}
              value={localProfile?.email || ''}
              onChangeText={v => setLocalProfile(p => ({ ...p, email: v }))}
              mode="outlined" style={fi.input} keyboardType="email-address"
              left={<TextInput.Icon icon="email-outline" />}
            />

            {/* foto buttons */}
            <View style={{ flexDirection:'row', gap:10 }}>
              <TouchableOpacity style={[fi.photoBtn, { borderColor: '#4F46E5', backgroundColor: '#4F46E508', flex: 1 }]} onPress={pickGallery} activeOpacity={0.8}>
                <MaterialCommunityIcons name="image-outline" size={16} color="#4F46E5" />
                <Text style={[fi.photoBtnTxt, { color: '#4F46E5' }]}>{t('gallery') || 'Galeria'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[fi.photoBtn, { borderColor: '#4F46E5', backgroundColor: '#4F46E508', flex: 1 }]} onPress={pickCamera} activeOpacity={0.8}>
                <MaterialCommunityIcons name="camera-outline" size={16} color="#4F46E5" />
                <Text style={[fi.photoBtnTxt, { color: '#4F46E5' }]}>{t('camera') || 'Câmera'}</Text>
              </TouchableOpacity>
            </View>

            {/* salvar */}
            <TouchableOpacity onPress={salvar} activeOpacity={0.88} style={{ borderRadius: 16, overflow: 'hidden' }}>
              <LinearGradient colors={['#4F46E5','#818CF8']} start={{ x:0,y:0 }} end={{ x:1,y:0 }} style={fi.saveBtn}>
                <MaterialCommunityIcons name="content-save-check" size={18} color="#fff" />
                <Text style={fi.saveBtnTxt}>{t('saveProfile') || 'Salvar Perfil'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </SectionCard>

          {/* ══ APARÊNCIA ══ */}
          <SectionCard
            icon="palette" title={t('appearance') || 'Aparência'} subtitle={t('themeAndColors') || 'Tema e cores'}
            color="#059669" gradient={['#059669','#34D399']} theme={theme} delay={180}
          >
            {/* dark mode toggle */}
            <TouchableOpacity
              onPress={toggleTheme} activeOpacity={0.8}
              style={[ap.row, { backgroundColor: isDarkTheme ? '#05966912' : theme.colors.surfaceVariant, borderColor: isDarkTheme ? '#059669' : theme.colors.outlineVariant }]}
            >
              <View style={[ap.iconBox, { backgroundColor: isDarkTheme ? '#059669' : theme.colors.outline }]}>
                <MaterialCommunityIcons name={isDarkTheme ? 'weather-night' : 'white-balance-sunny'} size={18} color="#fff" />
              </View>
              <Text style={[ap.rowLabel, { color: theme.colors.onSurface }]}>{t('darkTheme') || 'Tema Escuro'}</Text>
              <Switch value={isDarkTheme} onValueChange={toggleTheme} color="#059669" />
            </TouchableOpacity>

            {/* paleta de cores */}
            <Text style={[ap.colorLabel, { color: theme.colors.onSurfaceVariant }]}>
              {t('highlightColor') || 'Cor de destaque'}
            </Text>
            <View style={ap.palette}>
              {COLOR_PALETTE.map(({ color, label }) => {
                const active = theme.colors.primary === color;
                return (
                  <TouchableOpacity key={color} onPress={() => setPrimaryColor(color)} activeOpacity={0.85} style={{ alignItems: 'center', gap: 4 }}>
                    <View style={[ap.colorBtn, { backgroundColor: color, borderWidth: active ? 3 : 0, borderColor: '#fff', elevation: active ? 6 : 2 }]}>
                      {active && <MaterialCommunityIcons name="check" size={16} color="#fff" />}
                    </View>
                    <Text style={[ap.colorName, { color: active ? color : theme.colors.onSurfaceVariant }]}>{label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </SectionCard>

          {/* ══ PREFERÊNCIAS ══ */}
          <SectionCard
            icon="tune" title={t('preferences') || 'Preferências'} subtitle={`${t('language') || 'Idioma'} & ${t('fontSize') || 'Fonte'}`}
            color="#D97706" gradient={['#D97706','#FCD34D']} theme={theme} delay={260}
          >
            {/* idioma */}
            <TouchableOpacity
              onPress={() => setLangSheet(true)} activeOpacity={0.8}
              style={[pr.row, { borderColor: theme.colors.outlineVariant }]}
            >
              <View style={[pr.iconBox, { backgroundColor: '#D97706' }]}>
                <MaterialCommunityIcons name="translate" size={16} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[pr.rowLabel, { color: theme.colors.onSurface }]}>{t('language') || 'Idioma'}</Text>
                <Text style={[pr.rowVal, { color: '#D97706' }]}>{`${LANG_FLAGS[language] || ''} ${LANG_NAMES[language] || language}`}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
            </TouchableOpacity>

            {/* tamanho da fonte */}
            <TouchableOpacity
              onPress={() => setFontSheet(true)} activeOpacity={0.8}
              style={[pr.row, { borderColor: theme.colors.outlineVariant, marginTop: 10 }]}
            >
              <View style={[pr.iconBox, { backgroundColor: '#D97706' }]}>
                <MaterialCommunityIcons name={FONT_SIZE_ICONS[fontSize] || 'format-size'} size={16} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[pr.rowLabel, { color: theme.colors.onSurface }]}>{t('fontSize') || 'Tamanho da Fonte'}</Text>
                <Text style={[pr.rowVal, { color: '#D97706' }]}>{FONT_LABELS[fontSize] || fontSize}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
            </TouchableOpacity>
          </SectionCard>

          {/* ══ ZONA DE PERIGO ══ */}
          <SectionCard
            icon="alert-circle" title={t('resetAccountTitle') || 'Resetar Conta'} subtitle={t('resetAccountSubtitle') || 'Apaga todos os dados permanentemente'}
            color="#EF4444" gradient={['#EF4444','#FCA5A5']} theme={theme} delay={340}
          >
            <View style={[dz.box, { backgroundColor: '#EF444410', borderColor: '#EF444430' }]}>
              <MaterialCommunityIcons name="information-outline" size={16} color="#EF4444" />
              <Text style={dz.boxTxt}>{t('resetAccountMessage') || 'Todos os currículos e preferências serão apagados.'}</Text>
            </View>
            <TouchableOpacity onPress={() => setResetDialog(true)} activeOpacity={0.88} style={[dz.btn, { backgroundColor: '#EF444415', borderColor: '#EF4444' }]}>
              <MaterialCommunityIcons name="delete-forever-outline" size={18} color="#EF4444" />
              <Text style={[dz.btnTxt, { color: '#EF4444' }]}>{t('resetAccountTitle') || 'Resetar Conta'}</Text>
            </TouchableOpacity>
          </SectionCard>

        </View>
      </ScrollView>

      {/* ══ SHEET IDIOMA ══ */}
      <Portal>
        <Dialog visible={langSheet} onDismiss={() => setLangSheet(false)} style={{ borderRadius: 24 }}>
          <Dialog.Title>{t('language') || 'Idioma'}</Dialog.Title>
          <Dialog.Content style={{ gap: 8, paddingTop: 8 }}>
            {[['pt-BR','🇧🇷','Português (Brasil)'],['en','🇺🇸','English'],['es','🇪🇸','Español']].map(([code, flag, name]) => {
              const active = language === code;
              return (
                <TouchableOpacity
                  key={code}
                  onPress={() => { updatePreferences({ language: code }); setLangSheet(false); }}
                  activeOpacity={0.8}
                  style={[sh.option, { backgroundColor: active ? theme.colors.primary + '15' : theme.colors.surfaceVariant, borderColor: active ? theme.colors.primary : 'transparent', borderWidth: active ? 1.5 : 0 }]}
                >
                  <Text style={sh.flag}>{flag}</Text>
                  <Text style={[sh.optionTxt, { color: theme.colors.onSurface, fontWeight: active ? '800' : '500' }]}>{name}</Text>
                  {active && <MaterialCommunityIcons name="check-circle" size={18} color={theme.colors.primary} />}
                </TouchableOpacity>
              );
            })}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setLangSheet(false)}>{t('cancel') || 'Fechar'}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* ══ SHEET FONTE ══ */}
      <Portal>
        <Dialog visible={fontSheet} onDismiss={() => setFontSheet(false)} style={{ borderRadius: 24 }}>
          <Dialog.Title>{t('fontSize') || 'Tamanho da Fonte'}</Dialog.Title>
          <Dialog.Content style={{ gap: 8, paddingTop: 8 }}>
            {[['small', FONT_SIZE_ICONS.small],['medium', FONT_SIZE_ICONS.medium],['large', FONT_SIZE_ICONS.large]].map(([size, icon]) => {
              const active = fontSize === size;
              return (
                <TouchableOpacity
                  key={size}
                  onPress={() => { updatePreferences({ fontSize: size }); setFontSheet(false); }}
                  activeOpacity={0.8}
                  style={[sh.option, { backgroundColor: active ? theme.colors.primary + '15' : theme.colors.surfaceVariant, borderColor: active ? theme.colors.primary : 'transparent', borderWidth: active ? 1.5 : 0 }]}
                >
                  <MaterialCommunityIcons name={icon} size={20} color={active ? theme.colors.primary : theme.colors.onSurfaceVariant} />
                  <Text style={[sh.optionTxt, { color: theme.colors.onSurface, fontWeight: active ? '800' : '500' }]}>{FONT_LABELS[size]}</Text>
                  {active && <MaterialCommunityIcons name="check-circle" size={18} color={theme.colors.primary} />}
                </TouchableOpacity>
              );
            })}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setFontSheet(false)}>{t('cancel') || 'Fechar'}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* ══ DIALOG RESET ══ */}
      <Portal>
        <Dialog visible={resetDialog} onDismiss={() => setResetDialog(false)} style={{ borderRadius: 24 }}>
          <Dialog.Icon icon="alert" size={52} color="#EF4444" />
          <Dialog.Title style={{ textAlign:'center' }}>{t('resetAccountTitle') || 'Resetar Conta'}</Dialog.Title>
          <Dialog.Content>
            <Text style={{ textAlign:'center', color: '#EF4444', lineHeight: 22 }}>{t('resetAccountMessage') || 'Todos os dados serão apagados.'}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setResetDialog(false)}>{t('cancel') || 'Cancelar'}</Button>
            <Button onPress={confirmReset} textColor="#EF4444">{t('delete') || 'Resetar'}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar visible={snackVisible} onDismiss={() => setSnackVisible(false)} duration={2200} action={{ label:'OK', onPress: () => setSnackVisible(false) }}>
        {snackMsg || ''}
      </Snackbar>
    </>
  );
}

/* ─── styles ─── */
const s = StyleSheet.create({
  hero:       { paddingTop: Platform.OS === 'ios' ? 54 : 44, paddingBottom: 32, alignItems: 'center', overflow: 'hidden' },
  hb1:        { position:'absolute', width:200, height:200, borderRadius:100, backgroundColor:'rgba(255,255,255,0.07)', top:-70, right:-50 },
  hb2:        { position:'absolute', width:80,  height:80,  borderRadius:40,  backgroundColor:'rgba(255,255,255,0.07)', bottom:-10, left:10 },
  avatarWrap: { position:'relative', marginBottom:12 },
  avatarImg:  { width:90, height:90, borderRadius:26, borderWidth:3, borderColor:'rgba(255,255,255,0.9)' },
  avatarEmpty:{ width:90, height:90, borderRadius:26, backgroundColor:'rgba(255,255,255,0.2)', justifyContent:'center', alignItems:'center', borderWidth:2, borderColor:'rgba(255,255,255,0.35)' },
  avatarBadge:{ position:'absolute', bottom:-4, right:-4, width:28, height:28, borderRadius:9, backgroundColor:'rgba(0,0,0,0.45)', justifyContent:'center', alignItems:'center', borderWidth:2, borderColor:'#fff' },
  heroName:   { color:'#fff', fontSize:20, fontWeight:'900', letterSpacing:0.2 },
  heroRole:   { color:'rgba(255,255,255,0.8)', fontSize:14, marginTop:3 },
});

const sc = StyleSheet.create({
  card:   { borderRadius:20, borderWidth:1.5, overflow:'hidden', elevation:3, shadowColor:'#000', shadowOffset:{width:0,height:3}, shadowOpacity:0.07, shadowRadius:8 },
  header: { flexDirection:'row', alignItems:'center', gap:12, padding:16, paddingBottom:0 },
  iconBox:{ width:42, height:42, borderRadius:13, justifyContent:'center', alignItems:'center', flexShrink:0 },
  title:  { fontSize:16, fontWeight:'800' },
  sub:    { fontSize:12, marginTop:2 },
  body:   { padding:16, gap:12 },
});

const or = StyleSheet.create({
  row:   { flexDirection:'row', alignItems:'center', paddingVertical:12 },
  label: { flex:1, fontSize:14 },
  val:   { fontSize:13, fontWeight:'700', marginRight:4 },
});

const fi = StyleSheet.create({
  input:    { backgroundColor:'transparent' },
  photoBtn: { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:7, paddingVertical:11, borderRadius:14, borderWidth:1.5 },
  photoBtnTxt: { fontSize:13, fontWeight:'700' },
  saveBtn:  { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, paddingVertical:14 },
  saveBtnTxt:{ color:'#fff', fontWeight:'900', fontSize:15 },
});

const ap = StyleSheet.create({
  row:       { flexDirection:'row', alignItems:'center', gap:12, padding:14, borderRadius:16, borderWidth:1.5 },
  iconBox:   { width:36, height:36, borderRadius:10, justifyContent:'center', alignItems:'center', flexShrink:0 },
  rowLabel:  { flex:1, fontSize:14, fontWeight:'600' },
  colorLabel:{ fontSize:13, fontWeight:'700', marginTop:4, marginBottom:12 },
  palette:   { flexDirection:'row', flexWrap:'wrap', gap:12 },
  colorBtn:  { width:44, height:44, borderRadius:14, justifyContent:'center', alignItems:'center', elevation:2 },
  colorName: { fontSize:10, fontWeight:'600', textAlign:'center', maxWidth:52 },
});

const pr = StyleSheet.create({
  row:     { flexDirection:'row', alignItems:'center', gap:12, padding:14, borderRadius:16, borderWidth:1 },
  iconBox: { width:34, height:34, borderRadius:10, justifyContent:'center', alignItems:'center', flexShrink:0 },
  rowLabel:{ fontSize:14, fontWeight:'600' },
  rowVal:  { fontSize:12, fontWeight:'700', marginTop:2 },
});

const dz = StyleSheet.create({
  box:    { flexDirection:'row', alignItems:'flex-start', gap:8, padding:12, borderRadius:12, borderWidth:1 },
  boxTxt: { flex:1, fontSize:13, lineHeight:20, color:'#EF4444' },
  btn:    { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, paddingVertical:13, borderRadius:14, borderWidth:1.5 },
  btnTxt: { fontSize:14, fontWeight:'800' },
});

const sh = StyleSheet.create({
  option:    { flexDirection:'row', alignItems:'center', gap:12, padding:14, borderRadius:14 },
  flag:      { fontSize:22 },
  optionTxt: { flex:1, fontSize:15 },
});
