package kr.elroy.comma.diary

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import kotlinx.datetime.YearMonth
import kr.elroy.comma.diary.dto.request.CreateDiaryEntryRequest
import kr.elroy.comma.diary.dto.request.UpdateDiaryEntryRequest
import kr.elroy.comma.diary.dto.response.DiaryEntryResponse
import kr.elroy.comma.user.CurrentUserId
import org.springframework.web.bind.annotation.*

@Tag(name = "Diary", description = "일기 API")
@RequestMapping("/v1/me/diary")
interface DiaryApi {
    @Operation(summary = "일기 작성", description = "새로운 일기를 작성합니다.")
    @PostMapping
    fun createDiary(
        @Parameter(hidden = true)
        @CurrentUserId
        authorId: Long,

        @RequestBody
        request: CreateDiaryEntryRequest,
    ): DiaryEntryResponse

    @Operation(summary = "일기 목록 조회", description = "현재 사용자의 모든 일기를 조회합니다.")
    @GetMapping
    fun getAllDiaries(
        @Parameter(hidden = true)
        @CurrentUserId
        authorId: Long,

        @RequestParam(required = false)
        yearMonth: YearMonth?,
    ): List<DiaryEntryResponse>

    @Operation(summary = "일기 단건 조회", description = "ID로 특정 일기를 조회합니다.")
    @GetMapping("/{id}")
    fun getDiaryById(
        @Parameter(hidden = true)
        @CurrentUserId
        authorId: Long,

        @PathVariable
        id: Long,
    ): DiaryEntryResponse

    @Operation(summary = "일기 수정", description = "기존 일기를 수정합니다.")
    @PutMapping("/{id}")
    fun updateDiary(
        @Parameter(hidden = true)
        @CurrentUserId
        authorId: Long,

        @PathVariable
        id: Long,

        @RequestBody
        request: UpdateDiaryEntryRequest,
    ): DiaryEntryResponse

    @Operation(summary = "일기 삭제", description = "특정 일기를 삭제합니다.")
    @DeleteMapping("/{id}")
    fun deleteDiary(
        @Parameter(hidden = true)
        @CurrentUserId
        authorId: Long,

        @PathVariable
        id: Long,
    )
}