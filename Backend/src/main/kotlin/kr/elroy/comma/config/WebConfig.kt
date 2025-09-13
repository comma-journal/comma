package kr.elroy.comma.config

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.KotlinModule
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder
import org.springframework.web.method.support.HandlerMethodArgumentResolver
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfig(
    private val currentUserIdArgumentResolver: CurrentUserIdArgumentResolver,
) : WebMvcConfigurer {
    override fun addArgumentResolvers(resolvers: MutableList<HandlerMethodArgumentResolver>) {
        resolvers.add(currentUserIdArgumentResolver)
    }

    @Bean
    @Primary
    fun objectMapper(): ObjectMapper {
        return Jackson2ObjectMapperBuilder()
            .modules(KotlinModule.Builder().build(), JavaTimeModule(), LocalDateTimeModule())
            .build()
    }
}