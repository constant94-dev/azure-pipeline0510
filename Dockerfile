# syntax=docker/dockerfile:1

# Build stage
FROM openjdk:11-jdk-slim AS builder
WORKDIR /app

# Copy Gradle wrapper files
COPY gradle /app/gradle
COPY gradlew /app

# Copy project files
COPY build.gradle /app
COPY settings.gradle /app
COPY src /app/src

# Change permissions on Gradle wrapper
RUN chmod +x gradlew

# Build application
RUN ./gradlew clean build

# Run JAR Stage
FROM openjdk:11-jre-slim
# 작업 디렉토리를 '/app'로 설정
WORKDIR /app

# 이전 단계에서 'builder' 라는 이름의 스테이지에서 JAR 파일을 'app' 디렉토리로 복사한다.
COPY --from=builder /app/build/libs/patron-webMobile-1.2.4-SNAPSHOT.jar app.jar


# JAR 파일을 실행하고 'nohub'을 사용하여 프로세스를 백그라운드로 보내 컨테이너가 중지되거나 재시작되더라도 프로세스가 계속 실행되도록 하는 명령
CMD nohup java -jar app.jar &

FROM nginx:1.23-alpine
COPY default.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY index.html /usr/share/nginx/html
# Docker 컨테이너가 런타임 시 80 포트에서 수신 대기할 것임을 알리는 명령
EXPOSE 80
# Docker 컨테이너가 런타임 시 8080 포트에서 수신 대기할 것임을 알리는 명령
EXPOSE 8080

# COPY build/libs/patron-webMobile-1.2.4-SNAPSHOT.jar app.jar
# COPY --from=build $APP_HOME/build/libs/patron-webMobile-1.2.4-SNAPSHOT.jar /usr/share/nginx/html/app.jar
# CMD ["java", "-jar", "/usr/share/nginx/html/app.jar"]