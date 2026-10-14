import SignupForm from "@/components/SignupForm";

export default function HomePage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-white px-6 py-16">
      <main className="w-full max-w-[420px] text-center">
        <h1 className="text-[1.85rem] leading-tight font-bold tracking-tight uppercase">
          Join our mailing list
        </h1>
        <p className="mx-auto mt-5 max-w-[22rem] text-[15px] leading-6 text-neutral-400">
          Subscribe with your name, email, and institution to receive updates
          from this list.
        </p>
        <SignupForm />
      </main>
    </div>
  );
}
