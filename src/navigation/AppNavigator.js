// AppNavigator.js
import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Title, Paragraph, Avatar, Button, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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

function CustomDrawerContent(props) {
  const theme = useTheme();
  const { t, profile } = useContext(UserPreferencesContext);

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.drawerHeader, { backgroundColor: theme.colors.primary }]}>
        <Avatar.Image
          size={80}
          source={{ uri: profile?.foto || "https://i.pravatar.cc/300" }}
          style={styles.avatar}
        />
        <Title style={styles.drawerTitle}>{profile?.nome || "Usuário"}</Title>
        <Paragraph style={styles.drawerSubtitle}>
          {profile?.profissao || t("profile")}
        </Paragraph>
      </View>

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={styles.drawerFooter}>
        <Button
          mode="contained"
          icon="plus-circle"
          style={styles.createButton}
          onPress={() => props.navigation.navigate("CriarCurrículo")}
        >
          {t("createResume")}
        </Button>
      </View>
    </View>
  );
}

const Drawer = createDrawerNavigator();

export function AppNavigator() {
  const { t } = useContext(UserPreferencesContext);

  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="Início"
        component={TelaInicial}
        options={{
          title: t("dashboard"),
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Tutoriais"
        component={TelaTutoriais}
        options={{
          title: t("tutorials"),
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="school" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Histórico"
        component={TelaHistorico}
        options={{
          title: t("history"),
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="history" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="MeusCurrículos"
        component={ListaCurriculos}
        options={{
          title: t("resumes"),
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="folder" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="SelecionarTemplate"
        component={SelecionarTemplate}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="PreviewCurriculo"
        component={PreviewCurriculo}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="CriarCurrículo"
        component={TelaFormulario}
        options={{
          title: t("editResume"),
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="file-document-edit" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Configurações"
        component={SettingsScreen}
        options={{
          title: t("settings"),
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Sobre"
        component={AboutScreen}
        options={{
          title: t("about"),
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="information-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Suporte"
        component={SupportScreen}
        options={{
          title: t("support"),
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="help-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerHeader: { alignItems: "center", paddingVertical: 30 },
  avatar: { borderWidth: 2, borderColor: "#fff", marginBottom: 10 },
  drawerTitle: { fontSize: 18, color: "#fff", fontWeight: "bold" },
  drawerSubtitle: { fontSize: 14, color: "#f1f1f1" },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: "#dedede",
    padding: 10,
    marginBottom: 50,
  },
  createButton: { marginTop: 10 },
});
