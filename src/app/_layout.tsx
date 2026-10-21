
import { Stack } from "expo-router";
import { View, StyleSheet, Animated } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemeProvider } from "../context/ThemeContext";
import {
  ScrollProvider,
  useScrollAnimation,
} from "../context/ScrollContext";

import Footer from "../components/footer";
import Header from "../components/header";

function AppLayout() {
  const scrollY = useScrollAnimation();

  // Animate the header upward as the page scrolls down
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -150],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      {/* Floating animated header */}
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <Header />
      </Animated.View>

      {/* App screens */}
      <View style={styles.pages}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </View>

      {/* Floating footer */}
      <View style={styles.floatingFooter}>
        <Footer />
      </View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ScrollProvider>
          <AppLayout />
        </ScrollProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5F0",
  },

  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 10,
  },

  pages: {
    flex: 1,
  },

  floatingFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    elevation: 20,
  },
});
