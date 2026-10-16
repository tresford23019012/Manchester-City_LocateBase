import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { ThemeProvider } from "../context/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Footer from "../components/footer";
import Header from "../components/header";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <View style={styles.container}>
          <Header />

          <View style={styles.pages}>
          <Stack
            screenOptions={{
                headerShown: false,
              }}
            />
          </View>

           <Footer />
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5F0",
  },
  pages: {
    flex: 1,
  },
});
