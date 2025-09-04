import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const slides = [
  {
    key: "1",
    title: "🎉 Bem-vindo ao Criador de Currículos",
    text: "Crie documentos profissionais e modernos em poucos minutos.",
    image: require("../../assets/images/welcome_create-removebg-preview.png"),
    colors: ["#667eea", "#764ba2"],
  },
  {
    key: "2",
    title: "Personalização Total",
    text: "Escolha templates, cores e fontes para um currículo único.",
    image: require("../../assets/images/welcome_customize-removebg-preview.png"),
    colors: ["#764ba2", "#667eea"],
  },
  {
    key: "3",
    title: "Exporte e Compartilhe",
    text: "Gere seu currículo em PDF com um toque e envie para as melhores vagas.",
    image: require("../../assets/images/welcome_export-removebg-preview.png"),
    colors: ["#667eea", "#764ba2"],
  },
  {
    key: "4",
    title: "Tudo Pronto para o Sucesso!",
    text: "Vamos juntos conquistar a sua próxima grande oportunidade. 🙏",
    image: require("../../assets/images/welcome_ready-removebg-preview.png"),
    colors: ["#764ba2", "#667eea"],
  },
];

const Backdrop = ({ scrollX }) => {
  const backgroundColor = scrollX.interpolate({
    inputRange: slides.map((_, i) => i * width),
    outputRange: slides.map((slide) => slide.colors[0]),
  });
  return (
    <Animated.View
      style={[StyleSheet.absoluteFillObject, { backgroundColor }]}
    />
  );
};

const Pagination = ({ scrollX }) => (
  <View style={styles.paginationContainer}>
    {slides.map((_, i) => {
      const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
      const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.8, 1.4, 0.8],
        extrapolate: "clamp",
      });
      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.6, 1, 0.6],
        extrapolate: "clamp",
      });
      return (
        <Animated.View
          key={i}
          style={[styles.dot, { transform: [{ scale }], opacity }]}
        />
      );
    })}
  </View>
);

export default function WelcomeScreen({ onFinish }) {
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleFinish = async () => {
    await AsyncStorage.setItem("hasSeenWelcome", "true");
    if (onFinish) onFinish(); // 👈 avisa o AppContent para renderizar o AppNavigator
  };

  return (
    <View style={styles.container}>
      <Backdrop scrollX={scrollX} />
      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        keyExtractor={(item) => item.key}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];
          const imageTranslateX = scrollX.interpolate({
            inputRange,
            outputRange: [50, 0, -50],
          });
          const textTranslateX = scrollX.interpolate({
            inputRange,
            outputRange: [100, 0, -100],
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
          });

          const isLastSlide = index === slides.length - 1;

          return (
            <View style={styles.slide}>
              <Animated.Image
                source={item.image}
                style={[
                  styles.image,
                  { transform: [{ translateX: imageTranslateX }] },
                ]}
                resizeMode="contain"
              />
              <View>
                <Animated.Text
                  style={[
                    styles.title,
                    { transform: [{ translateX: textTranslateX }], opacity },
                  ]}
                >
                  {item.title}
                </Animated.Text>
                <Animated.Text
                  style={[
                    styles.text,
                    { transform: [{ translateX: textTranslateX }], opacity },
                  ]}
                >
                  {item.text}
                </Animated.Text>

                {isLastSlide && (
                  <Animated.View style={[{ opacity }, styles.buttonWrapper]}>
                    <TouchableOpacity onPress={handleFinish} activeOpacity={0.8}>
                      <LinearGradient
                        colors={["#82f4b1", "#30c67c"]}
                        style={styles.finalButton}
                      >
                        <Text style={styles.buttonText}>Começar Agora</Text>
                        <MaterialIcons
                          name="arrow-forward-ios"
                          size={18}
                          color="#fff"
                        />
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>
                )}
              </View>
            </View>
          );
        }}
      />
      <Pagination scrollX={scrollX} />
      <TouchableOpacity style={styles.skipButton} onPress={handleFinish}>
        <Text style={styles.skipText}>Pular</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: {
    width,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: width * 0.75,
    height: "40%",
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    alignSelf: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    margin: 8,
  },
  skipButton: {
    position: "absolute",
    top: 50,
    right: 20,
    padding: 10,
  },
  skipText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonWrapper: {
    alignItems: "center",
    marginTop: 30,
  },
  finalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
});
