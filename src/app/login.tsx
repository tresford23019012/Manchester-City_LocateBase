import { loginUser } from "../../services/authService";
import { syncUserProfile } from "../../services/userService";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing information", "Please enter your email and password.");
      return;
    }
    

    let currentStage = "Firebase authentication";

    try {
      setLoading(true);

      console.log("1. Attempting Firebase login...");

      const user = await loginUser(email, password);

      console.log("2. Firebase login successful!");
      console.log("Firebase UID:", user.uid);

      currentStage = "Backend profile synchronisation";

      console.log("3. Synchronising profile with backend...");

      await syncUserProfile(user);

      console.log("4. Backend profile synchronisation successful!");

      currentStage = "Navigation";

      router.replace("/");
    } catch (error: any) {
      console.log("LOGIN FAILED AT:", currentStage);
      console.log("ERROR CODE:", error.code);
      console.log("ERROR MESSAGE:", error.message);
      console.log("FULL ERROR:", error);

      Alert.alert(
        "Login failed",
        `Failed during: ${currentStage}\n\n${error.message || "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
        
        <View style={styles.skipContainer}>
        <Pressable onPress={() => router.replace("/")}>
            <Text style={styles.skipText}>Skip</Text>
        </Pressable>
        </View>

          {/* Logo */}
          <ImageBackground
          source={require("../../assets/images/locatebase_logo.png")}
          >
          <View style={styles.logoContainer}>
  
          </View>
          </ImageBackground>

          {/* Heading */}
          <Text style={styles.heading}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to continue discovering your next stay.
          </Text>

          {/* Email */}
          <TextInput
            style={styles.input}
            placeholder="Email or username"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Password */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Forgot password */}
          <Pressable
            style={styles.forgotContainer}
            onPress={() => router.push("/forgot-password")}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>

          {/* Login button */}
       <Pressable
        style={styles.primaryButton}
        onPress={handleLogin}
        disabled={loading}
        >
        {loading ? (
            <ActivityIndicator color="#FFFFFF" />
        ) : (
            <Text style={styles.primaryButtonText}>Sign In</Text>
        )}
        </Pressable>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          {/* Social login */}
          <View style={styles.socialContainer}>
            <Pressable
              style={styles.socialButton}
              onPress={() =>
                Alert.alert("Coming soon", "Google sign-in will be connected next.")
              }
            >
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.socialText}>Google</Text>
            </Pressable>

            <Pressable
              style={styles.socialButton}
              onPress={() =>
                Alert.alert("Coming soon", "Facebook sign-in will be connected next.")
              }
            >
              <Text style={styles.facebookIcon}>f</Text>
              <Text style={styles.socialText}>Facebook</Text>
            </Pressable>
          </View>

          {/* Register link */}
          <View style={styles.bottomTextContainer}>
            <Text style={styles.bottomText}>
              Don't have an account?{" "}
            </Text>

            <Pressable onPress={() => router.push("/register")}>
              <Text style={styles.linkText}>Sign up</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7FAF8",
  },

  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 35,
  },

  skipContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 10,
    top: -50,
    right: 1,
  },

  skipText: {
    color: "#9B1C2B",
    fontSize: 13,
    fontWeight: "700",
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 38,
    width: 65,
    height: 85,
  },

  heading: {
    fontSize: 25,
    fontWeight: "800",
    textAlign: "center",
    color: "#242424",
  },

  subtitle: {
    fontSize: 12,
    color: "#68736E",
    textAlign: "center",
    marginTop: 9,
    marginBottom: 30,
  },

  input: {
    height: 49,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CDEBDD",
    borderRadius: 13,
    paddingHorizontal: 16,
    marginBottom: 14,
    fontSize: 13,
    color: "#242424",
  },

  forgotContainer: {
    alignItems: "flex-end",
    marginTop: -3,
    marginBottom: 23,
  },

  forgotText: {
    fontSize: 11,
    color: "#68736E",
  },

  primaryButton: {
    height: 49,
    borderRadius: 13,
    backgroundColor: "#9B1C2B",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#DCE8E1",
  },

  orText: {
    marginHorizontal: 13,
    fontSize: 11,
    color: "#68736E",
  },

  socialContainer: {
    flexDirection: "row",
    gap: 12,
  },

  socialButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CDEBDD",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  googleIcon: {
    fontSize: 17,
    fontWeight: "800",
    color: "#4285F4",
  },

  facebookIcon: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1877F2",
  },

  socialText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#242424",
  },

  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },

  bottomText: {
    fontSize: 11,
    color: "#68736E",
  },

  linkText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9B1C2B",
  },
});

