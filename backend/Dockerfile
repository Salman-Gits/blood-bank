# Production multi-stage Dockerfile for Spring Boot on Koyeb
# Build Stage
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# Copy pom.xml and resolve dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build production jar
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create non-root system user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy built jar from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Koyeb dynamically provides $PORT (defaults to 8080)
ENV PORT=8080
EXPOSE 8080

# Run Spring Boot
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-Dserver.port=${PORT}", "-jar", "app.jar"]
