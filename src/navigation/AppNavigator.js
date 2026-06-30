import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TelaInicial from '../screens/TelaInicial';
import TelaFormulario from '../screens/TelaFormulario';
import SettingsScreen from '../screens/SettingsScreen';
import ListaCurriculos from '../screens/ListaCurriculos';
import TelaHistorico from '../screens/TelaHistorico';
import TelaTutoriais from '../screens/TelaTutoriais';
import AboutScreen from '../screens/AboutScreen';
import SupportScreen from '../screens/SupportScreen';

import { UserPreferencesContext } from '../context/UserPreferencesContext';

const Drawer = createDrawerNavigator();

const MENU_SECTIONS = [
  {
    title: null,
    items: [
      { name: 'Início',         labelKey: 'dashboard', icon: 'home-variant-outline', activeIcon: 'home-variant',     color: '#4F46E5' },
      { name: 'MeusCurriculos', labelKey: 'resumes',   icon: 'file-document-multiple-outline', activeIcon: 'file-document-multiple', color: '#059669' },
      { name: 'Histórico',      labelKey: 'history',   icon: 'clock-time-four-outline', activeIcon: 'clock-time-four', color: '#D97706' },
    ],
  },
  {
    title: 'Aprender',
    items: [
      { name: 'Tutoriais',      labelKey: 'tutorials', icon: 'school-outline',       activeIcon: 'school',         color: '#DC2626' },
    ],
  },
  {
    title: 'Conta',
    items: [
      { name: 'Configurações',  labelKey: 'settings',  icon: 'cog-outline',          activeIcon: 'cog',            color: '#7C3AED' },
      { name: 'Sobre',          labelKey: 'about',     icon: 'information-outline',  activeIcon: 'information',    color: '#0891B2' },
      { name: 'Suporte',        labelKey: 'support',   icon: 'lifebuoy',             activeIcon: 'lifebuoy',       color: '#BE185D' },
    ],
  },
];

function CustomDrawerContent(props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { t, profile } = useContext(UserPreferencesContext);

  const activeRoute = props.state?.routes[props.state.index]?.name;
  const userName = profile?.nome      || t('user');
  const userRole = profile?.profissao || t('profile');

  // Sidebar sempre escura (dark glass)
  const BG       = '#0F172A';
  const BG2      = '#1E293B';
  const BORDER   = 'rgba(255,255,255,0.07)';
  const MUTED    = 'rgba(255,255,255,0.45)';
  const BRIGHT   = '#F1F5F9';

  return (
    <View style={[d.root, { backgroundColor: BG }]}>

      {/* ══ HEADER ══ */}
      <View style={[d.header, { paddingTop: insets.top + 18 }]}>
        {/* glow blob */}
        <View style={[d.glow, { backgroundColor: theme.colors.primary + '40' }]} />

        {/* linha de perfil */}
        <View style={d.profileRow}>
          <View style={[d.avatarRing, { borderColor: theme.colors.primary }]}>
            {profile?.foto ? (
              <Image source={{ uri: profile.foto }} style={d.avatarImg} />
            ) : (
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary || theme.colors.primary]}
                style={d.avatarFallback}
              >
                <Text style={d.avatarInitials}>{getInitials(userName)}</Text>
              </LinearGradient>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[d.name, { color: BRIGHT }]} numberOfLines={1}>{userName}</Text>
            <Text style={[d.role, { color: MUTED }]} numberOfLines={1}>{userRole}</Text>
          </View>
        </View>

        {/* pill "novo currículo" */}
        <TouchableOpacity
          style={[d.newBtn, { backgroundColor: theme.colors.primary }]}
          onPress={() => props.navigation.navigate('CriarCurrículo')}
          activeOpacity={0.82}
        >
          <MaterialCommunityIcons name="plus" size={15} color="#fff" />
          <Text style={d.newBtnTxt}>{t('createResume')}</Text>
        </TouchableOpacity>

        <View style={[d.headerDivider, { backgroundColor: BORDER }]} />
      </View>

      {/* ══ ITENS ══ */}
      <DrawerContentScrollView
        {...props}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 4, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {MENU_SECTIONS.map((section, si) => (
          <View key={si} style={{ marginBottom: 6 }}>
            {section.title && (
              <Text style={[d.sectionLabel, { color: MUTED }]}>
                {section.title.toUpperCase()}
              </Text>
            )}

            {section.items.map((item) => {
              const isActive = activeRoute === item.name;
              return (
                <TouchableOpacity
                  key={item.name}
                  onPress={() => props.navigation.navigate(item.name)}
                  activeOpacity={0.7}
                  style={[
                    d.item,
                    { backgroundColor: isActive ? item.color + '22' : 'transparent' },
                    isActive && { borderLeftWidth: 3, borderLeftColor: item.color },
                  ]}
                >
                  {/* ícone */}
                  <View style={[
                    d.iconPill,
                    { backgroundColor: isActive ? item.color : BG2 },
                  ]}>
                    <MaterialCommunityIcons
                      name={isActive ? item.activeIcon : item.icon}
                      size={18}
                      color={isActive ? '#fff' : MUTED}
                    />
                  </View>

                  {/* label */}
                  <Text style={[
                    d.itemLabel,
                    { color: isActive ? '#fff' : MUTED, fontWeight: isActive ? '800' : '400' },
                  ]}>
                    {t(item.labelKey)}
                  </Text>

                  {isActive && (
                    <View style={[d.activeDot, { backgroundColor: item.color }]} />
                  )}
                </TouchableOpacity>
              );
            })}

            {si < MENU_SECTIONS.length - 1 && (
              <View style={[d.divider, { backgroundColor: BORDER }]} />
            )}
          </View>
        ))}
      </DrawerContentScrollView>

      {/* ══ RODAPÉ ══ */}
      <View style={[d.footer, { paddingBottom: insets.bottom + 14, borderTopColor: BORDER }]}>
        <Text style={[d.footerText, { color: MUTED }]}>App Currículos  •  v1.0</Text>
      </View>
    </View>
  );
}

