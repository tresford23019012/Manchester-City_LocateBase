import {
  View,
  Pressable,
  TextInput,
  Text,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSearch } from "../context/SearchContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import SideMenu from "./sideMenu";
import { useState } from "react";

type HeaderProps = {
  variant?: "default" | "favourites";
};

export default function Header({
  variant = "default",
}: HeaderProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  const [searchText, setSearchText] = useState("");

  const { setSearchQuery } = useSearch();

  const handleSearch = () => {
  const query = searchText.trim();

    setSearchQuery(query); // Empty query clears the search
  };

  return (
    <ImageBackground
      source={require("../../assets/images/topbar_pic.png")}
      style={styles.header}
      imageStyle={styles.headerImage}
    >
      {/* Brand colour overlay */}
      <LinearGradient
        colors={[
           "rgba(155, 28, 43, 0.30)",
           "rgba(205, 235, 221, 0.90)"
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.imageTint}
        pointerEvents="none"
      />

      {/* Menu */}
      <Pressable
        style={styles.menuButton}
        onPress={() => setMenuVisible(true)}
      >
        <Ionicons name="menu" size={28} color="#9B1C2B" />
      </Pressable>

      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />

      {/* Search or Page Title */}
      {variant === "default" ? (
        <View style={styles.searchContainer}>
          <Pressable onPress={handleSearch}>
            <Ionicons
              name="search-outline"
              size={24}
              color="#9B1C2B"
            />
          </Pressable>

          <TextInput
            placeholder="Search place, location..."
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />

          {searchText.length > 0 && (
            <Pressable
              onPress={() => {
                setSearchText("");
                setSearchQuery("");
              }}
            >
              <Ionicons name="close-circle" size={20} color="#9B1C2B" />
            </Pressable>
          )}

        </View>
      ) : (
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Favourites</Text>
        </View>
      )}

      {/* Profile */}
      <Pressable
        style={styles.profileButton}
        onPress={() => router.push("/account")}
      >
        <Ionicons name="person" size={22} color="#FFFFFF" />
      </Pressable>

      {/* Bottom Fade */}
      <LinearGradient
        colors={["transparent", "#F7FAF8"]}
        style={styles.bottomFade}
        pointerEvents="none"
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 140,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden",
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 30,
    gap: 15,
  },

  imageTint: {
    ...StyleSheet.absoluteFill,
  },

  headerImage: {
    resizeMode: "cover",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
  },

  menuButton: {
    width: 48,
    height: 41,
    backgroundColor: "#F7FAF8",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  searchContainer: {
    flex: 1,
    height: 45,
    backgroundColor: "#F7FAF8",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#CDEBDD",
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: "#242424",
  },

  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#9B1C2B",
  },

  profileButton: {
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: "#9B1C2B",
    justifyContent: "center",
    alignItems: "center",
  },
});
