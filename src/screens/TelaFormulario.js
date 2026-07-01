import React, { useState, useContext, useCallback, useLayoutEffect, useRef } from 'react';
import {
  ScrollView, StyleSheet, View, TouchableOpacity, Image,
  Platform, Dimensions, Animated, Modal, FlatList, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { TextInput, Text, Divider, useTheme, Checkbox } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { UserPreferencesContext } from '../context/UserPreferencesContext';
import { translations } from '../i18n/translations';
import CustomDropDown from '../components/CustomDropDown';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height: screenHeight } = Dimensions.get('window');
const isSmall = screenHeight < 700; // ex: Galaxy A20, iPhone SE

/* ─── idiomas disponíveis para o currículo ─── */
const IDIOMAS_CURRICULO = [
  { value: 'pt-BR', label: 'PT', flag: '🇧🇷', nome: 'Português' },
  { value: 'en',    label: 'EN', flag: '🇺🇸', nome: 'English'   },
  { value: 'es',    label: 'ES', flag: '🇪🇸', nome: 'Español'   },
];

/* ─── estrutura ─── */
const ESTRUTURA_INICIAL = {
  nomeInterno: '',
  idiomaCurriculo: 'pt-BR',
  fotoUri: null, fotoBase64: null, lastUpdated: null,
  dadosPessoais: { nome:'', endereco:'', telefone:'', email:'', linkedin:'', site:'', estado:'', cidade:'', cnh:'' },
  resumoProfissional: '', objetivoProfissional: '',
  formacao:     [{ nivel:'', curso:'', instituicao:'', anoConclusao: null }],
  experiencias: [{ cargo:'', empresa:'', dataInicio:null, dataFim:null, atual:false, atividades:'' }],
  certificacoes:[{ nome:'', instituicao:'', anoConclusao:null }],
  hardSkills:   [{ habilidade:'' }],
  softSkills:   [{ habilidade:'' }],
  idiomas:      [{ idioma:'', nivel:'' }],
};

/* ─── tabs de seção ─── */
const TABS = [
  { key:'dadosPessoais', labelKey:'personalData',           icon:'account',        color:'#4F46E5' },
  { key:'resumo',        labelKey:'resumeSummary',          icon:'text-account',   color:'#059669' },
  { key:'formacao',      labelKey:'education',              icon:'school',         color:'#DC2626' },
  { key:'experiencias',  labelKey:'professionalExperience', icon:'briefcase',      color:'#D97706' },
  { key:'certificacoes', labelKey:'coursesCertifications',  icon:'certificate',    color:'#7C3AED' },
  { key:'competencias',  labelKey:'competencies',           icon:'star',           color:'#0891B2' },
  { key:'idiomas',       labelKey:'languages',              icon:'translate',      color:'#BE185D' },
];

