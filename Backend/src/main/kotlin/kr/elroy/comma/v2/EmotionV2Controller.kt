package kr.elroy.comma.v2

import kr.elroy.comma.v2.dto.EmotionV2Dto
import org.springframework.web.bind.annotation.RestController

@RestController
class EmotionV2Controller(
    private val emotionService: EmotionV2Service,
) : EmotionV2Api {
    override fun getEmotions(): List<EmotionV2Dto> {
        return emotionService.findAll()
    }
}