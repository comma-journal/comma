package kr.elroy.comma.emotion.dto

import kotlinx.serialization.Serializable
import kr.elroy.comma.emotion.Emotion

@Serializable
data class EmotionDto(
    val id: Long,
    val name: String,
    val rgb: Int,
    val description: String?,
) {
    companion object {
        fun from(entity: Emotion): EmotionDto {
            return EmotionDto(
                id = entity.id.value,
                name = entity.name,
                rgb = entity.rgb,
                description = entity.description,
            )
        }
    }
}