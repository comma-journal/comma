package kr.elroy.comma.emotion

import kr.elroy.comma.emotion.dto.EmotionDto
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class EmotionService {
    @Transactional(readOnly = true)
    fun findAll(): List<EmotionDto> {
        return Emotion.all().map(EmotionDto::from)
    }
}