
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { usePathname, router } from "expo-router";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  Animated,
  Easing,
  useWindowDimensions,
} from "react-native";

type SideMenuProps = {
  visible: boolean;
  onClose: () => void;
};

export default function SideMenu({
  visible,
  onClose,
}: SideMenuProps) {
  const pathname = usePathname();
  const { width } = useWindowDimensions();

  const menuWidth = Math.min(width * 0.82, 340);

  const slideAnim = useRef(new Animated.Value(-340)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  const [modalVisible, setModalVisible] = useState(visible);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);

      slideAnim.setValue(-menuWidth);
      backdropAnim.setValue(0);

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (modalVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -menuWidth,
          duration: 260,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setModalVisible(false);
        }
      });
    }
  }, [visible, menuWidth]);

  const navigateTo = (path: string) => {
    onClose();
    router.push(path as any);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>

        {/* Animated dark backdrop */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.backdropOverlay,
            {
              opacity: backdropAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.45],
              }),
            },
          ]}
        />

        {/* Tap outside to close */}
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
        />

        {/* Animated menu panel */}
        <Animated.View
          style={[
            styles.menuPanel,
            {
              width: menuWidth,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >

          {/* Profile header */}
          <View style={styles.profileHeader}>
            <Pressable
              style={styles.profileRow}
              onPress={() => {
                // Profile navigation can be added later.
              }}
            >
              <View style={styles.avatar}>
                <Ionicons
                  name="person"
                  size={30}
                  color="#FFFFFF"
                />
              </View>

              <Pressable style={styles.profileInfo}
                onPress={() => navigateTo("/account")}>
                <Text style={styles.userName}>Your Name</Text>
                <Text style={styles.profileSubtitle}>
                  View your profile
                </Text>
              </Pressable>

              <Ionicons
                name="chevron-forward"
                size={23}
                color="#FFFFFF"
              />
            </Pressable>
          </View>

          {/* Home */}
          <View style={styles.homeButton}>
            <Pressable
              style={[
                styles.homeRow,
                isActive("/") && styles.activeMenuItem,
              ]}
              onPress={() => navigateTo("/")}
            >
              <Ionicons
                name={isActive("/") ? "home" : "home-outline"}
                size={34}
                color={isActive("/") ? "#FFFFFF" : "#68736E"}
              />

              <Text
                style={[
                  styles.homeName,
                  isActive("/") && styles.activeMenuText,
                ]}
              >
                Home
              </Text>

              <Ionicons
                name="chevron-forward"
                size={23}
                color={isActive("/") ? "#FFFFFF" : "#000000"}
                style={styles.homeArrow}
              />
            </Pressable>
          </View>

          {/* Favourites */}
          <View style={styles.favouriteButton}>
            <Pressable
              style={[
                styles.homeRow,
                isActive("/favourite") && styles.activeMenuItem,
              ]}
              onPress={() => navigateTo("/favourite")}
            >
              <Ionicons
                name={
                  isActive("/favourite")
                    ? "heart"
                    : "heart-outline"
                }
                size={35}
                color={
                  isActive("/favourite")
                    ? "#FFFFFF"
                    : "#000000"
                }
              />

              <Text
                style={[
                  styles.homeName,
                  isActive("/favourite") && styles.activeMenuText,
                ]}
              >
                Favourites
              </Text>

              <Ionicons
                name="chevron-forward"
                size={23}
                color={
                  isActive("/favourite")
                    ? "#FFFFFF"
                    : "#000000"
                }
                style={styles.homeArrow}
              />
            </Pressable>
          </View>

          {/* Sign In */}
          <View style={styles.favouriteButton}>
            <Pressable
              style={[
                styles.homeRow,
                isActive("/login") && styles.activeMenuItem,
              ]}
              onPress={() => navigateTo("/login")}
            >
              <Ionicons
                name={
                  isActive("/login")
                    ? "exit"
                    : "exit-outline"
                }
                size={35}
                color={
                  isActive("/login")
                    ? "#FFFFFF"
                    : "#000000"
                }
              />

              <Text
                style={[
                  styles.homeName,
                  isActive("/login") && styles.activeMenuText,
                ]}
              >
                Sign In
              </Text>

              <Ionicons
                name="chevron-forward"
                size={23}
                color={
                  isActive("/login")
                    ? "#FFFFFF"
                    : "#000000"
                }
                style={styles.homeArrow}
              />
            </Pressable>
          </View>

        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },

  backdropOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#000000",
  },

  backdrop: {
    ...StyleSheet.absoluteFill,
  },

  menuPanel: {
    backgroundColor: "#F7FAF8",
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
  },

  profileHeader: {
    backgroundColor: "#9B1C2B",
    paddingHorizontal: 18,
    paddingVertical: 28,
    borderTopRightRadius: 26,
    borderBottomRightRadius: 28,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#C8323B",
    alignItems: "center",
    justifyContent: "center",
  },

  profileInfo: {
    flex: 1,
  },

  userName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  profileSubtitle: {
    color: "#F4D9DC",
    fontSize: 12,
    marginTop: 4,
  },

  homeButton: {
    paddingVertical: 28,
    paddingHorizontal: 18,
  },

  favouriteButton: {
    paddingHorizontal: 18,
    marginBottom: 8,
  },

  homeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 34,
    gap: 12,
    height: 65,
  },

  homeName: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    color: "#242424",
  },

  homeArrow: {
    marginLeft: "auto",
  },

  activeMenuText: {
    color: "#FFFFFF",
  },

  activeMenuItem: {
    backgroundColor: "#9B1C2B",
  },
});
