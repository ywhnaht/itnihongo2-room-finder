package org.example.backend.model.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "rental_images")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RentalImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @Column(name = "image_url", nullable = false)
    String imageUrl;

    @Column(name = "alt_text")
    String altText;

    @ManyToOne(fetch = FetchType.LAZY)
            @JoinColumn(name = "rental_id", nullable = false)
    Rental rental;
}
