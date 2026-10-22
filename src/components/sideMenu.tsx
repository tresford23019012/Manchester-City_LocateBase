import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { View, Image, Text, Pressable, StyleSheet, Modal, } from "react-native";


type SideMenuProps = {
  visible: boolean;
  onClose: () => void;
};

export default function SideMenu({
  visible,
  onClose,
}: SideMenuProps) {
return (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={styles.overlay}>
      {/* Tap outside the menu to close it */}
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
      />

      {/* Side menu panel */}
      <View style={styles.menuPanel}>
        <View style={styles.profileHeader}>
          <Pressable
            style={styles.profileRow}
            onPress={() => {
              // Profile navigation can be added later
            }}
          >
            <View style={styles.avatar}>
              <Ionicons
                name="person"
                size={30}
                color="#FFFFFF"
              />
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.userName}>Mark Disho</Text>
              <Text style={styles.profileSubtitle}>
                View your profile
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={23}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        {/* We'll add the Favourites item here next */}
      </View>
    </View>
  </Modal>
);
}


const styles = StyleSheet.create({
profileHeader: {
  backgroundColor: "#54200F",
  paddingHorizontal: 18,
  paddingVertical: 28,
  borderTopLeftRadius: 26,
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
  backgroundColor: "#803719",
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
  color: "#F4D9C9",
  fontSize: 12,
  marginTop: 4,
},

overlay: {
  flex: 1,
  flexDirection: "row",
  backgroundColor: "rgba(0,0,0,0.4)",
},

backdrop: {
  flex: 1,
},

menuPanel: {
  width: "82%",
  maxWidth: 340,
  backgroundColor: "#F8F5F0",
  paddingTop: 55,
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
},

})