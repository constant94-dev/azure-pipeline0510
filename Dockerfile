# syntax=docker/dockerfile:1

# FROM adoptopenjdk:11-jdk-hotspot AS builder
# COPY gradlew .
# COPY gradle ./gradle
# COPY build.gradle .
# COPY settings.gradle .
# COPY src ./src
# RUN chmod +x ./gradlew
# RUN ./gradlew clean build

FROM nginx:1.23-alpine-slim

# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
EXPOSE 443

CMD nginx -g 'daemon off;'
# COPY --from=builder build/libs/patron-webMobile-1.2.4-SNAPSHOT.jar /usr/share/nginx/html/app.jar

# FROM adoptopenjdk:11-jdk-hotspot

# ENTRYPOINT ["java","-jar","/usr/share/nginx/html/app.jar"]