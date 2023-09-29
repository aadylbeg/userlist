const express = require("express");
const AppError = require("./utils/appError");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();
app.use(cors());
require("./utils/dbTables").createtables();

app.use(express.json());
app.post("/login", require("./controllers/auth").login);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/users", require("./routes/userRouters"));

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(require("./controllers/errController"));

module.exports = app;
