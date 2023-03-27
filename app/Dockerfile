# syntax=docker/dockerfile:1

FROM openjdk:8-alpine3.9 AS builder
COPY gradlew ./gradle
COPY gradle ./
COPY build.gradle ./
COPY settings.gradle ./
COPY src ./src
RUN chmod+x ./gradlew
RUN ./gradlew bootJar

FROM nginx:1.23-alpine-slim
COPY --from=builder build/libs/*.jar /usr/share/nginx/html/app.jar
ENTRYPOINT ["java","-jar","/usr/share/nginx/html/app.jar"]