export default function TelaFormulario({ navigation, route }) {
  const { t, language }  = useContext(UserPreferencesContext);
  const theme  = useTheme();
  const tabScrollRef = useRef(null);

  const [curriculo, setCurriculo]     = useState(ESTRUTURA_INICIAL);
  const [activeTab, setActiveTab]     = useState('dadosPessoais');
  const [showDatePicker, setShowDP]   = useState(false);
  const [dpField, setDpField]         = useState({ secao:'', index:0, campo:'' });
  const [modalImportar, setModalImportar] = useState(false);
  const [curriculosSalvos, setCurriculosSalvos] = useState([]);
  const [modalSalvar, setModalSalvar] = useState(false);

  const indexEdicao = route.params?.index ?? null;

  const abrirModalImportar = async () => {
    const raw = await AsyncStorage.getItem('curriculos');
    const list = raw ? JSON.parse(raw) : [];
    const validos = list.filter(c => c && !c._importado && c.dadosPessoais?.nome);
    setCurriculosSalvos(validos);
    setModalImportar(true);
  };

  const importarDados = (fonte) => {
    setCurriculo(prev => ({
      ...ESTRUTURA_INICIAL,
      ...fonte,
      nomeInterno: '',
      fotoUri: null,
      fotoBase64: null,
      lastUpdated: null,
    }));
    setModalImportar(false);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: indexEdicao !== null ? t('editResume') : t('createResume'),
      headerShown: false,            // usamos nosso próprio header
    });
  }, [navigation, indexEdicao, t]);

  const indexCarregado = useRef(undefined);

  useFocusEffect(useCallback(() => {
    const cur = route.params?.curriculo;
    const idx = route.params?.index ?? null;
    // Recarrega se: nunca carregou, ou se o índice do currículo mudou
    if (indexCarregado.current !== idx) {
      indexCarregado.current = idx;
      if (cur) {
        setCurriculo({ ...ESTRUTURA_INICIAL, ...cur });
      } else {
        setCurriculo({ ...ESTRUTURA_INICIAL, idiomaCurriculo: language || 'pt-BR' });
        setActiveTab('dadosPessoais');
      }
    }
  }, [route.params?.index, route.params?.curriculo]));

  /* helpers */
  const inp = (secao, campo, valor, index = null) =>
    setCurriculo(prev => {
      if (secao === null) return { ...prev, [campo]: valor };
      if (index !== null) {
        const l = JSON.parse(JSON.stringify(prev[secao] || []));
        l[index] = { ...l[index], [campo]: valor };
        return { ...prev, [secao]: l };
      }
      if (typeof prev[secao] === 'object' && prev[secao] !== null)
        return { ...prev, [secao]: { ...prev[secao], [campo]: valor } };
      return { ...prev, [secao]: valor };
    });

  const addItem = secao => {
    const blank = Object.keys(ESTRUTURA_INICIAL[secao][0]).reduce((a, k) => {
      a[k] = k.startsWith('data') ? null : k === 'atual' ? false : '';
      return a;
    }, {});
    setCurriculo(p => ({ ...p, [secao]: [...(p[secao] || []), blank] }));
  };

  const rmItem = (secao, i) =>
    setCurriculo(p => ({ ...p, [secao]: p[secao].filter((_, j) => j !== i) }));

  const openDP = (secao, index, campo) => { setDpField({ secao, index, campo }); setShowDP(true); };
  const onDP   = (_, d) => {
    setShowDP(Platform.OS === 'ios');
    if (d) inp(dpField.secao, dpField.campo, d.toISOString(), dpField.index);
  };
  const fmtDate = ds => {
    if (!ds) return '';
    const d = new Date(ds);
    return isNaN(d) ? '' : d.toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric' });
  };

  const [modalCamera, setModalCamera] = useState(false);

  const pickGallery = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing:true, aspect:[1,1], quality:0.5 });
    if (!r.canceled) setCurriculo(p => ({ ...p, fotoUri: r.assets[0].uri }));
  };
  const pickCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    const r = await ImagePicker.launchCameraAsync({ allowsEditing:true, aspect:[1,1], quality:0.5 });
    if (!r.canceled) setCurriculo(p => ({ ...p, fotoUri: r.assets[0].uri }));
  };

  const _persistir = async () => {
    const c = { ...curriculo, lastUpdated: new Date().toISOString() };
    if (curriculo.fotoUri?.startsWith('file://')) {
      const b64 = await FileSystem.readAsStringAsync(curriculo.fotoUri, { encoding: FileSystem.EncodingType.Base64 });
      c.fotoBase64 = `data:image/jpeg;base64,${b64}`;
    }
    const raw  = await AsyncStorage.getItem('curriculos');
    const list = raw ? JSON.parse(raw) : [];
    if (indexEdicao !== null) {
      list[indexEdicao] = c;
    } else {
      list.push(c);
    }
    await AsyncStorage.setItem('curriculos', JSON.stringify(list));
    return list.length - 1; // índice do salvo
  };

  const salvar = () => setModalSalvar(true);

  const salvarESair = async () => {
    try {
      await _persistir();
      setModalSalvar(false);
      navigation.navigate('MeusCurriculos');
    } catch(e) { console.error(e); }
  };

  const salvarEContinuar = async () => {
    try {
      const savedIdx = await _persistir();
      setModalSalvar(false);
      const newIdx = indexEdicao !== null ? indexEdicao : savedIdx;
      indexCarregado.current = newIdx;
      navigation.setParams({ index: newIdx, curriculo: undefined });
    } catch(e) { console.error(e); }
  };

  const mascaraTelefone = (v) => {
    const nums = v.replace(/\D/g, '').slice(0, 11);
    if (nums.length <= 10)
      return nums.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    return nums.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
  };

  /* tradução baseada no idioma do currículo (independente do app) */
  const tCurr = (key) => {
    if (!key) return '';
    const keys = key.split('.');
    let result = translations[curriculo.idiomaCurriculo] ?? translations['pt-BR'];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) return key;
    }
    return result || key;
  };

  const educLevels = Object.entries(tCurr('educationLevels')).map(([v,l]) => ({ label:l, value:v }));
  const stateList  = curriculo.idiomaCurriculo === 'pt-BR'
    ? Object.entries(tCurr('states')).map(([v,l]) => ({ label:l, value:v }))
    : [];
  const langLevels = Object.entries(tCurr('languageLevels')).map(([v,l]) => ({ label:l, value:v }));

  const s      = createStyles(theme);
  const curTab = TABS.find(tb => tb.key === activeTab) || TABS[0];

  /* ─── tab switch ─── */
  const switchTab = (key, i) => {
    setActiveTab(key);
    tabScrollRef.current?.scrollTo({ x: Math.max(0, i * 80 - width / 2 + 48), animated: true });
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      {showDatePicker && <DateTimePicker value={new Date()} mode="date" display="default" onChange={onDP} />}

      {/* ══════════ HEADER FIXO (padrão SelecionarTemplate) ══════════ */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        start={{ x:0, y:0 }} end={{ x:1, y:1 }}
        style={s.header}
      >
        <View style={[s.hb, s.hb1]} /><View style={[s.hb, s.hb2]} />

        {/* linha voltar + título + ícone foto */}
        <View style={s.headerRow}>
          <TouchableOpacity style={s.headerBackBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex:1, marginLeft:12 }}>
            <Text style={s.headerTitle}>
              {indexEdicao !== null ? t('editResume') : t('createResume')}
            </Text>
            <Text style={s.headerSub}>
              {indexEdicao !== null ? 'Edite as informações do currículo' : 'Preencha os dados do novo currículo'}
            </Text>
          </View>
          {/* foto clicável no lugar do ícone */}
          <TouchableOpacity onPress={pickGallery} activeOpacity={0.85} style={s.headerIconBox}>
            {curriculo.fotoUri
              ? <Image source={{ uri: curriculo.fotoUri }} style={s.headerPhoto} />
              : <MaterialCommunityIcons name="camera-account" size={24} color={theme.colors.primary} />
            }
            <View style={s.photoBadge}>
              <MaterialCommunityIcons name="camera-plus" size={9} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* linha 2: nome interno + botões */}
        <View style={s.headerBottom}>
          <View style={s.nameRow}>
            <MaterialCommunityIcons name="tag-outline" size={14} color="rgba(255,255,255,0.7)" />
            <TextInput
              value={curriculo.nomeInterno}
              onChangeText={v => inp(null, 'nomeInterno', v)}
              placeholder={t('internalResumeName')}
              placeholderTextColor="rgba(255,255,255,0.55)"
              style={s.nameInput}
              underlineColor="rgba(255,255,255,0.35)"
              activeUnderlineColor="#fff"
              textColor="#fff"
              mode="flat"
              dense
            />
          </View>

          {/* seletor de idioma do currículo */}
          <View style={s.langRow}>
            <MaterialCommunityIcons name="translate" size={13} color="rgba(255,255,255,0.7)" />
            <Text style={s.langRowLabel}>Idioma do currículo:</Text>
            {IDIOMAS_CURRICULO.map(lang => {
              const ativo = curriculo.idiomaCurriculo === lang.value;
              return (
                <TouchableOpacity
                  key={lang.value}
                  onPress={() => inp(null, 'idiomaCurriculo', lang.value)}
                  activeOpacity={0.75}
                  style={[s.langBtn, ativo && s.langBtnAtivo]}
                >
                  <Text style={s.langBtnFlag}>{lang.flag}</Text>
                  <Text style={[s.langBtnTxt, ativo && s.langBtnTxtAtivo]}>{lang.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={s.photoBtns}>
            <TouchableOpacity style={s.photoBtn} onPress={pickGallery}>
              <MaterialCommunityIcons name="image-outline" size={12} color="#fff" />
              <Text style={s.photoBtnTxt}>{t('gallery')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.photoBtn} onPress={pickCamera}>
              <MaterialCommunityIcons name="camera-outline" size={12} color="#fff" />
              <Text style={s.photoBtnTxt}>{t('camera')}</Text>
            </TouchableOpacity>
            {indexEdicao === null && (
              <TouchableOpacity style={s.importBtn} onPress={abrirModalImportar}>
                <MaterialCommunityIcons name="content-copy" size={12} color="#fff" />
                <Text style={s.importBtnTxt}>Copiar dados</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>

      {/* ══════════ MODAL IMPORTAR DADOS ══════════ */}
      <Modal
        visible={modalImportar}
        transparent
        animationType="slide"
        onRequestClose={() => setModalImportar(false)}
      >
        <View style={s.modalOverlay}>
          <View style={[s.modalBox, { backgroundColor: theme.colors.surface }]}>
            <View style={s.modalHeader}>
              <Text style={[s.modalTitle, { color: theme.colors.onSurface }]}>Usar dados de outro currículo</Text>
              <TouchableOpacity onPress={() => setModalImportar(false)}>
                <MaterialCommunityIcons name="close" size={22} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>
            <Text style={[s.modalSub, { color: theme.colors.onSurfaceVariant }]}>
              Selecione um currículo para copiar os dados. Você poderá editar tudo depois.
            </Text>
            {curriculosSalvos.length === 0 ? (
              <View style={s.modalEmpty}>
                <MaterialCommunityIcons name="file-document-outline" size={48} color={theme.colors.onSurfaceVariant} />
                <Text style={[s.modalEmptyTxt, { color: theme.colors.onSurfaceVariant }]}>Nenhum currículo salvo encontrado</Text>
              </View>
            ) : (
              <FlatList
                data={curriculosSalvos}
                keyExtractor={(_, i) => String(i)}
                style={{ maxHeight: 360 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[s.modalItem, { borderColor: theme.colors.outlineVariant }]}
                    onPress={() => importarDados(item)}
                    activeOpacity={0.75}
                  >
                    <View style={[s.modalItemIcon, { backgroundColor: theme.colors.primaryContainer }]}>
                      <MaterialCommunityIcons name="account-circle-outline" size={26} color={theme.colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[s.modalItemName, { color: theme.colors.onSurface }]} numberOfLines={1}>
                        {item.dadosPessoais?.nome || 'Sem nome'}
                      </Text>
                      <Text style={[s.modalItemSub, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
                        {item.nomeInterno || item.dadosPessoais?.email || ''}
                      </Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.primary} />
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* ══════════ MODAL SALVAR ══════════ */}
      <Modal visible={modalSalvar} transparent animationType="slide" onRequestClose={() => setModalSalvar(false)}>
        <View style={s.modalOverlay}>
          <View style={[s.modalBox, { backgroundColor: theme.colors.surface }]}>
            <View style={s.modalHeader}>
              <Text style={[s.modalTitle, { color: theme.colors.onSurface }]}>Salvar currículo</Text>
              <TouchableOpacity onPress={() => setModalSalvar(false)}>
                <MaterialCommunityIcons name="close" size={22} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>
            {(() => {
              const lang = IDIOMAS_CURRICULO.find(l => l.value === curriculo.idiomaCurriculo);
              return lang ? (
                <View style={[s.langBadge, { backgroundColor: theme.colors.primaryContainer }]}>
                  <Text style={s.langBadgeFlag}>{lang.flag}</Text>
                  <Text style={[s.langBadgeTxt, { color: theme.colors.primary }]}>
                    Currículo em {lang.nome}
                  </Text>
                </View>
              ) : null;
            })()}
            <Text style={[s.modalSub, { color: theme.colors.onSurfaceVariant }]}>
              O que deseja fazer após salvar?
            </Text>
            <TouchableOpacity
              style={[s.salvarOpcao, { borderColor: theme.colors.primary, backgroundColor: theme.colors.primaryContainer }]}
              onPress={salvarEContinuar}
            >
              <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={s.salvarOpcaoIcon}>
                <MaterialCommunityIcons name="pencil-outline" size={20} color="#fff" />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={[s.salvarOpcaoTitle, { color: theme.colors.primary }]}>Salvar e continuar editando</Text>
                <Text style={[s.salvarOpcaoSub, { color: theme.colors.onSurfaceVariant }]}>Salva e permanece nesta tela</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.salvarOpcao, { borderColor: theme.colors.outlineVariant, backgroundColor: theme.colors.surface, marginTop: 10 }]}
              onPress={salvarESair}
            >
              <View style={[s.salvarOpcaoIcon, { backgroundColor: theme.colors.surfaceVariant }]}>
                <MaterialCommunityIcons name="check-all" size={20} color={theme.colors.onSurfaceVariant} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.salvarOpcaoTitle, { color: theme.colors.onSurface }]}>Salvar e sair</Text>
                <Text style={[s.salvarOpcaoSub, { color: theme.colors.onSurfaceVariant }]}>Volta para Meus Currículos</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ══════════ TABS DE SEÇÃO ══════════ */}
      <View style={[s.tabsContainer, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.outlineVariant }]}>
        <ScrollView
          ref={tabScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.tabsScroll}
          bounces={false}
        >
          {TABS.map((tab, i) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => switchTab(tab.key, i)}
                activeOpacity={0.75}
                style={[s.tab, isActive && { borderBottomColor: tab.color, borderBottomWidth: 3 }]}
              >
                <View style={[s.tabIcon, { backgroundColor: isActive ? tab.color : theme.colors.surfaceVariant }]}>
                  <MaterialCommunityIcons name={tab.icon} size={16} color={isActive ? '#fff' : theme.colors.onSurfaceVariant} />
                </View>
                <Text style={[s.tabLabel, { color: isActive ? tab.color : theme.colors.onSurfaceVariant, fontWeight: isActive ? '800' : '500' }]}>
                  {tCurr(tab.labelKey)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ══════════ CONTEÚDO DA TAB ATIVA ══════════ */}
      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* indicador colorido da seção */}
        <Animatable.View key={activeTab} animation="fadeInUp" duration={300} style={[s.sectionBanner, { backgroundColor: curTab.color + '12', borderColor: curTab.color + '30' }]}>
          <View style={[s.sectionBannerIcon, { backgroundColor: curTab.color }]}>
            <MaterialCommunityIcons name={curTab.icon} size={18} color="#fff" />
          </View>
          <View style={{ flex:1 }}>
            <Text style={[s.sectionBannerTitle, { color: curTab.color }]} numberOfLines={1}>{tCurr(curTab.labelKey)}</Text>
            <Text style={[s.sectionBannerSub, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>
              {SECTION_DESC[activeTab] || ''}
            </Text>
          </View>
        </Animatable.View>

        {/* ── DADOS PESSOAIS ── */}
        {activeTab === 'dadosPessoais' && (
          <Animatable.View animation="fadeInUp" duration={350} style={s.fieldGroup}>
            <FieldCard icon="account-outline"     label={tCurr('name')}      placeholder={tCurr('placeholder_fullName')}  value={curriculo.dadosPessoais.nome}     onChangeText={v => inp('dadosPessoais','nome',v)}     theme={theme} s={s} />
            <FieldCard icon="email-outline"       label={tCurr('email')}     placeholder={tCurr('placeholder_email')}     value={curriculo.dadosPessoais.email}    onChangeText={v => inp('dadosPessoais','email',v)}    theme={theme} s={s} keyboardType="email-address" />
            <FieldCard icon="phone-outline"       label={tCurr('phone')}     placeholder={curriculo.idiomaCurriculo === 'pt-BR' ? '(00) 00000-0000' : tCurr('placeholder_phone')} value={curriculo.dadosPessoais.telefone} onChangeText={v => inp('dadosPessoais','telefone', curriculo.idiomaCurriculo === 'pt-BR' ? mascaraTelefone(v) : v)} theme={theme} s={s} keyboardType="phone-pad" />
            {curriculo.idiomaCurriculo === 'pt-BR' ? (
              <View style={[s.fieldWrap, { backgroundColor: theme.colors.surface }]}>
                <CustomDropDown label={tCurr('state')} value={curriculo.dadosPessoais.estado} setValue={v => inp('dadosPessoais','estado',v)} list={stateList} />
              </View>
            ) : (
              <FieldCard icon="map-marker-outline" label={tCurr('state')} placeholder={tCurr('placeholder_city')} value={curriculo.dadosPessoais.estado} onChangeText={v => inp('dadosPessoais','estado',v)} theme={theme} s={s} />
            )}
            <FieldCard icon="map-marker-outline"  label={tCurr('city')}      placeholder={tCurr('placeholder_city')}      value={curriculo.dadosPessoais.cidade}   onChangeText={v => inp('dadosPessoais','cidade',v)}   theme={theme} s={s} />
            <FieldCard icon="linkedin"            label={tCurr('linkedin')}  placeholder={tCurr('placeholder_linkedin')}  value={curriculo.dadosPessoais.linkedin} onChangeText={v => inp('dadosPessoais','linkedin',v)} theme={theme} s={s} />
            <FieldCard icon="web"                 label={tCurr('portfolio')} placeholder={tCurr('placeholder_portfolio')} value={curriculo.dadosPessoais.site}     onChangeText={v => inp('dadosPessoais','site',v)}     theme={theme} s={s} />

            {/* ── CNH ── */}
            <View style={[s.fieldWrap, { backgroundColor: theme.colors.surface, padding: 14, gap: 10 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <MaterialCommunityIcons name="car-outline" size={18} color={theme.colors.onSurfaceVariant} />
                <Text style={{ fontSize: 13, fontWeight: '700', color: theme.colors.onSurface }}>CNH</Text>
                <Text style={{ fontSize: 11, color: theme.colors.onSurfaceVariant }}>(opcional)</Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {['A','B','C','D','E','AB','AC','AD','AE'].map(cat => {
                  const sel = (curriculo.dadosPessoais.cnh || '').split(',').map(s => s.trim()).filter(Boolean);
                  const ativo = sel.includes(cat);
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => {
                        const next = ativo ? sel.filter(s => s !== cat) : [...sel, cat];
                        inp('dadosPessoais', 'cnh', next.join(', '));
                      }}
                      activeOpacity={0.75}
                      style={[s.cnhChip, ativo && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]}
                    >
                      <Text style={[s.cnhChipTxt, { color: ativo ? '#fff' : theme.colors.onSurface }]}>{cat}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {(curriculo.dadosPessoais.cnh || '') !== '' && (
                <Text style={{ fontSize: 12, color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                  Selecionado: <Text style={{ fontWeight: '700', color: theme.colors.primary }}>{curriculo.dadosPessoais.cnh}</Text>
                </Text>
              )}
            </View>
          </Animatable.View>
        )}

        {/* ── RESUMO ── */}
        {activeTab === 'resumo' && (
          <Animatable.View animation="fadeInUp" duration={350} style={s.fieldGroup}>
            <View style={[s.fieldWrap, { backgroundColor: theme.colors.surface }]}>
              <TextInput label={tCurr('summary')} placeholder={tCurr('placeholder_summary')} value={curriculo.resumoProfissional} onChangeText={v => inp('resumoProfissional',null,v)} mode="outlined" style={s.input} multiline numberOfLines={5} />
            </View>
            <View style={[s.fieldWrap, { backgroundColor: theme.colors.surface }]}>
              <TextInput label={tCurr('objective')} value={curriculo.objetivoProfissional} onChangeText={v => inp('objetivoProfissional',null,v)} mode="outlined" style={s.input} multiline numberOfLines={4} />
            </View>
            <TouchableOpacity
              style={[s.exBtn, { backgroundColor: '#059669' + '18', borderColor: '#059669' + '44' }]}
              onPress={() => navigation.navigate('ExemplosObjetivo', {
                onSelecionar: (frase) => setCurriculo(p => ({ ...p, objetivoProfissional: frase })),
              })}
              activeOpacity={0.8}
            >
              <LinearGradient colors={['#059669','#34D399']} style={s.exBtnIcon}>
                <MaterialCommunityIcons name="lightbulb-on" size={16} color="#fff" />
              </LinearGradient>
              <Text style={[s.exBtnText, { color:'#059669' }]}>{tCurr('getExamples')}</Text>
              <MaterialCommunityIcons name="chevron-right" size={18} color="#059669" />
            </TouchableOpacity>
          </Animatable.View>
        )}

        {/* ── FORMAÇÃO ── */}
        {activeTab === 'formacao' && (
          <Animatable.View animation="fadeInUp" duration={350} style={s.fieldGroup}>
            {(curriculo.formacao||[]).map((item, i) => (
              <ItemCard key={i} index={i} color="#DC2626" onRemove={() => rmItem('formacao',i)} theme={theme} t={tCurr}>
                <View style={[s.fieldWrap, { backgroundColor: theme.colors.background }]}>
                  <CustomDropDown label={tCurr('educationLevel')} value={item.nivel} setValue={v => inp('formacao','nivel',v,i)} list={educLevels} />
                </View>
                <FieldCard icon="book-outline"       label={tCurr('course')}      placeholder={tCurr('placeholder_course')}      value={item.curso}       onChangeText={v => inp('formacao','curso',v,i)}       theme={theme} s={s} />
                <FieldCard icon="school-outline"     label={tCurr('institution')} placeholder={tCurr('placeholder_institution')} value={item.instituicao} onChangeText={v => inp('formacao','instituicao',v,i)} theme={theme} s={s} />
                <DateField label={tCurr('yearConclusion')} value={fmtDate(item.anoConclusao)} onPress={() => openDP('formacao',i,'anoConclusao')} theme={theme} s={s} />
              </ItemCard>
            ))}
            <AddBtn label={tCurr('addEducation')} color="#DC2626" onPress={() => addItem('formacao')} />
          </Animatable.View>
        )}

        {/* ── EXPERIÊNCIAS ── */}
        {activeTab === 'experiencias' && (
          <Animatable.View animation="fadeInUp" duration={350} style={s.fieldGroup}>
            {(curriculo.experiencias||[]).map((item, i) => (
              <ItemCard key={i} index={i} color="#D97706" onRemove={() => rmItem('experiencias',i)} theme={theme} t={tCurr}>
                <FieldCard icon="briefcase-outline"  label={tCurr('position')} placeholder={tCurr('placeholder_position')} value={item.cargo}   onChangeText={v => inp('experiencias','cargo',v,i)}   theme={theme} s={s} />
                <FieldCard icon="office-building"    label={tCurr('company')}  placeholder={tCurr('placeholder_company')}  value={item.empresa} onChangeText={v => inp('experiencias','empresa',v,i)} theme={theme} s={s} />
                <View style={s.dateRow}>
                  <View style={{ flex:1 }}><DateField label={tCurr('startDate')} value={fmtDate(item.dataInicio)} onPress={() => openDP('experiencias',i,'dataInicio')} theme={theme} s={s} /></View>
                  <View style={{ flex:1 }}><DateField label={tCurr('endDate')}   value={fmtDate(item.dataFim)}    onPress={() => openDP('experiencias',i,'dataFim')}    theme={theme} s={s} disabled={item.atual} /></View>
                </View>
                <TouchableOpacity
                  style={[s.checkRow, { backgroundColor: item.atual ? '#D97706'+'18' : theme.colors.surfaceVariant }]}
                  onPress={() => { const v=!item.atual; inp('experiencias','atual',v,i); if(v) inp('experiencias','dataFim',null,i); }}
                >
                  <View style={[s.checkBox, { backgroundColor: item.atual ? '#D97706' : 'transparent', borderColor: item.atual ? '#D97706' : theme.colors.outline }]}>
                    {item.atual && <MaterialCommunityIcons name="check" size={13} color="#fff" />}
                  </View>
                  <Text style={[s.checkLabel, { color: item.atual ? '#D97706' : theme.colors.onSurface }]}>{tCurr('currentJob')}</Text>
                </TouchableOpacity>
                <View style={[s.fieldWrap, { backgroundColor: theme.colors.background }]}>
                  <TextInput label={tCurr('activities')} placeholder={tCurr('placeholder_activities')} value={item.atividades} onChangeText={v => inp('experiencias','atividades',v,i)} mode="outlined" style={s.input} multiline numberOfLines={4} />
                </View>
              </ItemCard>
            ))}
            <AddBtn label={tCurr('addExperience')} color="#D97706" onPress={() => addItem('experiencias')} />
          </Animatable.View>
        )}

        {/* ── CERTIFICAÇÕES ── */}
        {activeTab === 'certificacoes' && (
          <Animatable.View animation="fadeInUp" duration={350} style={s.fieldGroup}>
            {(curriculo.certificacoes||[]).map((item, i) => (
              <ItemCard key={i} index={i} color="#7C3AED" onRemove={() => rmItem('certificacoes',i)} theme={theme} t={tCurr}>
                <FieldCard icon="certificate-outline" label={tCurr('courseName')}         placeholder={tCurr('placeholder_courseName')}         value={item.nome}        onChangeText={v => inp('certificacoes','nome',v,i)}        theme={theme} s={s} />
                <FieldCard icon="domain"              label={tCurr('issuingOrganization')} placeholder={tCurr('placeholder_issuingOrganization')} value={item.instituicao} onChangeText={v => inp('certificacoes','instituicao',v,i)} theme={theme} s={s} />
                <DateField label={tCurr('yearConclusion')} value={fmtDate(item.anoConclusao)} onPress={() => openDP('certificacoes',i,'anoConclusao')} theme={theme} s={s} />
              </ItemCard>
            ))}
            <AddBtn label={tCurr('addCourse')} color="#7C3AED" onPress={() => addItem('certificacoes')} />
          </Animatable.View>
        )}

        {/* ── COMPETÊNCIAS ── */}
        {activeTab === 'competencias' && (
          <Animatable.View animation="fadeInUp" duration={350} style={s.fieldGroup}>
            <SkillSection
              title={tCurr('hardSkills')}
              subtitle={tCurr('hardSkills')}
              color="#0891B2"
              icon="code-tags"
              items={curriculo.hardSkills}
              placeholder={tCurr('placeholder_hardSkill')}
              onAdd={() => addItem('hardSkills')}
              onRemove={i => rmItem('hardSkills',i)}
              onChange={(v,i) => inp('hardSkills','habilidade',v,i)}
              addLabel={tCurr('addHardSkill')}
              theme={theme} s={s}
            />
            <View style={[s.dividerSection, { backgroundColor: theme.colors.outlineVariant }]} />
            <SkillSection
              title={tCurr('softSkills')}
              subtitle={tCurr('softSkills')}
              color="#BE185D"
              icon="heart-outline"
              items={curriculo.softSkills}
              placeholder={tCurr('placeholder_softSkill')}
              onAdd={() => addItem('softSkills')}
              onRemove={i => rmItem('softSkills',i)}
              onChange={(v,i) => inp('softSkills','habilidade',v,i)}
              addLabel={tCurr('addSoftSkill')}
              theme={theme} s={s}
            />
          </Animatable.View>
        )}

        {/* ── IDIOMAS ── */}
        {activeTab === 'idiomas' && (
          <Animatable.View animation="fadeInUp" duration={350} style={s.fieldGroup}>
            {(curriculo.idiomas||[]).map((item, i) => (
              <ItemCard key={i} index={i} color="#BE185D" onRemove={() => rmItem('idiomas',i)} theme={theme} t={tCurr}>
                <FieldCard icon="translate"  label={tCurr('language')}      placeholder={tCurr('placeholder_language')} value={item.idioma} onChangeText={v => inp('idiomas','idioma',v,i)} theme={theme} s={s} />
                <View style={[s.fieldWrap, { backgroundColor: theme.colors.background }]}>
                  <CustomDropDown label={tCurr('languageLevel')} value={item.nivel} setValue={v => inp('idiomas','nivel',v,i)} list={langLevels} />
                </View>
              </ItemCard>
            ))}
            <AddBtn label={tCurr('addLanguage')} color="#BE185D" onPress={() => addItem('idiomas')} />
          </Animatable.View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ══════════ BOTÃO SALVAR FLUTUANTE ══════════ */}
      <Animatable.View animation="fadeInUp" duration={400} delay={200} style={s.fabWrap}>
        <TouchableOpacity onPress={salvar} activeOpacity={0.88} style={s.fab}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            start={{ x:0,y:0 }} end={{ x:1,y:1 }}
            style={s.fabGrad}
          >
            <MaterialCommunityIcons name="content-save-all" size={22} color="#fff" />
            <Text style={s.fabText}>
              {indexEdicao !== null ? t('saveChanges') : t('saveResume')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animatable.View>
    </SafeAreaView>
  );
}

/* ─── descrições das seções ─── */
const SECTION_DESC = {
  dadosPessoais: 'Nome, contato, localização e redes',
  resumo:        'Resumo profissional e objetivo de carreira',
  formacao:      'Graduações, cursos e especializações',
  experiencias:  'Histórico de empregos e atividades',
  certificacoes: 'Certificados e cursos extracurriculares',
  competencias:  'Hard skills técnicas e soft skills',
  idiomas:       'Idiomas e níveis de proficiência',
};

/* ─── sub-componentes ─── */
const FieldCard = ({ icon, label, placeholder, value, onChangeText, theme, s, keyboardType, multiline, numberOfLines }) => (
  <View style={[s.fieldWrap, { backgroundColor: theme.colors.surface }]}>
    <TextInput
      label={label}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      mode="outlined"
      style={s.input}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={numberOfLines}
      left={<TextInput.Icon icon={icon} />}
    />
  </View>
);

const DateField = ({ label, value, onPress, theme, s, disabled }) => (
  <TouchableOpacity onPress={disabled ? null : onPress} activeOpacity={disabled ? 1 : 0.8}>
    <View style={[s.fieldWrap, { backgroundColor: theme.colors.surface, opacity: disabled ? 0.5 : 1 }]}>
      <TextInput
        label={label}
        value={value}
        mode="outlined"
        style={s.input}
        editable={false}
        right={<TextInput.Icon icon="calendar" />}
      />
    </View>
  </TouchableOpacity>
);

const ItemCard = ({ index, color, onRemove, theme, t, children }) => (
  <View style={[itemS.card, { borderColor: color + '30', backgroundColor: theme.colors.surface }]}>
    <View style={itemS.cardHeader}>
      <View style={[itemS.badge, { backgroundColor: color }]}>
        <Text style={itemS.badgeNum}>{index + 1}</Text>
      </View>
      <TouchableOpacity onPress={onRemove} style={[itemS.rmBtn, { backgroundColor: '#EF444420' }]} activeOpacity={0.8}>
        <MaterialCommunityIcons name="trash-can-outline" size={15} color="#EF4444" />
        <Text style={itemS.rmText}>{t('remove')}</Text>
      </TouchableOpacity>
    </View>
    <View style={{ gap: 10 }}>{children}</View>
  </View>
);

const AddBtn = ({ label, color, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[addS.btn, { borderColor: color }]}>
    <LinearGradient colors={[color, color + 'CC']} start={{ x:0,y:0 }} end={{ x:1,y:1 }} style={addS.icon}>
      <MaterialCommunityIcons name="plus" size={16} color="#fff" />
    </LinearGradient>
    <Text style={[addS.label, { color }]}>{label}</Text>
  </TouchableOpacity>
);

const SkillSection = ({ title, subtitle, color, icon, items, placeholder, onAdd, onRemove, onChange, addLabel, theme, s }) => (
  <View>
    <View style={[skillS.header, { backgroundColor: color + '12' }]}>
      <View style={[skillS.icon, { backgroundColor: color }]}>
        <MaterialCommunityIcons name={icon} size={16} color="#fff" />
      </View>
      <View>
        <Text style={[skillS.title, { color: theme.colors.onSurface }]}>{title}</Text>
        <Text style={[skillS.sub, { color: theme.colors.onSurfaceVariant }]}>{subtitle}</Text>
      </View>
    </View>
    <View style={skillS.chips}>
      {(items||[]).map((item, i) => (
        <View key={i} style={[skillS.chip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]}>
          <TextInput
            label={`Skill ${i+1}`}
            placeholder={placeholder}
            value={item.habilidade}
            onChangeText={v => onChange(v, i)}
            mode="outlined"
            style={[s.input, { minWidth: 140 }]}
            right={<TextInput.Icon icon="close" onPress={() => onRemove(i)} color={color} />}
          />
        </View>
      ))}
    </View>
    <AddBtn label={addLabel} color={color} onPress={onAdd} />
  </View>
);

/* ─── styles ─── */
const createStyles = theme => StyleSheet.create({
  root: { flex:1, backgroundColor: theme.colors.background },

  /* HEADER FIXO */
  header:        { paddingHorizontal:16, paddingVertical:16, overflow:'hidden', elevation:6 },
  hb:            { position:'absolute', borderRadius:999, backgroundColor:'rgba(255,255,255,0.07)' },
  hb1:           { width:140, height:140, top:-50, right:-40 },
  hb2:           { width:60,  height:60,  bottom:-16, left:16 },
  headerRow:     { flexDirection:'row', alignItems:'center' },
  headerBackBtn: { width:40, height:40, borderRadius:12, backgroundColor:'rgba(255,255,255,0.2)', justifyContent:'center', alignItems:'center' },
  headerTitle:   { color:'#fff', fontSize:20, fontWeight:'900', letterSpacing:0.2 },
  headerSub:     { color:'rgba(255,255,255,0.75)', fontSize:12, marginTop:2, fontWeight:'500' },
  headerIconBox: { width:44, height:44, borderRadius:14, backgroundColor:'#fff', justifyContent:'center', alignItems:'center', elevation:4, position:'relative' },
  headerPhoto:   { width:44, height:44, borderRadius:14 },
  headerBottom:  { marginTop:10, gap:6 },

  photoBadge: { position:'absolute', bottom:-3, right:-3, width:16, height:16, borderRadius:5, backgroundColor: theme.colors.primary, justifyContent:'center', alignItems:'center', borderWidth:2, borderColor:'#fff' },
  photoBtns: { flexDirection:'row', gap:5, flexWrap:'wrap' },
  photoBtn:  { flexDirection:'row', alignItems:'center', gap:3, backgroundColor:'rgba(255,255,255,0.2)', paddingVertical:4, paddingHorizontal:9, borderRadius:20, borderWidth:1, borderColor:'rgba(255,255,255,0.3)' },
  photoBtnTxt: { color:'#fff', fontSize: 11, fontWeight:'700' },

  nameRow: { flexDirection:'row', alignItems:'center', gap:6 },
  nameInput: { flex:1, backgroundColor:'transparent', color:'#fff', fontSize: isSmall ? 12 : 14 },
  importBtn: { flexDirection:'row', alignItems:'center', gap:4, paddingVertical:4, paddingHorizontal:9, borderRadius:20, backgroundColor:'rgba(255,255,255,0.2)', borderWidth:1, borderColor:'rgba(255,255,255,0.3)' },
  importBtnTxt: { color:'#fff', fontSize:11, fontWeight:'700' },

  /* seletor de idioma do currículo */
  langRow:        { flexDirection:'row', alignItems:'center', gap:6, marginBottom:2 },
  langRowLabel:   { color:'rgba(255,255,255,0.75)', fontSize:11, fontWeight:'600', marginRight:2 },
  langBtn:        { flexDirection:'row', alignItems:'center', gap:3, paddingVertical:4, paddingHorizontal:8, borderRadius:20, backgroundColor:'rgba(255,255,255,0.12)', borderWidth:1, borderColor:'rgba(255,255,255,0.2)' },
  langBtnAtivo:   { backgroundColor:'rgba(255,255,255,0.28)', borderColor:'rgba(255,255,255,0.6)' },
  langBtnFlag:    { fontSize:13 },
  langBtnTxt:     { color:'rgba(255,255,255,0.7)', fontSize:11, fontWeight:'700' },
  langBtnTxtAtivo:{ color:'#fff' },

  /* badge de idioma no modal salvar */
  langBadge:    { flexDirection:'row', alignItems:'center', gap:6, paddingVertical:6, paddingHorizontal:12, borderRadius:20, marginBottom:8, alignSelf:'flex-start' },
  langBadgeFlag:{ fontSize:16 },
  langBadgeTxt: { fontSize:13, fontWeight:'700' },
  modalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'flex-end' },
  modalBox: { borderTopLeftRadius:24, borderTopRightRadius:24, padding:20, paddingBottom:36 },
  modalHeader: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:6 },
  modalTitle: { fontSize:17, fontWeight:'700' },
  modalSub: { fontSize:13, marginBottom:16, lineHeight:18 },
  salvarOpcao:      { flexDirection:'row', alignItems:'center', gap:12, padding:14, borderRadius:16, borderWidth:1.5 },
  salvarOpcaoIcon:  { width:44, height:44, borderRadius:14, justifyContent:'center', alignItems:'center', overflow:'hidden' },
  salvarOpcaoTitle: { fontSize:15, fontWeight:'700' },
  salvarOpcaoSub:   { fontSize:12, marginTop:2 },
  modalItem: { flexDirection:'row', alignItems:'center', gap:12, paddingVertical:12, paddingHorizontal:8, borderBottomWidth:1 },
  modalItemIcon: { width:44, height:44, borderRadius:22, alignItems:'center', justifyContent:'center' },
  modalItemName: { fontSize:15, fontWeight:'600' },
  modalItemSub: { fontSize:12, marginTop:2 },
  modalEmpty: { alignItems:'center', paddingVertical:32, gap:10 },
  modalEmptyTxt: { fontSize:14 },

  /* TABS */
  tabsContainer: { borderBottomWidth:1 },
  tabsScroll: { paddingHorizontal:12, paddingVertical:8, gap:6 },
  tab: { alignItems:'center', paddingHorizontal:10, paddingVertical:6, borderBottomWidth:3, borderBottomColor:'transparent', gap:4 },
  tabIcon:  { width:30, height:30, borderRadius:9, justifyContent:'center', alignItems:'center' },
  tabLabel: { fontSize:11, letterSpacing:0.2 },

  /* CONTEÚDO */
  content: { padding:16 },

  sectionBanner: { flexDirection:'row', alignItems:'center', gap:12, padding:12, borderRadius:16, borderWidth:1, marginBottom:16 },
  sectionBannerIcon:  { width:34, height:34, borderRadius:10, justifyContent:'center', alignItems:'center', flexShrink:0 },
  sectionBannerTitle: { fontSize:14, fontWeight:'800' },
  sectionBannerSub:   { fontSize:11, marginTop:1, flexWrap:'wrap' },

  fieldGroup: { gap:12 },
  fieldWrap:  { borderRadius:14, overflow:'hidden' },
  input: { backgroundColor:'transparent', width:'100%' },
  dateRow: { flexDirection:'row', gap:10 },
  dividerSection: { height:1, marginVertical:16, borderRadius:1 },

  checkRow:  { flexDirection:'row', alignItems:'center', gap:10, padding:12, borderRadius:12 },
  checkBox:  { width:20, height:20, borderRadius:6, borderWidth:2, justifyContent:'center', alignItems:'center' },
  checkLabel:{ fontSize:14, fontWeight:'600' },

  cnhChip:    { paddingVertical:7, paddingHorizontal:14, borderRadius:20, borderWidth:1.5, borderColor:'#CBD5E1', backgroundColor:'transparent' },
  cnhChipTxt: { fontSize:13, fontWeight:'700' },

  exBtn: { flexDirection:'row', alignItems:'center', gap:10, padding:14, borderRadius:14, borderWidth:1 },
  exBtnIcon: { width:32, height:32, borderRadius:9, justifyContent:'center', alignItems:'center' },
  exBtnText: { flex:1, fontSize:14, fontWeight:'700' },

  /* FAB */
  fabWrap: { position:'absolute', bottom: isSmall ? 12 : 20, left:20, right:20 },
  fab: { borderRadius:26, overflow:'hidden', elevation:8, shadowColor: theme.colors.primary, shadowOffset:{width:0,height:6}, shadowOpacity:0.35, shadowRadius:12 },
  fabGrad: { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, paddingVertical: isSmall ? 12 : 15 },
  fabText: { color:'#fff', fontSize: isSmall ? 14 : 15, fontWeight:'900', letterSpacing:0.3 },
});

const itemS = StyleSheet.create({
  card: { borderRadius:18, borderWidth:1.5, padding:16, gap:12, elevation:2, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.06, shadowRadius:4 },
  cardHeader: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:4 },
  badge: { width:28, height:28, borderRadius:8, justifyContent:'center', alignItems:'center' },
  badgeNum: { color:'#fff', fontSize:13, fontWeight:'900' },
  rmBtn: { flexDirection:'row', alignItems:'center', gap:5, paddingVertical:6, paddingHorizontal:12, borderRadius:10 },
  rmText: { color:'#EF4444', fontSize:12, fontWeight:'700' },
});

const addS = StyleSheet.create({
  btn: { flexDirection:'row', alignItems:'center', gap:10, paddingVertical:14, paddingHorizontal:16, borderRadius:16, borderWidth:1.5, borderStyle:'dashed', marginTop:8 },
  icon: { width:30, height:30, borderRadius:9, justifyContent:'center', alignItems:'center' },
  label: { fontWeight:'700', fontSize:14 },
});

const skillS = StyleSheet.create({
  header: { flexDirection:'row', alignItems:'center', gap:12, padding:12, borderRadius:14, marginBottom:14 },
  icon:  { width:34, height:34, borderRadius:10, justifyContent:'center', alignItems:'center' },
  title: { fontSize:15, fontWeight:'800' },
  sub:   { fontSize:12, marginTop:2 },
  chips: { flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:4 },
  chip:  { borderRadius:12, overflow:'hidden', borderWidth:1 },
});
