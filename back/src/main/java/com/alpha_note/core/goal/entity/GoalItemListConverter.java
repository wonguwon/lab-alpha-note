package com.alpha_note.core.goal.entity;

import com.alpha_note.core.goal.dto.GoalItem;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.List;

/**
 * List<GoalItem>을 JSON 문자열로 변환하는 Converter
 */
@Converter
public class GoalItemListConverter implements AttributeConverter<List<GoalItem>, String> {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<GoalItem> attribute) {
        if (attribute == null || attribute.isEmpty()) {
            return "[]";
        }
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert GoalItem list to JSON", e);
        }
    }

    @Override
    public List<GoalItem> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty() || dbData.trim().equals("[]")) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(dbData, new TypeReference<List<GoalItem>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert JSON to GoalItem list", e);
        }
    }
}

