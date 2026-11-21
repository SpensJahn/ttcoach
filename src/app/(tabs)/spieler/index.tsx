import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { EmptyState, ListRow, Screen } from '@/components/ui';
import { playersRepo, type Player } from '@/lib/db';
import { colors, spacing } from '@/lib/theme';

export default function PlayerList() {
  const [players, setPlayers] = useState<Player[]>([]);

  useFocusEffect(
    useCallback(() => {
      setPlayers(playersRepo.list());
    }, []),
  );

  return (
    <Screen>
      <FlatList
        data={players}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.content}
        ListEmptyComponent={
          <EmptyState
            emoji="🧒"
            title="Noch keine Spieler"
            hint="Tippe auf ＋, um dein erstes Kind anzulegen. Für jedes Kind kannst du später individuelle Trainingspläne planen."
          />
        }
        renderItem={({ item }) => (
          <ListRow
            title={item.name}
            subtitle={
              [item.groupName, item.birthYear ? `Jahrgang ${item.birthYear}` : null]
                .filter(Boolean)
                .join(' · ') || null
            }
            onPress={() => router.push(`/spieler/${item.id}`)}
          />
        )}
      />
      <View style={styles.fabWrap}>
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}
          onPress={() => router.push('/spieler/neu')}
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
