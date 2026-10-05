import { View, Text, StyleSheet } from "react-native";

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text>Home</Text>
      <Text>Wishlist</Text>
      <Text>Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
});