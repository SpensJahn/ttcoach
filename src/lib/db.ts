import * as SQLite from 'expo-sqlite';

export type Player = {
  id: number;
  name: string;
  birthYear: number | null;
  groupName: string | null;
  notes: string | null;
};

export type Exercise = {
  id: number;
  title: string;
  description: string | null;
  category: string;
  difficulty: number;
  materials: string | null;
};

export type TrainingSession = {
  id: number;
  date: string;
  durationMin: number | null;
  theme: string | null;
  groupName: string | null;
  status: 'geplant' | 'absolviert';
  notes: string | null;
};

export type SessionDrill = {
  id: number;
  sessionId: number;
  playerId: number | null;
  exerciseId: number | null;
  durationMin: number | null;
  notes: string | null;
};

export type SessionDrillDetail = SessionDrill & {
  playerName: string | null;
  exerciseTitle: string | null;
  exerciseCategory: string | null;
};

export const EXERCISE_CATEGORIES = [
  'Ballkontrolle',
  'Aufschlag & Rückschlag',
  'Topspin & Überspiel',
  'Schmettern & Abschluss',
  'Fußarbeit & Beine',
  'Taktik & Spielsituationen',
  'Kondition & Athletik',
] as const;

const db = SQLite.openDatabaseSync('ttcoach.db');

