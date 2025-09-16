#!/bin/bash

npm install

npm install -g eas-cli

rm *.apk

export ANDROID_HOME="/usr/src/app/Android_SDK"

mkdir -p ${ANDROID_HOME}/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-7302050_latest.zip -O ${ANDROID_HOME}/tools.zip && \
    unzip ${ANDROID_HOME}/tools.zip -d ${ANDROID_HOME}/cmdline-tools && \
    mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest && \
    yes | ${ANDROID_HOME}/cmdline-tools/latest/bin/sdkmanager --licenses && \
    ${ANDROID_HOME}/cmdline-tools/latest/bin/sdkmanager "build-tools;30.0.3" "tools" "emulator" "platform-tools" \
    "platforms;android-30" "platforms;android-33" "build-tools;33.0.2" && \
    ${ANDROID_HOME}/cmdline-tools/latest/bin/sdkmanager --install "ndk;23.1.7779620"

git init

eas build -p android --local

mv *.apk "/common/client.apk"

npx expo start --port 8082

