const { Pool } = require("pg");

exports.pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
});

exports.createtables = async () => {
  const admins = {
    name: "admins",
    sin: `
    CREATE TABLE IF NOT EXISTS "admins" (
        "id" SERIAL,
        "uuid" UUID,
        "username" VARCHAR NOT NULL UNIQUE,
        "password" VARCHAR NOT NULL,
        PRIMARY KEY ("id")
    );`,
  };

  const users = {
    name: "users",
    sin: `
    CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL,
        "uuid" UUID,
        "username" VARCHAR NOT NULL,
        "email" VARCHAR NOT NULL,
        "image" VARCHAR,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id")
    );`,
  };

  for (i of [admins, users]) {
    await this.pool.query(i.sin).catch((error) => {
      console.error(i.name, error.stack);
    });
  }
};
