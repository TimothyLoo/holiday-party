import React from "react";
import GameClient from "./GameClient";

interface GamePageProps {
  params: { id: string };
}

// Required for static export
export function generateStaticParams() {
  return [1, 2, 3, 4, 5].map((id) => ({ id: id.toString() }));
}

export default function GamePage({ params }: GamePageProps) {
  return <GameClient id={params.id} />;
}
