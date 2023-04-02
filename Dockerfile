# syntax=docker/dockerfile:1

FROM adoptopenjdk:11-jdk-hotspot AS builder
COPY gradlew .
COPY gradle ./gradle
COPY build.gradle .
COPY settings.gradle .
COPY src ./src
RUN chmod +x ./gradlew
RUN ./gradlew clean build

FROM nginx:1.23-alpine-slim
COPY --from=builder build/libs/patron-webMobile-1.2.4-SNAPSHOT.jar /usr/share/nginx/html/app.jar

# FROM adoptopenjdk:11-jdk-hotspot

# ENTRYPOINT ["java","-jar","/usr/share/nginx/html/app.jar"]