import db from "../config/db.js";

export async function findByEmail(email) {
  const sql = "select * from utilisateurs where email = ?";
  const [result] = await db.query(sql, [email]);

  return result[0];
}

export async function createUser(nom, prenom, email, role, hashedPassword) {
  const sql = `insert into utilisateurs (nom,prenom,email,role,password_hash) VALUES(?,?,?,?,?)`;

  await db.query(sql, [nom, prenom, email, role, hashedPassword]);
}
