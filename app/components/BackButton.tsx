// app/components/BackButton.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type BackButtonProps = {
  href?: string;         // optional: go to a specific route
  label?: string;        // optional: custom label
};

export function BackButton({ href, label = "Back" }: BackButtonProps) {
  const router = useRouter();

  // If an href is provided, render a Next.js Link
  if (href) {
    return (
      <Link
        href={href}
        className="px-3 py-1 rounded border border-gray-300 text-sm text-gray-700 hover:bg-gray-100"
      >
        {label}
      </Link>
    );
  }

  // Otherwise, behave like browser back
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="px-3 py-1 rounded border border-gray-300 text-sm text-gray-700 hover:bg-gray-100"
    >
      {label}
    </button>
  );
}
