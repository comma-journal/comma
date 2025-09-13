package kr.elroy.comma

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import java.util.*

@SpringBootApplication
class CommaApplication

fun main(args: Array<String>) {
    TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"))
    System.setProperty("user.timezone", "Asia/Seoul")
	runApplication<CommaApplication>(*args)
}
