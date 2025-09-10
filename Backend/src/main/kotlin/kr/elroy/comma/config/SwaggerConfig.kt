package kr.elroy.comma.config

import io.swagger.v3.oas.models.Components
import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Info
import io.swagger.v3.oas.models.media.Schema
import io.swagger.v3.oas.models.security.SecurityRequirement
import io.swagger.v3.oas.models.security.SecurityScheme
import io.swagger.v3.oas.models.servers.Server
import kotlinx.datetime.LocalDate
import kotlinx.datetime.LocalDateTime
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class SwaggerConfig {
    @Bean
    fun openAPI(): OpenAPI? {
        return OpenAPI()
            .components(
                Components()
                    .addSecuritySchemes(
                        "bearerAuth",
                        SecurityScheme()
                            .type(SecurityScheme.Type.HTTP)
                            .scheme("bearer")
                            .bearerFormat("JWT")
                    )
                    .addSchemas("LocalDate", Schema<LocalDate>().type("string").format("date").example("2025-09-10"))
                    .addSchemas(
                        "LocalDateTime",
                        Schema<LocalDateTime>().type("string").format("date-time").example("2025-09-10T14:30:00")
                    )
            )
            .addSecurityItem(SecurityRequirement().addList("bearerAuth"))
            .info(apiInfo())
            .addServersItem(
                Server()
                    .url("https://comma.gamja.cloud")
                    .description("Production server")
            )
            .addServersItem(
                Server()
                    .url("http://localhost:8080")
                    .description("local server")
            )
    }

    private fun apiInfo(): Info? {
        return Info()
            .title("Comma")
            .description("Comma 서버 API Docs")
            .version("1.0.0")
    }
}