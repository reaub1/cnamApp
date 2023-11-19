FROM php:7.4-apache

COPY ./deploy/my-proxy.conf /etc/apache2/sites-available/000-default.conf
COPY ./deploy/ /var/www/html

RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    unzip \
    zip \
 && rm -rf /var/lib/apt/lists/* \
 && a2enmod proxy \
 && a2enmod proxy_http \
 && npm install \
 && npm install pm2 -g \
 && env PATH=$PATH:/usr/local/lib/node_modules/pm2/bin/pm2

WORKDIR /var/www/html/api