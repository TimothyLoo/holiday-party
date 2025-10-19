// app/game/[id]/page.tsx
import Link from "next/link";
import styles from "./page.module.css";

interface GamePageProps {
  params: { id: string };
}

// Static pages for export
export function generateStaticParams() {
  return [1, 2, 3, 4, 5].map((id) => ({ id: id.toString() }));
}

export default function GamePage({ params }: GamePageProps) {
  const { id } = params;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Game {id}</h1>
      <p className={styles.description}>This is the layout for all games.</p>
      <Link href="/">
        <div className={styles.button}>Back to Home</div>
      </Link>
    </div>
  );
}
