import * as AuthService from "../services/auth.service.js";

export async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;

    const result = await AuthService.registerUser({
      email,
      password,
      name,
    });

    res.status(201).json({
      message: "Registered successfully. OTP sent.",
      userId: result.userId,
    });
  } catch (err) {
    next(err);
  }
}

export async function verifyEmail(req, res, next) {
  try {
    const { email, otp } = req.body;

    await AuthService.verifyOtp({ email, otp });

    res.json({ message: "Email verified" });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const { token } = await AuthService.loginUser({ email, password });

    res.json({ message: "Login successful", token });
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    await AuthService.forgotPassword({ email });

    res.json({ message: "OTP sent" });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { email, otp, newPassword } = req.body;

    await AuthService.resetPassword({ email, otp, newPassword });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
}
