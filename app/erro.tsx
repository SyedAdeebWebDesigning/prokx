// src/app/error.tsx
"use client";

import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const Error = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const statusCode = searchParams.get("statusCode");
  const message = searchParams.get("message");
  const longMessage = searchParams.get("longMessage");
  const code = searchParams.get("code");
  const traceId = searchParams.get("traceId");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold">Oops, an error occurred</h1>
      {statusCode && <p className="mt-2 text-lg">Status Code: {statusCode}</p>}
      {message && <p className="mt-2 text-lg">Message: {message}</p>}
      {longMessage && <p className="mt-2 text-lg">Details: {longMessage}</p>}
      {code && <p className="mt-2 text-lg">Error Code: {code}</p>}
      {traceId && <p className="mt-2 text-lg">Trace ID: {traceId}</p>}
      <p className="mt-4 text-center">
        Please try again later or contact support if the issue persists. <br />
        This error can also be caused if your account is deleted from the
        database.
      </p>
      <Link
        href={"/sign-in"}
        className={cn("", buttonVariants({ variant: "link" }))}
      >
        Sign in
      </Link>
    </main>
  );
};

export default Error;
