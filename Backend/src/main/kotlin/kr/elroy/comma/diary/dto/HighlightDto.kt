package kr.elroy.comma.diary.dto

import kotlinx.serialization.Serializable

@Serializable
data class HighlightDto(
    val start: Int,
    val end: Int,
    val rgb: Int,
)