import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Badge, EmptyState, ListRow, Screen } from '@/components/ui';
import { formatDeDate, sessionsRepo, type TrainingSession } from '@/lib/db';
import { colors, spacing } from '@/lib/theme';

export default function SessionList() {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);

  useFocusEffect(
    useCallback(() => {
      setSessions(sessionsRepo.list());
    }, []),
  );

  return (
    <Screen>
      <FlatList
        data={sessions}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.content}
        ListEmptyComponent={
          <EmptyState
            emoji="🗓️"
            title="Noch keine Trainings angelegt"
            hint="Tippe auf ＋, um eine Trainingseinheit zu planen: Datum, Schwerpunkt und Übungen pro Spieler."
          />
        }
        renderItem={({ item }) => (
          <ListRow
            title={formatDeDate(item.date)}
            subtitle={item.theme || 'Ohne Schwerpunkt'}
            onPress={() => router.push(`/training/${item.id}`)}
            right={
              <Badge
                label={item.status}
                tone={item.status === 'absolviert' ? 'success' : 'accent'}
              />
            }
          />
        )}
      />
      <View style={styles.fabWrap}>
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}
          onPress={() => router.push('/training/neu')}
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
