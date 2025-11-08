package org.example.backend.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.example.backend.model.dto.PageDto;
import org.example.backend.model.dto.RentalBasicDto;
import org.example.backend.repository.RentalRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
}
