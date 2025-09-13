package kr.elroy.comma.ai

import kr.elroy.comma.diary.dto.CommentDto
import org.springframework.ai.chat.client.ChatClient
import org.springframework.core.ParameterizedTypeReference
import org.springframework.stereotype.Component
import org.springframework.web.servlet.resource.ResourceUrlProvider

@Component
class AiComment(
    private val chatClient: ChatClient.Builder,
    private val resourceUrlProvider: ResourceUrlProvider
) {
    fun createComment(content: String): List<CommentDto>? {
        val chunk = content.split("\\s+".toRegex())
        println(mapOf(("content" to chunk)))

        val chatClient = chatClient.build()
        val result = chatClient
            .prompt()
            .system("""
                <instruction>
                - 당신은 심리학에 관한 지식이 풍부한 심리 전문가입니다.
                - 유저가 쓴 감정일기를 읽고 중요하지만 사실에 대한 묘사만 존재하고 감정이 누락된 부분을 감지하고 유저에게 피드백을 주어야 합니다.
                - 일기의 내용은 띄워쓰기와 개행문자 기준으로 List에 나뉘어 담겨있습니다.
                - 피드백을 줄 땐 아래의 단계를 step-by-step으로 따라야합니다.
                    1. 주변 맥락을 고려하여 읽었을 때 사실이 묘사되어 있지만 감정 서술이 누락된 부분인지 찾으세요.
                    2. 이 문장이 감정 일기의 주요 주제가 될 만큼 중요한 사건을 다루고 있는지 확인하세요.
                    3. 만약 정말 중요한 사건이지만 감정이 누락되었다면, 사실을 묘사한 부분만을 확인하여 해당 문장의 시작부분의 List index와 끝부분의 List index를 지정해야합니다.
                
                - output의 **start**와 **end**는 피드백을 생성할 문장의 **시작 리스트 index**,  **종료 리스트 index**인지 검증해야합니다.
                </instruction>
                
                <expected_output>
                // Json List 입니다.
                [
                    {
                      "start": 0, // 피드백을 줄 문장의 시작 단어가 전체 리스트에서 몇 번째 인덱스인지
                      "end": 6, // 피드백을 줄 문장의 종료 단어가 전체 리스트에서 몇 번째 인덱스인지
                      "content": "이렇게 아침에 일어나기 힘들었을 때 기분은 어땠나요?", // 피드백 내용
                      "author": "AI" // AI 고정
                    }
                ]
                </expected_output>
                
                
                <example-1>
                    <input>
                        {content=["아침", "햇살이", "부드럽게", "들어와", "마음이", "차분해졌다.", "버스를", "놓쳤지만", "이상하게도", "조급하지", "않았고", "카페", "창가에", "앉으니", "작은", "설렘이", "피어올랐다.", "오늘은", "잘", "해낼", "수", "있을", "것", "같아", "든든했다."]}
                    </input>
                
                    <output>
                        []
                    </output>
                
                    <reason>
                        감정이 누락된 부분이 없습니다.
                    </reason>
                </example-1>
                
                
                <example-2>
                    <input>
                        {content=["알람이", "세", "번", "울린", "뒤에", "일어났다.", "이불을", "개고", "샤워를", "했다.", "토스트를", "먹고", "8시", "40분에", "집을", "나섰다.", "2호선을", "타고", "강남역에서", "환승했다.", "9시", "20분에", "사무실에", "도착해", "메일을", "정리했다."]}
                    </input>
                
                    <output>
                        [
                            {
                              "start": 0,
                              "end": 6,
                              "content": "이렇게 아침에 일어나기 힘들었을 때 기분은 어땠나요?",
                              "author": "AI"
                            }
                        ]
                    </output>
                
                    <reason>
                        알람이 세 번 울린 뒤에 일어났다.  => 감정이 누락된 부분을 탐지했습니다.
                        2호선을 타고 강남역에서 환승했다. => 크게 중요하지 않습니다.
                    </reason>
                </example-2>
            """)
            .user { userSpec ->
                userSpec.text("{content}")
                    .params(mapOf(("content" to chunk)))
            }
            .call()
            .entity(object: ParameterizedTypeReference<List<CommentDto>>() {})

        return result?.map { d ->
            var startIndex = 0
            for(i in 0..< d.start)
                startIndex += chunk[i].length + 1

            var endIndex = startIndex
            var i = d.start
            while(!chunk[i].contains(".")) {
                endIndex += chunk[i].length + 1
                i++
            }
            endIndex += chunk[i].length

            d.copy(
                start = startIndex,
                end = endIndex,
                content = d.content,
                author = d.author
            )
        }
    }
}