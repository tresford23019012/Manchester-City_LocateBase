package com.locatebase.api.guesthouse;

import org.springframework.data.mongodb.core.geo.GeoJsonPoint;

import java.util.List;

public record GuesthouseResponse(
        String id,
        String name,
        String description,
        String city,
        String address,
        double latitude,
        double longitude,
        double pricePerNight,
        List<String> amenities,
        List<String> images,
        String contactPhone,
        String contactEmail,
        double averageRating,
        int ratingCount) {

    public static GuesthouseResponse from(Guesthouse g) {
        GeoJsonPoint p = g.getLocation();
        double lat = p != null ? p.getY() : 0;   // y is latitude
        double lng = p != null ? p.getX() : 0;   // x is longitude

        return new GuesthouseResponse(
                g.getId(), g.getName(), g.getDescription(), g.getCity(), g.getAddress(),
                lat, lng, g.getPricePerNight(),
                g.getAmenities(), g.getImages(),
                g.getContactPhone(), g.getContactEmail(),
                g.getAverageRating(), g.getRatingCount());
    }
}
