const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { createSendToken } = require("../utils/createSendToken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { pool } = require("../utils/dbTables");

exports.protect = catchAsync(async (req, res, next) => {
  let token,
    auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer")) token = auth.split(" ")[1];
  if (!token) return next(new AppError("You are not logged in", 401));

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_ADMIN);

  const admin = await pool.query(
    `SELECT id, uuid, username FROM admins WHERE uuid = $1`,
    [decoded.id]
  );
  req.admin = admin.rows[0];
  next();
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  const select = "SELECT * FROM admins WHERE username = $1";
  const admin = await pool.query(select, [username]);

  if (
    !password ||
    admin.rowCount < 1 ||
    !(await bcrypt.compare(password, admin.rows[0].password))
  )
    return next(new AppError("Incorrect username or password", 401));

  createSendToken(admin.rows[0], 200, res);
});
