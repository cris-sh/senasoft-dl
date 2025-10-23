const { Preferences } = require("../models");
const { preferencesUpdate } = require("../utils/validators");

// Servicio para obtener preferencias del usuario
exports.getByUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Validar que el userId sea numérico
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const pref = await Preferences.findOne({ where: { user_id: userId } });

    if (!pref) {
      return res.status(404).json({ error: "Preferences not found" });
    }

    res.json({
      message: "ok",
      data: {
        data: {
          id: pref.id,
          user_id: pref.user_id,
          theme: pref.theme
        }
      },
      status: 200
    });
  } catch (err) {
    next(err);
  }
};

// Servicio para actualizar el tema de las preferencias del usuario
exports.update = async (req, res, next) => {
  try {
    const { error, value } = preferencesUpdate.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const userId = req.params.userId;

    // Validar que el userId sea numérico
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    let pref = await Preferences.findOne({ where: { user_id: userId } });

    if (!pref) {
      // Crear nuevas preferencias si no existen
      pref = await Preferences.create({
        user_id: userId,
        theme: value.theme || 'dark'
      });
    } else {
      // Actualizar preferencias existentes
      await pref.update(value);
    }

    res.json({
      message: "ok",
      data: {
        data: {
          id: pref.id,
          user_id: pref.user_id,
          theme: pref.theme
        }
      },
      status: 200
    });
  } catch (err) {
    next(err);
  }
};
