import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata = {
  title: "Seeds of Transformation mailing list",
  description:
    "Join our mailing list to receive updates and other information regarding the OMT-funded Seeds of Transformation national project.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={sans.variable}>
      <body>{children}</body>
    </html>
  );
}
