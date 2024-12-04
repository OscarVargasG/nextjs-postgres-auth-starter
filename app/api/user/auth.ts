import { prisma } from "@/lib/prisma";
import { comparePassword, hashPassword } from "@/lib/util";
import { NextApiRequest, NextApiResponse } from "next";

// Manejo principal del endpoint
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    await loginUserHandler(req, res);
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

// Controlador de inicio de sesión
async function loginUserHandler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Invalid inputs" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        image: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Comparar la contraseña ingresada con el hash almacenado
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Excluir la contraseña antes de enviar la respuesta
    return res.status(200).json(exclude(user, ["password"]));
  } catch (e) {
    console.error("Login Error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Función para excluir propiedades del objeto usuario
function exclude<T extends object, Key extends keyof T>(
  user: T,
  keys: Key[]
): Omit<T, Key> {
  const result = { ...user };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}
