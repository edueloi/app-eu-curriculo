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

  const BG     = '#FFFFFF';
  const BORDER = '#F1F5F9';
  const MUTED  = '#94A3B8';
  const DARK   = '#1E293B';

  return (
    <View style={[d.root, { backgroundColor: BG }]}>

      {/* ══ HEADER com gradiente ══ */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary || theme.colors.primary]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={[d.header, { paddingTop: insets.top + 20 }]}
      >
        {/* blob decorativo */}
        <View style={[d.glow, { backgroundColor: 'rgba(255,255,255,0.12)' }]} />
        <View style={[d.glow2, { backgroundColor: 'rgba(255,255,255,0.07)' }]} />

        {/* perfil */}
        <View style={d.profileRow}>
          <View style={[d.avatarRing, { borderColor: 'rgba(255,255,255,0.6)' }]}>
            {profile?.foto ? (
              <Image source={{ uri: profile.foto }} style={d.avatarImg} />
            ) : (
              <View style={[d.avatarFallback, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
                <Text style={d.avatarInitials}>{getInitials(userName)}</Text>
              </View>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[d.name, { color: '#fff' }]} numberOfLines={1}>{userName}</Text>
            <Text style={[d.role, { color: 'rgba(255,255,255,0.7)' }]} numberOfLines={1}>{userRole}</Text>
          </View>
        </View>

        {/* botão novo currículo */}
        <TouchableOpacity
          style={d.newBtn}
          onPress={() => props.navigation.navigate('CriarCurrículo')}
          activeOpacity={0.82}
        >
          <MaterialCommunityIcons name="plus" size={15} color={theme.colors.primary} />
          <Text style={[d.newBtnTxt, { color: theme.colors.primary }]}>{t('createResume')}</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* ══ ITENS ══ */}
      <DrawerContentScrollView
        {...props}
        style={{ flex: 1, backgroundColor: BG }}
        contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 8, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {MENU_SECTIONS.map((section, si) => (
          <View key={si} style={{ marginBottom: 4 }}>
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
                    { backgroundColor: isActive ? item.color + '15' : 'transparent' },
                    isActive && { borderLeftWidth: 3, borderLeftColor: item.color },
                  ]}
                >
                  <View style={[
                    d.iconPill,
                    { backgroundColor: isActive ? item.color : item.color + '15' },
                  ]}>
                    <MaterialCommunityIcons
                      name={isActive ? item.activeIcon : item.icon}
                      size={18}
                      color={isActive ? '#fff' : item.color}
                    />
                  </View>

                  <Text style={[
                    d.itemLabel,
                    { color: isActive ? item.color : DARK, fontWeight: isActive ? '800' : '500' },
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
        <Text style={[d.footerText, { color: MUTED }]}>Currículo Expresso  •  v1.0</Text>
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
      screenOptions={({ navigation }) => ({
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
        headerLeft: () => (
          <TouchableOpacity
            style={{ marginLeft: 16, padding: 8 }}
            onPress={() => navigation.toggleDrawer()}
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="menu" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
        ),
        drawerType: 'front',
        overlayColor: 'rgba(0,0,0,0.55)',
        drawerStyle: {
          width: '76%',
          backgroundColor: '#FFFFFF',
          borderTopRightRadius: 32,
          borderBottomRightRadius: 32,
          overflow: 'hidden',
          elevation: 30,
          shadowColor: '#000',
          shadowOffset: { width: 10, height: 0 },
          shadowOpacity: 0.18,
          shadowRadius: 28,
        },
        swipeEnabled: true,
      })}
    >
      <Drawer.Screen name="Início"          component={TelaInicial}    options={{ title: t('dashboard') }} />
      <Drawer.Screen name="MeusCurriculos"  component={ListaCurriculos} options={{ headerShown: false }} />
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
    paddingBottom: 20,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 160, height: 160,
    borderRadius: 80,
    top: -50, right: -40,
  },
  glow2: {
    position: 'absolute',
    width: 100, height: 100,
    borderRadius: 50,
    bottom: -20, left: -20,
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
    borderWidth: 2,
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
    paddingVertical: 11, paddingHorizontal: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6,
  },
  newBtnTxt: { fontSize: 14, fontWeight: '800', flex: 1 },

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

