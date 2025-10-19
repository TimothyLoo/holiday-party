import React from "react";
import GameClient from "./GameClient";
import Head from "next/head";

interface GamePageProps {
  params: { id: string };
}

// Required for static export
export function generateStaticParams() {
  return [1, 2, 3, 4, 5].map((id) => ({ id: id.toString() }));
}

export default function GamePage({ params }: GamePageProps) {
  return (
    <>
      <Head>
        <title>Game 1 - Holiday Party</title>
        <meta name="description" content="Holiday games at Costco" />
      </Head>
      <GameClient id={params.id} />
    </>
  );
}
