package org.example.backend.exception;

public class RentalNotFoundException extends RuntimeException {
    public RentalNotFoundException(String message) {
        super(message);
    }
}