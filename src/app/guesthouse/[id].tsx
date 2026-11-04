import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  getGuesthouseById,
  type Guesthouse,
} from "../services/api";

const COLORS = {
  primary: "#9B1C2B",
  mint: "#CDEBDD",
  darkCrimson: "#C8323B",

  background: "#F7FAF8",
  surface: "#FFFFFF",
  text: "#242424",
  secondary: "#68736E",
  placeholder: "#A0AAA5",
  border: "#E3EAE6",
};

export default function GuesthouseDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [guesthouse, setGuesthouse] = useState<Guesthouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDetails() {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          throw new Error("Guesthouse ID was not provided.");
        }

        const data = await getGuesthouseById(id);

        if (isMounted) {
          setGuesthouse(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load guesthouse details."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const openContact = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Unable to open", "This contact option is unavailable.");
    }
  };

  const handlePhone = () => {
    if (!guesthouse?.contactPhone) return;

    openContact(`tel:${guesthouse.contactPhone}`);
  };

  const handleEmail = () => {
    if (!guesthouse?.contactEmail) return;

    openContact(`mailto:${guesthouse.contactEmail}`);
  };

  const handleWhatsApp = () => {
    if (!guesthouse?.contactPhone) return;

    const phone = guesthouse.contactPhone.replace(/\D/g, "");

    openContact(`https://wa.me/${phone}`);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.statusText}>
          Loading guesthouse details...
        </Text>
      </View>
    );
  }

  if (error || !guesthouse) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons
          name="alert-circle-outline"
          size={45}
          color={COLORS.secondary}
        />

        <Text style={styles.errorTitle}>
          Unable to load guesthouse
        </Text>

        <Text style={styles.statusText}>
          {error ?? "Guesthouse information could not be found."}
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const images = guesthouse.images?.filter(
    (image) => Boolean(image?.trim())
  ) ?? [];

  const location = [
    guesthouse.address,
    guesthouse.city,
  ].filter(Boolean).join(", ");

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {/* Image gallery */}
      <View style={styles.galleryContainer}>
        {images.length > 0 ? (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            {images.map((image, index) => (
              <Image
                key={`${image}-${index}`}
                source={{ uri: image }}
                style={styles.heroImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons
              name="image-outline"
              size={55}
              color={COLORS.secondary}
            />
            <Text style={styles.placeholderText}>
              No photos available
            </Text>
          </View>
        )}

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={23} color={COLORS.text} />
        </Pressable>

        {images.length > 1 && (
          <View style={styles.photoCount}>
            <Ionicons name="images-outline" size={14} color="#FFFFFF" />
            <Text style={styles.photoCountText}>
              {images.length} photos
            </Text>
          </View>
        )}
      </View>

      {/* Guesthouse overview */}
      <View style={styles.detailsContainer}>
        <Text style={styles.guesthouseName}>
          {guesthouse.name}
        </Text>

        <View style={styles.locationRow}>
          <Ionicons
            name="location-outline"
            size={17}
            color={COLORS.secondary}
          />
          <Text style={styles.locationText}>
            {location || "Location not provided"}
          </Text>
        </View>

        <View style={styles.overviewRow}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={17} color="#D69B35" />
            <Text style={styles.ratingText}>
              {Number.isFinite(guesthouse.averageRating)
                ? guesthouse.averageRating.toFixed(1)
                : "—"}
            </Text>
            <Text style={styles.reviewCount}>
              ({guesthouse.ratingCount} ratings)
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              P{guesthouse.pricePerNight}
            </Text>
            <Text style={styles.perNight}>/ night</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            About this guesthouse
          </Text>

          <Text style={styles.description}>
            {guesthouse.description || "No description available yet."}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Amenities and facilities
          </Text>

          {guesthouse.amenities?.length > 0 ? (
            <View style={styles.amenitiesContainer}>
              {guesthouse.amenities.map((amenity, index) => (
                <View
                  key={`${amenity}-${index}`}
                  style={styles.amenityItem}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    color={COLORS.primary}
                  />
                  <Text style={styles.amenityText}>
                    {amenity.replace(/-/g, " ")}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>
              No amenities listed yet.
            </Text>
          )}
        </View>

        <View style={styles.divider} />

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Contact information
          </Text>

          {guesthouse.contactPhone ? (
            <Pressable
              style={styles.contactRow}
              onPress={handlePhone}
            >
              <View style={styles.contactIcon}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.contactDetails}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>
                  {guesthouse.contactPhone}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={COLORS.secondary}
              />
            </Pressable>
          ) : null}

          {guesthouse.contactPhone ? (
            <Pressable
              style={styles.contactRow}
              onPress={handleWhatsApp}
            >
              <View style={styles.contactIcon}>
                <Ionicons
                  name="logo-whatsapp"
                  size={20}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.contactDetails}>
                <Text style={styles.contactLabel}>WhatsApp</Text>
                <Text style={styles.contactValue}>
                  Message this guesthouse
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={COLORS.secondary}
              />
            </Pressable>
          ) : null}

          {guesthouse.contactEmail ? (
            <Pressable
              style={styles.contactRow}
              onPress={handleEmail}
            >
              <View style={styles.contactIcon}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.contactDetails}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>
                  {guesthouse.contactEmail}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={COLORS.secondary}
              />
            </Pressable>
          ) : null}

          {!guesthouse.contactPhone && !guesthouse.contactEmail && (
            <Text style={styles.emptyText}>
              Contact information is not available.
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 100,
  },

  content: {
    paddingBottom: 205,
  },

  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  statusText: {
    color: COLORS.secondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },

  errorTitle: {
    color: COLORS.primary,
    fontSize: 19,
    fontWeight: "700",
    marginTop: 15,
  },

  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  galleryContainer: {
    height: 280,
    backgroundColor: COLORS.soft,
  },

  heroImage: {
    width: 390,
    height: 280,
  },

  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    color: COLORS.secondary,
    marginTop: 10,
  },

  backButton: {
    position: "absolute",
    top: 45,
    left: 18,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },

  photoCount: {
    position: "absolute",
    bottom: 15,
    right: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },

  photoCountText: {
    color: "#FFFFFF",
    fontSize: 12,
  },

  detailsContainer: {
    padding: 20,
  },

  guesthouseName: {
    fontSize: 25,
    fontWeight: "800",
    color: COLORS.primary,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
    gap: 5,
  },

  locationText: {
    color: COLORS.secondary,
    fontSize: 13,
    flex: 1,
  },

  overviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  ratingText: {
    fontWeight: "700",
    color: COLORS.text,
    fontSize: 15,
  },

  reviewCount: {
    color: COLORS.secondary,
    fontSize: 12,
  },

  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  price: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: "800",
  },

  perNight: {
    color: COLORS.secondary,
    fontSize: 12,
    marginLeft: 3,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 22,
  },

  section: {
    gap: 13,
  },

  sectionTitle: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "700",
  },

  description: {
    color: COLORS.secondary,
    fontSize: 14,
    lineHeight: 23,
  },

  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: COLORS.soft,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 9,
  },

  amenityText: {
    color: COLORS.text,
    fontSize: 12,
    textTransform: "capitalize",
  },

  emptyText: {
    color: COLORS.secondary,
    fontSize: 13,
  },

  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  contactIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.soft,
    justifyContent: "center",
    alignItems: "center",
  },

  contactDetails: {
    flex: 1,
    marginLeft: 12,
  },

  contactLabel: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
  },

  contactValue: {
    color: COLORS.secondary,
    fontSize: 12,
    marginTop: 3,
  },

  bookingNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.soft,
    padding: 14,
    borderRadius: 12,
    marginTop: 25,
  },

  bookingNoticeText: {
    color: COLORS.primary,
    fontSize: 12,
    flex: 1,
  },
});