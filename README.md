# TT Coach 🏓

Mobile App für Tischtennis-Trainer: langfristige Trainingsplanung pro Kind, Wochenplanung
mit konkreten Übungen, Trainingsdoku und Spielbeobachtungen.

## Aktueller Stand (MVP)

- **Spieler-Verwaltung** – Profil pro Kind (Name, Jahrgang, Trainingsgruppe, Notizen)
- **Übungs-Bibliothek** – Übungen mit Beschreibung, Kategorie, Schwierigkeit und Material;
  Kategorien-Filter; beim ersten Start werden Beispielübungen angelegt
- **Wochen-Trainingsplanung** – Trainingseinheit anlegen (Datum, Dauer, Schwerpunkt,
  Gruppe), Übungen aus der Bibliothek pro Spieler (oder für die ganze Gruppe) zuordnen,
  Status „geplant“ / „absolviert“
- **Übersicht-Dashboard** – Kennzahlen (Spieler, Übungen, anstehende Trainings)

Alle Daten werden lokal auf dem Gerät gespeichert (SQLite via `expo-sqlite`).

## Geplante Ausbaustufen

1. **Trainingsdoku** – Kurzdoku pro Kind nach der Einheit (Was lief gut? Wo nachlegen?)
2. **Langfristplanung** – Zielcontainer pro Kind (Saisonziele, Meilensteine), Verknüpfung
   Wochenplan ↔ Ziel („dieses Kind arbeitet diese Woche an diesem Ziel“)
3. **Spielbeobachtungen** – Gegner, Ergebnis, Stärken/Schwächen; abgeleitete Folgetüren
   fließen in den Langfristplan
4. **Login & Geräteübergreifende Synchronisation** – Backend (z. B. Postgres) einführen und
   SQLite durch eine API-First-Schicht ersetzen
5. **Feinschliff** – Suche/Filter, PDF-Export des Wochenplans, Backup

## Tech-Stack

- React Native 0.88 / Expo SDK 58 (TypeScript, strikt)
- **Expo Router** für Navigation (`src/app/`)
- **expo-sqlite** für lokale Persistenz (`src/lib/db.ts`)

## Entwicklung

```bash
npm install
npx expo start          # dann in der „Expo Go“-App auf dem Handy öffnen
```

```bash
npx tsc --noEmit        # Typecheck
npx expo lint           # Lint
```

## Projektstruktur

```
src/
  app/            # Screens (Expo Router)
    (tabs)/       # Übersicht, Spieler, Übungen, Trainings
    training/     # Trainingsplan-Editor + Übungs-Zuordnung
  components/     # Wiederverwendbare UI-Bausteine (Select, Buttons, …)
  lib/            # Datenbank-Schicht (SQLite, Repositories) und Theme
```
