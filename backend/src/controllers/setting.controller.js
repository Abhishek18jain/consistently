import User from "../models/user.model.js";
import bcrypt from "bcrypt";

/**
 * PATCH /settings
 * Update user preferences (timezone, week start, etc.)
 */
export async function updateSettings(req, res, next) {
  try {
    const userId = req.user.id;
    const { timezone, weekStartsOn } = req.body;

    const update = {};

    if (timezone) update["settings.timezone"] = timezone;
    if (typeof weekStartsOn === "number") {
      update["settings.weekStartsOn"] = weekStartsOn;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: update },
      { new: true }
    ).select("settings");

    res.status(200).json({
      message: "Settings updated successfully",
      settings: user.settings
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /settings/pin
 * Set or update reflection PIN
 */
export async function updatePin(req, res, next) {
  try {
    const userId = req.user.id;
    const { pin } = req.body;

    if (!pin || pin.length < 4) {
      return res.status(400).json({
        message: "PIN must be at least 4 digits"
      });
    }

    const pinHash = await bcrypt.hash(pin, 10);

    await User.findByIdAndUpdate(userId, {
      pinHash
    });

    res.status(200).json({
      message: "Reflection PIN updated successfully"
    });
  } catch (err) {
    next(err);
  }
}
