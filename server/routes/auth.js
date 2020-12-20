const express = require("express");
const router = express.Router();
const { auth } = require("../controllers");

router.post("/login", auth.login);
router.get("/logout", auth.middleware.checkLogin, auth.logout);
router.post("/register", auth.rgister);
router.put("/user", auth.middleware.checkLogin, auth.editUser);
router.delete("/user", auth.middleware.checkLogin, auth.deleteAccount);

module.exports = router;
