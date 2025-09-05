import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { createStackNavigator } from '@react-navigation/stack';
import { Title, Paragraph, Avatar, useTheme, Divider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

// Importação de todos os seus ecrãs
import TelaInicial from "../screens/TelaInicial";
import SelecionarTemplate from "../screens/SelecionarTemplate";
import TelaFormulario from "../screens/TelaFormulario";
import SettingsScreen from "../screens/SettingsScreen";
import ListaCurriculos from "../screens/ListaCurriculos";
import PreviewCurriculo from "../screens/PreviewCurriculo";
import TelaHistorico from "../screens/TelaHistorico";
import TelaTutoriais from "../screens/TelaTutoriais";
import AboutScreen from "../screens/AboutScreen";
import { UserPreferencesContext } from "../context/UserPreferencesContext";
import SupportScreen from "../screens/SupportScreen";
import ExemplosObjetivo from "../screens/ExemplosObjetivo";
import SitesRecomendados from "../screens/SitesRecomendados";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Pilha de navegação para o fluxo da Tela Inicial
function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TelaInicial" component={TelaInicial} />
      <Stack.Screen name="SitesRecomendados" component={SitesRecomendados} />
    </Stack.Navigator>
  );
}

// Pilha de navegação para o fluxo de "Meus Currículos"
function CurriculoStackNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="ListaCurriculos"  // 🔹 Aqui garante que abre na lista
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen 
        name="ListaCurriculos" 
        component={ListaCurriculos} 
      />
      <Stack.Screen 
        name="SelecionarTemplate" 
        component={SelecionarTemplate} 
      />
      <Stack.Screen 
        name="PreviewCurriculo" 
        component={PreviewCurriculo} 
      />
    </Stack.Navigator>
  );
}


// Componente completo e personalizado para o conteúdo do menu
function CustomDrawerContent(props) {
  const theme = useTheme();
  const { t, profile } = useContext(UserPreferencesContext);
  const styles = createStyles(theme);

  return (
    <View style={styles.drawerContainer}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.drawerHeader}
      >
        {profile?.foto ? (
          <Avatar.Image
            size={80}
            source={{ uri: profile.foto }}
            style={styles.avatar}
          />
        ) : (
          <Avatar.Image
            size={80}
            source={require('../../assets/avatar-placeholder.png')}
            style={styles.avatar}
          />
        )}
        <Title style={styles.drawerTitle}>{profile?.nome || t("user")}</Title>
        <Paragraph style={styles.drawerSubtitle}>
          {profile?.profissao || t("profile")}
        </Paragraph>
      </LinearGradient>

      <DrawerContentScrollView {...props} style={{ paddingTop: 8 }}>
        <DrawerItemList {...props} />
        <Divider style={styles.separator} />
        <DrawerItem
          label={t("createResume")}
          labelStyle={styles.createButtonLabel}
          icon={() => (
            <LinearGradient
              colors={[theme.colors.secondary, theme.colors.primary]}
              style={styles.createButtonIconWrapper}
            >
              <MaterialCommunityIcons name="plus" color={"#fff"} size={24} />
            </LinearGradient>
          )}
          onPress={() => props.navigation.navigate("CriarCurrículo")}
          style={styles.createButtonDrawerItem}
        />
      </DrawerContentScrollView>
    </View>
  );
}

// Componente principal do Navegador
export function AppNavigator() {
  const { t } = useContext(UserPreferencesContext);
  const theme = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.onSurface,
        drawerStyle: {
          width: '80%',
          backgroundColor: theme.colors.background,
        },
        drawerActiveTintColor: theme.colors.onPrimary,
        drawerActiveBackgroundColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.onSurfaceVariant,
        drawerLabelStyle: {
          marginLeft: 0,
          fontSize: 15,
          fontWeight: '500',
        },
        drawerItemStyle: {
          borderRadius: 12,
          marginHorizontal: 16,
        },
      }}
    >
      <Drawer.Screen 
        name="InícioStack" 
        component={HomeStackNavigator} 
        options={{ title: t("dashboard"), drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="view-dashboard-outline" color={color} size={size} /> }} 
      />
      <Drawer.Screen 
        name="MeusCurriculos"   // 🔹 Melhor trocar o nome para simples
        component={CurriculoStackNavigator} 
        options={{ 
          title: t("resumes"), 
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="folder-multiple-outline" color={color} size={size} />
          ) 
        }} 
      />

      <Drawer.Screen 
        name="Tutoriais" 
        component={TelaTutoriais} 
        options={{ title: t("tutorials"), drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="school-outline" color={color} size={size} /> }} 
      />
      <Drawer.Screen 
        name="Histórico" 
        component={TelaHistorico} 
        options={{ title: t("history"), drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="history" color={color} size={size} /> }} 
      />
      <Drawer.Screen 
        name="Configurações" 
        component={SettingsScreen} 
        options={{ title: t("settings"), drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="cog-outline" color={color} size={size} /> }} 
      />
      <Drawer.Screen 
        name="Sobre" 
        component={AboutScreen} 
        options={{ title: t("about"), drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="information-outline" color={color} size={size} /> }} 
      />
      <Drawer.Screen 
        name="Suporte" 
        component={SupportScreen} 
        options={{ title: t("support"), drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="help-circle-outline" color={color} size={size} /> }} 
      />
      
      {/* Ecrãs que não aparecem no menu mas são necessários para a navegação */}
      <Drawer.Screen 
        name="CriarCurrículo" 
        component={TelaFormulario} 
        options={{ title: t("editResume"), drawerItemStyle: { display: 'none' } }} 
      />
      <Drawer.Screen 
        name="ExemplosObjetivo" 
        component={ExemplosObjetivo} 
        options={{ drawerItemStyle: { display: 'none' } }}
      />
    </Drawer.Navigator>
  );
}

const createStyles = (theme) => StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  drawerHeader: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  avatar: {
    marginTop: 15,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.25)",
    marginBottom: 12,
    backgroundColor: theme.colors.surface,
  },
  drawerTitle: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  drawerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.outlineVariant,
    marginVertical: 12,
    marginHorizontal: 16,
  },
  createButtonDrawerItem: {
    marginHorizontal: 16,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 12,
    
  },
  createButtonIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 0,
  },
  createButtonLabel: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 0,
  },
});