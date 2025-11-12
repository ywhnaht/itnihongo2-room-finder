package org.example.backend.model.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.geolatte.geom.Point;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rentals")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Rental {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String name;
    String description;

    @Column(name = "full_address")
    String fullAddress;

    int price;
    double area;

    @Column(name = "location", nullable = false, columnDefinition = "POINT")
    Point location;

    @Column(name = "thumbnail_url")
    String thumbnailUrl;

    @Column(name = "contact_phone")
    String contactPhone;

    @Column(name = "contact_name")
    String contactName;

    @Column(name = "average_rating")
    Double averageRating;

    @Column(name = "rating_count")
    Integer ratingCount;

    @Column(name = "electricity_price")
    Integer electricityPrice;

    @Column(name = "water_price")
    Integer waterPrice;

    @Column(name = "wifi_price")
    Integer wifiPrice;

    @Column(name = "created_at")
    LocalDateTime createdAt;

    @Column(name = "updated_at")
    LocalDateTime updatedAt;

    @Column(name = "distance_to_school")
    Double distanceToSchool;

    @OneToMany(mappedBy = "rental", cascade = CascadeType.ALL, orphanRemoval = true)
    List<RentalImage> images = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
            @JoinTable(name = "rental_amenities", joinColumns = @JoinColumn(name = "rental_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id", referencedColumnName = "id"))
    List<Amenity> amenities = new ArrayList<>();

}
