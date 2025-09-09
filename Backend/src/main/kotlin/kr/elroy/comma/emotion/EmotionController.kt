package kr.elroy.comma.emotion

import kr.elroy.comma.emotion.dto.EmotionResponse
import org.springframework.web.bind.annotation.RestController

@RestController
class EmotionController(
    private val emotionService: EmotionService,
) : EmotionApi {
    override fun getEmotions(): List<EmotionResponse> {
        return emotionService.findAll()
    }
}