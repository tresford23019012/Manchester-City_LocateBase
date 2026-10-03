package com.locatebase.api.config;

import com.locatebase.api.guesthouse.Guesthouse;
import com.locatebase.api.guesthouse.GuesthouseRepository;
import com.locatebase.api.guesthouse.GuesthouseStatus;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Profile("dev")   // only runs when the app is started with the dev profile
public class DevDataSeeder implements CommandLineRunner {

    private final GuesthouseRepository repository;

    public DevDataSeeder(GuesthouseRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) {
            return;   // already seeded, don't add duplicates
        }

        repository.saveAll(List.of(
                make("Kgotla View Guesthouse", "Palapye", 27.1247, -22.5467, 450, 4.3, 12,
                        GuesthouseStatus.ACTIVE, List.of("WiFi", "Parking", "Breakfast")),
                make("Pula Palms Guesthouse", "Gaborone", 25.9231, -24.6282, 780, 4.7, 31,
                        GuesthouseStatus.ACTIVE, List.of("WiFi", "Pool", "Air conditioning", "Parking")),
                make("Tati River Lodge", "Francistown", 27.5100, -21.1700, 620, 4.0, 8,
                        GuesthouseStatus.ACTIVE, List.of("WiFi", "Garden")),
                make("Suspended Example Inn", "Gaborone", 25.9100, -24.6500, 300, 3.0, 2,
                        GuesthouseStatus.SUSPENDED, List.of("WiFi"))
        ));
    }

    private Guesthouse make(String name, String city, double lng, double lat, double price,
                            double rating, int ratingCount, GuesthouseStatus status,
                            List<String> amenities) {
        Guesthouse g = new Guesthouse();
        g.setName(name);
        g.setDescription("Sample listing for development.");
        g.setCity(city);
        g.setLocation(new GeoJsonPoint(lng, lat));   // longitude first, then latitude
        g.setPricePerNight(price);
        g.setAmenities(amenities);
        g.setContactPhone("+26771000000");
        g.setAverageRating(rating);
        g.setRatingCount(ratingCount);
        g.setStatus(status);
        return g;
    }
}