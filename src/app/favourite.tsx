import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type Guesthouse = {
  id: string;
  name: string;
  location: string;
  rating: string;
  ratingLabel: string;
  reviews: number;
  image: string;
};

const SAMPLE_FAVOURITES: Guesthouse[] = [
  {
    id: "1",
    name: "Thamalakane Guest House",
    location: "Maun",
    rating: "9.2",
    ratingLabel: "Wonderful",
    reviews: 15,
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
  },
  {
    id: "2",
    name: "Riverview Lodge",
    location: "Maun",
    rating: "8.7",
    ratingLabel: "Very Good",
    reviews: 32,
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600",
  },
  {
    id: "3",
    name: "Okavango Retreat",
    location: "Shorobe",
    rating: "8.5",
    ratingLabel: "Very Good",
    reviews: 18,
    image:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600",
  },
  {
    id: "4",
    name: "Bushside Camp",
    location: "Maun",
    rating: "8.9",
    ratingLabel: "Fabulous",
    reviews: 27,
    image:
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=600",
  },
];

export default function FavouriteScreen() {
  const {
    user,
    loading: authLoading,
    isAuthenticated,
  } = useAuth();

  const [favourites, setFavourites] =
    useState<Guesthouse[]>(SAMPLE_FAVOURITES);

  const removeFavourite = (id: string) => {
    setFavourites((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  const openDetails = (id: string) => {
    // TODO: Replace with your actual guesthouse details route.
    router.push({
      pathname: "/guesthouse/[id]",
      params: { id },
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.pageHeading}>
        <View>
          <Text style={styles.subtitle}>
            Your saved places, all in one spot.
          </Text>
        </View>

        <View style={styles.countContainer}>
          <Ionicons name="heart" size={15} color="#9B1C2B" />
          <Text style={styles.countText}>
            {favourites.length}
          </Text>
        </View>
      </View>

      {favourites.length > 0 ? (
        <View style={styles.list}>
          {favourites.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image
                source={{ uri: item.image }}
                style={styles.guesthouseImage}
                resizeMode="cover"
              />

              <View style={styles.cardDetails}>
                <View style={styles.nameRow}>
                  <Text
                    style={styles.guesthouseName}
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>

                  <TouchableOpacity
                    onPress={() => removeFavourite(item.id)}
                    style={styles.heartButton}
                  >
                    <Ionicons
                      name="heart"
                      size={21}
                      color="#9B1C2B"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.locationRow}>
                  <Ionicons
                    name="location-outline"
                    size={13}
                    color="#68736E"
                  />
                  <Text style={styles.location}>
                    {item.location}
                  </Text>
                </View>

                <View style={styles.bottomRow}>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.rating}>
                      {item.rating}
                    </Text>
                  </View>

                  <View style={styles.reviewDetails}>
                    <Text style={styles.ratingLabel}>
                      {item.ratingLabel}
                    </Text>
                    <Text style={styles.reviewCount}>
                      {item.reviews} reviews
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => openDetails(item.id)}
                  >
                    <Text style={styles.detailsText}>
                      View details
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={13}
                      color="#9B1C2B"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="heart-outline"
              size={42}
              color="#9B1C2B"
            />
          </View>

          <Text style={styles.emptyTitle}>
            No favourites yet
          </Text>

          <Text style={styles.emptyDescription}>
            You haven't saved any guesthouses yet.
            Explore places and save the ones you love!
          </Text>

          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => router.push("/")}
          >
            <Text style={styles.exploreButtonText}>
              Explore guesthouses
            </Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAF8",
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 150,
    paddingBottom: 165,
  },

  pageHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  title: {
    fontSize: 23,
    fontWeight: "800",
    color: "#9B1C2B",
  },

  subtitle: {
    fontSize: 12,
    color: "#68736E",
    marginTop: 5,
  },

  countContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FCEBEC",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },

  list: {
    gap: 12,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 7,
    minHeight: 112,
    elevation: 2,
    shadowColor: "#242424",
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  guesthouseImage: {
    width: 112,
    minHeight: 112,
    borderRadius: 11,
    backgroundColor: "#E3EAE6",
  },

  cardDetails: {
    flex: 1,
    paddingLeft: 10,
    paddingVertical: 3,
    justifyContent: "space-between",
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  guesthouseName: {
    flex: 1,
    fontSize: 13,
    fontWeight: "800",
    color: "#242424",
    lineHeight: 17,
  },

  heartButton: {
    paddingLeft: 5,
    paddingBottom: 3,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 3,
  },

  location: {
    fontSize: 10,
    color: "#68736E",
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
  },

  ratingContainer: {
    backgroundColor: "#247B5B",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },

  rating: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },

  reviewDetails: {
    marginLeft: 6,
    flex: 1,
  },

  ratingLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9B1C2B",
  },

  reviewCount: {
    fontSize: 9,
    color: "#68736E",
    marginTop: 2,
  },

  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#9B1C2B",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 4,
  },

  detailsText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#9B1C2B",
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingTop: 100,
  },

  emptyIcon: {
    width: 85,
    height: 85,
    borderRadius: 45,
    backgroundColor: "#FCEBEC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#242424",
  },

  emptyDescription: {
    fontSize: 13,
    color: "#68736E",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 9,
  },

  exploreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9B1C2B",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 22,
    gap: 8,
  },

  exploreButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },
});
