import SignupForm from "@/components/SignupForm";

export default function HomePage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-white px-6 py-16">
      <main className="w-full max-w-[420px] text-center">
        <h1 className="text-3xl leading-tight font-bold tracking-tight uppercase">
          Join our mailing list
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-[15px] leading-6 text-neutral-500">
          Add your title, name and surname, email, institution, and province.
        </p>
        <SignupForm />
      </main>
    </div>
  );
}
