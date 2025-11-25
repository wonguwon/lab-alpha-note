package com.alpha_note.core.habit.controller;

import com.alpha_note.core.common.response.ApiResponse;
import com.alpha_note.core.habit.dto.request.CreateHabitRecordRequest;
import com.alpha_note.core.habit.dto.request.UpdateHabitRecordRequest;
import com.alpha_note.core.habit.dto.response.HabitCalendarResponse;
import com.alpha_note.core.habit.dto.response.HabitRecordResponse;
import com.alpha_note.core.habit.service.HabitCalendarService;
import com.alpha_note.core.habit.service.HabitRecordService;
import com.alpha_note.core.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/v1/habits/{habitId}/records")
@RequiredArgsConstructor
public class HabitRecordController {

    private final HabitRecordService habitRecordService;
    private final HabitCalendarService habitCalendarService;

    /**
     * 습관 기록 생성
     */
    @PostMapping
    public ResponseEntity<ApiResponse<HabitRecordResponse>> createRecord(
            @AuthenticationPrincipal User user,
            @PathVariable Long habitId,
            @Valid @RequestBody CreateHabitRecordRequest request
    ) {
        HabitRecordResponse response = habitRecordService.createRecord(
                habitId, user.getId(), request
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("기록이 성공적으로 생성되었습니다.", response));
    }

    /**
     * 습관 기록 목록 조회 (페이징, 비로그인 허용)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<HabitRecordResponse>>> getRecords(
            @PathVariable Long habitId,
            @PageableDefault(size = 20, sort = "recordDate", direction = Sort.Direction.DESC)
            Pageable pageable
    ) {
        Page<HabitRecordResponse> response = habitRecordService.getRecords(
                habitId, pageable
        );
        return ResponseEntity.ok(ApiResponse.success("기록 목록 조회 성공", response));
    }

    /**
     * 특정 날짜의 기록 조회 (비로그인 허용)
     */
    @GetMapping("/date/{date}")
    public ResponseEntity<ApiResponse<List<HabitRecordResponse>>> getRecordsByDate(
            @PathVariable Long habitId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<HabitRecordResponse> response = habitRecordService.getRecordsByDate(
                habitId, date
        );
        return ResponseEntity.ok(ApiResponse.success("날짜별 기록 조회 성공", response));
    }

    /**
     * 습관 기록 상세 조회 (비로그인 허용)
     */
    @GetMapping("/{recordId}")
    public ResponseEntity<ApiResponse<HabitRecordResponse>> getRecord(
            @PathVariable Long habitId,
            @PathVariable Long recordId
    ) {
        HabitRecordResponse response = habitRecordService.getRecord(recordId);
        return ResponseEntity.ok(ApiResponse.success("기록 조회 성공", response));
    }

    /**
     * 습관 기록 수정
     */
    @PutMapping("/{recordId}")
    public ResponseEntity<ApiResponse<HabitRecordResponse>> updateRecord(
            @AuthenticationPrincipal User user,
            @PathVariable Long habitId,
            @PathVariable Long recordId,
            @Valid @RequestBody UpdateHabitRecordRequest request
    ) {
        HabitRecordResponse response = habitRecordService.updateRecord(
                recordId, user.getId(), request
        );
        return ResponseEntity.ok(ApiResponse.success("기록이 성공적으로 수정되었습니다.", response));
    }

    /**
     * 습관 기록 삭제
     */
    @DeleteMapping("/{recordId}")
    public ResponseEntity<ApiResponse<Void>> deleteRecord(
            @AuthenticationPrincipal User user,
            @PathVariable Long habitId,
            @PathVariable Long recordId
    ) {
        habitRecordService.deleteRecord(recordId, user.getId());
        return ResponseEntity.ok(ApiResponse.success("기록이 성공적으로 삭제되었습니다.", null));
    }

    /**
     * 월별 잔디 데이터 조회 (비로그인 허용)
     */
    @GetMapping("/calendar")
    public ResponseEntity<ApiResponse<HabitCalendarResponse>> getCalendar(
            @PathVariable Long habitId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth
    ) {
        HabitCalendarResponse response = habitCalendarService.getMonthlyCalendar(
                habitId, yearMonth
        );
        return ResponseEntity.ok(ApiResponse.success("캘린더 조회 성공", response));
    }
}
