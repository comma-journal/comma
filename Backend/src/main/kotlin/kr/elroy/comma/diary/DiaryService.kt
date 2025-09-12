package kr.elroy.comma.diary

import kotlinx.datetime.YearMonth
import kotlinx.datetime.number
import kr.elroy.comma.ai.AiComment
import kr.elroy.comma.diary.domain.DiaryEntry
import kr.elroy.comma.diary.domain.DiaryEntryTable
import kr.elroy.comma.diary.dto.request.CreateDiaryEntryRequest
import kr.elroy.comma.diary.dto.request.UpdateDiaryEntryRequest
import kr.elroy.comma.diary.dto.response.DiaryEntryResponse
import kr.elroy.comma.user.domain.User
import org.jetbrains.exposed.v1.core.SqlExpressionBuilder.eq
import org.jetbrains.exposed.v1.core.and
import org.jetbrains.exposed.v1.datetime.month
import org.jetbrains.exposed.v1.datetime.year
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DiaryService(
    private val aiComment: AiComment
) {
    @Transactional
    fun createDiaryEntry(authorId: Long, request: CreateDiaryEntryRequest): DiaryEntryResponse {
        val newAnnotation = request.annotation.copy(
            comments = aiComment.createComment(request.content) ?: emptyList()
        )

        return DiaryEntry.create(
            author = User[authorId],
            content = request.content,
            title = request.title,
            entryDate = request.entryDate,
            annotation = newAnnotation
        ).let(DiaryEntryResponse::from)
    }

    @Transactional(readOnly = true)
    fun findAllByAuthorId(authorId: Long, yearMonth: YearMonth?): List<DiaryEntryResponse> {
        var query = (DiaryEntryTable.author eq authorId)

        yearMonth?.let {
            query = query.and { DiaryEntryTable.entryDate.year() eq yearMonth.year }
            query = query.and { DiaryEntryTable.entryDate.month() eq yearMonth.month.number }
        }

        return DiaryEntry.find(query).map(DiaryEntryResponse::from)
    }

    @Transactional(readOnly = true)
    fun findEntryById(authorId: Long, id: Long): DiaryEntryResponse? {
        return DiaryEntry.findById(id)?.let(DiaryEntryResponse::from)
    }

    @Transactional
    fun updateDiaryEntry(authorId: Long, id: Long, request: UpdateDiaryEntryRequest): DiaryEntryResponse {
        val diaryEntry = DiaryEntry.findById(id) ?: throw IllegalArgumentException("Diary entry not found")
        val newAnnotation = request.annotation.copy(
            comments = emptyList()
        )
        return diaryEntry.apply {
            content = request.content
            title = request.title
            entryDate = request.entryDate
            annotation = newAnnotation
        }.let(DiaryEntryResponse::from)
    }

    @Transactional
    fun deleteDiaryEntry(authorId: Long, id: Long) {
        DiaryEntry.findById(id)?.delete()
    }
}