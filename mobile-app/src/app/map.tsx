import { View, Text, StyleSheet } from "react-native";

export default function MapPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5F0",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#54200F",
  },
});