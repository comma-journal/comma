package kr.elroy.comma.config

import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.servlet.http.HttpServletResponse
import kr.elroy.comma.jwt.JwtAuthenticationFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class SecurityConfig(
    private val jwtAuthenticationFilter: JwtAuthenticationFilter,
) {
    private val objectMapper = ObjectMapper()

    private val whiteList = arrayOf(
        "/v1/users",
        "/v3/api-docs/**",
        "/swagger-ui.html",
        "/swagger-ui/**",
        "/docs",
        "/api-docs",
        "/webjars/**"
    )

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .formLogin { it.disable() }
            .httpBasic { it.disable() }
            .cors { }
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers(*whiteList).permitAll()
                    .anyRequest().authenticated()
            }
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter::class.java)
            .oauth2ResourceServer {
                it.jwt { }
            }
            .exceptionHandling {
                it.authenticationEntryPoint { _, response, _ ->
                    sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "인증되지 않은 사용자입니다.")
                }
                it.accessDeniedHandler { _, response, _ ->
                    sendErrorResponse(response, HttpServletResponse.SC_FORBIDDEN, "접근 권한이 없습니다.")
                }
            }

        return http.build()
    }

    @Bean
    fun corsConfigurer(): WebMvcConfigurer = object : WebMvcConfigurer {
        override fun addCorsMappings(registry: CorsRegistry) {
            registry.addMapping("/**")
                .allowedOriginPatterns(
                    "http://localhost:*",
                    "http://127.0.0.1:*",
                    "https://comma.gamja.cloud",
                )
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Location", "Content-Disposition")
                .allowCredentials(false)
                .maxAge(3600)
        }
    }

    private fun sendErrorResponse(response: HttpServletResponse, code: Int, message: String) {
        response.characterEncoding = "UTF-8"
        response.contentType = "application/json"
        response.status = code

        val errorResponse = mapOf("message" to message, "code" to code)
        response.writer.write(objectMapper.writeValueAsString(errorResponse))
    }
}
