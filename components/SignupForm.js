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
import { provinces } from "@/lib/provinces";
import { surnameStartsWithCapital } from "@/lib/validate";

const schema = z.object({
  title: z.string().trim().min(2, "Enter your title.").max(40, "Enter your title."),
  name: z
    .string()
    .trim()
    .min(2, "Enter your name and surname.")
    .max(120, "Enter your name and surname.")
    .refine(surnameStartsWithCapital, "Surname must start with a capital letter."),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(200, "Enter a valid email address."),
  institution: z
    .string()
    .trim()
    .min(2, "Enter your institution.")
    .max(160, "Enter your institution."),
  province: z.string().refine((value) => provinces.includes(value), "Choose your province."),
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
      title: "",
      name: "",
      email: "",
      institution: "",
      province: "",
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
      className="mt-8 text-left"
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      aria-busy={status === "saving"}
    >
      <FieldGroup className="gap-3.5">
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel htmlFor="title" className="sr-only">
                Title
              </FieldLabel>
              <Input
                {...field}
                id="title"
                className={fieldClass}
                autoComplete="honorific-prefix"
                enterKeyHint="next"
                placeholder="Title"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid ? <FieldError className="text-center" errors={[fieldState.error]} /> : null}
            </Field>
          )}
        />
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel htmlFor="name" className="sr-only">
                Name and surname
              </FieldLabel>
              <Input
                {...field}
                id="name"
                className={fieldClass}
                autoComplete="name"
                enterKeyHint="next"
                placeholder="Name and surname"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid ? <FieldError className="text-center" errors={[fieldState.error]} /> : null}
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
                placeholder="Email address"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid ? <FieldError className="text-center" errors={[fieldState.error]} /> : null}
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
              <Input
                {...field}
                id="institution"
                className={fieldClass}
                autoComplete="organization"
                enterKeyHint="next"
                placeholder="Institution"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid ? <FieldError className="text-center" errors={[fieldState.error]} /> : null}
            </Field>
          )}
        />
        <Controller
          name="province"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel htmlFor="province" className="sr-only">
                Province
              </FieldLabel>
              <div className="relative">
                <select
                  {...field}
                  id="province"
                  className={`${fieldClass} appearance-none border pr-10 ${field.value ? "text-neutral-800" : "text-neutral-400"}`}
                  aria-invalid={fieldState.invalid}
                >
                  <option value="">Province</option>
                  {provinces.map((name) => (
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
              {fieldState.invalid ? <FieldError className="text-center" errors={[fieldState.error]} /> : null}
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
              className="items-start px-0.5"
            >
              <Checkbox
                id="agreement"
                className="mt-0.5 size-4 rounded-none border-neutral-400"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                aria-invalid={fieldState.invalid}
              />
              <div className="grid gap-1">
                <FieldLabel htmlFor="agreement" className="text-sm leading-5 font-normal text-neutral-600">
                  I agree to join the mailing list.
                </FieldLabel>
                {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
              </div>
            </Field>
          )}
        />
        {serverError ? <FieldError className="text-center">{serverError}</FieldError> : null}
        <Button
          type="submit"
          className="mt-1 h-12 w-full rounded-none bg-[#2f2f2f] text-sm font-semibold tracking-[0.16em] text-white uppercase shadow-none hover:bg-black"
          disabled={status === "saving"}
        >
          {status === "saving" ? "Saving…" : "Subscribe"}
        </Button>
        <button
          type="button"
          className="w-full pt-4 text-center text-[13px] font-medium tracking-[0.16em] text-neutral-800 uppercase underline underline-offset-[5px]"
          onClick={() => setStatus("declined")}
        >
          No thanks
        </button>
      </FieldGroup>
    </form>
  );
}
