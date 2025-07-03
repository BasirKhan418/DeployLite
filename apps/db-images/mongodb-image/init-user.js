db.createUser({
  user: process.env.DB_USER || 'admin',
  pwd: process.env.DB_PASSWORD || 'secretpass',
  roles: [{ role: "readWrite", db: process.env.DB_NAME || 'mydatabase' }]
});
