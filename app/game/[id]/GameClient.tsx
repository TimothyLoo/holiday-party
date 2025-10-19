"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import styles from "./page.module.css";
import { db, addMember, createGame, assignMember, getMembersForGame } from "../../../lib/db";

interface GameClientProps {
  id: string;
}

interface AssignmentWithName {
  id: string;
  gameId: string;
  memberId: string;
  name: string;
  team: string;
  status: "naughty" | "nice";
}

export default function GameClient({ id }: GameClientProps) {
  const [scanOpen, setScanOpen] = useState(false);
  const [qrResult, setQrResult] = useState("");
  const [assignments, setAssignments] = useState<AssignmentWithName[]>([]);
  const [banner, setBanner] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const gameId = `game-${id}`;

  // helper to show banner for 5 seconds
  const showBanner = (message: string, type: "success" | "error" = "success") => {
    setBanner({ message, type });
    setTimeout(() => setBanner(null), 5000);
  };

  // Initialize game and load assignments
  useEffect(() => {
    const init = async () => {
      let game = await db.games.get(gameId);
      if (!game) await createGame(`Game ${id}`, new Date().toISOString());

      const current = await getMembersForGame(gameId);
      setAssignments(current);
    };
    init();
  }, [gameId]);

  // Subscribe to Dexie updates
  useEffect(() => {
    const table = db.assignments;

    const handleChanges = async () => {
      const current = await getMembersForGame(gameId);
      setAssignments(current);
    };

    table.hook("creating", handleChanges);
    table.hook("updating", handleChanges);

    return () => {
      table.hook("creating").unsubscribe(handleChanges);
      table.hook("updating").unsubscribe(handleChanges);
    };
  }, [gameId]);

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
    setQrResult(scannedUrl);

    const memberName = parseMemberFromUrl(scannedUrl);
    if (!memberName) {
      showBanner("❌ No member found in QR code!", "error");
      setScanOpen(false);
      return;
    }

    setScanOpen(false);

    let members = await db.members.where("name").equals(memberName).toArray();
    let memberId: string;
    if (members.length === 0) {
      memberId = await addMember(memberName);
    } else {
      memberId = members[0].id;
    }

    if (assignments.find((a) => a.memberId === memberId)) {
      showBanner(`⚠️ ${memberName} already checked in!`, "error");
      return;
    }

    const team1Count = assignments.filter((a) => a.team === "Team 1").length;
    const team2Count = assignments.filter((a) => a.team === "Team 2").length;
    const assignedTeam = team1Count <= team2Count ? "Team 1" : "Team 2";

    // Randomly assign naughty or nice
    const status = Math.random() < 0.5 ? "naughty" : "nice";

    await assignMember(gameId, memberId, assignedTeam, status);

    showBanner(`🎉 ${memberName} clocked in: ${assignedTeam}, ${status.toUpperCase()} list!`);

    const updatedAssignments = await getMembersForGame(gameId);
    const half = Math.ceil(updatedAssignments.length / 2);
    const shuffled = [...updatedAssignments].sort(() => Math.random() - 0.5);

    for (let i = 0; i < shuffled.length; i++) {
      const a = shuffled[i];
      const newTeam = i < half ? "Team 1" : "Team 2";
      if (a.team !== newTeam) {
        await db.assignments.update(a.id, { team: newTeam });
      }
    }

    const refreshed = await getMembersForGame(gameId);
    setAssignments(refreshed);
  };

  const handleError = (err: any) => {
    console.error(err);
    showBanner("🚫 Oops! Something went wrong with the camera.", "error");
  };

  const membersByTeam = (team: string) => assignments.filter((a) => a.team === team);
  const membersByStatus = (status: "naughty" | "nice") =>
    assignments.filter((a) => a.status === status);

  return (
    <div className={styles.page}>
      {/* 🔔 Notification Banner */}
      {banner && (
        <div
          className={`${styles.banner} ${
            banner.type === "error" ? styles.bannerError : styles.bannerSuccess
          }`}
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
