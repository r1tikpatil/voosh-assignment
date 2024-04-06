const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");

const {
  register,
  login,
  userDetails,
  allUsers,
  profileVisibility,
  updateUserInfo
} = require("../controllers/user");

router.post("/signup", register);
router.post("/signin", login);
router.get("/me", authentication, userDetails);
router.get("/allUsers", authentication, allUsers);
router.put("/profile-visibility", authentication, profileVisibility);
router.put("/info", authentication, updateUserInfo);

module.exports = router;
