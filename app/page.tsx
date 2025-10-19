// app/page.tsx
'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  const games = [1, 2, 3, 4, 5];

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Welcome! Choose a game:</h1>
      <div className={styles.ctas}>
        {games.map((game) => (
          <Link key={game} href={`/game/${game}`}>
            <div className={styles.button}>Game {game}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
