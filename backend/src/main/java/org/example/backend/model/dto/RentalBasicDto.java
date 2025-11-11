package org.example.backend.model.dto;

import java.time.LocalDateTime;

public interface RentalBasicDto {
    Long getId();
    String getName();
    Integer getPrice();
    String getThumbNailUrl();
    Double getAverageRating();
    String getLocationGeoJson();
    LocalDateTime getCreatedAt();
    Double getDistanceToSchool();
    String getFullAddress();
}
