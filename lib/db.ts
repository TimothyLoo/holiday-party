import Dexie, { Table } from "dexie";
import { v4 as uuidv4 } from "uuid";

// Interfaces for your data
export interface Member {
  id: string;
  name: string;
}

export interface Game {
  id: string;
  name: string;
  date: string;
}

export interface Assignment {
  id: string;
  gameId: string;
  memberId: string;
  team: string;
  status: "naughty" | "nice";
}

// Dexie database class
export class HolidayGameDB extends Dexie {
  members!: Table<Member, string>;
  games!: Table<Game, string>;
  assignments!: Table<Assignment, string>;

  constructor() {
    super("HolidayGameDB");
    this.version(1).stores({
      members: "id,name",
      games: "id,date,name",
      assignments: "id,gameId,memberId,[gameId+team],[gameId+status]"
    });
  }
}

// Single DB instance
export const db = new HolidayGameDB();

// ----- Helper functions -----

// Add a member
export async function addMember(name: string) {
  const id = uuidv4();
  await db.members.add({ id, name });
  return id;
}

// Create a game
export async function createGame(name: string, date: string) {
  const id = uuidv4();
  await db.games.add({ id, name, date });
  return id;
}

// Assign member to team/naughty-nice list
export async function assignMember(
  gameId: string,
  memberId: string,
  team: string,
  status: "naughty" | "nice"
) {
  const id = uuidv4();
  await db.assignments.add({ id, gameId, memberId, team, status });
  return id;
}

// Get all assignments for a game
export async function getAssignmentsForGame(gameId: string) {
  return await db.assignments.where("gameId").equals(gameId).toArray();
}

// Get all members for a game with details
export async function getMembersForGame(gameId: string) {
  const assignments = await getAssignmentsForGame(gameId);
  const members = await Promise.all(
    assignments.map(async (a) => {
      const member = await db.members.get(a.memberId);
      return { ...a, name: member?.name };
    })
  );
  return members;
}
