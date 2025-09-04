import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppNavigator } from "./AppNavigator";
import ExemplosObjetivo from "../screens/ExemplosObjetivo";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Drawer principal */}
        <Stack.Screen
          name="DrawerApp"
          component={AppNavigator}
          options={{ headerShown: false }}
        />

        {/* Tela de exemplo, tipo modal */}
        <Stack.Screen
          name="ExemplosObjetivo"
          component={ExemplosObjetivo}
          options={{
            headerShown: false,
            presentation: "modal", // aparece fullscreen como modal
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
