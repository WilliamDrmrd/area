FROM node:20

WORKDIR /usr/src/app

ENV ANDROID_HOME /usr/src/app/Android_SDK

COPY . .

RUN apt-get update \
    && apt-get install -y \
    ninja-build \
    default-jdk

CMD ["/bin/bash", "./startup.sh"]

