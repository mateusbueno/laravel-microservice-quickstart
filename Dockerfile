FROM php:7.4-fpm-alpine3.15

RUN apk add --no-cache shadow \
            openssl \
            bash \
            mysql-client \
            nodejs-current \
            npm \
            freetype-dev \
            libjpeg-turbo-dev \
            libpng-dev \
            libzip-dev \
            git

RUN touch /home/www-data/.bashrc | echo "PS1='\w\$ '" >> /home/www-data/.bashrc
RUN docker-php-ext-install pdo pdo_mysql bcmath zip
RUN docker-php-ext-install -j$(nproc) gd
RUN npm install -g yarn

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN usermod -u 1000 www-data

WORKDIR /var/www

RUN rm -rf /var/www/html && ln -s public html

USER www-data

EXPOSE 9000

ENTRYPOINT ["php-fpm"]
