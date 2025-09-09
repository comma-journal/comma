package kr.elroy.comma.diary

import kotlinx.datetime.LocalDate
import kr.elroy.comma.diary.domain.DiaryEntry
import kr.elroy.comma.diary.domain.DiaryEntryTable
import kr.elroy.comma.diary.dto.request.CreateDiaryEntryRequest
import kr.elroy.comma.diary.dto.request.UpdateDiaryEntryRequest
import kr.elroy.comma.diary.dto.response.DiaryEntryResponse
import kr.elroy.comma.user.domain.User
import org.jetbrains.exposed.v1.core.SqlExpressionBuilder.eq
import org.jetbrains.exposed.v1.core.and
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DiaryService {
    @Transactional
    fun createDiaryEntry(authorId: Long, request: CreateDiaryEntryRequest): DiaryEntryResponse {
        return DiaryEntry.create(
            author = User[authorId],
            content = request.content,
            title = request.title,
            entryDate = request.entryDate,
            annotations = request.annotations
        ).let(DiaryEntryResponse::from)
    }

    @Transactional(readOnly = true)
    fun findAllByAuthorId(authorId: Long, date: LocalDate?): List<DiaryEntryResponse> {
        val query = (DiaryEntryTable.author eq authorId)

        date?.let {
            query.and { DiaryEntryTable.author eq authorId }
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

        return diaryEntry.apply {
            content = request.content
            title = request.title
            entryDate = request.entryDate
            annotations = request.annotations.toTypedArray()
        }.let(DiaryEntryResponse::from)
    }

    @Transactional
    fun deleteDiaryEntry(authorId: Long, id: Long) {
        DiaryEntry.findById(id)?.delete()
    }
}