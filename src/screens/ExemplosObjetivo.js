import React, { useState, useMemo, useContext, useRef } from "react";
import {
  StyleSheet, View, FlatList, TouchableOpacity,
  Dimensions, Animated, Modal, StatusBar,
} from "react-native";
import { Text, Searchbar, useTheme } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { UserPreferencesContext } from "../context/UserPreferencesContext";
import { translationsFormsExemple } from "../i18n/translationsFormsExemple";

const { width } = Dimensions.get("window");

/* ── Card de frase individual ── */
function FraseCard({ frase, selecionado, onPress, idx, theme }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isSelected = selecionado === frase;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
    onPress(frase);
  };

  return (
    <Animatable.View animation="fadeInLeft" duration={350} delay={idx * 50}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.85}
          style={[
            s.fraseCard,
            {
              backgroundColor: isSelected
                ? theme.colors.primaryContainer
                : theme.colors.surface,
              borderColor: isSelected
                ? theme.colors.primary
                : theme.colors.outlineVariant,
              borderWidth: isSelected ? 2 : 1,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={isSelected ? "check-circle" : "format-quote-open"}
            size={20}
            color={isSelected ? theme.colors.primary : theme.colors.onSurfaceVariant}
            style={{ marginTop: 2 }}
          />
          <Text
            style={[
              s.fraseText,
              {
                color: isSelected ? theme.colors.primary : theme.colors.onSurface,
                fontWeight: isSelected ? "600" : "400",
              },
            ]}
          >
            {frase}
          </Text>
          {isSelected && (
            <Animatable.View animation="bounceIn" duration={400}>
              <View style={[s.selectedBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={s.selectedBadgeTxt}>Selecionado</Text>
              </View>
            </Animatable.View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </Animatable.View>
  );
}

/* ── Accordion de área ── */
function AreaAccordion({ item, selecionado, onSelect, index, theme }) {
  const [aberto, setAberto] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(rotateAnim, {
      toValue: aberto ? 0 : 1,
      friction: 6,
      useNativeDriver: true,
    }).start();
    setAberto(v => !v);
  };

  const rotate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] });

  return (
    <Animatable.View animation="fadeInUp" duration={450} delay={index * 60}>
      <TouchableOpacity onPress={toggle} activeOpacity={0.88} style={[s.accordionWrap, { backgroundColor: theme.colors.surface }]}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.accordionHeader}
        >
          <View style={s.accordionBlob} />
          <View style={[s.accordionIconBox, { backgroundColor: theme.colors.surface }]}>
            <MaterialCommunityIcons name={item.icon} size={20} color={theme.colors.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.accordionTitle}>{item.area}</Text>
            <Text style={s.accordionCount}>{item.frases.length} exemplos</Text>
          </View>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <MaterialCommunityIcons name="chevron-down" size={22} color="#fff" />
          </Animated.View>
        </LinearGradient>

        {aberto && (
          <View style={[s.accordionBody, { backgroundColor: theme.colors.surfaceVariant }]}>
            {item.frases.map((frase, idx) => (
              <FraseCard
                key={idx}
                frase={frase}
                selecionado={selecionado}
                onPress={onSelect}
                idx={idx}
                theme={theme}
              />
            ))}
          </View>
        )}
      </TouchableOpacity>
    </Animatable.View>
  );
}

