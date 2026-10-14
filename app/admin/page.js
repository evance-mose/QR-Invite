import AdminPanel from "@/components/AdminPanel";

export const metadata = {
  title: "Mailing list",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="mx-auto grid w-full max-w-5xl items-start gap-10 px-6 py-16 lg:grid-cols-2">
      <section>
        <p className="text-sm font-medium text-muted-foreground">Private</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Mailing list</h1>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
          Signups from the QR code page. Download them when you want to add the emails to your list.
        </p>
      </section>
      <AdminPanel />
    </main>
  );
}
