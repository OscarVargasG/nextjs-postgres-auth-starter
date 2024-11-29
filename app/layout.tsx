import { NextAuthProvider } from "@/providers/NextAuthProvider";
import "./globals.css";

export const metadata = {
  title: "Donation Quest - ¡Haz un impacto mientras te diviertes!",
  description:
    "Únete a Donation Quest, una experiencia gamificada donde cada donación cuenta. Sigue tu progreso, compite en el ranking y contribuye a un impacto real en el mundo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
