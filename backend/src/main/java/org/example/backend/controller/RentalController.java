package org.example.backend.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.backend.model.dto.ApiResponse;
import org.example.backend.model.dto.PageDto;
import org.example.backend.model.dto.RentalBasicDto;
import org.example.backend.model.dto.RentalDetailDto;
import org.example.backend.service.RentalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rentals")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RentalController {
    RentalService rentalService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageDto<RentalBasicDto>>> getAllRentals(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        PageDto<RentalBasicDto> rentalPage = rentalService.getAllRentals(page, limit);
        return ResponseEntity.ok(ApiResponse.success(rentalPage, "Successful!"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RentalDetailDto>> getRentalById(
            @PathVariable Long id
    ) {
        RentalDetailDto rentalDetail = rentalService.getRentalDetails(id);
        return ResponseEntity.ok(ApiResponse.success(rentalDetail, "Successful!"));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageDto<RentalBasicDto>>> searchRentals(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) Double maxDistance,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) String address
    ) {
        PageDto<RentalBasicDto> rentalPage = rentalService.searchRentals(page, limit, maxDistance, minRating, minPrice, maxPrice, address);
        return ResponseEntity.ok(ApiResponse.success(rentalPage, "Successful!"));
    }
}
