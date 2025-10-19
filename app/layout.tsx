"use client";

import React, { useEffect } from "react";
import { db } from "../lib/db";
import { geistMono, geistSans } from "../lib/fonts";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Just accessing db will initialize it
    console.log("HolidayGameDB initialized:", db.name);
  }, []);
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
