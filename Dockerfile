# syntax=docker/dockerfile:1

FROM openjdk:11-jdk-slim AS build
WORKDIR /home/source/java-app
COPY build.gradle .
COPY settings.gradle .
COPY . .
RUN chmod +x ./gradlew
RUN ./gradlew build

FROM nginx:1.23-alpine-slim
RUN rm /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD nginx -g 'daemon off;'

FROM openjdk:11-jre-slim
COPY --from=build /home/source/java-app/build/libs/patron-webMobile-1.2.4-SNAPSHOT.jar /usr/share/nginx/html/app.jar
CMD ["java", "-jar", "/usr/share/nginx/html/app.jar"]