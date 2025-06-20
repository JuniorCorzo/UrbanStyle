
# 1. Builder stage
FROM gradle:8.14.2-jdk21-alpine AS builder
LABEL authors="JuniorCorzo"

# Set working directory
WORKDIR /app

# Copy only Gradle wrapper and config to cache dependencies
COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle
COPY .env .env

# Ensure wrapper is executable
RUN chmod +x gradlew



# Download dependencies
RUN ./gradlew dependencies --no-daemon

# Copy source code
COPY src ./src

# Build the application (skip tests if preferred)
RUN ./gradlew bootJar --no-daemon -x test


# 2. Runtime stage
FROM eclipse-temurin:21-jre-alpine

# Create non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Create app directory
WORKDIR /app

# Copy the executable jar from builder
COPY --from=builder /app/build/libs/*.jar app.jar

# Expose default Spring Boot port
EXPOSE 8080

# Optional healthcheck against Spring Boot actuator
HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Start the application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]