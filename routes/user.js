const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");

const { register, login, userDetails } = require("../controllers/user");

router.post("/signup", register);
router.post("/signin", login);
router.get("/me", authentication, userDetails);

module.exports = router;
