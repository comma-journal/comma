package kr.elroy.comma.v2

import kr.elroy.comma.v2.dto.EmotionV2Dto
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class EmotionV2Service {
    @Transactional(readOnly = true)
    fun findAll(): List<EmotionV2Dto> {
        return EmotionV2.all().map(EmotionV2Dto::from)
    }
}