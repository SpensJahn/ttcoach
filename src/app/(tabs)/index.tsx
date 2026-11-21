import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Badge, Card, EmptyState, ListRow, Screen } from '@/components/ui';
import {
  exercisesRepo,
  formatDeDate,
  playersRepo,
  sessionsRepo,
  toIsoDate,
  type TrainingSession,
} from '@/lib/db';
import { colors, spacing, typography } from '@/lib/theme';

function Stats({ value, label }: { value: number; label: string }) {
  return (
    <Card style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={typography.muted}>{label}</Text>
    </Card>
  );
}

export default function Dashboard() {
  const [playerCount, setPlayerCount] = useState(0);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [planned, setPlanned] = useState<TrainingSession[]>([]);

  useFocusEffect(
    useCallback(() => {
      exercisesRepo.seedIfEmpty();
      setPlayerCount(playersRepo.list().length);
      setExerciseCount(exercisesRepo.count());
      setPlanned(sessionsRepo.list().filter((s) => s.status === 'geplant'));
    }, []),
  );

  const today = toIsoDate(new Date());

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Trainingswoche im Blick</Text>

        <View style={styles.statsRow}>
          <Stats value={playerCount} label="Spieler" />
          <Stats value={exerciseCount} label="Übungen" />
          <Stats value={planned.length} label="Geplant" />
        </View>

        <Card style={styles.hintCard}>
          <Text style={styles.hintTitle}>So arbeitest du mit der App</Text>
          <Text style={styles.hintText}>
            1. Spieler anlegen{'\n'}
            2. Übungen pflegen (Beispiele sind schon enthalten){'\n'}
            3. Training planen, Übungen pro Spieler zuordnen{'\n'}
            4. Nach dem Training dokumentieren
          </Text>
        </Card>

        <Text style={styles.sectionTitle}>Nächste geplante Trainings</Text>
        {planned.length === 0 ? (
          <EmptyState
            emoji="🏓"
            title="Kein Training geplant"
            hint="Lege im Tab „Trainings“ eine neue Einheit an und plane die Übungen pro Spieler."
          />
        ) : (
          planned.map((s) => (
            <Card key={s.id} style={{ padding: 0 }}>
              <ListRow
                title={`${formatDeDate(s.date)}${s.date === today ? ' · heute' : ''}`}
                subtitle={s.theme || 'Ohne Schwerpunkt'}
                onPress={() => router.push(`/training/${s.id}`)}
                right={<Badge label={s.status} tone="accent" />}
              />
            </Card>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  title: {
    ...typography.title,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.accent,
  },
  hintCard: {
    backgroundColor: colors.primary,
    borderWidth: 0,
  },
  hintTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    marginBottom: spacing.sm,
  },
  hintText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    lineHeight: 22,
  },
  sectionTitle: {
    ...typography.heading,
    marginTop: spacing.sm,
  },
});
