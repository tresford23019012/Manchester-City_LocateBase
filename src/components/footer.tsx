import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

export default function Footer() {
  return (
    <BlurView
  intensity={80}
  tint="light"
  style={styles.footer}
>
  <View style={styles.footerContent}>

    <Pressable style={styles.menuButton}>
      <Ionicons name="compass" size={28} color="#54200F" />
      <Text style={styles.menuText}>Explore</Text>
    </Pressable>

    <Pressable style={styles.menuButton}>
      <Ionicons name="location-outline" size={28} color="#54200F" />
      <Text style={styles.menuText}>Map</Text>
    </Pressable>

    <Pressable style={styles.menuButton}>
      <Ionicons name="notifications-outline" size={28} color="#54200F" />
      <Text style={styles.menuText}>Notifications</Text>
    </Pressable>

  </View>
</BlurView>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 80,
    marginHorizontal: 20,
    marginBottom: 20,

    borderRadius: 30,
    overflow: "hidden",

    // VERY subtle glass tint
    backgroundColor: "rgba(255, 255, 255, 0.15)",

    // Only ONE border
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",

    elevation: 8,
  },

  footerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  menuButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  menuText: {
    fontSize: 14,
    color: "#54200F",
    marginTop: 2,
    textAlign: "center",
  },
});
