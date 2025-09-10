package kr.elroy.comma.config

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonDeserializer
import com.fasterxml.jackson.databind.JsonSerializer
import com.fasterxml.jackson.databind.SerializerProvider
import com.fasterxml.jackson.databind.module.SimpleModule
import kotlinx.datetime.LocalDate
import kotlinx.datetime.LocalDateTime

class LocalDateTimeModule : SimpleModule() {
    init {
        addSerializer(LocalDateTime::class.java, LocalDateTimeSerializer())
        addDeserializer(LocalDateTime::class.java, LocalDateTimeDeserializer())
        addSerializer(LocalDate::class.java, LocalDateSerializer())
        addDeserializer(LocalDate::class.java, LocalDateDeserializer())
    }
}

class LocalDateTimeSerializer : JsonSerializer<LocalDateTime>() {
    override fun serialize(value: LocalDateTime, gen: JsonGenerator, serializers: SerializerProvider) {
        gen.writeString(value.toString())
    }
}

class LocalDateTimeDeserializer : JsonDeserializer<LocalDateTime>() {
    override fun deserialize(p: JsonParser, ctxt: DeserializationContext): LocalDateTime {
        return LocalDateTime.parse(p.text)
    }
}

class LocalDateSerializer : JsonSerializer<LocalDate>() {
    override fun serialize(value: LocalDate, gen: JsonGenerator, serializers: SerializerProvider) {
        gen.writeString(value.toString())
    }
}

class LocalDateDeserializer : JsonDeserializer<LocalDate>() {
    override fun deserialize(p: JsonParser, ctxt: DeserializationContext): LocalDate {
        return LocalDate.parse(p.text)
    }
}