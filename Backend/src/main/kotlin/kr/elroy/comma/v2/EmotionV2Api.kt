package kr.elroy.comma.v2

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import kr.elroy.comma.v2.dto.EmotionV2Dto
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@Tag(name = "EmotionV2", description = "EmotionV2 API")
@RequestMapping("/v2/emotions")
interface EmotionV2Api {
    @Operation(summary = "감정 목록 조회", description = "모든 감정을 조회합니다.")
    @GetMapping
    fun getEmotions(): List<EmotionV2Dto>
}