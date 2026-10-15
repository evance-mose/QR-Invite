"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

function csvCell(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

function downloadCsv(rows) {
  const header = ["Created at", "Title", "Name", "Email", "Institution", "Province"];
  const lines = [
    header.join(","),
    ...rows.map((row) =>
      [row.createdAt || row.submittedAt, row.title, row.name, row.email, row.institution, row.province]
        .map(csvCell)
        .join(",")
    ),
  ];
  const blob = new Blob([`\uFEFF${lines.join("\n")}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "mailing-list.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function formatWhen(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/signups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "The mailing list could not be loaded.");
        setRows(null);
        return;
      }
      setRows(data.rows || []);
    } catch {
      setError("The mailing list could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  if (!rows) {
    return (
      <Card className="rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
        <CardContent className="px-6 pt-6">
          <form onSubmit={load}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="password">List password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="h-11 bg-card px-3 text-base md:text-base"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </Field>
              {error ? <FieldError>{error}</FieldError> : null}
              <Button type="submit" size="lg" className="h-11 w-full text-base" disabled={loading}>
                {loading ? "Opening…" : "Open the list"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] lg:col-span-2">
      <CardContent className="px-6 pt-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p>
            <strong>{rows.length}</strong> {rows.length === 1 ? "person" : "people"}
          </p>
          <Button
            type="button"
            variant="outline"
            className="w-auto"
            onClick={() => downloadCsv(rows)}
            disabled={rows.length === 0}
          >
            Download CSV
          </Button>
        </div>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No one has joined yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-xs tracking-wide text-muted-foreground uppercase">
                  <th className="py-3 pr-4 font-medium">Created at</th>
                  <th className="py-3 pr-4 font-medium">Title</th>
                  <th className="py-3 pr-4 font-medium">Name</th>
                  <th className="py-3 pr-4 font-medium">Email</th>
                  <th className="py-3 pr-4 font-medium">Institution</th>
                  <th className="py-3 font-medium">Province</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={`${row.email}-${row.createdAt || row.submittedAt}`} className="border-b last:border-0">
                    <td className="py-3 pr-4 align-top">{formatWhen(row.createdAt || row.submittedAt)}</td>
                    <td className="py-3 pr-4 align-top">{row.title}</td>
                    <td className="py-3 pr-4 align-top">{row.name}</td>
                    <td className="py-3 pr-4 align-top">{row.email}</td>
                    <td className="py-3 pr-4 align-top">{row.institution}</td>
                    <td className="py-3 align-top">{row.province}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
