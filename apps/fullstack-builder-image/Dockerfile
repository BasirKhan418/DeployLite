FROM ubuntu:focal
RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get upgrade -y
RUN apt-get install -y nodejs
RUN apt-get install git -y
WORKDIR  /home/deploylite/app
COPY main.sh main.sh
COPY script.js script.js
COPY package*.json .
RUN npm install

RUN chmod +x main.sh
RUN chmod +x script.js
# Expose port 80
EXPOSE 80
ENTRYPOINT [ "/home/deploylite/app/main.sh" ]

