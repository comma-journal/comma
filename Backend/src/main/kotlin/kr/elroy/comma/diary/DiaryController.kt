package kr.elroy.comma.diary

import kotlinx.datetime.LocalDate
import kr.elroy.comma.diary.dto.request.CreateDiaryEntryRequest
import kr.elroy.comma.diary.dto.request.UpdateDiaryEntryRequest
import kr.elroy.comma.diary.dto.response.DiaryEntryResponse
import org.springframework.web.bind.annotation.RestController

@RestController
class DiaryController(
    private val diaryService: DiaryService,
) : DiaryApi {
    override fun createDiary(
        authorId: Long,
        request: CreateDiaryEntryRequest,
    ): DiaryEntryResponse {
        return diaryService.createDiaryEntry(authorId, request)
    }

    override fun getAllDiaries(
        authorId: Long,
        date: LocalDate?,
    ): List<DiaryEntryResponse> {
        return diaryService.findAllByAuthorId(authorId, date)
    }

    override fun getDiaryById(
        authorId: Long,
        id: Long,
    ): DiaryEntryResponse {
        return diaryService.findEntryById(authorId, id)!!
    }

    override fun updateDiary(
        authorId: Long,
        id: Long,
        request: UpdateDiaryEntryRequest,
    ): DiaryEntryResponse {
        return diaryService.updateDiaryEntry(authorId, id, request)
    }

    override fun deleteDiary(authorId: Long, id: Long) {
        diaryService.deleteDiaryEntry(authorId, id)
    }
}