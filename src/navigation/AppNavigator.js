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

const MENU_ITEMS = [
  { name: 'Início',         labelKey: 'dashboard', icon: 'home-outline',                  activeIcon: 'home' },
  { name: 'MeusCurriculos', labelKey: 'resumes',   icon: 'file-document-outline',         activeIcon: 'file-document' },
  { name: 'Histórico',      labelKey: 'history',   icon: 'history',                       activeIcon: 'history' },
  { name: 'Tutoriais',      labelKey: 'tutorials', icon: 'school-outline',                activeIcon: 'school' },
  { name: 'Configurações',  labelKey: 'settings',  icon: 'cog-outline',                   activeIcon: 'cog' },
  { name: 'Sobre',          labelKey: 'about',     icon: 'information-outline',           activeIcon: 'information' },
  { name: 'Suporte',        labelKey: 'support',   icon: 'help-circle-outline',           activeIcon: 'help-circle' },
];

function CustomDrawerContent(props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { t, profile } = useContext(UserPreferencesContext);

  const activeRoute = props.state?.routes[props.state.index]?.name;

  const userName  = profile?.nome      || t('user');
  const userRole  = profile?.profissao || t('profile');

  return (
    <View style={[d.root, { backgroundColor: theme.colors.background }]}>

      {/* ── CABEÇALHO GRADIENTE ── */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1.2 }}
        style={[d.header, { paddingTop: insets.top + 24 }]}
      >
        {/* Avatar */}
        <View style={d.avatarWrap}>
          {profile?.foto ? (
            <Image source={{ uri: profile.foto }} style={d.avatarImg} />
          ) : (
            <View style={d.avatarFallback}>
              <Text style={d.avatarInitials}>{getInitials(userName)}</Text>
            </View>
          )}
          <View style={d.onlineDot} />
        </View>

        {/* Info */}
        <Text style={d.name} numberOfLines={1}>{userName}</Text>
        <Text style={d.role} numberOfLines={1}>{userRole}</Text>

        {/* CTA pill */}
        <TouchableOpacity
          style={d.cta}
          onPress={() => props.navigation.navigate('CriarCurrículo')}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="plus" size={16} color={theme.colors.primary} />
          <Text style={[d.ctaText, { color: theme.colors.primary }]}>{t('createResume')}</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* ── MENU ── */}
      <DrawerContentScrollView
        {...props}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {MENU_ITEMS.map((item) => {
          const isActive = activeRoute === item.name;
          return (
            <TouchableOpacity
              key={item.name}
              onPress={() => props.navigation.navigate(item.name)}
              activeOpacity={0.7}
              style={[
                d.item,
                isActive && { backgroundColor: theme.colors.primary + '14' },
              ]}
            >
              {/* Ícone com fundo */}
              <View
                style={[
                  d.itemIconBox,
                  {
                    backgroundColor: isActive
                      ? theme.colors.primary
                      : theme.colors.surfaceVariant,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={isActive ? item.activeIcon : item.icon}
                  size={19}
                  color={isActive ? '#fff' : theme.colors.onSurfaceVariant}
                />
              </View>

              <Text
                style={[
                  d.itemLabel,
                  {
                    color: isActive ? theme.colors.primary : theme.colors.onSurface,
                    fontWeight: isActive ? '800' : '500',
                  },
                ]}
              >
                {t(item.labelKey)}
              </Text>

              {/* Barra ativa */}
              {isActive && (
                <View style={[d.activeBar, { backgroundColor: theme.colors.primary }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </DrawerContentScrollView>

      {/* ── RODAPÉ ── */}
      <View style={[d.footer, { borderTopColor: theme.colors.outlineVariant, paddingBottom: insets.bottom + 10 }]}>
        <MaterialCommunityIcons name="briefcase-outline" size={14} color={theme.colors.onSurfaceVariant} />
        <Text style={[d.footerText, { color: theme.colors.onSurfaceVariant }]}>
          App Currículos v1.0
        </Text>
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
        // ── HEADER ──
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

        // ── DRAWER: overlay, NÃO empurra o conteúdo ──
        drawerType: 'front',          // <-- muda o comportamento
        overlayColor: 'rgba(0,0,0,0.45)',

        drawerStyle: {
          width: '72%',
          backgroundColor: theme.colors.background,
          // cantos arredondados só do lado direito
          borderTopRightRadius: 28,
          borderBottomRightRadius: 28,
          overflow: 'hidden',
          // sombra forte para separar visualmente
          elevation: 24,
          shadowColor: '#000',
          shadowOffset: { width: 6, height: 0 },
          shadowOpacity: 0.35,
          shadowRadius: 20,
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

/* ─────────────────────────────────── STYLES ─────────────────────────────── */
const d = StyleSheet.create({
  root: { flex: 1 },

  /* cabeçalho */
  header: {
    paddingHorizontal: 22,
    paddingBottom: 24,
    borderBottomRightRadius: 0,  // o drawer já tem radius
  },
  avatarWrap: { position: 'relative', marginBottom: 14, alignSelf: 'flex-start' },
  avatarImg: {
    width: 72,
    height: 72,
    borderRadius: 22,
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  avatarFallback: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  avatarInitials: { fontSize: 28, fontWeight: '900', color: '#fff' },
  onlineDot: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2.5,
    borderColor: '#fff',
  },
  name: { fontSize: 20, fontWeight: '900', color: '#fff', letterSpacing: 0.1 },
  role: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2, marginBottom: 18 },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingVertical: 9,
    paddingHorizontal: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  ctaText: { fontSize: 13, fontWeight: '800' },

  /* itens de menu */
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 2,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 14,
    position: 'relative',
  },
  itemIconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },
  itemLabel: { flex: 1, fontSize: 15 },
  activeBar: {
    width: 4,
    height: 22,
    borderRadius: 2,
  },

  /* rodapé */
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  footerText: { fontSize: 11, fontWeight: '600', opacity: 0.7 },
});
