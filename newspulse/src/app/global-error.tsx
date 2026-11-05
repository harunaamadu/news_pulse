"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 24,
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 32, margin: 0 }}>
          NewsPulse is temporarily unavailable
        </h1>
        <p style={{ maxWidth: 420, color: "#6b7280", margin: 0 }}>
          Something went wrong on our side. Please try again in a moment.
        </p>
        {error.digest && (
          <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
            Reference: {error.digest}
          </p>
        )}
        <button
          type="button"
          onClick={reset}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            background: "transparent",
            cursor: "pointer",
            font: "inherit",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}