function getInitials(name) {
  if (!name) return '?';
  const p = name.trim().split(' ');
  return p.length === 1
    ? p[0][0].toUpperCase()
    : (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

export function AppNavigator() {
  const { t } = useContext(UserPreferencesContext);
  const theme  = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.outlineVariant,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: { fontWeight: '800', fontSize: 17 },
        drawerType: 'front',
        overlayColor: 'rgba(0,0,0,0.55)',
        drawerStyle: {
          width: '76%',
          backgroundColor: '#0F172A',
          borderTopRightRadius: 32,
          borderBottomRightRadius: 32,
          overflow: 'hidden',
          elevation: 30,
          shadowColor: '#000',
          shadowOffset: { width: 10, height: 0 },
          shadowOpacity: 0.4,
          shadowRadius: 28,
        },
        swipeEnabled: true,
      }}
    >
      <Drawer.Screen name="Início"          component={TelaInicial}    options={{ title: t('dashboard') }} />
      <Drawer.Screen name="MeusCurriculos"  component={ListaCurriculos} options={{ title: t('resumes') }} />
      <Drawer.Screen name="CriarCurrículo"  component={TelaFormulario}  options={{ headerShown: false, drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="Histórico"       component={TelaHistorico}  options={{ title: t('history') }} />
      <Drawer.Screen name="Tutoriais"       component={TelaTutoriais}  options={{ title: t('tutorials') }} />
      <Drawer.Screen name="Configurações"   component={SettingsScreen}  options={{ title: t('settings') }} />
      <Drawer.Screen name="Sobre"           component={AboutScreen}    options={{ title: t('about') }} />
      <Drawer.Screen name="Suporte"         component={SupportScreen}  options={{ title: t('support') }} />
    </Drawer.Navigator>
  );
}

/* ─────────────────── STYLES ─────────────────── */
const d = StyleSheet.create({
  root: { flex: 1 },

  /* HEADER */
  header: {
    paddingHorizontal: 20,
    paddingBottom: 0,
    position: 'relative',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 200, height: 200,
    borderRadius: 100,
    top: -80, right: -60,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  avatarRing: {
    width: 56, height: 56,
    borderRadius: 28,
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 56, height: 56, borderRadius: 28 },
  avatarFallback: {
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarInitials: { fontSize: 20, fontWeight: '900', color: '#fff' },
  name: { fontSize: 16, fontWeight: '800', letterSpacing: 0.1, marginBottom: 2 },
  role: { fontSize: 12, fontWeight: '500' },

  newBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'stretch',
    borderRadius: 14,
    paddingVertical: 12, paddingHorizontal: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8,
  },
  newBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '800', flex: 1 },

  headerDivider: { height: 1, marginBottom: 8 },

  /* SEÇÕES */
  sectionLabel: {
    fontSize: 10, fontWeight: '700', letterSpacing: 1.4,
    marginHorizontal: 4, marginTop: 16, marginBottom: 6,
  },
  divider: { height: 1, marginVertical: 10, borderRadius: 1, marginHorizontal: 4 },

  /* ITENS */
  item: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 11, paddingHorizontal: 12,
    borderRadius: 14, marginVertical: 2,
    borderLeftWidth: 3, borderLeftColor: 'transparent',
    gap: 12,
  },
  iconPill: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  itemLabel: { flex: 1, fontSize: 14, letterSpacing: 0.1 },
  activeDot: {
    width: 7, height: 7, borderRadius: 4,
  },

  /* RODAPÉ */
  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
});

