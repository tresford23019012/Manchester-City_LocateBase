import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { usePathname, router } from "expo-router";

export default function Footer() {
  const pathname = usePathname();

  return (
    <View style={styles.footerShadow}>
      <BlurView intensity={80} tint="light" style={styles.footer}>
        <View style={styles.footerContent}>

          {/*Explore*/}
          <Pressable style={styles.menuButton} onPress={() => router.push("/")}>
            <Ionicons
              name={pathname === "/" ? "compass" : "compass-outline"}
              size={28}
              color={pathname === "/" ? "#54200F" : "#864612"}
            />

            <Text
              style={[styles.menuText, pathname === "/" && styles.activeText]}
            >
              Explore
            </Text>
          </Pressable>

          {/*Map*/}
          <Pressable
            style={styles.menuButton}
            onPress={() => router.push("/map")}
          >
            <Ionicons
              name={pathname === "/map" ? "location" : "location-outline"}
              size={28}
              color={pathname === "/map" ? "#54200F" : "#864612"}
            />

            <Text
              style={[
                styles.menuText,
                pathname === "/map" && styles.activeText,
              ]}
            >
              Map
            </Text>
          </Pressable>

          {/*Notification*/}
          <Pressable
            style={styles.menuButton}
            onPress={() => router.push("/notifications")}
          >
            <Ionicons
              name={
                pathname === "/notifications"
                  ? "notifications"
                  : "notifications-outline"
              }
              size={28}
              color={pathname === "/notifications" ? "#54200F" : "#8b341a"}
            />

            <Text
              style={[
                styles.menuText,
                pathname === "/notifications" && styles.activeText,
              ]}
            >
              Notifications
            </Text>
          </Pressable>
          
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  footerShadow: {
    marginHorizontal: 20,
    marginBottom: 40,

    backgroundColor: "transparent",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,

    elevation: 16,
  },

  footer: {
    height: 80,

    borderRadius: 30,
    overflow: "hidden",

    // VERY subtle glass tint
    backgroundColor: "rgba(255, 255, 255, 0.15)",

    // Only ONE border
    borderWidth: 1,
    borderColor: "rgba(231, 188, 168, 0.35)",
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

  activeText: {
  color: "#54200F",
  fontWeight: "600",
},
});
