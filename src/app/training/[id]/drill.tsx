import { useState } from 'react';
import { Alert, ScrollView, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Select } from '@/components/Select';
import { Field, PrimaryButton, Screen, TextField } from '@/components/ui';
import {
  exercisesRepo,
  playersRepo,
  sessionsRepo,
  type Exercise,
  type Player,
} from '@/lib/db';
import { spacing } from '@/lib/theme';

export default function AddDrill() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const sessionId = Number(id);

  const players: Player[] = playersRepo.list();
  const exercises: Exercise[] = exercisesRepo.list();

  const [playerId, setPlayerId] = useState<number | null>(null);
  const [exerciseId, setExerciseId] = useState<number | null>(null);
  const [duration, setDuration] = useState('10');
  const [notes, setNotes] = useState('');

  const playerOptions = [
    { value: null, label: 'Ganze Gruppe' },
    ...players.map((p) => ({ value: p.id, label: p.name })),
  ];
  const exerciseOptions: { value: number | null; label: string }[] =
    exercises.map((e) => ({ value: e.id, label: `${e.title} (${e.category})` }));

  const save = () => {
    if (!exerciseId) {
      Alert.alert('Übung wählen', 'Bitte wähle eine Übung aus der Bibliothek.');
      return;
    }
    if (players.length === 0) {
      Alert.alert(
        'Keine Spieler',
        'Lege zuerst im Tab „Spieler“ mindestens ein Kind an.',
      );
      return;
    }
    const durationNum = duration.trim() ? Number(duration.trim()) : null;
    sessionsRepo.addDrill({
      sessionId,
      playerId,
      exerciseId,
      durationMin:
        durationNum && Number.isFinite(durationNum) ? durationNum : null,
      notes: notes.trim() || null,
    });
    router.back();
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {players.length === 0 ? (
          <Text style={{ marginBottom: spacing.lg, color: '#6B7280' }}>
            Es gibt noch keine Spieler. Lege sie im Tab „Spieler“ an – oder wähle
            „Ganze Gruppe“.
          </Text>
        ) : (
          <Field label="Für wen?">
            <Select
              label="Spieler / Gruppe"
              options={playerOptions}
              value={playerId}
              onChange={setPlayerId}
            />
          </Field>
        )}

        <Field label="Übung">
          <Select
            label="Übung auswählen"
            options={exerciseOptions}
            value={exerciseId}
            onChange={(v) => setExerciseId(v)}
          />
        </Field>

        <Field label="Geplante Dauer in Minuten">
          <TextField
            value={duration}
            onChangeText={setDuration}
            placeholder="10"
            keyboardType="number-pad"
          />
        </Field>

        <Field label="Notiz (optional)">
          <TextField
            value={notes}
            onChangeText={setNotes}
            placeholder="z. B. zuerst rechts, dann links; Ziel: 8 von 10 Treffern"
            multiline
            style={{ minHeight: 80, textAlignVertical: 'top' }}
          />
        </Field>

        <PrimaryButton title="Zum Trainingsplan hinzufügen" onPress={save} />
      </ScrollView>
    </Screen>
  );
}
