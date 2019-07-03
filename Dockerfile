FROM alpine
 
RUN apk update  \
    && apk add --no-cache openssl ca-certificates nginx nginx-mod-rtmp ffmpeg nodejs nodejs-npm\
    && rm -rf /var/cache/apk/* \
    && mkdir -p /www /var/sock /var/rec /www/backend /www/frontend \
    && npm install -g @vue/cli

COPY frontend /www/frontend
COPY backend /www/backend
ADD nginx.conf /etc/nginx/nginx.conf
ADD startup.sh /
RUN chown nginx:nginx /www /var/sock /var/rec
RUN chmod 777 /var/rec
RUN cd /www/frontend \
    && npm install \
    && npm run build \
    && mv ./dist/* ../ \
    && rm -rf frontend
RUN cd /www/backend \
    && npm install

VOLUME /var/rec
EXPOSE 80 1935 8080

CMD sh startup.sh