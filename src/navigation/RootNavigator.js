import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from "./AppNavigator";

// Importação dos ecrãs que abrem por cima
import ExemplosObjetivo from "../screens/ExemplosObjetivo";
import SitesRecomendados from "../screens/SitesRecomendados";
import SelecionarTemplate from "../screens/SelecionarTemplate";
import PreviewCurriculo from "../screens/PreviewCurriculo";
import BlogScreen from "../screens/BlogScreen";
import ArtigoScreen from '../screens/ArtigoScreen';
import TelaFormulario from "../screens/TelaFormulario";
import QuizPerfil from "../screens/QuizPerfil";
import QuizEntrevista from "../screens/QuizEntrevista";

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {/* O primeiro ecrã é a app inteira com o menu lateral */}
          <Stack.Screen
            name="DrawerApp"
            component={AppNavigator}
            options={{ headerShown: false }}
          />

          {/* Ecrãs que abrem por cima, com o seu próprio cabeçalho */}
          <Stack.Screen name="SitesRecomendados" component={SitesRecomendados} options={{ headerShown: false }} />
          <Stack.Screen name="SelecionarTemplate" component={SelecionarTemplate} options={{ headerShown: false }} />
          <Stack.Screen name="PreviewCurriculo" component={PreviewCurriculo} options={{ headerShown: false }} />
          <Stack.Screen name="BlogScreen" component={BlogScreen} options={{ headerShown: false }}/>
           <Stack.Screen name="ArtigoScreen" component={ArtigoScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CriarCurrículo" component={TelaFormulario} options={{ headerShown: false }} />
          <Stack.Screen name="QuizPerfil" component={QuizPerfil} options={{ headerShown: false }} />
          <Stack.Screen name="QuizEntrevista" component={QuizEntrevista} options={{ headerShown: false }} />

          {/* Ecrã que abre como um "modal" */}
          <Stack.Screen
            name="ExemplosObjetivo"
            component={ExemplosObjetivo}
            options={{
              headerShown: false,
              presentation: "modal",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}