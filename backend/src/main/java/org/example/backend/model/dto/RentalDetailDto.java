package org.example.backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RentalDetailDto {
    private Long id;
    private String name;
    private String description;
    private String fullAddress;
    private int price;
    private double area;

//    private String locationGeoJson;
    private Double distanceToSchool;

    private String contactPhone;
    private String contactName;
    private Double averageRating;
    private Integer ratingCount;

    private Integer electricityPrice;
    private Integer waterPrice;
    private Integer wifiPrice;

    private LocalDateTime createdAt;

    private List<String> images;

    private List<AmenityDto> amenities;
}
