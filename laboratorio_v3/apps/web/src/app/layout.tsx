import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ConfigureAmplify } from "../components/ConfigureAmplify";

export const metadata: Metadata = {
  title: "NEXUS Retail Labs",
  description: "Laboratorio ejecutivo de decisiones comerciales con AI personal."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ConfigureAmplify />
        {children}
      </body>
    </html>
  );
}
