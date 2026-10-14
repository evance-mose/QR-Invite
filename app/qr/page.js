import QRCode from "qrcode";
import { headers } from "next/headers";
import PrintButton from "@/components/PrintButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mailing list QR code",
  robots: { index: false, follow: false },
};

function siteUrl(headerList) {
  const configured = process.env.SITE_URL?.trim();
  if (configured) return `${configured.replace(/\/$/, "")}/`;

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) {
    const host = production.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return `https://${host}/`;
  }

  const host = (headerList.get("x-forwarded-host") || headerList.get("host") || "localhost:3000")
    .split(",")[0]
    .trim();
  const proto =
    headerList.get("x-forwarded-proto")?.split(",")[0].trim() ||
    (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}/`;
}

export default async function QrPage() {
  const url = siteUrl(await headers());
  const qr = await QRCode.toDataURL(url, {
    width: 720,
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#17211c", light: "#ffffff" },
  });

  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 py-12 text-center">
      <p className="text-sm font-medium text-muted-foreground">Scan to join</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Mailing list</h1>
      <img
        src={qr}
        alt="QR code that opens the mailing list form"
        width={360}
        height={360}
        className="mt-8 w-[min(360px,80vw)] rounded-3xl bg-card p-4 shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
      />
      <p className="mt-4 max-w-md font-mono text-sm break-all">{url}</p>
      <PrintButton />
    </main>
  );
}
