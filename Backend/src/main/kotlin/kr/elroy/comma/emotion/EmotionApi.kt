package kr.elroy.comma.emotion

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import kr.elroy.comma.emotion.dto.EmotionDto
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@Tag(name = "Emotion", description = "Emotion API")
@RequestMapping("/v1/emotions")
interface EmotionApi {
    @Operation(summary = "감정 목록 조회", description = "모든 감정을 조회합니다.")
    @GetMapping
    fun getEmotions(): List<EmotionDto>
}