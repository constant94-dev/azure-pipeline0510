# syntax=docker/dockerfile:1

FROM adoptopenjdk:11-jdk-hotspot-focal AS builder
COPY gradlew .
COPY gradle ./gradle
COPY build.gradle .
COPY settings.gradle .
COPY src ./src
RUN chmod +x ./gradlew
RUN ./gradlew clean build

FROM nginx:1.23-alpine-slim
COPY --from=builder build/libs/*.jar /usr/share/nginx/html/app.jar
ENTRYPOINT ["java","-jar","/usr/share/nginx/html/app.jar"]