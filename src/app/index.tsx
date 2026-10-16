
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  FlatList,
} from "react-native";

const categories = ["Recommended", "Popular", "Affordable"];

const hotels = [
  {
    id: "1",
    name: "Thamalakane Guest House",
    location: "Plot 941, Exit 7, Disaneng Ward, Maun",
    price: 920,
    rating: 4.8,
    reviews: 15,
    category: "Recommended",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=700",
  },
  {
    id: "2",
    name: "Little Sable",
    location: "Khwai, Botswana",
    price: 1200,
    rating: 4.5,
    reviews: 24,
    category: "Popular",
    image:
      "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=700",
  },
  {
    id: "3",
    name: "Riverview Guest House",
    location: "Serowe, Botswana",
    price: 650,
    rating: 4.3,
    reviews: 18,
    category: "Affordable",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=700",
  },
  {
    id: "4",
    name: "Oakwood Guest House",
    location: "Palapye, Botswana",
    price: 780,
    rating: 4.6,
    reviews: 12,
    category: "Recommended",
    image:
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=700",
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] =
    useState("Recommended");

  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredHotels =
    selectedCategory === "Recommended"
      ? hotels
      : hotels.filter(
          (hotel) => hotel.category === selectedCategory
        );

  const toggleFavorite = (id: string) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const renderHotelCard = (hotel: (typeof hotels)[number]) => (
    <View key={hotel.id} style={styles.hotelCard}>
      <View>
        <Image
          source={{ uri: hotel.image }}
          style={styles.hotelImage}
        />

        <Pressable
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(hotel.id)}
        >
          <Text style={styles.heart}>
            {favorites.includes(hotel.id) ? "♥" : "♡"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.cardDetails}>
        <Text numberOfLines={1} style={styles.hotelName}>
          {hotel.name}
        </Text>

        <Text numberOfLines={1} style={styles.location}>
          ♧ {hotel.location}
        </Text>

        <View style={styles.cardBottom}>
          <View style={styles.rating}>
            <Text style={styles.ratingText}>★ {hotel.rating}</Text>
          </View>

          <Text style={styles.reviews}>
            {hotel.reviews} reviews
          </Text>

          <Text style={styles.price}>
            P{hotel.price}
          </Text>
        </View>

        <Pressable
          style={styles.detailsButton}
          onPress={() => {
            // We'll connect this to the hotel details page later.
          }}
        >
          <Text style={styles.detailsText}>View details →</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
      >
        {categories.map((category) => (
          <Pressable
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.categoryButton,
              selectedCategory === category &&
                styles.selectedCategory,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category &&
                  styles.selectedCategoryText,
              ]}
            >
              {category === "Recommended"
                ? "⌂"
                : category === "Popular"
                  ? "♨"
                  : "◇"}{" "}
              {category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Featured hotels */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === "Recommended"
            ? "Recommended for You"
            : selectedCategory}
        </Text>
      </View>

      <FlatList
        data={filteredHotels}
        horizontal
        nestedScrollEnabled
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderHotelCard(item)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hotelList}
      />

      {/* Nearby guest houses */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Nearby Guest Houses
        </Text>

        <Pressable
          onPress={() => {
            // We'll connect this to a full listings page later.
          }}
        >
          <Text style={styles.seeAll}>See all →</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.nearbyList}
      >
        {hotels.map((hotel) => (
          <View key={hotel.id} style={styles.nearbyCard}>
            <Image
              source={{ uri: hotel.image }}
              style={styles.nearbyImage}
            />

            <Text numberOfLines={1} style={styles.nearbyName}>
              {hotel.name}
            </Text>

            <Text numberOfLines={1} style={styles.nearbyLocation}>
              {hotel.location}
            </Text>

            <Text style={styles.nearbyPrice}>
              P{hotel.price} / night
            </Text>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5F0",
  },
  content: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  categoryList: {
    paddingHorizontal: 14,
    gap: 8,
    paddingBottom: 20,
  },
  categoryButton: {
    backgroundColor: "#F7E1C7",
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 22,
  },
  selectedCategory: {
    backgroundColor: "#F58A24",
  },
  categoryText: {
    color: "#54200F",
    fontSize: 12,
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: "#FFFFFF",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    color: "#54200F",
    fontSize: 17,
    fontWeight: "700",
  },
  seeAll: {
    color: "#F58A24",
    fontSize: 12,
    fontWeight: "600",
  },
  hotelList: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  hotelCard: {
    width: 285,
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    marginRight: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  hotelImage: {
    width: "100%",
    height: 155,
    resizeMode: "cover",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.85)",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  heart: {
    color: "#E74C3C",
    fontSize: 22,
  },
  cardDetails: {
    padding: 10,
  },
  hotelName: {
    color: "#54200F",
    fontSize: 14,
    fontWeight: "700",
  },
  location: {
    color: "#62574F",
    fontSize: 10,
    marginTop: 5,
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 9,
  },
  rating: {
    backgroundColor: "#28764A",
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  ratingText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  reviews: {
    color: "#62574F",
    fontSize: 10,
    flex: 1,
  },
  price: {
    color: "#54200F",
    fontSize: 13,
    fontWeight: "700",
  },
  detailsButton: {
    alignSelf: "flex-end",
    borderWidth: 1,
    borderColor: "#F58A24",
    borderRadius: 15,
    paddingHorizontal: 11,
    paddingVertical: 5,
    marginTop: 9,
  },
  detailsText: {
    color: "#54200F",
    fontSize: 10,
  },
  nearbyList: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    gap: 12,
  },
  nearbyCard: {
    width: 145,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    paddingBottom: 9,
  },
  nearbyImage: {
    width: "100%",
    height: 100,
  },
  nearbyName: {
    color: "#54200F",
    fontSize: 11,
    fontWeight: "700",
    marginHorizontal: 8,
    marginTop: 7,
  },
  nearbyLocation: {
    color: "#62574F",
    fontSize: 9,
    marginHorizontal: 8,
    marginTop: 3,
  },
  nearbyPrice: {
    color: "#54200F",
    fontSize: 10,
    fontWeight: "600",
    marginHorizontal: 8,
    marginTop: 5,
  },
});
