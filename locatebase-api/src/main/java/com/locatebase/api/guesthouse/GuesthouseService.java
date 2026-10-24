package com.locatebase.api.guesthouse;

import com.locatebase.api.common.BadRequestException;
import com.locatebase.api.common.NotFoundException;
import com.locatebase.api.common.PageResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class GuesthouseService {

    private static final int MAX_PAGE_SIZE = 50;

    private final GuesthouseRepository repository;
    private final MongoTemplate mongo;

    public GuesthouseService(GuesthouseRepository repository, MongoTemplate mongo) {
        this.repository = repository;
        this.mongo = mongo;
    }

    public GuesthouseResponse getPublicById(String id) {
        Guesthouse g = repository.findById(id)
                .filter(x -> x.getStatus() == GuesthouseStatus.PUBLISHED)   // draft and suspended look like "not found"
                .orElseThrow(() -> new NotFoundException("Guesthouse not found: " + id));
        return GuesthouseResponse.from(g);
    }

    public PageResponse<GuesthouseResponse> search(String search, String city, Double minPrice, Double maxPrice,
                                                   Double minRating, String amenities, String sort,
                                                   int page, int size) {
        if (page < 0) throw new BadRequestException("page must be 0 or greater");
        if (size < 1) throw new BadRequestException("size must be at least 1");
        size = Math.min(size, MAX_PAGE_SIZE);

        // Only PUBLISHED guesthouses are ever public
        List<Criteria> filters = new ArrayList<>();
        filters.add(Criteria.where("status").is(GuesthouseStatus.PUBLISHED));

        // Pattern.quote treats the user's text as plain text, so it can't be abused as a query pattern
        if (search != null && !search.isBlank()) {
            String literal = Pattern.quote(search.trim());
            filters.add(new Criteria().orOperator(
                    Criteria.where("name").regex(literal, "i"),
                    Criteria.where("city").regex(literal, "i"),
                    Criteria.where("address").regex(literal, "i")));
        }
        if (city != null && !city.isBlank()) {
            filters.add(Criteria.where("city").regex("^" + Pattern.quote(city.trim()) + "$", "i"));
        }
        if (minPrice != null || maxPrice != null) {
            Criteria price = Criteria.where("pricePerNight");
            if (minPrice != null) price = price.gte(minPrice);
            if (maxPrice != null) price = price.lte(maxPrice);
            filters.add(price);
        }
        if (minRating != null) {
            filters.add(Criteria.where("ratingAverage").gte(minRating));
        }

        // amenities=wifi,parking means the guesthouse must have ALL of the listed amenities
        List<String> wanted = parseAmenities(amenities);
        if (!wanted.isEmpty()) {
            filters.add(Criteria.where("amenities").all(wanted));
        }

        Query query = new Query(new Criteria().andOperator(filters));
        long total = mongo.count(query, Guesthouse.class);   // count before paging

        query.with(PageRequest.of(page, size, buildSort(sort)));
        List<GuesthouseResponse> content = mongo.find(query, Guesthouse.class).stream()
                .map(GuesthouseResponse::from)
                .toList();

        return PageResponse.of(content, page, size, total);
    }

    private List<String> parseAmenities(String amenities) {
        if (amenities == null || amenities.isBlank()) return List.of();
        return Arrays.stream(amenities.split(","))
                .map(a -> a.trim().toLowerCase())
                .filter(a -> !a.isEmpty())
                .toList();
    }

    // The contract's sort values. The default is cheapest first.
    private Sort buildSort(String sort) {
        String key = (sort == null || sort.isBlank()) ? "price_asc" : sort.trim().toLowerCase();
        String field;
        Sort.Direction direction;
        switch (key) {
            case "price_asc" -> { field = "pricePerNight"; direction = Sort.Direction.ASC; }
            case "price_desc" -> { field = "pricePerNight"; direction = Sort.Direction.DESC; }
            case "rating_desc" -> { field = "ratingAverage"; direction = Sort.Direction.DESC; }
            case "distance" -> throw new BadRequestException("sort=distance is not available yet");
            default -> throw new BadRequestException("sort must be price_asc, price_desc, rating_desc or distance");
        }
        // id as a tie-breaker keeps pages stable when two prices or ratings are equal
        return Sort.by(direction, field).and(Sort.by(Sort.Direction.ASC, "id"));
    }
}