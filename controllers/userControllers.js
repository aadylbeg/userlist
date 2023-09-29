const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp");
const { v4 } = require("uuid");
const APIFeatures = require("../utils/apiFeatutres");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { pool } = require("../utils/dbTables");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const query = new APIFeatures(req.query).filter().sort().paginate();

  select = `SELECT * ${query.where} ${query.order} ${query.limit}`;
  const users = await pool.query(select);

  return res.status(200).send(users.rows);
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await pool.query("SELECT * FROM users WHERE uuid= $1", [
    req.params.uuid,
  ]);
  if (user.rowCount < 1) return next(new AppError("Not Found", 404));

  return res.status(200).send(user.rows[0]);
});

exports.createUser = catchAsync(async (req, res, next) => {
  const { username, email } = req.body;
  var uuid = v4();

  await pool.query(
    `INSERT INTO users (uuid, username, email) VALUES ($1, $2, $3)`,
    [uuid, username, email]
  );

  const newUser = await pool.query("SELECT * FROM users WHERE uuid= $1", [
    uuid,
  ]);

  return res.status(201).send(newUser.rows[0]);
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { username, email, is_deleted } = req.body;
  const user = await pool.query("SELECT * FROM users WHERE uuid= $1", [
    req.params.uuid,
  ]);
  if (user.rowCount < 1) return next(new AppError("Not Found", 404));

  const set = `UPDATE users SET username = $1, email = $2 WHERE uuid = $3`;
  await pool.query(set, [
    username || user.rows[0].username,
    email || user.rows[0].email,
    user.rows[0].uuid,
  ]);

  const updatedUser = await pool.query("SELECT * FROM users WHERE uuid= $1", [
    req.params.uuid,
  ]);

  return res.status(200).send(updatedUser.rows[0]);
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await pool.query("SELECT id FROM users WHERE uuid= $1", [
    req.params.uuid,
  ]);
  if (user.rowCount < 1) return next(new AppError("Not Found", 404));

  await pool.query("DELETE FROM users WHERE uuid = $1", [req.params.uuid]);

  return res.status(204).send();
});

exports.uploadUserPhoto = catchAsync(async (req, res, next) => {
  const user = await pool.query("SELECT id, image FROM users WHERE uuid= $1", [
    req.params.uuid,
  ]);
  if (user.rowCount < 1) return next(new AppError("Not Found", 404));

  if (user.rows[0].image != null)
    fs.unlink(`./public/${user.rows[0].image}.webp`, (err) => {});

  const fileName = v4();
  await sharp(req.file.buffer)
    .toFormat("webp")
    .webp({ quality: 80 })
    .toFile(`./public/${fileName}.webp`);

  await pool.query(
    `UPDATE users SET image = $1 WHERE id = ${user.rows[0].id}`,
    [fileName]
  );

  var newUser = await pool.query("SELECT * FROM users WHERE uuid= $1", [
    req.params.uuid,
  ]);

  return res.status(200).send(newUser.rows[0]);
});

exports.deleteUserPhoto = catchAsync(async (req, res, next) => {
  const user = await pool.query("SELECT id, image FROM users WHERE uuid= $1", [
    req.params.uuid,
  ]);
  if (user.rowCount < 1) return next(new AppError("Not Found", 404));

  fs.unlink(`./public/${user.rows[0].image}.webp`, (err) => {
    if (err) return next(new AppError("Not found photo", 404));
  });

  await pool.query(
    `UPDATE users SET image = null WHERE id = ${user.rows[0].id}`
  );

  return res.status(204).send();
});

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadPhoto = upload.single("photo");
