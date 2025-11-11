package org.example.backend.repository;

import org.example.backend.model.dto.RentalBasicDto;
import org.example.backend.model.entity.Rental;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RentalRepository extends JpaRepository<Rental, Long> {
    @Query(
            value = "SELECT " +
                    "    id, name, price, thumbnail_url as thumbnailUrl, " +
                    "    average_rating as averageRating, rating_count as ratingCount, " +
                    "    ST_AsGeoJSON(location) as locationGeoJson, " +
                    "    created_at as createdAt " +
                    "FROM rentals",

            countQuery = "SELECT count(id) FROM rentals",
            nativeQuery = true
    )
    Page<RentalBasicDto> findAllBasic(Pageable pageable);

    @Query("SELECT r FROM Rental r LEFT JOIN FETCH r.amenities WHERE r.id = :id")
    Optional<Rental> findDetailById(@Param("id") Long id);
}
