#! /bin/sh
node /www/backend/index.js &
nginx -g "daemon off;"