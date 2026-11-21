import { useCallback, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Badge, PrimaryButton, Screen, SecondaryButton } from '@/components/ui';
import {
  formatDeDate,
  sessionsRepo,
  type SessionDrillDetail,
  type TrainingSession,
} from '@/lib/db';
import { colors, spacing } from '@/lib/theme';

export default function SessionEditor() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const sessionId = Number(id);

  const [session, setSession] = useState<TrainingSession | null>(null);
  const [drills, setDrills] = useState<SessionDrillDetail[]>([]);

  const reload = useCallback(() => {
    setSession(sessionsRepo.get(sessionId));
    setDrills(sessionsRepo.listDrills(sessionId));
  }, [sessionId]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  if (!session) {
    return (
      <Screen>
        <Text style={{ padding: spacing.lg }}>Training nicht gefunden.</Text>
      </Screen>
    );
  }

  const toggleStatus = () => {
    const next = session.status === 'geplant' ? 'absolviert' : 'geplant';
    sessionsRepo.updateStatus(session.id, next);
    reload();
  };

  const removeDrill = (drill: SessionDrillDetail) => {
    Alert.alert(
      'Übung entfernen',
      drill.exerciseTitle
        ? `"${drill.exerciseTitle}" aus dem Plan entfernen?`
        : 'Diesen Planpunkt entfernen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Entfernen',
          style: 'destructive',
          onPress: () => {
            sessionsRepo.removeDrill(drill.id);
            reload();
          },
        },
      ],
    );
  };

  const removeSession = () => {
    Alert.alert('Training löschen', 'Dieses Training samt Übungsplan löschen?', [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Löschen',
        style: 'destructive',
        onPress: () => {
          sessionsRepo.remove(session.id);
          router.back();
        },
      },
    ]);
  };

  const totalMinutes = drills.reduce(
    (sum, d) => sum + (d.durationMin ?? 0),
    0,
  );

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={styles.date}>{formatDeDate(session.date)}</Text>
          <Badge
            label={session.status}
            tone={session.status === 'absolviert' ? 'success' : 'accent'}
          />
        </View>
        <Text style={styles.metaLine}>
          {[
            session.theme || 'Ohne Schwerpunkt',
            session.groupName,
            session.durationMin ? `${session.durationMin} min` : null,
          ]
            .filter(Boolean)
            .join(' · ')}
        </Text>

        <PrimaryButton
          color={session.status === 'geplant' ? colors.success : colors.primary}
          title={
            session.status === 'geplant'
              ? 'Training abschließen'
              : 'Erneut öffnen (geplant)'
          }
          onPress={toggleStatus}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Übungsplan{drills.length > 0 ? ` · ${totalMinutes} min geplant` : ''}
          </Text>
          <Pressable onPress={() => router.push(`/training/${session.id}/drill`)}>
            <Text style={styles.addLink}>＋ Übung</Text>
          </Pressable>
        </View>

        {drills.length === 0 ? (
          <Text style={styles.emptyHint}>
            Noch keine Übungen zugeordnet. Tippe auf „＋ Übung“, um für jedes Kind
            konkrete Übungen aus der Bibliothek zu wählen.
          </Text>
        ) : (
          drills.map((d) => (
            <View key={d.id} style={styles.drillCard}>
              <View style={styles.drillHeader}>
                <Text style={styles.drillPlayer}>{d.playerName ?? 'Ganze Gruppe'}</Text>
                {d.durationMin ? (
                  <Text style={styles.drillDuration}>{d.durationMin} min</Text>
                ) : null}
              </View>
              <Text style={styles.drillTitle}>
                {d.exerciseTitle ?? 'Übung gelöscht'}
                {d.exerciseCategory ? `  ·  ${d.exerciseCategory}` : ''}
              </Text>
              {d.notes ? <Text style={styles.drillNotes}>{d.notes}</Text> : null}
              <Pressable onPress={() => removeDrill(d)}>
                <Text style={styles.removeLink}>Entfernen</Text>
              </Pressable>
            </View>
          ))
        )}

        <SecondaryButton title="Training löschen" danger onPress={removeSession} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
  },
  metaLine: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: -spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  addLink: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: 15,
  },
  emptyHint: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 21,
  },
  drillCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  drillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drillPlayer: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  drillDuration: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  drillTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.xs,
  },
  drillNotes: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  removeLink: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
    marginTop: spacing.md,
  },
});
