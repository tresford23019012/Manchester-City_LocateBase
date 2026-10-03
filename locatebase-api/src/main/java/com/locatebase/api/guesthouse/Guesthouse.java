package com.locatebase.api.guesthouse;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Document("guesthouses")
public class Guesthouse {

    @Id
    private String id;

    private String name;
    private String description;
    private String city;
    private String address;

    private GeoJsonPoint location;        // longitude first, then latitude
    private double pricePerNight;         // in pula

    private List<String> amenities = new ArrayList<>();
    private List<String> images = new ArrayList<>();   // photo links, max 7, staff-managed

    private String contactPhone;
    private String contactEmail;
    private String ownerId;

    private GuesthouseStatus status = GuesthouseStatus.DRAFT;

    private double averageRating;
    private int ratingCount;

    private Instant createdAt = Instant.now();
}