function init() {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      birth_year INTEGER,
      group_name TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL DEFAULT 'Ballkontrolle',
      difficulty INTEGER NOT NULL DEFAULT 2,
      materials TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS training_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      duration_min INTEGER,
      theme TEXT,
      group_name TEXT,
      status TEXT NOT NULL DEFAULT 'geplant',
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS session_drills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
      player_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
      exercise_id INTEGER REFERENCES exercises(id) ON DELETE SET NULL,
      duration_min INTEGER,
      notes TEXT
    );
  `);
}

init();

export function toIsoDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatDeDate(iso: string): string {
  const [, m, d] = iso.split('-');
  return `${d}.${m}.`;
}

export const playersRepo = {
  list(): Player[] {
    return db.getAllSync<Player>('SELECT * FROM players ORDER BY name');
  },
  get(id: number): Player | null {
    return (
      db.getFirstSync<Player>('SELECT * FROM players WHERE id = ?', [id]) ?? null
    );
  },
  save(input: {
    id: number | null;
    name: string;
    birthYear: number | null;
    groupName: string | null;
    notes: string | null;
  }): number {
    if (input.id) {
      db.runSync(
        'UPDATE players SET name = ?, birth_year = ?, group_name = ?, notes = ? WHERE id = ?',
        [input.name, input.birthYear, input.groupName, input.notes, input.id],
      );
      return input.id;
    }
    const result = db.runSync(
      'INSERT INTO players (name, birth_year, group_name, notes) VALUES (?, ?, ?, ?)',
      [input.name, input.birthYear, input.groupName, input.notes],
    );
    return result.lastInsertRowId as number;
  },
  remove(id: number) {
    db.runSync('DELETE FROM players WHERE id = ?', [id]);
  },
};

export const exercisesRepo = {
  list(category?: string): Exercise[] {
    if (category) {
      return db.getAllSync<Exercise>(
        'SELECT * FROM exercises WHERE category = ? ORDER BY title',
        [category],
      );
    }
    return db.getAllSync<Exercise>('SELECT * FROM exercises ORDER BY title');
  },
  get(id: number): Exercise | null {
    return (
      db.getFirstSync<Exercise>('SELECT * FROM exercises WHERE id = ?', [id]) ??
      null
    );
  },
  save(input: {
    id: number | null;
    title: string;
    description: string | null;
    category: string;
    difficulty: number;
    materials: string | null;
  }): number {
    if (input.id) {
      db.runSync(
        'UPDATE exercises SET title = ?, description = ?, category = ?, difficulty = ?, materials = ? WHERE id = ?',
        [
          input.title,
          input.description,
          input.category,
          input.difficulty,
          input.materials,
          input.id,
        ],
      );
      return input.id;
    }
    const result = db.runSync(
      'INSERT INTO exercises (title, description, category, difficulty, materials) VALUES (?, ?, ?, ?, ?)',
      [
        input.title,
        input.description,
        input.category,
        input.difficulty,
        input.materials,
      ],
    );
    return result.lastInsertRowId as number;
  },
  remove(id: number) {
    db.runSync('DELETE FROM exercises WHERE id = ?', [id]);
  },
  count(): number {
    const row = db.getFirstSync<{ n: number }>(
      'SELECT COUNT(*) AS n FROM exercises',
    );
    return row?.n ?? 0;
  },
  seedIfEmpty() {
    if (this.count() > 0) return false;
    const samples: Omit<Exercise, 'id'>[] = [
      {
        title: '10 Aufschläge auf Zielkreise',
        description:
          'Abwechselnd beidseitig aufschlagen, Ziel: 10 Treffer auf markierte Kreise. Varianten: kurz, lang, Schnitt.',
        category: 'Aufschlag & Rückschlag',
        difficulty: 1,
        materials: '4 Zielmarkierungen, Bälle',
      },
      {
        title: 'Topspin-Dauerball von gleicher Position',
        description:
          'Trainingspartner ballt kontinuierlich, Spieler antwortet mit Topspin. Fokus: Rumpfeinsatz und Timing.',
        category: 'Topspin & Überspiel',
        difficulty: 2,
        materials: 'Viele Bälle',
      },
      {
        title: 'Fußarbeit gegen zufällige Bälle',
        description:
          'Bälle werden zufällig links/rechts geballt. Spieler läuft passgenau an den Ball heran und kehrt in die Mitte zurück.',
        category: 'Fußarbeit & Beine',
        difficulty: 2,
        materials: 'Bälle',
      },
      {
        title: '60 Sekunden Ballwechsel-Dauer',
        description:
          '60 Sekunden konstanter Ballwechsel: Spieler kontrolliert jede Vorhand mittig auf die Tischhälfte und wechselt rhythmisch mit der Rückhand.',
        category: 'Ballkontrolle',
        difficulty: 1,
        materials: 'Tisch, Bälle',
      },
      {
        title: 'Schmetterball-Finish nach Topspin',
        description:
          '2× Topspin, dann Schmetterball auf den hochkommenden Ball. Fokus: Tempoumschaltung und Punktabschluss.',
        category: 'Schmettern & Abschluss',
        difficulty: 3,
        materials: 'Bälle, bei Bedarf Roboter',
      },
      {
        title: 'Spiel 11 Punkte mit Sonderregel',
        description:
          'Echtes Zählspiel: Punkt zählt nur nach eigenem Angriffsschlag. Trainiert die Risikobereitschaft in Spielsituationen.',
        category: 'Taktik & Spielsituationen',
        difficulty: 2,
        materials: 'Tisch, Bälle',
      },
    ];
    for (const s of samples) {
      this.save({ id: null, ...s });
    }
    return true;
  },
};

export const sessionsRepo = {
  list(): TrainingSession[] {
    return db.getAllSync<TrainingSession>(
      'SELECT * FROM training_sessions ORDER BY date DESC',
    );
  },
  get(id: number): TrainingSession | null {
    return (
      db.getFirstSync<TrainingSession>(
        'SELECT * FROM training_sessions WHERE id = ?',
        [id],
      ) ?? null
    );
  },
  create(input: {
    date: string;
    durationMin: number | null;
    theme: string | null;
    groupName: string | null;
  }): number {
    const result = db.runSync(
      "INSERT INTO training_sessions (date, duration_min, theme, group_name, status) VALUES (?, ?, ?, ?, 'geplant')",
      [input.date, input.durationMin, input.theme, input.groupName],
    );
    return result.lastInsertRowId as number;
  },
  updateStatus(id: number, status: 'geplant' | 'absolviert') {
    db.runSync('UPDATE training_sessions SET status = ? WHERE id = ?', [
      status,
      id,
    ]);
  },
  remove(id: number) {
    db.runSync('DELETE FROM training_sessions WHERE id = ?', [id]);
  },
  listDrills(sessionId: number): SessionDrillDetail[] {
    return db.getAllSync<SessionDrillDetail>(
      `SELECT sd.id, sd.session_id AS sessionId, sd.player_id AS playerId,
              sd.exercise_id AS exerciseId, sd.duration_min AS durationMin, sd.notes,
              p.name AS playerName, e.title AS exerciseTitle, e.category AS exerciseCategory
       FROM session_drills sd
       LEFT JOIN players p ON p.id = sd.player_id
       LEFT JOIN exercises e ON e.id = sd.exercise_id
       WHERE sd.session_id = ?
       ORDER BY sd.id`,
      [sessionId],
    );
  },
  addDrill(input: {
    sessionId: number;
    playerId: number | null;
    exerciseId: number | null;
    durationMin: number | null;
    notes: string | null;
  }): number {
    const result = db.runSync(
      'INSERT INTO session_drills (session_id, player_id, exercise_id, duration_min, notes) VALUES (?, ?, ?, ?, ?)',
      [
        input.sessionId,
        input.playerId,
        input.exerciseId,
        input.durationMin,
        input.notes,
      ],
    );
    return result.lastInsertRowId as number;
  },
  removeDrill(drillId: number) {
    db.runSync('DELETE FROM session_drills WHERE id = ?', [drillId]);
  },
};
