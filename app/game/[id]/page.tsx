import React from "react";
import GameClient from "./GameClient";
import Head from "next/head";

interface GamePageProps {
  params: Promise<{ id: string }>;
}

// Required for static export
export function generateStaticParams() {
  return [1, 2, 3, 4, 5].map((id) => ({ id: id.toString() }));
}

export default async function GamePage({ params }: GamePageProps) {
  const { id } = await params; // ✅ must await params now

  return (
    <>
      <Head>
        <title>Game {id} - Holiday Party</title>
        <meta name="description" content="Holiday games at Costco" />
      </Head>
      <GameClient id={id} />
    </>
  );
}
