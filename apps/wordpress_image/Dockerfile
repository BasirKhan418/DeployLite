FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

# Install packages: Apache, MySQL, PHP, WordPress dependencies
RUN apt-get update && apt-get install -y \
  apache2 \
  mysql-server \
  php libapache2-mod-php php-mysql php-curl php-xml php-gd php-mbstring php-zip \
  curl wget unzip less nano && \
  apt-get clean

# Enable Apache rewrite module
RUN a2enmod rewrite

# Download WordPress
RUN curl -O https://wordpress.org/latest.tar.gz && \
    tar -xzf latest.tar.gz && \
    cp -a wordpress/. /var/www/html/ && \
    rm -rf wordpress latest.tar.gz

# ✅ Remove the default Apache index.html page
RUN rm -f /var/www/html/index.html

# ✅ Set correct ownership and permissions
RUN chown -R www-data:www-data /var/www/html

# Copy the entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

CMD ["/entrypoint.sh"]
