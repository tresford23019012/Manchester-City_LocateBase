import { View, Text, Pressable, StyleSheet } from "react-native";
import Header from "../components/header";
import Footer from "../components/footer";

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      <Header />

      <View style={styles.content}>
        <Text style={styles.title}>My first App</Text>

        <Text style={styles.subtitle}>
          I am building a mobile app!
        </Text>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Button</Text>
        </Pressable>
      </View>

      <Footer />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0e5ca",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,
    marginBottom: 30,
  },

  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});