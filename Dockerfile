# syntax=docker/dockerfile:1

# FROM adoptopenjdk:11-jdk-hotspot AS builder
# COPY gradlew .
# COPY gradle ./gradle
# COPY build.gradle .
# COPY settings.gradle .
# COPY src ./src
# RUN chmod +x ./gradlew
# RUN ./gradlew clean build

FROM openjdk:11-jdk-slim AS build
WORKDIR /home/source/java-app
COPY build.gradle .
COPY settings.gradle .
COPY . .
RUN chmod +x ./gradlew
RUN ./gradlew build

FROM nginx:1.23-alpine-slim
EXPOSE 80
EXPOSE 443
CMD nginx -g 'daemon off;'

FROM openjdk:11-jre-slim
COPY --from=build /home/source/java-app/build/libs/patron-webMobile-1.2.4-SNAPSHOT.jar /usr/share/nginx/html/app.jar
# WORKDIR /usr/share/nginx/html
# RUN chmod 777 /usr/share/nginx/html
# RUN chmod +x ./1.2.4_app.jar
EXPOSE 8080
CMD ["java", "-jar", "/usr/share/nginx/html/app.jar"]


# FROM nginx:1.23-alpine-slim

# # COPY nginx.conf /etc/nginx/nginx.conf

# EXPOSE 80
# EXPOSE 443

# CMD nginx -g 'daemon off;'
# COPY --from=builder build/libs/patron-webMobile-1.2.4-SNAPSHOT.jar /usr/share/nginx/html/app.jar

# FROM adoptopenjdk:11-jdk-hotspot

# ENTRYPOINT ["java","-jar","/usr/share/nginx/html/app.jar"]