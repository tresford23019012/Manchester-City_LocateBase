import { View, Pressable, TextInput, StyleSheet, ImageBackground, } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Header() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>

    <View style={styles.header}>

   
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
    </View>

    </View>
  );
}

const styles = StyleSheet.create({

    container: {
  
  },

  header: {
    height: 128,
    backgroundColor: "#F58A24",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,

    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 30,
    gap: 15,
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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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