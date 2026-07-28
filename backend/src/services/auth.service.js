import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import * as authRepository from "../repositories/auth.repositories.js";

export async function login(email, password) {
  const user = await authRepository.findByEmail(email);

  if (!user) {
    throw new Error("Utilisateur introuvable");
  }
  console.log(user);

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    throw new Error("Mot de passe incorrect");
  }

  const token = jwt.sign(
    {
      id: user.id_user,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    },
  );

  return {
    user,
    token,
  };
}

export async function register(
  nom,
  prenom,
  email,
  role,
  password,
  confirm_password,
) {
  const user = await authRepository.findByEmail(email);

  if (user) {
    throw new Error("Cet email existe déjà");
  }

  if (password != confirm_password) {
    throw new Error("Confirmez bien votre mdp");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await authRepository.createUser(nom, prenom, email, role, hashedPassword);

  return {
    message: "Compte créé avec succès",
  };
}
