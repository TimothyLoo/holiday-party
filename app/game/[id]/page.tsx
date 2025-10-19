// app/game/[id]/page.tsx

import React from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface GamePageProps {
  params: { id: string };
}

// Static pages for export
export function generateStaticParams() {
  return [1, 2, 3, 4, 5].map((id) => ({ id: id.toString() }));
}

export default async function GamePage({ params }: GamePageProps) {
  const { id } = await params;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Game {id}</h1>
      <p className={styles.description}>This is the layout for all games.</p>

      <div className={styles.tables}>
        <div className={`${styles.table} ${styles.team1}`}>
          <h2>Team 1</h2>
          <p>Player A</p>
          <p>Player B</p>
        </div>

        <div className={`${styles.table} ${styles.team2}`}>
          <h2>Team 2</h2>
          <p>Player C</p>
          <p>Player D</p>
        </div>

        <div className={`${styles.table} ${styles.nice}`}>
          <h2>Nice List</h2>
          <p>Person 1</p>
          <p>Person 2</p>
        </div>

        <div className={`${styles.table} ${styles.naughty}`}>
          <h2>Naughty List</h2>
          <p>Person 3</p>
          <p>Person 4</p>
        </div>
      </div>

      <Link href="/">
        <div className={styles.button}>Back to Home</div>
      </Link>
    </div>
  );
}
