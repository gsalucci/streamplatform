FROM alpine
 
ENV VIDEOJS_VERSION 7.5.5
ENV HLS_VERSION 5.15.0
 
RUN apk update  \
    && apk add --no-cache openssl ca-certificates nginx nginx-mod-rtmp ffmpeg nodejs nodejs-npm\
    && rm -rf /var/cache/apk/* \
    && mkdir -p /www /var/sock /var/rec /www/backend

COPY frontend /www
COPY backend /www/backend
ADD nginx.conf /etc/nginx/nginx.conf
ADD startup.sh /
RUN chown nginx:nginx /www /var/sock /var/rec
RUN cd /www/backend \
    && npm install

VOLUME /var/rec
EXPOSE 80 1935 8080

CMD sh startup.sh