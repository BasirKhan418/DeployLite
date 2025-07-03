FROM mongo:6.0

# Inject init script
COPY init-user.js /docker-entrypoint-initdb.d/

# Env vars (injected via ECS or docker run - no need to hardcode)
# ENV MONGO_INITDB_ROOT_USERNAME=admin
# ENV MONGO_INITDB_ROOT_PASSWORD=secretpass
# ENV MONGO_INITDB_DATABASE=mydatabase

EXPOSE 27017
