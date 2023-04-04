# syntax=docker/dockerfile:1

# Build stage
FROM openjdk:11-jdk-slim AS builder
WORKDIR /app

# Copy Gradle wrapper files
COPY gradlew .
COPY gradle /gradle

# Copy project files
COPY build.gradle /app
COPY settings.gradle /app
COPY src /app/src

# Change permissions on Gradle wrapper
RUN chmod +x gradlew

# Build application
RUN ./gradlew clean build

FROM openjdk:11-jre-slim
WORKDIR /app
COPY --from=builder /app/build/libs/patron-webMobile-1.2.4-SNAPSHOT.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]

FROM nginx:1.23-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html
EXPOSE 80

# COPY build/libs/patron-webMobile-1.2.4-SNAPSHOT.jar app.jar
# COPY --from=build $APP_HOME/build/libs/patron-webMobile-1.2.4-SNAPSHOT.jar /usr/share/nginx/html/app.jar
# CMD ["java", "-jar", "/usr/share/nginx/html/app.jar"]