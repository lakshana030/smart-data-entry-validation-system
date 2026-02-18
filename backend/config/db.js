const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",          
  host: "localhost",
  database: "myappdb",       
  password: "Lakshana35",
  port: 5433,
});

pool.connect()
  .then(() => console.log("PostgreSQL Connected ✅"))
  .catch(err => console.error("Connection Error ❌", err));

module.exports = pool;
