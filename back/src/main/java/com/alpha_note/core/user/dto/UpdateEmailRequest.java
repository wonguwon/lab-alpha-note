package com.alpha_note.core.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateEmailRequest {
    @NotBlank(message = "New email is required")
    @Email(message = "Please provide a valid email")
    private String newEmail;
}
