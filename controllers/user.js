const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      bio,
      avatarUrl,
      phoneNumber,
      isAdmin,
      isPublic,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email, isAdmin });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      email,
      name,
      password: hashedPassword,
      isAdmin,
      bio,
      phoneNumber,
      isPublic,
      avatarUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Signup successfull!",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password!",
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password!",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.status(200).json({
        success: true,
        message: "User Successfully logged in!",
        token,
        user: user,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error,
    });
  }
};

exports.userDetails = async (req, res) => {
  try {
    const loggedInuser = req.user;

    const user = await User.findOne({
      email: loggedInuser.email,
    }).select("-password -createdAt -updatedAt -__v");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error,
    });
  }
};

exports.allUsers = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const query = loggedInUser.isAdmin
      ? {}
      : { isPublic: true, isAdmin: false };

    const users = await User.find(query).select(
      "-password -createdAt -updatedAt -__v"
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

exports.updateUserInfo = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const { name, email, password, bio, avatarUrl, phoneNumber } = req.body;

    const user = await User.findOne({ email: loggedInUser.email });

    if (name !== undefined && name !== null) user.name = name;
    if (email !== undefined && email !== null) user.email = email;
    if (password !== undefined && password !== null) {
      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
    }
    if (bio !== undefined && bio !== null) user.bio = bio;
    if (avatarUrl !== undefined && avatarUrl !== null)
      user.avatarUrl = avatarUrl;
    if (phoneNumber !== undefined && phoneNumber !== null)
      user.phoneNumber = phoneNumber;

    await user.save();

    return res.status(200).json({
      success: true,
      message: `User info updated successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

exports.profileVisibility = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const user = await User.findOne({
      email: loggedInUser.email,
    });

    user.isPublic = !user.isPublic;
    await user.save();
    return res.status(200).json({
      success: true,
      message: `Profile has set to ${user.isPublic ? "Public" : "Private"}.`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};
