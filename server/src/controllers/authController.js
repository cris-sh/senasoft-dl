const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User, Preferences } = require("../models");

// helper: safely format a value as ISO date string or return null
const formatDate = (val) => {
  if (!val) return null;
  try {
    const d = val instanceof Date ? val : new Date(val);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString();
  } catch (e) {
    return null;
  }
};

const signToken = (user) => {
  // safe payload for front-end session
  const payload = {
    id: Number(user.id),
    email: user.email,
    name: user.name,
    lastname: user.lastname,
    snd_lastname: user.snd_lastname,
    role: user.role,
    phone: user.phone,
    doc_num: user.doc_num,
  };
  return jwt.sign(payload, process.env.JWT_SECRET || "change_this_secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

exports.register = async (req, res, next) => {
  try {
    const {
      name,
      lastname,
      snd_lastname,
      email,
      password,
      bday,
      gender,
      doc_type,
      doc_num,
      phone,
    } = req.body;
    if (
      !name ||
      !lastname ||
      !snd_lastname ||
      !email ||
      !password ||
      !bday ||
      !gender ||
      !doc_type ||
      !doc_num ||
      !phone
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      lastname,
      snd_lastname,
      email,
      password: hashed,
      birthday: bday,
      gender: gender,
      doc_type: doc_type,
      doc_num: doc_num,
      phone: phone,
      role: "user",
    });
    // create default preferences row for the user
    const pref = await Preferences.create({ user_id: user.id, theme: "dark" });

    const token = signToken(user);
    const session = {
      id: Number(user.id),
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      snd_lastname: user.snd_lastname,
      role: user.role,
      phone: user.phone || "",
      birthday: formatDate(user.birthday),
      gender: user.gender || null,
      doc_type: user.doc_type || null,
      doc_num: user.doc_num || "",
      updated_at: formatDate(user.updated_at),
    };

    const prefOut = {
      id: Number(pref.id),
      user_id: Number(pref.user_id),
      theme: pref.theme,
    };

    res.status(201).json({
      message: "ok",
      data: { user: session, preferences: prefOut, token },
      status: 200,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const pref = await Preferences.findOne({ where: { user_id: user.id } });

    const token = signToken(user);
    const session = {
      id: Number(user.id),
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      snd_lastname: user.snd_lastname,
      role: user.role,
      phone: user.phone || "",
      birthday: formatDate(user.birthday),
      gender: user.gender || null,
      doc_type: user.doc_type || null,
      doc_num: user.doc_num || "",
      updated_at: formatDate(user.updated_at),
    };

    const prefOut = pref
      ? {
          id: Number(pref.id),
          user_id: Number(pref.user_id),
          theme: pref.theme,
        }
      : null;

    res.json({
      message: "ok",
      data: { user: session, preferences: prefOut, token },
      status: 200,
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Not authenticated" });

    const pref = await Preferences.findOne({ where: { user_id: user.id } });

    const session = {
      id: Number(user.id),
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      snd_lastname: user.snd_lastname,
      role: user.role,
      phone: user.phone || "",
      birthday: formatDate(user.birthday),
      gender: user.gender || null,
      doc_type: user.doc_type || null,
      doc_num: user.doc_num || "",
      updated_at: formatDate(user.updated_at),
    };

    const prefOut = pref
      ? {
          id: Number(pref.id),
          user_id: Number(pref.user_id),
          theme: pref.theme,
        }
      : null;

    res.json({
      message: "ok",
      data: { user: session, preferences: prefOut },
      status: 200,
    });
  } catch (err) {
    next(err);
  }
};
