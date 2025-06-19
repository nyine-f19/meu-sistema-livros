FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY . .

RUN mvn clean install -DskipTests

FROM openjdk:17-jre-slim

WORKDIR /app

COPY --from=build /app/target/api-ifbooks-0.0.1-SNAPSHOT.jar app.jar

CMD ["java", "-jar", "app.jar"]