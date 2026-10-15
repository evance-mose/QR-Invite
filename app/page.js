import SignupForm from "@/components/SignupForm";

export default function HomePage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-white px-6 py-16">
      <main className="w-full max-w-[420px] text-center">
        <h1 className="text-3xl leading-tight font-semibold tracking-tight text-balance">
          Join the Seeds of Transformation mailing list
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-base leading-7 text-neutral-700">
          Join our mailing list to receive updates and other information regarding the OMT-funded
          Seeds of Transformation national project.
        </p>
        <SignupForm />
      </main>
    </div>
  );
}
