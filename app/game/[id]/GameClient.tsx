"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import styles from "./page.module.css";

interface GameClientProps {
  id: string;
}

export default function GameClient({ id }: GameClientProps) {
  const [scanOpen, setScanOpen] = useState(false);
  const [qrResult, setQrResult] = useState("");

  const handleScan = (result: IDetectedBarcode[]) => {
    console.log(result);
    setScanOpen(false);
    alert(`Clocked in! You scanned: ${result.map((r) => r.rawValue).join(", ")}`);
  };

  const handleError = (err: any) => {
    console.error(err);
    alert("Oops! Something went wrong with the camera.");
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Game {id}</h1>

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

      <div className={styles.buttons}>
        <Link href="/">
          <div className={styles.button}>Back to Home</div>
        </Link>

        <div
          className={styles.button}
          onClick={() => setScanOpen(true)}
          style={{ backgroundColor: "#E31837", color: "#fff" }}
        >
          📸 Scan to Play! (Clock In)
        </div>
      </div>

      {scanOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <Scanner onScan={handleScan} onError={handleError} />
            <div
              className={styles.button}
              onClick={() => setScanOpen(false)}
              style={{ marginTop: "1rem", backgroundColor: "#005DAA", color: "#fff" }}
            >
              ❌ Cancel
            </div>
          </div>
        </div>
      )}

      {qrResult && <p>You scanned: {qrResult}</p>}
    </div>
  );
}
