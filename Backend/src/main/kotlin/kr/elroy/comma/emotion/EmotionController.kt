package kr.elroy.comma.emotion

import kr.elroy.comma.emotion.dto.EmotionDto
import org.springframework.web.bind.annotation.RestController

@RestController
class EmotionController(
    private val emotionService: EmotionService,
) : EmotionApi {
    override fun getEmotions(): List<EmotionDto> {
        return emotionService.findAll()
    }
}