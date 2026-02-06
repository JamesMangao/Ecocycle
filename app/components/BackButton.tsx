// components/BackButton.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type BackButtonProps = {
  href?: string;           // optional: allow either href or router.back()
  label?: string;
};

export function BackButton({ href, label = "Back" }: BackButtonProps) {
  const router = useRouter();

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
