"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { institutions } from "@/lib/institutions";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(120, "Enter your name."),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(200, "Enter a valid email address."),
  institution: z
    .string()
    .refine((value) => institutions.includes(value), "Choose your institution."),
  agreement: z.boolean().refine((value) => value, "Tick the box to agree."),
  company_website: z.string().optional(),
});

const fieldClass =
  "h-12 w-full rounded-none border-0 bg-[#f2f2f2] px-4 text-center text-base text-neutral-800 shadow-none placeholder:text-neutral-400 focus-visible:ring-0 md:text-base";

export default function SignupForm() {
  const [status, setStatus] = useState("idle");
  const [serverError, setServerError] = useState("");
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      institution: "",
      agreement: false,
      company_website: "",
    },
  });

  async function onSubmit(values) {
    setServerError("");
    setStatus("saving");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus("idle");
        setServerError(data.error || "The signup could not be saved. Try again.");
        return;
      }

      setStatus(data.duplicate ? "duplicate" : "saved");
    } catch {
      setStatus("idle");
      setServerError("The signup could not be saved. Check your connection and try again.");
    }
  }

  if (status === "declined") {
    return (
      <p className="mt-10 text-center text-[15px] leading-6 text-neutral-400" aria-live="polite">
        You can close this page.
      </p>
    );
  }

  if (status === "saved" || status === "duplicate") {
    return (
      <div className="mt-10" aria-live="polite">
        <h2 className="text-2xl font-bold tracking-tight uppercase">
          {status === "duplicate" ? "Already on the list" : "You are on the list"}
        </h2>
        <p className="mt-4 text-[15px] leading-6">You can close this page.</p>
      </div>
    );
  }

  return (
    <form
      className="mt-10 text-left"
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      aria-busy={status === "saving"}
    >
      <FieldGroup className="gap-3">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel htmlFor="name" className="sr-only">
                Name
              </FieldLabel>
              <Input
                {...field}
                id="name"
                className={fieldClass}
                autoComplete="name"
                enterKeyHint="next"
                placeholder="Enter your name"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel htmlFor="email" className="sr-only">
                Email
              </FieldLabel>
              <Input
                {...field}
                id="email"
                className={fieldClass}
                type="email"
                autoComplete="email"
                inputMode="email"
                enterKeyHint="next"
                spellCheck={false}
                placeholder="Enter your email"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
            </Field>
          )}
        />
        <Controller
          name="institution"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel htmlFor="institution" className="sr-only">
                Institution
              </FieldLabel>
              <div className="relative">
                <select
                  {...field}
                  id="institution"
                  className={`${fieldClass} appearance-none pr-10 ${field.value ? "text-neutral-800" : "text-neutral-400"}`}
                  aria-invalid={fieldState.invalid}
                >
                  <option value="">Institution</option>
                  {institutions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-neutral-500"
                  aria-hidden="true"
                />
              </div>
              {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
            </Field>
          )}
        />
        <div className="absolute -left-[9999px] h-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="company_website">Website</label>
          <input
            id="company_website"
            tabIndex={-1}
            autoComplete="off"
            {...form.register("company_website")}
          />
        </div>
        <Controller
          name="agreement"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              orientation="horizontal"
              data-invalid={fieldState.invalid}
              className="items-start justify-center py-1"
            >
              <Checkbox
                id="agreement"
                className="mt-0.5 size-4 rounded-none"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                aria-invalid={fieldState.invalid}
              />
              <div className="grid gap-1">
                <FieldLabel htmlFor="agreement" className="font-normal text-neutral-500">
                  I agree to join the mailing list.
                </FieldLabel>
                {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
              </div>
            </Field>
          )}
        />
        {serverError ? <FieldError>{serverError}</FieldError> : null}
        <Button
          type="submit"
          className="h-12 w-full rounded-none bg-[#3a3a3a] text-sm font-semibold tracking-[0.18em] text-white uppercase shadow-none hover:bg-[#2a2a2a]"
          disabled={status === "saving"}
        >
          {status === "saving" ? "Saving…" : "Subscribe"}
        </Button>
        <button
          type="button"
          className="w-full py-3 text-center text-sm font-medium tracking-[0.14em] uppercase underline underline-offset-4"
          onClick={() => setStatus("declined")}
        >
          No thanks
        </button>
      </FieldGroup>
    </form>
  );
}
