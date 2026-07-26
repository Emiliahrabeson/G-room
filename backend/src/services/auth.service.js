export async function login(email, password) {
  const user = await authRepository.findByEmail(email);

  return user;
}

export async function register(email, password) {
  const user = await authRepository.findByEmail(email);

  return user;
}
