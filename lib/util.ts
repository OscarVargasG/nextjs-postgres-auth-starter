import bcrypt from "bcrypt";

// Generar un hash con bcrypt
export const hashPassword = async (pass: string) => {
  const saltRounds = 10;
  return await bcrypt.hash(pass, saltRounds);
};

// Comparar la contraseña ingresada con el hash almacenado
export const comparePassword = async (pass: string, hash: string) => {
  return await bcrypt.compare(pass, hash);
};
