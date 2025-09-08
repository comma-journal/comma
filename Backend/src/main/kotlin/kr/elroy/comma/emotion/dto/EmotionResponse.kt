package kr.elroy.comma.emotion.dto

import kr.elroy.comma.emotion.Emotion

data class EmotionResponse(
    val id: Long,
    val name: String,
    val rgb: Int,
    val description: String?,
) {
    companion object {
        fun from(entity: Emotion): EmotionResponse {
            return EmotionResponse(
                id = entity.id.value,
                name = entity.name,
                rgb = entity.rgb,
                description = entity.description,
            )
        }
    }
}