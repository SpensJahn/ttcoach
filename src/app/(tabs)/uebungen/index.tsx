import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { EmptyState, ListRow, Screen } from '@/components/ui';
import {
  EXERCISE_CATEGORIES,
  exercisesRepo,
  type Exercise,
} from '@/lib/db';
import { colors, spacing } from '@/lib/theme';

const difficultyLabel = (d: number) => '★'.repeat(d) + '☆'.repeat(3 - d);

export default function ExerciseList() {
  const [category, setCategory] = useState<string | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const reload = useCallback(
    (cat: string | null) => {
      setExercises(exercisesRepo.list(cat ?? undefined));
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      reload(category);
    }, [category, reload]),
  );

  return (
    <Screen>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md }}>
        <FlatList
          data={['Alle', ...EXERCISE_CATEGORIES]}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const active = item === 'Alle' ? category === null : category === item;
            return (
              <Pressable
                onPress={() => {
                  const next = item === 'Alle' ? null : item;
                  setCategory(next);
                  reload(next);
                }}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text
                  style={[styles.chipText, active && styles.chipTextActive]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      <FlatList
        data={exercises}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.content}
        ListEmptyComponent={
          <EmptyState
            emoji="📋"
            title="Keine Übungen in dieser Kategorie"
            hint="Tippe auf ＋, um eine Übung anzulegen – Beschreibung, Kategorie, Schwierigkeit und Material."
          />
        }
        renderItem={({ item }) => (
          <ListRow
            title={item.title}
            subtitle={`${item.category} · ${difficultyLabel(item.difficulty)}`}
            onPress={() => router.push(`/uebungen/${item.id}`)}
          />
        )}
      />

      <View style={styles.fabWrap}>
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}
          onPress={() => router.push('/uebungen/neu')}
        >
          <Text style={styles.fabText}>＋</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  chipTextActive: {
    color: '#fff',
  },
  fabWrap: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xl,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
    marginTop: -2,
  },
});
