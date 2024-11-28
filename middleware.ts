import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // Redirigir a /login si no está autenticado
  },
});

export const config = {
  matcher: ["/dashboard/:path*"], // Aplicar el middleware solo a las rutas del Dashboard
};
