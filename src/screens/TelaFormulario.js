import React, { useState, useContext, useCallback, useLayoutEffect, useRef } from 'react';
import {
  ScrollView, StyleSheet, View, TouchableOpacity, Image,
  Platform, Dimensions, Animated,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { TextInput, Text, Divider, useTheme, Checkbox } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { UserPreferencesContext } from '../context/UserPreferencesContext';
import CustomDropDown from '../components/CustomDropDown';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height: screenHeight } = Dimensions.get('window');
const isSmall = screenHeight < 700; // ex: Galaxy A20, iPhone SE

/* ─── estrutura ─── */
const ESTRUTURA_INICIAL = {
  nomeInterno: '',
  fotoUri: null, fotoBase64: null, lastUpdated: null,
  dadosPessoais: { nome:'', endereco:'', telefone:'', email:'', linkedin:'', site:'', estado:'', cidade:'' },
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

  const indexEdicao = route.params?.index ?? null;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: indexEdicao !== null ? t('editResume') : t('createResume'),
      headerShown: false,            // usamos nosso próprio header
    });
  }, [navigation, indexEdicao, t]);

  useFocusEffect(useCallback(() => {
    const cur = route.params?.curriculo;
    const obj = route.params?.objetivoSelecionado;
    
    if (obj) {
      setCurriculo(p => ({ ...p, objetivoProfissional: obj }));
      navigation.setParams({ objetivoSelecionado: null });
    } else if (cur) {
      setCurriculo({ ...ESTRUTURA_INICIAL, ...cur });
    } else {
      setCurriculo({ ...ESTRUTURA_INICIAL });
      setActiveTab('dadosPessoais');
    }
  }, [route.params?.curriculo, route.params?.objetivoSelecionado]));

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

  const pickGallery = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing:true, aspect:[1,1], quality:0.5 });
    if (!r.canceled) setCurriculo(p => ({ ...p, fotoUri: r.assets[0].uri }));
  };
  const pickCamera = async () => {
    const r = await ImagePicker.launchCameraAsync({ allowsEditing:true, aspect:[1,1], quality:0.5 });
    if (!r.canceled) setCurriculo(p => ({ ...p, fotoUri: r.assets[0].uri }));
  };

  const salvar = async () => {
    try {
      const c = { ...curriculo, lastUpdated: new Date().toISOString() };
      if (curriculo.fotoUri?.startsWith('file://')) {
        const b64 = await FileSystem.readAsStringAsync(curriculo.fotoUri, { encoding: FileSystem.EncodingType.Base64 });
        c.fotoBase64 = `data:image/jpeg;base64,${b64}`;
      }
      const raw  = await AsyncStorage.getItem('curriculos');
      const list = raw ? JSON.parse(raw) : [];
      indexEdicao !== null ? (list[indexEdicao] = c) : list.push(c);
      await AsyncStorage.setItem('curriculos', JSON.stringify(list));
      navigation.navigate('MeusCurriculos');
    } catch(e) { console.error(e); }
  };

  const educLevels = Object.entries(t('educationLevels')).map(([v,l]) => ({ label:l, value:v }));
  const stateList  = Object.entries(t('states')).map(([v,l])           => ({ label:l, value:v }));
  const langLevels = Object.entries(t('languageLevels')).map(([v,l])   => ({ label:l, value:v }));

  const s      = createStyles(theme);
  const curTab = TABS.find(tb => tb.key === activeTab) || TABS[0];

  /* ─── tab switch ─── */
  const switchTab = (key, i) => {
    setActiveTab(key);
    tabScrollRef.current?.scrollTo({ x: Math.max(0, i * 80 - width / 2 + 48), animated: true });
  };

  return (
    <View style={s.root}>
      {showDatePicker && <DateTimePicker value={new Date()} mode="date" display="default" onChange={onDP} />}

      {/* ══════════ HERO HEADER ══════════ */}
      <Animatable.View animation="fadeInDown" duration={500}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          start={{ x:0, y:0 }} end={{ x:1, y:1 }}
          style={s.hero}
        >
          {/* bolhas deco */}
          <View style={[s.hb, s.hb1]} /><View style={[s.hb, s.hb2]} />

          {/* botão voltar */}
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>

          {/* foto centralizada */}
          <View style={s.photoCenter}>
            <TouchableOpacity onPress={pickGallery} activeOpacity={0.85} style={s.photoWrap}>
              {curriculo.fotoUri
                ? <Image source={{ uri: curriculo.fotoUri }} style={s.photoImg} />
                : (
                  <View style={s.photoEmpty}>
                    <MaterialCommunityIcons name="camera-account" size={36} color="rgba(255,255,255,0.9)" />
                    <Text style={s.photoEmptyTxt}>Adicionar foto</Text>
                  </View>
                )
              }
              <View style={s.photoBadge}>
                <MaterialCommunityIcons name="camera-plus" size={13} color="#fff" />
              </View>
            </TouchableOpacity>

            {/* botões galeria / câmera */}
            <View style={s.photoBtns}>
              <TouchableOpacity style={s.photoBtn} onPress={pickGallery}>
                <MaterialCommunityIcons name="image-outline" size={14} color="#fff" />
                <Text style={s.photoBtnTxt}>{t('gallery')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.photoBtn} onPress={pickCamera}>
                <MaterialCommunityIcons name="camera-outline" size={14} color="#fff" />
                <Text style={s.photoBtnTxt}>{t('camera')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* nome interno */}
          <View style={s.nameRow}>
            <MaterialCommunityIcons name="tag-outline" size={16} color="rgba(255,255,255,0.7)" />
            <TextInput
              value={curriculo.nomeInterno}
              onChangeText={v => inp(null, 'nomeInterno', v)}
              placeholder={t('internalResumeName')}
              placeholderTextColor="rgba(255,255,255,0.55)"
              style={s.nameInput}
              underlineColor="rgba(255,255,255,0.4)"
              activeUnderlineColor="#fff"
              textColor="#fff"
              mode="flat"
              dense
            />
          </View>
        </LinearGradient>
      </Animatable.View>

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
                  {t(tab.labelKey)}
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
            <Text style={[s.sectionBannerTitle, { color: curTab.color }]} numberOfLines={1}>{t(curTab.labelKey)}</Text>
            <Text style={[s.sectionBannerSub, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>
              {SECTION_DESC[activeTab] || ''}
            </Text>
          </View>
        </Animatable.View>

        {/* ── DADOS PESSOAIS ── */}
        {activeTab === 'dadosPessoais' && (
          <Animatable.View animation="fadeInUp" duration={350} style={s.fieldGroup}>
            <FieldCard icon="account-outline"     label={t('name')}      placeholder={t('placeholder_fullName')}  value={curriculo.dadosPessoais.nome}     onChangeText={v => inp('dadosPessoais','nome',v)}     theme={theme} s={s} />
            <FieldCard icon="email-outline"       label={t('email')}     placeholder={t('placeholder_email')}     value={curriculo.dadosPessoais.email}    onChangeText={v => inp('dadosPessoais','email',v)}    theme={theme} s={s} keyboardType="email-address" />
            <FieldCard icon="phone-outline"       label={t('phone')}     placeholder={t('placeholder_phone')}     value={curriculo.dadosPessoais.telefone} onChangeText={v => inp('dadosPessoais','telefone',v)} theme={theme} s={s} keyboardType="phone-pad" />
            {language === 'pt-BR' ? (
              <View style={[s.fieldWrap, { backgroundColor: theme.colors.surface }]}>
                <CustomDropDown label={t('state')} value={curriculo.dadosPessoais.estado} setValue={v => inp('dadosPessoais','estado',v)} list={stateList} />
              </View>
            ) : (
              <FieldCard icon="map-marker-outline" label={t('state')} placeholder={t('placeholder_city')} value={curriculo.dadosPessoais.estado} onChangeText={v => inp('dadosPessoais','estado',v)} theme={theme} s={s} />
            )}
            <FieldCard icon="map-marker-outline"  label={t('city')}      placeholder={t('placeholder_city')}      value={curriculo.dadosPessoais.cidade}   onChangeText={v => inp('dadosPessoais','cidade',v)}   theme={theme} s={s} />
            <FieldCard icon="linkedin"            label={t('linkedin')}  placeholder={t('placeholder_linkedin')}  value={curriculo.dadosPessoais.linkedin} onChangeText={v => inp('dadosPessoais','linkedin',v)} theme={theme} s={s} />
            <FieldCard icon="web"                 label={t('portfolio')} placeholder={t('placeholder_portfolio')} value={curriculo.dadosPessoais.site}     onChangeText={v => inp('dadosPessoais','site',v)}     theme={theme} s={s} />
          </Animatable.View>
        )}

        {/* ── RESUMO ── */}
        {activeTab === 'resumo' && (
          <Animatable.View animation="fadeInUp" duration={350} style={s.fieldGroup}>
            <View style={[s.fieldWrap, { backgroundColor: theme.colors.surface }]}>
              <TextInput label={t('summary')} placeholder={t('placeholder_summary')} value={curriculo.resumoProfissional} onChangeText={v => inp('resumoProfissional',null,v)} mode="outlined" style={s.input} multiline numberOfLines={5} />
            </View>
            <View style={[s.fieldWrap, { backgroundColor: theme.colors.surface }]}>
              <TextInput label={t('objective')} value={curriculo.objetivoProfissional} onChangeText={v => inp('objetivoProfissional',null,v)} mode="outlined" style={s.input} multiline numberOfLines={4} />
            </View>
            <TouchableOpacity
              style={[s.exBtn, { backgroundColor: '#059669' + '18', borderColor: '#059669' + '44' }]}
              onPress={() => navigation.navigate('ExemplosObjetivo', { onSelect: txt => inp('objetivoProfissional',null,txt) })}
              activeOpacity={0.8}
            >
              <LinearGradient colors={['#059669','#34D399']} style={s.exBtnIcon}>
                <MaterialCommunityIcons name="lightbulb-on" size={16} color="#fff" />
              </LinearGradient>
              <Text style={[s.exBtnText, { color:'#059669' }]}>{t('getExamples')}</Text>
              <MaterialCommunityIcons name="chevron-right" size={18} color="#059669" />
            </TouchableOpacity>
          </Animatable.View>
        )}

        {/* ── FORMAÇÃO ── */}
        {activeTab === 'formacao' && (
          <Animatable.View animation="fadeInUp" duration={350} style={s.fieldGroup}>
            {(curriculo.formacao||[]).map((item, i) => (
              <ItemCard key={i} index={i} color="#DC2626" onRemove={() => rmItem('formacao',i)} theme={theme} t={t}>
                <View style={[s.fieldWrap, { backgroundColor: theme.colors.background }]}>
                  <CustomDropDown label={t('educationLevel')} value={item.nivel} setValue={v => inp('formacao','nivel',v,i)} list={educLevels} />
                </View>
                <FieldCard icon="book-outline"       label={t('course')}      placeholder={t('placeholder_course')}      value={item.curso}       onChangeText={v => inp('formacao','curso',v,i)}       theme={theme} s={s} />
                <FieldCard icon="school-outline"     label={t('institution')} placeholder={t('placeholder_institution')} value={item.instituicao} onChangeText={v => inp('formacao','instituicao',v,i)} theme={theme} s={s} />
                <DateField label={t('yearConclusion')} value={fmtDate(item.anoConclusao)} onPress={() => openDP('formacao',i,'anoConclusao')} theme={theme} s={s} />
              </ItemCard>
            ))}
            <AddBtn label={t('addEducation')} color="#DC2626" onPress={() => addItem('formacao')} />
          </Animatable.View>
        )}

        {/* ── EXPERIÊNCIAS ── */}
        {activeTab === 'experiencias' && (
          <Animatable.View animation="fadeInUp" duration={350} style={s.fieldGroup}>
            {(curriculo.experiencias||[]).map((item, i) => (
              <ItemCard key={i} index={i} color="#D97706" onRemove={() => rmItem('experiencias',i)} theme={theme} t={t}>
                <FieldCard icon="briefcase-outline"  label={t('position')} placeholder={t('placeholder_position')} value={item.cargo}   onChangeText={v => inp('experiencias','cargo',v,i)}   theme={theme} s={s} />
                <FieldCard icon="office-building"    label={t('company')}  placeholder={t('placeholder_company')}  value={item.empresa} onChangeText={v => inp('experiencias','empresa',v,i)} theme={theme} s={s} />
                <View style={s.dateRow}>
                  <View style={{ flex:1 }}><DateField label={t('startDate')} value={fmtDate(item.dataInicio)} onPress={() => openDP('experiencias',i,'dataInicio')} theme={theme} s={s} /></View>
                  <View style={{ flex:1 }}><DateField label={t('endDate')}   value={fmtDate(item.dataFim)}    onPress={() => openDP('experiencias',i,'dataFim')}    theme={theme} s={s} disabled={item.atual} /></View>
                </View>
                <TouchableOpacity
                  style={[s.checkRow, { backgroundColor: item.atual ? '#D97706'+'18' : theme.colors.surfaceVariant }]}
                  onPress={() => { const v=!item.atual; inp('experiencias','atual',v,i); if(v) inp('experiencias','dataFim',null,i); }}
                >
                  <View style={[s.checkBox, { backgroundColor: item.atual ? '#D97706' : 'transparent', borderColor: item.atual ? '#D97706' : theme.colors.outline }]}>
                    {item.atual && <MaterialCommunityIcons name="check" size={13} color="#fff" />}
                  </View>
                  <Text style={[s.checkLabel, { color: item.atual ? '#D97706' : theme.colors.onSurface }]}>{t('currentJob')}</Text>
                </TouchableOpacity>
                <View style={[s.fieldWrap, { backgroundColor: theme.colors.background }]}>
                  <TextInput label={t('activities')} placeholder={t('placeholder_activities')} value={item.atividades} onChangeText={v => inp('experiencias','atividades',v,i)} mode="outlined" style={s.input} multiline numberOfLines={4} />
                </View>
              </ItemCard>
            ))}
            <AddBtn label={t('addExperience')} color="#D97706" onPress={() => addItem('experiencias')} />
          </Animatable.View>
        )}

        {/* ── CERTIFICAÇÕES ── */}
        {activeTab === 'certificacoes' && (
          <Animatable.View animation="fadeInUp" duration={350} style={s.fieldGroup}>
            {(curriculo.certificacoes||[]).map((item, i) => (
              <ItemCard key={i} index={i} color="#7C3AED" onRemove={() => rmItem('certificacoes',i)} theme={theme} t={t}>
                <FieldCard icon="certificate-outline" label={t('courseName')}         placeholder={t('placeholder_courseName')}         value={item.nome}        onChangeText={v => inp('certificacoes','nome',v,i)}        theme={theme} s={s} />
                <FieldCard icon="domain"              label={t('issuingOrganization')} placeholder={t('placeholder_issuingOrganization')} value={item.instituicao} onChangeText={v => inp('certificacoes','instituicao',v,i)} theme={theme} s={s} />
                <DateField label={t('yearConclusion')} value={fmtDate(item.anoConclusao)} onPress={() => openDP('certificacoes',i,'anoConclusao')} theme={theme} s={s} />
              </ItemCard>
            ))}
            <AddBtn label={t('addCourse')} color="#7C3AED" onPress={() => addItem('certificacoes')} />
          </Animatable.View>
        )}

        {/* ── COMPETÊNCIAS ── */}
        {activeTab === 'competencias' && (
          <Animatable.View animation="fadeInUp" duration={350} style={s.fieldGroup}>
            <SkillSection
              title={t('hardSkills')}
              subtitle="Técnicas e ferramentas"
              color="#0891B2"
              icon="code-tags"
              items={curriculo.hardSkills}
              placeholder={t('placeholder_hardSkill')}
              onAdd={() => addItem('hardSkills')}
              onRemove={i => rmItem('hardSkills',i)}
              onChange={(v,i) => inp('hardSkills','habilidade',v,i)}
              addLabel={t('addHardSkill')}
              theme={theme} s={s}
            />
            <View style={[s.dividerSection, { backgroundColor: theme.colors.outlineVariant }]} />
            <SkillSection
              title={t('softSkills')}
              subtitle="Comportamentais e interpessoais"
              color="#BE185D"
              icon="heart-outline"
              items={curriculo.softSkills}
              placeholder={t('placeholder_softSkill')}
              onAdd={() => addItem('softSkills')}
              onRemove={i => rmItem('softSkills',i)}
              onChange={(v,i) => inp('softSkills','habilidade',v,i)}
              addLabel={t('addSoftSkill')}
              theme={theme} s={s}
            />
          </Animatable.View>
        )}

        {/* ── IDIOMAS ── */}
        {activeTab === 'idiomas' && (
          <Animatable.View animation="fadeInUp" duration={350} style={s.fieldGroup}>
            {(curriculo.idiomas||[]).map((item, i) => (
              <ItemCard key={i} index={i} color="#BE185D" onRemove={() => rmItem('idiomas',i)} theme={theme} t={t}>
                <FieldCard icon="translate"  label={t('language')}      placeholder={t('placeholder_language')} value={item.idioma} onChangeText={v => inp('idiomas','idioma',v,i)} theme={theme} s={s} />
                <View style={[s.fieldWrap, { backgroundColor: theme.colors.background }]}>
                  <CustomDropDown label={t('languageLevel')} value={item.nivel} setValue={v => inp('idiomas','nivel',v,i)} list={langLevels} />
                </View>
              </ItemCard>
            ))}
            <AddBtn label={t('addLanguage')} color="#BE185D" onPress={() => addItem('idiomas')} />
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
    </View>
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

  /* HERO */
  hero: { paddingTop: Platform.OS === 'ios' ? (isSmall ? 40 : 54) : (isSmall ? 32 : 44), paddingBottom: isSmall ? 12 : 20, paddingHorizontal: 20, overflow:'hidden' },
  hb:  { position:'absolute', borderRadius:999, backgroundColor:'rgba(255,255,255,0.07)' },
  hb1: { width:140, height:140, top:-50, right:-40 },
  hb2: { width:60,  height:60,  bottom:-16, left:16 },

  backBtn: { width:36, height:36, borderRadius:11, backgroundColor:'rgba(255,255,255,0.2)', justifyContent:'center', alignItems:'center', marginBottom: isSmall ? 6 : 12 },

  photoCenter: { alignItems:'center', marginBottom: isSmall ? 8 : 14 },
  photoWrap: { position:'relative' },
  photoImg:  { width: isSmall ? 64 : 80, height: isSmall ? 64 : 80, borderRadius: isSmall ? 18 : 22, borderWidth:3, borderColor:'rgba(255,255,255,0.9)' },
  photoEmpty: { width: isSmall ? 64 : 80, height: isSmall ? 64 : 80, borderRadius: isSmall ? 18 : 22, backgroundColor:'rgba(255,255,255,0.18)', justifyContent:'center', alignItems:'center', borderWidth:2, borderColor:'rgba(255,255,255,0.35)', gap: isSmall ? 2 : 4 },
  photoEmptyTxt: { color:'rgba(255,255,255,0.85)', fontSize: isSmall ? 9 : 10, fontWeight:'700' },
  photoBadge: { position:'absolute', bottom:-4, right:-4, width:22, height:22, borderRadius:7, backgroundColor: theme.colors.primary, justifyContent:'center', alignItems:'center', borderWidth:2, borderColor:'#fff' },
  photoBtns: { flexDirection:'row', gap:8, marginTop: isSmall ? 8 : 12 },
  photoBtn:  { flexDirection:'row', alignItems:'center', gap:4, backgroundColor:'rgba(255,255,255,0.2)', paddingVertical: isSmall ? 5 : 7, paddingHorizontal: isSmall ? 10 : 14, borderRadius:20, borderWidth:1, borderColor:'rgba(255,255,255,0.3)' },
  photoBtnTxt: { color:'#fff', fontSize: isSmall ? 11 : 12, fontWeight:'700' },

  nameRow: { flexDirection:'row', alignItems:'center', gap:8, marginTop: isSmall ? 2 : 4 },
  nameInput: { flex:1, backgroundColor:'transparent', color:'#fff', fontSize: isSmall ? 13 : 15 },

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
