package com.locatebase.api.guesthouse;

import com.locatebase.api.common.BadRequestException;
import com.locatebase.api.common.NotFoundException;
import com.locatebase.api.common.PageResponse;
import com.locatebase.api.user.AppUser;
import com.locatebase.api.user.AppUserRepository;
import com.locatebase.api.user.Role;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

@Service
public class AdminGuesthouseService {

    private static final int MAX_PAGE_SIZE = 50;

    private final GuesthouseRepository repository;
    private final AppUserRepository users;
    private final MongoTemplate mongo;

    public AdminGuesthouseService(GuesthouseRepository repository, AppUserRepository users, MongoTemplate mongo) {
        this.repository = repository;
        this.users = users;
        this.mongo = mongo;
    }

    // All guesthouses in every status, newest first
    public PageResponse<GuesthouseResponse> list(String search, String status, String city, int page, int size) {
        if (page < 0) throw new BadRequestException("page must be 0 or greater");
        if (size < 1) throw new BadRequestException("size must be at least 1");
        size = Math.min(size, MAX_PAGE_SIZE);

        List<Criteria> filters = new ArrayList<>();
        if (status != null && !status.isBlank()) {
            filters.add(Criteria.where("status").is(parseStatus(status).name()));
        }
        if (search != null && !search.isBlank()) {
            String literal = Pattern.quote(search.trim());   // plain text, never a query pattern
            filters.add(new Criteria().orOperator(
                    Criteria.where("name").regex(literal, "i"),
                    Criteria.where("city").regex(literal, "i"),
                    Criteria.where("address").regex(literal, "i")));
        }
        if (city != null && !city.isBlank()) {
            filters.add(Criteria.where("city").regex("^" + Pattern.quote(city.trim()) + "$", "i"));
        }

        Query query = filters.isEmpty() ? new Query() : new Query(new Criteria().andOperator(filters));
        long total = mongo.count(query, Guesthouse.class);

        query.with(PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, "createdAt").and(Sort.by(Sort.Direction.ASC, "id"))));
        List<GuesthouseResponse> content = mongo.find(query, Guesthouse.class).stream()
                .map(GuesthouseResponse::from)
                .toList();
        return PageResponse.of(content, page, size, total);
    }

    public GuesthouseResponse get(String id) {
        return GuesthouseResponse.from(find(id));
    }

    // A new guesthouse always starts as a draft with no photos and no ratings
    public GuesthouseResponse create(GuesthouseRequest request) {
        Guesthouse g = new Guesthouse();
        apply(g, request);
        g.setStatus(GuesthouseStatus.DRAFT);
        g.setOwnerId(resolveOwnerId(request.ownerEmail()));
        return GuesthouseResponse.from(repository.save(g));
    }

    // Replaces the details with what was sent. Status, photos, ratings and views are never touched here.
    public GuesthouseResponse update(String id, GuesthouseRequest request) {
        Guesthouse g = find(id);
        apply(g, request);

        String ownerId = resolveOwnerId(request.ownerEmail());
        if (ownerId != null) {
            g.setOwnerId(ownerId);   // left out = the current owner stays
        }
        g.setUpdatedAt(Instant.now());
        return GuesthouseResponse.from(repository.save(g));
    }

    // Deleting a guesthouse also removes its ratings and everyone's favourites of it
    public void delete(String id) {
        Guesthouse g = find(id);
        repository.delete(g);
        mongo.remove(Query.query(Criteria.where("guesthouseId").is(id)), "ratings");
        mongo.remove(Query.query(Criteria.where("guesthouseId").is(id)), "favourites");
    }

    // Demo status flow: published listings appear on mobile, drafts and suspended do not.
    public GuesthouseResponse changeStatus(String id, GuesthouseStatus status) {
        Guesthouse g = find(id);
        g.setStatus(status);
        g.setUpdatedAt(Instant.now());
        return GuesthouseResponse.from(repository.save(g));
    }

    // ---------- helpers ----------

    private Guesthouse find(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Guesthouse not found: " + id));
    }

    private GuesthouseStatus parseStatus(String status) {
        try {
            return GuesthouseStatus.fromJson(status);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("status must be draft, published or suspended");
        }
    }

    private void apply(Guesthouse g, GuesthouseRequest r) {
        g.setName(r.name().trim());
        g.setDescription(clean(r.description()));
        g.setCity(r.city().trim());
        g.setAddress(clean(r.address()));
        g.setLocation(r.location() == null ? null : toPoint(r.location()));
        g.setPricePerNight(r.pricePerNight());
        g.setAmenities(cleanAmenities(r.amenities()));

        GuesthouseRequest.ContactInput c = r.contact();
        g.setContact(c == null ? new Contact()
                : new Contact(clean(c.phone()), clean(c.whatsapp()), clean(c.email())));
    }

    // GeoJSON order is [longitude, latitude]
    private GeoJsonPoint toPoint(GuesthouseRequest.LocationInput location) {
        double lng = location.coordinates().get(0);
        double lat = location.coordinates().get(1);
        if (lng < -180 || lng > 180) throw new BadRequestException("Longitude must be between -180 and 180");
        if (lat < -90 || lat > 90) throw new BadRequestException("Latitude must be between -90 and 90");
        return new GeoJsonPoint(lng, lat);
    }

    // lowercase, trimmed, no duplicates, spaces become hyphens ("Air Conditioning" -> "air-conditioning")
    private List<String> cleanAmenities(List<String> amenities) {
        Set<String> result = new LinkedHashSet<>();
        if (amenities != null) {
            for (String a : amenities) {
                if (a == null) continue;
                String value = a.trim().toLowerCase().replaceAll("\\s+", "-");
                if (!value.isEmpty()) result.add(value);
            }
        }
        return new ArrayList<>(result);
    }

    // finds the owner by email; returns null when no email was given
    private String resolveOwnerId(String ownerEmail) {
        if (ownerEmail == null || ownerEmail.isBlank()) return null;
        AppUser owner = users.findByEmailIgnoreCase(ownerEmail.trim())
                .orElseThrow(() -> new BadRequestException("No user with that email. The owner must sign up first."));
        if (owner.getRole() == Role.CUSTOMER) {
            throw new BadRequestException("That user is not an owner.");
        }
        return owner.getId();
    }

    private String clean(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }
}