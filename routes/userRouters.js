const express = require("express");
const users = require("../controllers/userControllers");

const router = express.Router();
router.use(require("../controllers/auth").protect);

router.get("/", users.getAllUsers);
router.get("/:uuid", users.getUser);
router.post("/", users.createUser);
router.put("/:uuid", users.updateUser);
router.delete("/:uuid", users.deleteUser);
router.put("/image/:uuid", users.uploadPhoto, users.uploadUserPhoto);
router.delete("/image/:uuid", users.deleteUserPhoto);

module.exports = router;
