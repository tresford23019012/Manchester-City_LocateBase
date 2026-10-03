package com.locatebase.api.guesthouse;

import com.locatebase.api.common.PageResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/guesthouses")
public class GuesthouseController {

    private final GuesthouseService service;

    public GuesthouseController(GuesthouseService service) {
        this.service = service;
    }

    @GetMapping
    public PageResponse<GuesthouseResponse> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String order,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return service.search(q, city, minPrice, maxPrice, minRating, sort, order, page, size);
    }

    @GetMapping("/{id}")
    public GuesthouseResponse get(@PathVariable String id) {
        return service.getPublicById(id);
    }
}