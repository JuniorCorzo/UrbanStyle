# 1. Builder stage
FROM gradle:8.14.2-jdk21-alpine AS builder
LABEL authors="JuniorCorzo"

RUN apk add --no-cache bash
WORKDIR /app

COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle
COPY .env .env

RUN chmod +x gradlew



RUN ./gradlew dependencies --no-daemon

COPY src ./src

RUN sh ./gradlew bootJar --no-daemon -x test


FROM eclipse-temurin:21-jre-alpine

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080


ENTRYPOINT ["java", "-jar", "/app/app.jar"]