/* ── Tela principal ── */
export default function ExemplosObjetivo({ navigation, route }) {
  const theme = useTheme();
  const { locale } = useContext(UserPreferencesContext);
  const [selecionado, setSelecionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    const data = Object.entries(translationsFormsExemple)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([area, dados]) => ({
        area,
        icon: dados.icon,
        frases: dados[locale] || dados.pt,
      }));
    const normalize = (str) =>
      str.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    if (!searchQuery) return data;
    const q = normalize(searchQuery);
    return data.filter((item) => normalize(item.area).includes(q));
  }, [searchQuery, locale]);

  const handleSelect = (frase) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelecionado(frase);
    setModalVisible(true);
  };

  const aplicar = () => {
    setModalVisible(false);
    if (selecionado) {
      navigation.goBack();
      const callback = route.params?.onSelecionar;
      if (typeof callback === 'function') {
        callback(selecionado);
      }
    }
  };

  const totalExemplos = filteredData.reduce((acc, i) => acc + i.frases.length, 0);

  return (
    <SafeAreaView style={[s.root, { backgroundColor: theme.colors.background }]} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

      {/* ── HEADER FIXO ── */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.header}
      >
        <View style={[s.blob, { width: 160, height: 160, top: -60, right: -50 }]} />
        <View style={[s.blob, { width: 80, height: 80, bottom: -20, left: 20 }]} />

        <View style={s.headerRow}>
          <TouchableOpacity style={s.headerBackBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.headerTitle}>Exemplos de Objetivo</Text>
            <Text style={s.headerSub}>{filteredData.length} áreas · {totalExemplos} frases</Text>
          </View>
          <View style={[s.headerIconBox, { backgroundColor: theme.colors.surface }]}>
            <MaterialCommunityIcons name="lightbulb-on-outline" size={22} color={theme.colors.primary} />
          </View>
        </View>

        {/* busca */}
        <View style={s.searchWrap}>
          <MaterialCommunityIcons name="magnify" size={18} color="rgba(255,255,255,0.7)" style={{ marginLeft: 4 }} />
          <Searchbar
            placeholder="Buscar área..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={s.searchbar}
            inputStyle={s.searchInput}
            iconColor="transparent"
            placeholderTextColor="rgba(255,255,255,0.55)"
          />
        </View>
      </LinearGradient>

      {/* ── LISTA ── */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.area}
        contentContainerStyle={s.listContent}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item, index }) => (
          <AreaAccordion
            item={item}
            selecionado={selecionado}
            onSelect={handleSelect}
            index={index}
            theme={theme}
          />
        )}
        ListEmptyComponent={
          <Animatable.View animation="fadeIn" style={s.emptyBox}>
            <Animatable.Text animation="pulse" iterationCount="infinite" style={s.emptyEmoji}>🔍</Animatable.Text>
            <Text style={[s.emptyTitle, { color: theme.colors.onSurface }]}>Nenhuma área encontrada</Text>
            <Text style={[s.emptySub, { color: theme.colors.onSurfaceVariant }]}>Tente outro termo de busca</Text>
          </Animatable.View>
        }
      />

      {/* ── MODAL DE CONFIRMAÇÃO ── */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={s.modalOverlay}>
          <Animatable.View animation="slideInUp" duration={350} style={[s.modalBox, { backgroundColor: theme.colors.surface }]}>
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.secondary]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={s.modalGradHeader}
            >
              <MaterialCommunityIcons name="check-circle-outline" size={28} color="#fff" />
              <Text style={s.modalGradTitle}>Usar este exemplo?</Text>
            </LinearGradient>

            <View style={s.modalBody}>
              <View style={[s.modalFraseBox, { backgroundColor: theme.colors.primaryContainer, borderColor: theme.colors.primary }]}>
                <MaterialCommunityIcons name="format-quote-open" size={18} color={theme.colors.primary} />
                <Text style={[s.modalFraseTxt, { color: theme.colors.onPrimaryContainer }]}>{selecionado}</Text>
              </View>
              <Text style={[s.modalHint, { color: theme.colors.onSurfaceVariant }]}>
                Este texto será copiado para o campo "Objetivo Profissional" do seu currículo.
              </Text>
            </View>

            <View style={s.modalActions}>
              <TouchableOpacity
                style={[s.modalBtnCancel, { borderColor: theme.colors.outlineVariant }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[s.modalBtnCancelTxt, { color: theme.colors.onSurfaceVariant }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.modalBtnConfirm} onPress={aplicar}>
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.secondary]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={s.modalBtnGrad}
                >
                  <MaterialCommunityIcons name="check" size={16} color="#fff" />
                  <Text style={s.modalBtnGradTxt}>Usar exemplo</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },

  /* header */
  header:        { paddingHorizontal: 16, paddingVertical: 16, overflow: "hidden", elevation: 6 },
  blob:          { position: "absolute", borderRadius: 999, backgroundColor: "rgba(255,255,255,0.07)" },
  headerRow:     { flexDirection: "row", alignItems: "center" },
  headerBackBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center" },
  headerTitle:   { color: "#fff", fontSize: 20, fontWeight: "900", letterSpacing: 0.2 },
  headerSub:     { color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 2 },
  headerIconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: "center", alignItems: "center", elevation: 4 },

  /* busca */
  searchWrap:  { flexDirection: "row", alignItems: "center", marginTop: 12, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 14, paddingHorizontal: 6, borderWidth: 1, borderColor: "rgba(255,255,255,0.25)" },
  searchbar:   { flex: 1, backgroundColor: "transparent", elevation: 0, height: 42 },
  searchInput: { color: "#fff", fontSize: 14 },

  /* lista */
  listContent: { padding: 16, paddingBottom: 48, gap: 12 },

  /* accordion */
  accordionWrap:    { borderRadius: 18, overflow: "hidden", elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6 },
  accordionHeader:  { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, overflow: "hidden" },
  accordionBlob:    { position: "absolute", width: 80, height: 80, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.1)", right: -20, top: -20 },
  accordionIconBox: { width: 38, height: 38, borderRadius: 12, justifyContent: "center", alignItems: "center", elevation: 2 },
  accordionTitle:   { color: "#fff", fontSize: 15, fontWeight: "800" },
  accordionCount:   { color: "rgba(255,255,255,0.75)", fontSize: 11, marginTop: 2 },
  accordionBody:    { paddingVertical: 8, paddingHorizontal: 10, gap: 8 },

  /* frase card */
  fraseCard:        { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 14, borderRadius: 14 },
  fraseText:        { flex: 1, fontSize: 14, lineHeight: 22 },
  selectedBadge:    { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, marginTop: 6 },
  selectedBadgeTxt: { color: "#fff", fontSize: 11, fontWeight: "700" },

  /* empty */
  emptyBox:   { alignItems: "center", paddingTop: 60, gap: 10 },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontSize: 18, fontWeight: "700" },
  emptySub:   { fontSize: 14 },

  /* modal */
  modalOverlay:     { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalBox:         { borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: "hidden" },
  modalGradHeader:  { flexDirection: "row", alignItems: "center", gap: 10, padding: 20, paddingBottom: 16 },
  modalGradTitle:   { color: "#fff", fontSize: 18, fontWeight: "800" },
  modalBody:        { padding: 20, gap: 12 },
  modalFraseBox:    { flexDirection: "row", gap: 10, padding: 14, borderRadius: 14, borderWidth: 1.5, alignItems: "flex-start" },
  modalFraseTxt:    { flex: 1, fontSize: 14, lineHeight: 22, fontStyle: "italic" },
  modalHint:        { fontSize: 13, lineHeight: 18 },
  modalActions:     { flexDirection: "row", gap: 10, padding: 20, paddingTop: 0, paddingBottom: 36 },
  modalBtnCancel:   { flex: 1, borderWidth: 1.5, justifyContent: "center", alignItems: "center", paddingVertical: 14, borderRadius: 14 },
  modalBtnCancelTxt:{ fontSize: 14, fontWeight: "600" },
  modalBtnConfirm:  { flex: 1, borderRadius: 14, overflow: "hidden" },
  modalBtnGrad:     { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 14 },
  modalBtnGradTxt:  { color: "#fff", fontSize: 14, fontWeight: "700" },
});
