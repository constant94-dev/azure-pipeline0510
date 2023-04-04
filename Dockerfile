# syntax=docker/dockerfile:1

FROM openjdk:11-jdk-slim AS build
WORKDIR /app

COPY build.gradle $APP_HOME
COPY settings.gradle $APP_HOME
COPY gradlew $APP_HOME
COPY gradle $APP_HOME/gradle
COPY src $APP_HOME/src
RUN chmod +x ./gradlew
RUN ./gradlew clean build
COPY build/libs/patron-webMobile-1.2.4-SNAPSHOT.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]

FROM nginx:1.23-alpine-slim
# RUN rm /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# COPY build/libs/patron-webMobile-1.2.4-SNAPSHOT.jar app.jar
# COPY --from=build $APP_HOME/build/libs/patron-webMobile-1.2.4-SNAPSHOT.jar /usr/share/nginx/html/app.jar
# CMD ["java", "-jar", "/usr/share/nginx/html/app.jar"]