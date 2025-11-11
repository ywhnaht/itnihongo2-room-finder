package org.example.backend.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.backend.exception.RentalNotFoundException;
import org.example.backend.model.dto.AmenityDto;
import org.example.backend.model.dto.PageDto;
import org.example.backend.model.dto.RentalBasicDto;
import org.example.backend.model.dto.RentalDetailDto;
import org.example.backend.model.entity.Rental;
import org.example.backend.model.entity.RentalImage;
import org.example.backend.repository.RentalRepository;
import org.geolatte.geom.Point;
import org.locationtech.jts.io.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RentalService {
    RentalRepository rentalRepository;

    public PageDto<RentalBasicDto> getAllRentals(int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        Page<RentalBasicDto> rentalPage = rentalRepository.findAllBasic(pageable);

        Map<String, Object> pagination = new HashMap<>();
        pagination.put("currentPage", rentalPage.getNumber() + 1);
        pagination.put("limit", rentalPage.getSize());
        pagination.put("totalItems", rentalPage.getTotalElements());
        pagination.put("totalPages", rentalPage.getTotalPages());

        return new PageDto<>(rentalPage.getContent(),  pagination);
    }

    @Transactional(readOnly = true)
    public RentalDetailDto getRentalDetails(Long id) {
        Rental rental = rentalRepository.findDetailById(id)
                .orElseThrow(() -> new RentalNotFoundException("Rental not found with id: " + id));

        return mapToDetailDto(rental);
    }

    private RentalDetailDto mapToDetailDto(Rental rental) {
//        String locationGeoJson = convertPointToGeoJson(rental.getLocation());

        List<String> imageUrls = rental.getImages().stream()
                .map(RentalImage::getImageUrl)
                .collect(Collectors.toList());

        List<AmenityDto> amenityDtos = rental.getAmenities().stream()
                .map(amenity -> new AmenityDto(amenity.getName(), amenity.getIconClass()))
                .collect(Collectors.toList());

        return RentalDetailDto.builder()
                .id(rental.getId())
                .name(rental.getName())
                .description(rental.getDescription())
                .fullAddress(rental.getFullAddress())
                .distanceToSchool(rental.getDistanceToSchool())
                .price(rental.getPrice())
                .area(rental.getArea())
//                .locationGeoJson(locationGeoJson)
                .contactPhone(rental.getContactPhone())
                .contactName(rental.getContactName())
                .averageRating(rental.getAverageRating())
                .ratingCount(rental.getRatingCount())
                .createdAt(rental.getCreatedAt())
                .images(imageUrls)
                .amenities(amenityDtos) //
                .build();
    }

//    private String convertPointToGeoJson(Point point) {
//        if (point == null) {
//            return null;
//        }
//        GeoJSONWriter writer = new Js();
//        // Sẽ trả về: {"type":"Point","coordinates":[lng, lat]}
//        return writer.write(point);
//    }
}
