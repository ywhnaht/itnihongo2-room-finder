package org.example.backend.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.backend.model.dto.PageDto;
import org.example.backend.model.dto.RentalBasicDto;
import org.example.backend.service.RentalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rentals")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RentalController {
    RentalService rentalService;

    @GetMapping
    public ResponseEntity<PageDto<RentalBasicDto>> getAllRentals(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        PageDto<RentalBasicDto> rentalPage = rentalService.getAllRentals(page, limit);
        return ResponseEntity.ok(rentalPage);
    }
}
