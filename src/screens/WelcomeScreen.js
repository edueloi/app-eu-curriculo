import React, { useRef, useContext, useState } from "react";
import {
  View, StyleSheet, Dimensions, Text, TouchableOpacity, FlatList, Animated, Image
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import { UserPreferencesContext } from "../context/UserPreferencesContext";
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get("window");

const slides = [
  { key: "0", icon: "translate", image: null }, // Slide de seleção de idioma
  { key: "1", icon: "file-plus", image: require("../../assets/images/welcome_create-removebg-preview.png") },
  { key: "2", icon: "brush", image: require("../../assets/images/welcome_customize-removebg-preview.png") },
  { key: "3", icon: "file-pdf-box", image: require("../../assets/images/welcome_export-removebg-preview.png") },
  { key: "4", icon: "check-circle-outline", image: require("../../assets/images/welcome_ready-removebg-preview.png") },
];

const Backdrop = ({ scrollX, theme }) => {
  const colors = [theme.colors.primary, theme.colors.secondary, theme.colors.primary, theme.colors.secondary, theme.colors.primary];
  const backgroundColor = scrollX.interpolate({
    inputRange: colors.map((_, i) => i * width),
    outputRange: colors,
  });
  return (
    <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor }]}>
      <View style={styles.overlay} />
    </Animated.View>
  );
};

const Pagination = ({ scrollX }) => (
  <View style={styles.paginationContainer}>
    {slides.map((_, i) => {
      const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
      const scale = scrollX.interpolate({ inputRange, outputRange: [0.8, 1.4, 0.8], extrapolate: "clamp" });
      const opacity = scrollX.interpolate({ inputRange, outputRange: [0.6, 1, 0.6], extrapolate: "clamp" });
      return <Animated.View key={i} style={[styles.dot, { transform: [{ scale }], opacity }]} />;
    })}
  </View>
);

export default function WelcomeScreen({ onFinish }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const theme = useTheme();
  const { t, updatePreferences } = useContext(UserPreferencesContext);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleFinish = async () => {
    await AsyncStorage.setItem("hasSeenWelcome", "true");
    if (onFinish) onFinish();
  };

  const handleLanguageSelect = (lang) => {
    updatePreferences({ language: lang });
    flatListRef.current?.scrollToIndex({ index: 1 });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      <Backdrop scrollX={scrollX} theme={theme} />

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        keyExtractor={(item) => item.key}
        renderItem={({ item, index }) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          const imageScale = scrollX.interpolate({ inputRange, outputRange: [0.5, 1, 0.5], extrapolate: "clamp" });
          const opacity = scrollX.interpolate({ inputRange, outputRange: [0, 1, 0], extrapolate: "clamp" });
          const isLastSlide = index === slides.length - 1;

          if (item.key === "0") {
            return (
              <View style={styles.slide}>
                <Animatable.View animation="fadeInDown" duration={1000}>
                  <MaterialCommunityIcons name={item.icon} size={60} color="#fff" style={{ marginBottom: 20 }} />
                </Animatable.View>
                <Animatable.Text animation="fadeInDown" duration={1000} delay={200} style={styles.title}>Selecione seu Idioma</Animatable.Text>
                <Animatable.Text animation="fadeInDown" duration={1000} delay={400} style={styles.text}>Choose Your Language</Animatable.Text>
                <Animatable.Text animation="fadeInDown" duration={1000} delay={600} style={styles.text}>Selecciona tu Idioma</Animatable.Text>

                <Animatable.View animation="fadeInUp" duration={1000} delay={800} style={styles.languageButtonContainer}>
                  <TouchableOpacity style={styles.languageButton} onPress={() => handleLanguageSelect("pt-BR")}>
                    <Text style={styles.languageButtonText}>Português</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.languageButton} onPress={() => handleLanguageSelect("en")}>
                    <Text style={styles.languageButtonText}>English</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.languageButton} onPress={() => handleLanguageSelect("es")}>
                    <Text style={styles.languageButtonText}>Español</Text>
                  </TouchableOpacity>
                </Animatable.View>
              </View>
            );
          }

          return (
            <View style={styles.slide}>
              <Animatable.View animation="bounceIn" duration={1200} delay={200}>
                <MaterialCommunityIcons name={item.icon} size={60} color="#fff" style={{ marginBottom: 20 }} />
              </Animatable.View>
              <Animated.Image
                source={item.image}
                style={[styles.image, { transform: [{ scale: imageScale }], opacity }]}
                resizeMode="contain"
              />
              <Animated.Text style={[styles.title, { opacity }]}>{t(`welcome_title_${item.key}`)}</Animated.Text>
              <Animated.Text style={[styles.text, { opacity }]}>{t(`welcome_text_${item.key}`)}</Animated.Text>

              {isLastSlide && (
                <Animatable.View animation="fadeInUp" duration={1000} delay={500}>
                  <TouchableOpacity style={styles.startButton} onPress={handleFinish}>
                    <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={styles.startButtonBg}>
                      <Text style={styles.startButtonText}>{t("startNow")}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animatable.View>
              )}
            </View>
          );
        }}
      />

      <Pagination scrollX={scrollX} />

      {currentIndex < slides.length - 1 && (
        <Animatable.View animation="fadeInRight" duration={1000} delay={500}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => flatListRef.current?.scrollToIndex({ index: currentIndex + 1 })}
          >
            <MaterialCommunityIcons name="arrow-right-circle" size={60} color="#fff" />
          </TouchableOpacity>
        </Animatable.View>
      )}

      <Animatable.View animation="fadeInLeft" duration={1000} delay={500}>
        <TouchableOpacity style={styles.skipButton} onPress={handleFinish}>
          <Text style={styles.skipText}>{t("skip")}</Text>
        </TouchableOpacity>
      </Animatable.View>
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
    width: width * 0.7,
    height: height * 0.35,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.85)",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  paginationContainer: {
    position: "absolute",
    bottom: 90,
    flexDirection: "row",
    alignSelf: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    margin: 6,
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
  nextButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  startButton: {
    marginTop: 40,
    borderRadius: 30,
    overflow: "hidden",
    elevation: 2,
  },
  startButtonBg: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  startButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  languageButtonContainer: {
    marginTop: 30,
  },
  languageButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 10,
    elevation: 2,
  },
  languageButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
