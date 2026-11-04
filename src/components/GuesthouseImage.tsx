
import React from "react";
import {
  Image,
  View,
  StyleSheet,
  ImageStyle,
  StyleProp,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type GuesthouseImageProps = {
  photos?: { url?: string }[];
  style?: StyleProp<ImageStyle>;
};

export default function GuesthouseImage({
  photos,
  style,
}: GuesthouseImageProps) {
  const imageUrl = photos?.find(
    (photo) => photo.url?.trim()
  )?.url;

  if (!imageUrl) {
    return (
      <View style={[styles.placeholder, style]}>
        <Ionicons
          name="image-outline"
          size={35}
          color="#9AA59F"
        />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: imageUrl }}
      style={style}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: "#E3EAE6",
    justifyContent: "center",
    alignItems: "center",
  },
});
