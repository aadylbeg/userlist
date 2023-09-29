const chai = require("chai");
const expect = chai.expect;
const { Client } = require("pg");
require("dotenv").config({ path: ".env" });

describe("User", function () {
  const client = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
  });

  before(function (done) {
    // Connect to the PostgreSQL database
    client.connect((err) => {
      if (err) return done(err);

      done();
    });
  });

  // Clean up the database after each test
  afterEach(function (done) {
    client.query("DELETE FROM users", (err) => {
      if (err) return done(err);

      done();
    });
  });

  after(function (done) {
    // Disconnect from the PostgreSQL database
    client.end((err) => {
      if (err) return done(err);

      done();
    });
  });

  // Describe the "create" test
  describe("Create", function () {
    it("should successfully create a new user", function (done) {
      const query = `INSERT INTO users (username, email) VALUES ('John Doe', 'john@example.com') RETURNING *`;
      client.query(query, (err, result) => {
        if (err) return done(err);

        expect(result.rows.length).to.equal(1);
        expect(result.rows[0].username).to.equal("John Doe");
        expect(result.rows[0].email).to.equal("john@example.com");
        done();
      });
    });
  });

  // Describe the "edit" test
  describe("Edit", function () {
    it("should successfully update an existing user", function (done) {
      client.query(
        "INSERT INTO users (username, email) VALUES ($1, $2)",
        ["Jane Smith", "jane@example.com"],
        (err) => {
          if (err) return done(err);

          const query = `UPDATE users SET username = 'Jane Johnson' WHERE email = 'jane@example.com' RETURNING * `;
          client.query(query, (err, result) => {
            if (err) return done(err);

            expect(result.rows[0].username).to.equal("Jane Johnson");
            done();
          });
        }
      );
    });
  });

  // Describe the "delete" test
  describe("Delete", function () {
    it("should successfully delete an existing user", function (done) {
      client.query(
        "INSERT INTO users (username, email) VALUES ($1, $2)",
        ["Bob Smith", "bob@example.com"],
        (err) => {
          if (err) return done(err);

          const query = `DELETE FROM users WHERE email = 'bob@example.com' RETURNING *`;
          client.query(query, (err, result) => {
            if (err) return done(err);

            expect(result.rows.length).to.equal(1);
            done();
          });
        }
      );
    });
  });
});
