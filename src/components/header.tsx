import { View, Pressable, TextInput, StyleSheet, ImageBackground, } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function Header() {
  const insets = useSafeAreaInsets();

  return (


    <ImageBackground 
    source={require("../../assets/images/topbar_pic.png")}
    style={styles.header}
    imageStyle={styles.headerImage}>
    

      {/* Menu */}
        <Pressable style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#54200F" />
        </Pressable>

      {/* Search */}
        <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={24} color="#54200F" />

            <TextInput
            placeholder="Search place, location..."
            placeholderTextColor="#999"
            style={styles.searchInput}
            />
        </View>

      {/* Profile */}
        <Pressable style={styles.profileButton}>
            <Ionicons name="person" size={22} color="#FFFFFF" />
        </Pressable>

        <LinearGradient
        colors={["transparent", "#F8F5F0"]}
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
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  backgroundImage: {
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  searchContainer: {
    flex: 1,
    height: 45,
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
  },

  profileButton: {
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: "#54200F",
    justifyContent: "center",
    alignItems: "center",
  },

  profileText: {
    color: "#FFFFFF",
    fontSize: 25,
  },
});