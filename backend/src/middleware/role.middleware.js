export function verifyRole(...rolesAutorises) {
  return (req, res, next) => {
    const { role } = req.user;

    if (!rolesAutorises.includes(role)) {
      return res.status(403).json({ error: "Accès refusé pour ce rôle" });
    }

    next();
  };
}
