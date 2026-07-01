import React, { useState, useCallback, useContext, useRef, useEffect } from 'react';
import {
  StyleSheet, View, Alert, FlatList, TouchableOpacity,
  Dimensions, Animated, Easing, Modal, Pressable,
} from 'react-native';
import { Text, useTheme, Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
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

/* ── Ilustração tela vazia ── */
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
      <View style={{ width: 140, height: 140, borderRadius: 70, backgroundColor: color + '14', justifyContent: 'center', alignItems: 'center' }}>
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

export default function ListaCurriculos({ navigation, route }) {
  const theme = useTheme();
  const { t } = useContext(UserPreferencesContext);

  const [curriculos, setCurriculos]    = useState([]);
  const [snackbarMsg, setSnackbar]     = useState(null);
  const [deleteModal, setDeleteModal]  = useState(null); // { index, nome, importado }

  useFocusEffect(useCallback(() => { carregar(); }, []));

  const carregar = async () => {
    const data = await AsyncStorage.getItem('curriculos');
    setCurriculos(data ? JSON.parse(data) : []);
  };

  const carregarExemplos = async () => {
    await AsyncStorage.setItem('curriculos', JSON.stringify(curriculosExemplo));
    carregar();
  };

  const importarCurriculo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword',
               'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      const destDir  = FileSystem.documentDirectory + 'curriculos_importados/';
      const destPath = destDir + file.name;

      await FileSystem.makeDirectoryAsync(destDir, { intermediates: true });
      await FileSystem.copyAsync({ from: file.uri, to: destPath });

      const novo = {
        _importado: true,
        nomeInterno: file.name.replace(/\.[^.]+$/, ''),
        arquivoUri: destPath,
        arquivoNome: file.name,
        arquivoMime: file.mimeType || 'application/pdf',
        lastUpdated: new Date().toISOString(),
      };

      const novos = [novo, ...curriculos];
      setCurriculos(novos);
      await AsyncStorage.setItem('curriculos', JSON.stringify(novos));
      setSnackbar('importado');

    } catch (e) {
      Alert.alert('Erro', 'Não foi possível importar o arquivo.');
    }
  };

  const visualizarCurriculo = async (cur) => {
    try {
      const info = await FileSystem.getInfoAsync(cur.arquivoUri);
      if (!info.exists) {
        Alert.alert('Arquivo não encontrado', 'O arquivo pode ter sido removido do dispositivo.');
        return;
      }
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert('Visualização indisponível', 'Seu dispositivo não suporta esta função.');
        return;
      }
      await Sharing.shareAsync(cur.arquivoUri, {
        mimeType: cur.arquivoMime || 'application/pdf',
        dialogTitle: `Abrir ${cur.arquivoNome}`,
        UTI: 'com.adobe.pdf',
      });
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível abrir o arquivo.');
    }
  };

  const enviarCurriculo = async (cur) => {
    try {
      const info = await FileSystem.getInfoAsync(cur.arquivoUri);
      if (!info.exists) {
        Alert.alert('Arquivo não encontrado', 'O arquivo pode ter sido removido do dispositivo.');
        return;
      }
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert('Compartilhamento indisponível', 'Seu dispositivo não suporta esta função.');
        return;
      }
      await Sharing.shareAsync(cur.arquivoUri, {
        mimeType: cur.arquivoMime || 'application/pdf',
        dialogTitle: `Enviar ${cur.arquivoNome}`,
        UTI: 'com.adobe.pdf',
      });
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível compartilhar o arquivo.');
    }
  };

  const excluir = (index) => {
    const cur = curriculos[index];
    setDeleteModal({
      index,
      nome: cur.nomeInterno || `Currículo ${index + 1}`,
      importado: !!cur._importado,
      ext: cur._importado ? (cur.arquivoNome || '').split('.').pop().toUpperCase() : null,
    });
  };

  const confirmarExclusao = async () => {
    const { index } = deleteModal;
    const novos = curriculos.filter((_, i) => i !== index);
    setCurriculos(novos);
    await AsyncStorage.setItem('curriculos', JSON.stringify(novos));
    setDeleteModal(null);
    setSnackbar('deletado');
  };

  const fmtDate = (ds) => {
    if (!ds) return '—';
    return new Date(ds).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  /* ── HEADER FIXO ── */
  const Header = () => (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={s.header}
    >
      {/* blobs decorativos */}
      <View style={[s.blob, { width: 180, height: 180, top: -70, right: -50, backgroundColor: 'rgba(255,255,255,0.08)' }]} />
      <View style={[s.blob, { width: 90,  height: 90,  bottom: -30, left: -20, backgroundColor: 'rgba(255,255,255,0.06)' }]} />

      <View style={s.headerRow}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} activeOpacity={0.8} style={s.headerBackBtn}>
          <MaterialCommunityIcons name="menu" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={s.headerTitle}>{t('myResumesTitle')}</Text>
          <Text style={s.headerSub}>
            {curriculos.length === 0
              ? 'Nenhum currículo ainda'
              : `${curriculos.length} ${curriculos.length === 1 ? 'currículo' : 'currículos'}`}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={importarCurriculo}
            activeOpacity={0.85}
            style={[s.headerAddBtn, { backgroundColor: 'rgba(255,255,255,0.22)', width: 44, height: 44 }]}
          >
            <MaterialCommunityIcons name="file-import-outline" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('CriarCurrículo')}
            activeOpacity={0.85}
            style={s.headerAddBtn}
          >
            <MaterialCommunityIcons name="plus" size={22} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );

  /* ── TELA VAZIA ── */
  if (curriculos.length === 0) {
    const c = theme.colors.primary;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
        <Header />
        <View style={{ flex: 1 }}>
          <FloatingDot size={90}  color={c} startX={-20}       startY={60}  duration={3200} delay={0}    />
          <FloatingDot size={55}  color={c} startX={width-60}  startY={140} duration={2800} delay={400}  />
          <FloatingDot size={36}  color={c} startX={width*0.4} startY={240} duration={3600} delay={900}  />
          <FloatingDot size={24}  color={c} startX={30}        startY={340} duration={2600} delay={1200} />

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
            <Animatable.View animation="zoomIn" duration={700} delay={100}>
              <EmptyIllustration color={c} />
            </Animatable.View>

            <Animatable.View animation="fadeInUp" duration={600} delay={300} style={{ alignItems: 'center', marginTop: 32 }}>
              <Text style={{ fontSize: 22, fontWeight: '900', color: theme.colors.onSurface, textAlign: 'center' }}>
                {t('noResumesYet')}
              </Text>
              <Text style={{ fontSize: 14, color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 10, lineHeight: 22 }}>
                {'Crie seu primeiro currículo\ne destaque-se no mercado!'}
              </Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" duration={600} delay={500} style={{ width: '100%', gap: 12, marginTop: 36 }}>
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

              <TouchableOpacity
                onPress={importarCurriculo}
                activeOpacity={0.85}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 28, borderWidth: 1.5, borderColor: c + '55', backgroundColor: c + '0D' }}
              >
                <MaterialCommunityIcons name="file-import-outline" size={18} color={c} />
                <Text style={{ color: c, fontWeight: '700', fontSize: 14 }}>Importar meu currículo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={carregarExemplos}
                activeOpacity={0.8}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 28 }}
              >
                <MaterialCommunityIcons name="lightbulb-on-outline" size={16} color={theme.colors.onSurfaceVariant} />
                <Text style={{ color: theme.colors.onSurfaceVariant, fontWeight: '600', fontSize: 13 }}>Carregar exemplos</Text>
              </TouchableOpacity>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" duration={600} delay={700} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 28 }}>
              {['Modelos profissionais', 'Export PDF', 'Múltiplos idiomas'].map((tip, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: c + '12', borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderColor: c + '22' }}>
                  <MaterialCommunityIcons name={['star-four-points', 'file-pdf-box', 'translate'][i]} size={13} color={c} />
                  <Text style={{ fontSize: 12, fontWeight: '600', color: c }}>{tip}</Text>
                </View>
              ))}
            </Animatable.View>
          </View>
        </View>
        <Snackbar visible={!!snackbarMsg} onDismiss={() => setSnackbar(null)} duration={2500}>
          {snackbarMsg === 'importado' ? 'Currículo importado com sucesso!' : t('deleteSuccess')}
        </Snackbar>
      </SafeAreaView>
    );
  }

  /* ── CARD ── */
  const renderItem = ({ item: cur, index }) => {
    const [c1, c2] = CARD_COLORS[index % CARD_COLORS.length];
    const initials   = getInitials(cur.nomeInterno || `C${index + 1}`);
    const nome       = cur.nomeInterno || `Currículo ${index + 1}`;
    const profissao  = cur.dadosPessoais?.nome || '';
    const completude = calcCompletude(cur);
    const importado  = !!cur._importado;

    const ext = importado
      ? (cur.arquivoNome || '').split('.').pop().toUpperCase()
      : null;

    /* ── Card currículo IMPORTADO ── */
    if (importado) {
      const extIcon = ext === 'PDF' ? 'file-pdf-box' : 'file-word-box';
      const extColor = ext === 'PDF' ? '#E53E3E' : '#2B6CB0';
      return (
        <Animatable.View animation="fadeInUp" duration={500} delay={index * 60}>
          <View style={[s.importCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline + '60' }]}>
            {/* linha superior: ícone + info + deletar */}
            <View style={s.importCardTop}>
              <View style={[s.importIconBox, { backgroundColor: extColor + '15' }]}>
                <MaterialCommunityIcons name={extIcon} size={32} color={extColor} />
                <Text style={[s.importExtLabel, { color: extColor }]}>{ext || 'DOC'}</Text>
              </View>

              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={[s.cardName, { color: theme.colors.onSurface }]} numberOfLines={2}>{nome}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 }}>
                  <View style={[s.importedTagBadge, { backgroundColor: c1 + '18', borderColor: c1 + '40' }]}>
                    <MaterialCommunityIcons name="upload-outline" size={10} color={c1} />
                    <Text style={[s.importedTagText, { color: c1 }]}>Importado</Text>
                  </View>
                  <Text style={[s.cardDate, { color: theme.colors.onSurfaceVariant }]}>{fmtDate(cur.lastUpdated)}</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => excluir(index)}
                style={[s.deleteBtn, { backgroundColor: theme.colors.errorContainer || '#FFEBEE' }]}
              >
                <MaterialCommunityIcons name="delete-outline" size={17} color={theme.colors.error} />
              </TouchableOpacity>
            </View>

            {/* divisor */}
            <View style={[s.importDivider, { backgroundColor: theme.colors.outlineVariant }]} />

            {/* botão Enviar / Abrir */}
            <TouchableOpacity
              onPress={() => enviarCurriculo(cur)}
              activeOpacity={0.85}
              style={{ borderRadius: 14, overflow: 'hidden' }}
            >
              <LinearGradient
                colors={[c1, c2]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 13 }}
              >
                <MaterialCommunityIcons name="share-variant-outline" size={16} color="#fff" />
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Abrir / Enviar currículo</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      );
    }

    /* ── Card currículo CRIADO NO APP ── */
    return (
      <Animatable.View animation="fadeInUp" duration={500} delay={index * 60}>
        <View style={[s.card, { backgroundColor: theme.colors.surface, borderColor: c1 + '28' }]}>
          <LinearGradient colors={[c1, c2]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={s.cardStripe} />

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
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                  <MaterialCommunityIcons name="clock-outline" size={11} color={theme.colors.onSurfaceVariant} />
                  <Text style={[s.cardDate, { color: theme.colors.onSurfaceVariant }]}>{fmtDate(cur.lastUpdated)}</Text>
                  {cur.idiomaCurriculo && cur.idiomaCurriculo !== 'pt-BR' ? (
                    <View style={[s.langFlag, { backgroundColor: c1 + '18', borderColor: c1 + '40' }]}>
                      <Text style={s.langFlagEmoji}>
                        {cur.idiomaCurriculo === 'en' ? '🇺🇸' : cur.idiomaCurriculo === 'es' ? '🇪🇸' : '🇧🇷'}
                      </Text>
                      <Text style={[s.langFlagTxt, { color: c1 }]}>
                        {cur.idiomaCurriculo === 'en' ? 'EN' : cur.idiomaCurriculo === 'es' ? 'ES' : 'PT'}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>

              <TouchableOpacity
                onPress={() => excluir(index)}
                style={[s.deleteBtn, { backgroundColor: theme.colors.errorContainer || '#FFEBEE' }]}
              >
                <MaterialCommunityIcons name="delete-outline" size={17} color={theme.colors.error} />
              </TouchableOpacity>
            </View>

            <View style={s.progressRow}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text style={{ fontSize: 10, color: theme.colors.onSurfaceVariant, fontWeight: '600' }}>Completude do perfil</Text>
                  <Text style={[s.progressLabel, { color: c1 }]}>{`${completude}%`}</Text>
                </View>
                <View style={[s.progressTrack, { backgroundColor: theme.colors.outlineVariant }]}>
                  <LinearGradient
                    colors={[c1, c2]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={[s.progressFill, { width: `${completude}%` }]}
                  />
                </View>
              </View>
            </View>

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <Header />
      <FlatList
        data={curriculos}
        renderItem={renderItem}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
      />

      {/* ── Modal de exclusão ── */}
      <Modal
        visible={!!deleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModal(null)}
      >
        <Pressable style={s.modalOverlay} onPress={() => setDeleteModal(null)}>
          <Pressable style={[s.modalBox, { backgroundColor: theme.colors.surface }]} onPress={() => {}}>

            {/* ícone */}
            <View style={[s.modalIconWrap, { backgroundColor: theme.colors.errorContainer || '#FFEBEE' }]}>
              <MaterialCommunityIcons name="delete-forever-outline" size={32} color={theme.colors.error} />
            </View>

            <Text style={[s.modalTitle, { color: theme.colors.onSurface }]}>Excluir currículo?</Text>

            {/* nome do arquivo em destaque */}
            <View style={[s.modalFileBox, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline + '40' }]}>
              <MaterialCommunityIcons
                name={deleteModal?.importado ? (deleteModal?.ext === 'PDF' ? 'file-pdf-box' : 'file-word-box') : 'file-document-outline'}
                size={20}
                color={deleteModal?.importado && deleteModal?.ext === 'PDF' ? '#E53E3E' : theme.colors.primary}
              />
              <Text style={[s.modalFileName, { color: theme.colors.onSurface }]} numberOfLines={2}>
                {deleteModal?.nome}
              </Text>
            </View>

            <Text style={[s.modalDesc, { color: theme.colors.onSurfaceVariant }]}>
              {deleteModal?.importado
                ? 'O arquivo original no seu celular não será apagado.'
                : 'Esta ação não pode ser desfeita.'}
            </Text>

            {/* botões */}
            <View style={s.modalBtns}>
              <TouchableOpacity
                onPress={() => setDeleteModal(null)}
                activeOpacity={0.8}
                style={[s.modalBtnCancel, { borderColor: theme.colors.outline + '60', backgroundColor: theme.colors.surfaceVariant }]}
              >
                <Text style={[s.modalBtnCancelText, { color: theme.colors.onSurfaceVariant }]}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmarExclusao}
                activeOpacity={0.85}
                style={[s.modalBtnDelete, { backgroundColor: theme.colors.error }]}
              >
                <MaterialCommunityIcons name="delete-outline" size={16} color="#fff" />
                <Text style={s.modalBtnDeleteText}>Excluir</Text>
              </TouchableOpacity>
            </View>

          </Pressable>
        </Pressable>
      </Modal>

      <Snackbar visible={!!snackbarMsg} onDismiss={() => setSnackbar(null)} duration={2500}>
        {snackbarMsg === 'importado' ? 'Currículo importado com sucesso!' : t('deleteSuccess')}
      </Snackbar>
    </SafeAreaView>
  );
}

/* ── completude ── */
function calcCompletude(cur) {
  let filled = 0, total = 6;
  if (cur.dadosPessoais?.nome)           filled++;
  if (cur.dadosPessoais?.email)          filled++;
  if (cur.dadosPessoais?.telefone)       filled++;
  if (cur.resumoProfissional)            filled++;
  if ((cur.experiencias||[]).length > 0) filled++;
  if ((cur.formacao||[]).length > 0)     filled++;
  return Math.round((filled / total) * 100);
}

const s = StyleSheet.create({
  /* HEADER FIXO */
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    overflow: 'hidden',
  },
  blob: { position: 'absolute', borderRadius: 999 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: 0.2 },
  headerSub:   { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 3, fontWeight: '500' },
  headerBackBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerAddBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6,
  },

  /* CARD */
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

  cardName: { fontSize: 15, fontWeight: '800' },
  cardSub:  { fontSize: 12, marginTop: 1 },
  cardDate: { fontSize: 11 },

  deleteBtn: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },

  progressRow:  { marginTop: 14 },
  progressTrack:{ height: 5, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: 5, borderRadius: 3 },
  progressLabel:{ fontSize: 11, fontWeight: '800' },

  /* CARD IMPORTADO */
  importCard: {
    borderRadius: 20, borderWidth: 1.5,
    overflow: 'hidden', padding: 16,
    elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 8,
  },
  importCardTop:    { flexDirection: 'row', alignItems: 'center' },
  importIconBox:    { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  importExtLabel:   { fontSize: 9, fontWeight: '900', letterSpacing: 1, marginTop: 1 },
  importedTagBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  importedTagText:  { fontSize: 10, fontWeight: '700' },
  langFlag:         { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, borderWidth: 1 },
  langFlagEmoji:    { fontSize: 11 },
  langFlagTxt:      { fontSize: 10, fontWeight: '700' },
  importDivider:    { height: 1, marginVertical: 14 },
  importCardActions:{ flexDirection: 'row', gap: 10 },
  importBtnOutline: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11, borderRadius: 14, borderWidth: 1.5 },
  importBtnFilled:  { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11 },
  importBtnText:    { fontWeight: '700', fontSize: 13 },

  /* MODAL EXCLUSÃO */
  modalOverlay:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalBox:           { width: '100%', borderRadius: 28, padding: 28, alignItems: 'center', elevation: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 20 },
  modalIconWrap:      { width: 72, height: 72, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  modalTitle:         { fontSize: 20, fontWeight: '900', marginBottom: 16, textAlign: 'center' },
  modalFileBox:       { flexDirection: 'row', alignItems: 'center', gap: 10, width: '100%', borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 12 },
  modalFileName:      { flex: 1, fontSize: 14, fontWeight: '700' },
  modalDesc:          { fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  modalBtns:          { flexDirection: 'row', gap: 12, width: '100%' },
  modalBtnCancel:     { flex: 1, paddingVertical: 14, borderRadius: 16, borderWidth: 1.5, alignItems: 'center' },
  modalBtnCancelText: { fontWeight: '700', fontSize: 14 },
  modalBtnDelete:     { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: 16 },
  modalBtnDeleteText: { color: '#fff', fontWeight: '800', fontSize: 14 },

  cardActions:     { flexDirection: 'row', gap: 10, marginTop: 14, paddingTop: 14, borderTopWidth: 1 },
  actionBtn:       { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 14, borderWidth: 1.5 },
  actionBtnFilled: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10 },
  actionBtnText:   { fontWeight: '700', fontSize: 13 },
});
