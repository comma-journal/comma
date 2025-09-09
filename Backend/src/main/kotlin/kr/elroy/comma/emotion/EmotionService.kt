package kr.elroy.comma.emotion

import kr.elroy.comma.emotion.dto.EmotionResponse
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class EmotionService {
    @Transactional(readOnly = true)
    fun findAll(): List<EmotionResponse> {
        return Emotion.all().map(EmotionResponse::from)
    }
}