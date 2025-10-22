const { Preferences } = require('../models');
const { preferencesUpdate } = require('../utils/validators');

exports.getByUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const pref = await Preferences.findOne({ where: { user_id: userId } });
    if (!pref) return res.status(404).json({ error: 'Preferences not found' });
    res.json({ data: pref });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { error, value } = preferencesUpdate.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const userId = req.params.userId;
    let pref = await Preferences.findOne({ where: { user_id: userId } });
    if (!pref) pref = await Preferences.create({ user_id: userId, ...value });
    else await pref.update(value);
    res.json({ data: pref });
  } catch (err) { next(err); }
};
