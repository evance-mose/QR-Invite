import QRCode from "qrcode";
import { headers } from "next/headers";
import PrintButton from "@/components/PrintButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Seeds of Transformation mailing list",
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
    <main className="flex min-h-svh flex-col items-center px-6 py-12 text-center">
      <div className="my-auto flex w-full max-w-md flex-col items-center">
        <p className="text-lg font-semibold tracking-tight text-neutral-900">Scan to join</p>
        <h1 className="mt-2 text-4xl leading-tight font-semibold tracking-tight text-balance">
          Seeds of Transformation mailing list
        </h1>
        <img
          src={qr}
          alt="QR code that opens the Seeds of Transformation mailing list"
          width={360}
          height={360}
          className="mt-8 w-[min(360px,80vw)] rounded-3xl bg-card p-4 shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
        />
        <PrintButton />
      </div>
    </main>
  );
}
