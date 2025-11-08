package org.example.backend.model.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class PageDto<T> {
    private List<T> data;

    private Map<String, Object> pagination;

    public PageDto(List<T> data, Map<String, Object> pagination) {
        this.data = data;
        this.pagination = pagination;
    }
}
