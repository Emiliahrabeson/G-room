import * as authService from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const { nom, prenom, email, role, password, confirm_password } = req.body;
    const user = await authService.register(
      nom,
      prenom,
      email,
      role,
      password,
      confirm_password,
    );
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    // enlever le mdp
    const { password_hash, ...safeUser } = user;

    res.status(200).json({ user: safeUser, token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
