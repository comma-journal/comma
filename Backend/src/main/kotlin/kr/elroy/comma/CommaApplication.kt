package kr.elroy.comma

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class CommaApplication

fun main(args: Array<String>) {
	runApplication<CommaApplication>(*args)
}
