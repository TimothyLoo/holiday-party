"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { useLiveQuery } from "dexie-react-hooks";
import styles from "./page.module.css";
import { db, addMember, createGame, assignMember, getMembersForGame } from "../../../lib/db";

interface GameClientProps {
  id: string;
}

export default function GameClient({ id }: GameClientProps) {
  const [scanOpen, setScanOpen] = useState(false);
  const [banner, setBanner] = useState<{ message: string; color: string } | null>(null);

  const gameId = `game-${id}`;

  // Initialize game on load
  useEffect(() => {
    const init = async () => {
      const game = await db.games.get(gameId);
      if (!game) await createGame(`Game ${id}`, new Date().toISOString());
    };
    init();
  }, [gameId, id]);

  // Reactively get all assignments
  const assignments = useLiveQuery(
    async () => {
      return (await getMembersForGame(gameId)) ?? [];
    },
    [gameId],
    []
  );

  const showBanner = (message: string, color: string = "#005DAA") => {
    setBanner({ message, color });
    setTimeout(() => setBanner(null), 5000);
  };

  const parseMemberFromUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.searchParams.get("member") || "";
    } catch {
      return "";
    }
  };

  const handleScan = async (result: IDetectedBarcode[]) => {
    if (!result.length) return;
    const scannedUrl = result[0].rawValue;
    const memberName = parseMemberFromUrl(scannedUrl);

    if (!memberName) {
      showBanner("No member found in QR code!", "#E31837");
      setScanOpen(false);
      return;
    }

    setScanOpen(false);

    // Ensure member exists
    const member = await db.members.where("name").equals(memberName).first();
    const memberId = member ? member.id : await addMember(memberName);

    // Check if already assigned
    const alreadyAssigned = assignments?.find((a) => a.memberId === memberId);
    if (alreadyAssigned) {
      showBanner(`${memberName} has already checked in!`, "#E31837");
      return;
    }

    // Assign team (balance)
    const team1Count = assignments?.filter((a) => a.team === "Team 1").length ?? 0;
    const team2Count = assignments?.filter((a) => a.team === "Team 2").length ?? 0;
    const assignedTeam = team1Count <= team2Count ? "Team 1" : "Team 2";

    // Random naughty/nice
    const status = Math.random() < 0.5 ? "naughty" : "nice";

    // Save
    await assignMember(gameId, memberId, assignedTeam, status);

    // Success banner
    showBanner(
      `${memberName} joined ${assignedTeam} — ${status === "naughty" ? "😈 Naughty!" : "🎅 Nice!"}`,
      status === "naughty" ? "#E31837" : "#007A33"
    );
  };

  const handleError = (err: unknown) => {
    console.error(err);
    showBanner("Oops! Something went wrong with the camera.", "#E31837");
  };

  const membersByTeam = (team: string) => assignments?.filter((a) => a.team === team) ?? [];

  const membersByStatus = (status: "naughty" | "nice") =>
    assignments?.filter((a) => a.status === status) ?? [];

  return (
    <div className={styles.page}>
      {banner && (
        <div
          className={styles.banner}
          style={{
            backgroundColor: banner.color,
            color: "#fff",
            padding: "12px",
            borderRadius: "8px",
            textAlign: "center",
            marginBottom: "10px",
            fontWeight: 600,
          }}
        >
          {banner.message}
        </div>
      )}

      <h1 className={styles.title}>Game {id}</h1>

      <div className={styles.tables}>
        <div className={`${styles.table} ${styles.team1}`}>
          <h2>Team 1</h2>
          {membersByTeam("Team 1").map((a) => (
            <p key={a.memberId}>{a.name}</p>
          ))}
        </div>

        <div className={`${styles.table} ${styles.team2}`}>
          <h2>Team 2</h2>
          {membersByTeam("Team 2").map((a) => (
            <p key={a.memberId}>{a.name}</p>
          ))}
        </div>

        <div className={`${styles.table} ${styles.nice}`}>
          <h2>Nice List</h2>
          {membersByStatus("nice").map((a) => (
            <p key={a.memberId}>{a.name}</p>
          ))}
        </div>

        <div className={`${styles.table} ${styles.naughty}`}>
          <h2>Naughty List</h2>
          {membersByStatus("naughty").map((a) => (
            <p key={a.memberId}>{a.name}</p>
          ))}
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
              style={{
                marginTop: "1rem",
                backgroundColor: "#005DAA",
                color: "#fff",
              }}
            >
              ❌ Cancel
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
