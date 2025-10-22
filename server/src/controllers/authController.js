const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models");

const signToken = (user) => {
  const payload = { id: user.id, email: user.email, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET || "change_this_secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, lastname, snd_lastname, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      lastname,
      snd_lastname,
      email,
      password: hashed,
      birthday: new Date(),
      gender: "other",
      doc_type: "",
      doc_num: "",
      phone: "",
      role: "user",
    });
    const token = signToken(user);
    res.status(201).json({ user: { id: user.id, email: user.email }, token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    // passport-local will set req.user
    const user = req.user;
    const token = signToken(user);
    res.json({ user: { id: user.id, email: user.email }, token });
  } catch (err) {
    next(err);
  }
};
