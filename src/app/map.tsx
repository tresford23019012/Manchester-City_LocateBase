import React, { useRef, useState, useEffect } from "react";
import * as Location from "expo-location";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  FlatList,
  Image,
  useWindowDimensions,
} from "react-native";

import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  getGuesthouses,
  searchGuesthouses,
} from "./services/api";

import { useSearch } from "../context/SearchContext";

const INITIAL_REGION = {
  latitude: -22.5461,
  longitude: 27.1254,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

type MapGuesthouse = {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  ratingCount: number;
  latitude: number;
  longitude: number;
  image: string | null;
  distanceKm?: number;
};

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const earthRadius = 6371;

  const toRadians = (degrees: number) =>
    (degrees * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

// Guesthouse card component
function GuesthouseCard({
  place,
  onPress,
}: {
  place: MapGuesthouse;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.hotelCard}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {place.image ? (
        <Image
          source={{ uri: place.image }}
          style={styles.hotelImage}
        />
      ) : (
        <View style={[styles.hotelImage, styles.imagePlaceholder]}>
          <Ionicons
            name="bed-outline"
            size={32}
            color="#9B1C2B"
          />
        </View>
      )}

      <View style={styles.hotelDetails}>
        <Text style={styles.hotelName} numberOfLines={1}>
          {place.name}
        </Text>

      <Text style={styles.hotelLocation}>
        {place.location}
      </Text>

      {place.distanceKm !== undefined && (
        <Text style={styles.distanceText}>
          {place.distanceKm < 1
            ? `${Math.round(place.distanceKm * 1000)} m away`
            : `${place.distanceKm.toFixed(1)} km away`}
        </Text>
      )}

      <Text style={styles.hotelRating}>
        ★ {place.ratingCount > 0
          ? `${place.rating} (${place.ratingCount} reviews)`
          : "New listing"}
      </Text>

        <Text style={styles.hotelPrice}>
          P{place.price}
          <Text style={styles.hotelNight}> / night</Text>
        </Text>
      </View>

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => {}}
      >
        <Ionicons
          name="heart-outline"
          size={22}
          color="#9B1C2B"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function MapScreen() {
  // Map reference and screen dimensions
  const mapRef = useRef<MapView | null>(null);
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { searchQuery } = useSearch();

  // Bottom sheet dimensions
  const SHEET_HEIGHT = height * 0.78;
  const COLLAPSED_POSITION = SHEET_HEIGHT - 190;

  // States
  const [guesthouses, setGuesthouses] = useState<MapGuesthouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<MapGuesthouse | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [userLocation, setUserLocation] =
    useState<Location.LocationObjectCoords | null>(null);

  const nearbyGuesthouses = userLocation
  ? guesthouses
      .map((place) => ({
        ...place,
        distanceKm: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          place.latitude,
          place.longitude
        ),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
  : guesthouses;

  useEffect(() => {
    const getInitialLocation = async () => {
      try {
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          console.log("Location permission was not granted.");
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setUserLocation(location.coords);
      } catch (err) {
        console.error("Could not retrieve user location:", err);
      }
    };

    void getInitialLocation();
  }, []);

  // Fetch actual guesthouses
  useEffect(() => {
    let isMounted = true;

    const loadGuesthouses = async () => {
      try {
        setLoading(true);
        setError(null);

    const query = searchQuery.trim();

    const result = query
      ? await searchGuesthouses(query)
      : await getGuesthouses();

        const actualGuesthouses: MapGuesthouse[] = (
          result.content ?? []
        )
          .map((place) => ({
            id: place.id,
            name: place.name,
            location: [place.address, place.city]
              .filter(Boolean)
              .join(", "),
            price: place.pricePerNight,
            rating: place.averageRating ?? 0,
            ratingCount: place.ratingCount ?? 0,
            latitude: place.latitude,
            longitude: place.longitude,
            image: place.images?.[0] ?? null,
          }))
          .filter(
            (place) =>
              Boolean(place.id) &&
              Number.isFinite(place.latitude) &&
              Number.isFinite(place.longitude)
          );

        if (isMounted) {
          setGuesthouses(actualGuesthouses);
        }
      } catch (err: unknown) {
        console.error("Failed to load map guesthouses:", err);

        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load guesthouses."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadGuesthouses();

    return () => {
      isMounted = false;
    };
  }, [searchQuery]);

  useEffect(() => {
    if (!searchQuery.trim() || guesthouses.length === 0) {
      return;
    }

    setSelected(null);

    if (guesthouses.length === 1) {
      const place = guesthouses[0];

      mapRef.current?.animateToRegion(
        {
          latitude: place.latitude,
          longitude: place.longitude,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        },
        700
      );

      setSelected(place);
    } else {
      mapRef.current?.fitToCoordinates(
        guesthouses.map((place) => ({
          latitude: place.latitude,
          longitude: place.longitude,
        })),
        {
          edgePadding: {
            top: 160,
            right: 60,
            bottom: 300,
            left: 60,
          },
          animated: true,
        }
      );
    }
  }, [searchQuery, guesthouses]);

  useEffect(() => {
  if (searchQuery.trim() !== "") return;

  if (userLocation) {
    mapRef.current?.animateToRegion(
      {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      },
      700
    );
  }
}, [searchQuery, userLocation]);

  // Animation values
  const sheetPosition = useRef(
    new Animated.Value(COLLAPSED_POSITION)
  ).current;

  const expandedRef = useRef(false);
  const dragStart = useRef(COLLAPSED_POSITION);

  // Open or close bottom sheet
  const snapSheet = (expand: boolean) => {
    expandedRef.current = expand;
    setExpanded(expand);

    Animated.spring(sheetPosition, {
      toValue: expand ? 0 : COLLAPSED_POSITION,
      useNativeDriver: true,
      friction: 9,
      tension: 65,
    }).start();
  };

  // Select sheet position
  const changeSheet = (expand: boolean) => {
    snapSheet(expand);
  };

  // Drag gestures
  const panResponder = useRef(
    PanResponder.create({

  onStartShouldSetPanResponder: () => false,

  onMoveShouldSetPanResponder: (_, gesture) =>
    Math.abs(gesture.dy) > 5 &&
    Math.abs(gesture.dy) > Math.abs(gesture.dx),

    onPanResponderTerminationRequest: () => false,

    onPanResponderGrant: () => {
      console.log("DRAG STARTED");

      // Use the known resting position
      dragStart.current = expandedRef.current
        ? 0
        : COLLAPSED_POSITION;

      // Stop any ongoing animation before dragging
      sheetPosition.stopAnimation();
    },

    onPanResponderMove: (_, gesture) => {

      const nextPosition = Math.max(
        0,
        Math.min(
          COLLAPSED_POSITION,
          dragStart.current + gesture.dy
        )
      );

      sheetPosition.setValue(nextPosition);

      console.log("DRAGGING:", gesture.dy);
    },

    onPanResponderRelease: (_, gesture) => {

      console.log("DRAG RELEASED:", gesture.dy);

      const currentPosition =
        dragStart.current + gesture.dy;

      const midpoint = COLLAPSED_POSITION / 2;

      if (gesture.dy < -40 || gesture.vy < -0.5) {
        snapSheet(true);
      } 
      else if (gesture.dy > 40 || gesture.vy > 0.5) {
        snapSheet(false);
      } 
      else {
        snapSheet(currentPosition < midpoint);
      }
    },

  })
).current;

  // Focus on selected guesthouse
  function focusGuesthouse(place: MapGuesthouse) {
    setSelected(place);

    mapRef.current?.animateToRegion(
      {
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: 0.025,
        longitudeDelta: 0.025,
      },
      500
    );
  }

  // Reset map
  async function resetMap() {
    try {
      let currentLocation = userLocation;

      if (!currentLocation) {
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          console.log("Location permission denied.");
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        currentLocation = location.coords;
        setUserLocation(currentLocation);
      }

      setSelected(null);

      mapRef.current?.animateToRegion(
        {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        },
        700
      );
    } catch (err) {
      console.error("Unable to return to current location:", err);
    }
  }

  return (
    <View style={styles.container}>

      {/* Google Map */}
      <MapView
        ref={mapRef}
        style={[styles.map, { marginTop: 100 }]}
        initialRegion={INITIAL_REGION}
        onPress={() => setSelected(null)}
        showsUserLocation={Boolean(userLocation)}
        showsMyLocationButton={false}
        userInterfaceStyle="light"
        customMapStyle={[]}
        onMapReady={() =>
          console.log("LocateBase map ready")
        }
      >
        {guesthouses.map((place) => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            onPress={() => focusGuesthouse(place)}
            tracksViewChanges={false}
          >
            <View
              style={[
                styles.priceMarker,
                selected?.id === place.id &&
                  styles.activeMarker,
              ]}
            >
              <Text
                style={[
                  styles.priceText,
                  selected?.id === place.id &&
                    styles.activePriceText
                ]}
              >
                P{place.price}
              </Text>
            </View>
          </Marker>
        ))}
      </MapView>   

        {loading && (
            <View style={styles.statusMessage}>
              <Text>Loading guesthouses...</Text>
            </View>
          )}

          {error && (
            <View style={styles.statusMessage}>
              <Text>{error}</Text>
            </View>
          )}


      {/* Draggable guesthouse panel */}
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            height: SHEET_HEIGHT,
            bottom: insets.bottom + -20,
            transform: [
              { translateY: sheetPosition },
            ],
          },
        ]}
      >

      {/* Draggable header area */}
        <View {...panResponder.panHandlers}>

        <View style={styles.dragArea}>
          <View style={styles.dragHandle} />
        </View>

        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>
            Available guesthouses
          </Text>

          <TouchableOpacity onPress={() => changeSheet(true)}>

          </TouchableOpacity>
        </View>
      </View>

        {/* Guesthouse list */}
        <FlatList
          data={nearbyGuesthouses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GuesthouseCard
              place={item}
              onPress={() => focusGuesthouse(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
          nestedScrollEnabled
        />

      </Animated.View>

      {/* Recenter button */}
      <TouchableOpacity
        style={[
          styles.locationButton,
          { bottom: insets.bottom + 180 },
        ]}
        onPress={resetMap}
        accessibilityLabel="Reset map view"
      >
        <Ionicons
          name="locate-outline"
          size={25}
          color="#9B1C2B"
        />
      </TouchableOpacity>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAF8",
  },

  map: {
    flex: 1,
    width: "100%",
  },

  // Map markers
  priceMarker: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#9B1C2B",
    elevation: 4,
  },

  activeMarker: {
    backgroundColor: "#9B1C2B",
    borderColor: "#FFFFFF",
  },

  priceText: {
    color: "#9B1C2B",
    fontWeight: "700",
    fontSize: 13,
  },

  activePriceText: {
    color: "#FFFFFF",
  },

  // Bottom sheet
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#F7FAF8",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 14,
    paddingBottom: 105,
    elevation: 15,
    zIndex: 10,
  },

  dragArea: {
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 10,
    backgroundColor: "#B8C9C0",
  },

  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 12,
  },

  sheetTitle: {
    color: "#242424",
    fontSize: 16,
    fontWeight: "700",
  },

  seeAll: {
    color: "#9B1C2B",
    fontWeight: "600",
    fontSize: 13,
  },

  // Guesthouse cards
  hotelCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    marginBottom: 10,
    padding: 7,
    gap: 12,
    borderWidth: 1,
    borderColor: "#E3EAE6",
  },

  hotelImage: {
    width: 115,
    height: 112,
    borderRadius: 9,
  },

  imagePlaceholder: {
    backgroundColor: "#CDEBDD",
    alignItems: "center",
    justifyContent: "center",
  },

  hotelDetails: {
    flex: 1,
    paddingTop: 8,
  },

  hotelName: {
    color: "#242424",
    fontSize: 14,
    fontWeight: "600",
  },

  hotelLocation: {
    color: "#68736E",
    fontSize: 12,
    marginTop: 4,
  },

  hotelRating: {
    color: "#68736E",
    fontSize: 12,
    marginTop: 5,
  },

  hotelPrice: {
    color: "#9B1C2B",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },

  hotelNight: {
    color: "#68736E",
    fontSize: 11,
    fontWeight: "400",
  },

  favoriteButton: {
    padding: 7,
  },

  // Location button
  locationButton: {
    position: "absolute",
    right: 16,
    backgroundColor: "#FFFFFF",
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    zIndex: 5,
    borderWidth: 1,
    borderColor: "#CDEBDD",
  },

  statusMessage: {
  position: "absolute",
  top: 115,
  alignSelf: "center",
  backgroundColor: "#FFFFFF",
  padding: 12,
  borderRadius: 12,
  elevation: 4,
  zIndex: 20,
},

distanceText: {
  color: "#93A052",
  fontSize: 11,
  fontWeight: "600",
  marginTop: 3,
},
});

