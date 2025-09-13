package kr.elroy.comma.v2.dto

import kotlinx.serialization.Serializable
import kr.elroy.comma.v2.EmotionV2

@Serializable
data class EmotionV2Dto(
    val id: Long,
    val name: String,
    val rgb: Int,
    val category: String,
    val description: String?,
) {
    companion object {
        fun from(entity: EmotionV2): EmotionV2Dto {
            return EmotionV2Dto(
                id = entity.id.value,
                name = entity.name,
                rgb = entity.rgb,
                category = entity.category,
                description = entity.description,
            )
        }
    }
}