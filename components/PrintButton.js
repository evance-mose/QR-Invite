"use client";

import { Button } from "@/components/ui/button";

export default function PrintButton() {
  return (
    <Button type="button" className="mt-6 w-auto px-5 print:hidden" onClick={() => window.print()}>
      Print this code
    </Button>
  );
}
