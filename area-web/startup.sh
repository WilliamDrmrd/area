#!/bin/bash

npm install

if [ ! -f /common/client.apk ]; then
  touch /common/client.apk
fi

ln -s /common/client.apk /usr/src/app/public/client.apk

npm run start
