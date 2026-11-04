import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { logoutUser } from "../../services/authService";
import { router } from "expo-router";
import { Alert } from "react-native";

const COLORS = {
  primary: "#9B1C2B",
  mint: "#CDEBDD",
  darkCrimson: "#C8323B",
  background: "#F7FAF8",
  surface: "#FFFFFF",
  text: "#242424",
  secondary: "#68736E",
  border: "#E3EAE6",
};

type AccountItemProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle: string;
  onPress: () => void;
};

function AccountItem({
  icon,
  title,
  subtitle,
  onPress,
}: AccountItemProps) {

  return (
    
    <Pressable
      style={({ pressed }) => [
        styles.accountItem,
        pressed && styles.pressedItem,
      ]}
      onPress={onPress}
    >
      <View style={styles.itemIconContainer}>
        <Ionicons
          name={icon}
          size={23}
          color={COLORS.primary}
        />
      </View>

      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemSubtitle}>{subtitle}</Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={22}
        color={COLORS.secondary}
      />
    </Pressable>
  );
}

export default function AccountScreen() {
  const openPersonalInfo = () =>
    router.push("/personal-information");

  const handleLogout = () => {
  Alert.alert(
    "Log Out",
    "Are you sure you want to log out?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          try {
            await logoutUser();
            router.replace("/");
          } catch (error) {
            Alert.alert(
              "Logout Failed",
              "Unable to log out. Please try again."
            );
          }
        },
      },
    ]
  );
};

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Page heading */}
{/* Account banner */}
    <ImageBackground
    source={require("../../assets/images/topbar_pic.png")}
    style={styles.accountBanner}
    imageStyle={styles.bannerImage}
    >
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

    <View style={styles.bannerContent}>
        <Text style={styles.heading}>My Account</Text>
        <Text style={styles.headingSubtitle}>
        Manage your profile and preferences
        </Text>
    </View>
    </ImageBackground>

      {/* Profile section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons
              name="person"
              size={55}
              color={COLORS.primary}
            />
          </View>

          <Pressable
            style={styles.cameraButton}
            onPress={openPersonalInfo}
          >
            <Ionicons
              name="camera"
              size={17}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        <Text style={styles.userName}>Your Name</Text>

        <Text style={styles.userEmail}>
          Update your email address
        </Text>

        <View style={styles.locationContainer}>
          <Ionicons
            name="location"
            size={13}
            color={COLORS.primary}
          />
          <Text style={styles.locationText}>
            Add your location
          </Text>
        </View>

        <Pressable
          style={styles.editButton}
          onPress={openPersonalInfo}
        >
          <Ionicons
            name="create-outline"
            size={16}
            color="#FFFFFF"
          />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </Pressable>
      </View>

      {/* Account options */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>
          Account Management
        </Text>

        <AccountItem
          icon="person-outline"
          title="Personal Information"
          subtitle="Manage your name, email and phone"
          onPress={openPersonalInfo}
        />

        <AccountItem
          icon="heart"
          title="My Favourites"
          subtitle="View and manage your saved places"
          onPress={() => router.push("/favourite")}
        />

        <AccountItem
          icon="star"
          title="My Reviews"
          subtitle="Manage your reviews and ratings"
          onPress={() => router.push("/reviews")}
        />

        <AccountItem
          icon="log-out-outline"
          title="Log Out"
          subtitle="See you later"
          onPress={handleLogout}
        />
      </View>

      {/* Footer information */}
      <View style={styles.bottomInfo}>
        <Ionicons
          name="shield-checkmark-outline"
          size={17}
          color={COLORS.secondary}
        />
        <Text style={styles.bottomInfoText}>
          Your account and information are securely managed.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

    content: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 165,
    },

  pageHeading: {
    marginBottom: 22,
  },

  accountBanner: {
  height: 155,
  marginHorizontal: -20,
  marginTop: -24,
  marginBottom: 24,
  justifyContent: "flex-end",
  overflow: "hidden",
},

bannerImage: {
  resizeMode: "cover",
  borderBottomLeftRadius: 40,
  borderBottomRightRadius: 40,
},

imageTint: {
    ...StyleSheet.absoluteFill,
  borderBottomLeftRadius: 40,
  borderBottomRightRadius: 40,
  },

bannerContent: {
  paddingHorizontal: 24,
  paddingBottom: 22,

},

heading: {
  fontSize: 25,
  fontWeight: "800",
  color: "#FFFFFF",
},

headingSubtitle: {
  fontSize: 12,
  color: "#FFFFFF",
  marginTop: 5,
},

  heading: {
    fontSize: 24,
    fontWeight: "800",
      color: "#9B1C2B",
  },

  headingSubtitle: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 5,
  },

  profileSection: {
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  avatarContainer: {
    position: "relative",
    marginBottom: 12,
  },

  avatar: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: COLORS.mint,
    alignItems: "center",
    justifyContent: "center",
  },

  cameraButton: {
    position: "absolute",
    right: -2,
    bottom: 2,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.darkCrimson,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: COLORS.surface,
  },

  userName: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
  },

  userEmail: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 5,
  },

  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 7,
  },

  locationText: {
    fontSize: 11,
    color: COLORS.secondary,
  },

  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 22,
    marginTop: 17,
  },

  editButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  menuSection: {
    gap: 11,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 3,
  },

  accountItem: {
    minHeight: 76,
    backgroundColor: COLORS.surface,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  pressedItem: {
    backgroundColor: COLORS.mint,
    opacity: 0.85,
  },

  itemIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.mint,
    alignItems: "center",
    justifyContent: "center",
  },

  itemDetails: {
    flex: 1,
  },

  itemTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
  },

  itemSubtitle: {
    fontSize: 10,
    color: COLORS.secondary,
    marginTop: 4,
  },

  bottomInfo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    marginTop: 25,
  },

  bottomInfoText: {
    fontSize: 10,
    color: COLORS.secondary,
  },
});
