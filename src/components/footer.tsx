import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { usePathname, router } from "expo-router";
import { useEffect, useRef } from "react";

export default function Footer() {
  const pathname = usePathname();

  const exploreScale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
      Animated.spring(exploreScale, {
        toValue: pathname === "/" ? 1.3 : 1,
        useNativeDriver: true,
        friction: 6,
        tension: 100,
      }).start();
    }, [pathname, exploreScale]);

    const exploreBar = useRef(new Animated.Value(0)).current;
    const mapBar = useRef(new Animated.Value(0)).current;
    const notificationsBar = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const bars = [
        { animation: exploreBar, active: pathname === "/" },
        { animation: mapBar, active: pathname === "/map" },
        {
          animation: notificationsBar,
          active: pathname === "/notifications",
        },
      ];

      bars.forEach(({ animation, active }) => {
        animation.stopAnimation();

        Animated.timing(animation, {
          toValue: active ? 35 : 0,
          duration: 500,
          useNativeDriver: false,
        }).start();
      });
    }, [pathname, exploreBar, mapBar, notificationsBar]);

  return (
    <View style={styles.footerShadow}>
      <BlurView intensity={80} tint="light" style={styles.footer}>
        <View style={styles.footerContent}>

          {/*Explore*/}
          <Pressable style={styles.menuButtons} onPress={() => router.push("/")}>
            <Animated.View
              style={{
                transform: [{ scale: exploreScale }],
              }} >

              <Ionicons
                name={pathname === "/" ? "compass" : "compass-outline"}
                size={28}
                color={pathname === "/" ? "#54200F" : "#864612"}
              />
            </Animated.View>

            <Text
              style={[styles.menuText, pathname === "/" && styles.activeText]}
            >
              Explore
            </Text>

            {pathname === "/"  &&  
            (<Animated.View
                  style={[
                    styles.activeBar,
                    { width: exploreBar },
                  ]}
                /> )}

          </Pressable>

          {/*Map*/}
          <Pressable style={styles.menuButtons} onPress={() => router.push("/map")}>
            <Animated.View
              style={{
                transform: [{ scale: pathname === "/map" ? 1.3 : 1 }],
              }} >
            <Ionicons
              name={pathname === "/map" ? "location" : "location-outline"}
              size={28}
              color={pathname === "/map" ? "#54200F" : "#864612"}
            />
            </Animated.View>

            <Text
              style={[
                styles.menuText,
                pathname === "/map" && styles.activeText,
              ]}
            >
              Map
            </Text>

            {pathname === "/map"  && 
            (<Animated.View
                  style={[
                    styles.activeBar,
                    { width: mapBar },
                  ]}
                />) }

          </Pressable>

          {/*Notification*/}
          <Pressable style={styles.menuButtons} onPress={() => router.push("/notifications")}>
            <Animated.View
              style={{
                transform: [{ scale: pathname === "/notifications" ? 1.3 : 1 }],
              }} >
            <Ionicons
              name={
                pathname === "/notifications"
                  ? "notifications"
                  : "notifications-outline"
              }
              size={28}
              color={pathname === "/notifications" ? "#54200F" : "#8b341a"}
            />
            </Animated.View>

            <Text
              style={[
                styles.menuText,
                pathname === "/notifications" && styles.activeText,
              ]}
            >
              Notifications
            </Text>

            {pathname === "/notifications"  && 
            (<Animated.View
                  style={[
                    styles.activeBar,
                    { width: notificationsBar },
                  ]}
                /> ) }

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
    justifyContent: "space-around",
    paddingHorizontal: 0,
  },

  menuButtons: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
  },

  menuText: {
    fontSize: 12,
    color: "#54200F",
    marginTop: 0,
    textAlign: "center",
  },

  activeText: {
    color: "#54200F",
    fontWeight: "600",
},

  activeBar: {
    position: "absolute",
    bottom: -8,
    width: 35,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#F58A24",
    alignSelf: "center",
  },
});
