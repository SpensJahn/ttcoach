import { useState } from 'react';
import { Alert, ScrollView, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Field, PrimaryButton, Screen, SecondaryButton, TextField } from '@/components/ui';
import { playersRepo } from '@/lib/db';
import { spacing } from '@/lib/theme';

export default function PlayerForm() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'neu';
  const existing = isNew ? null : playersRepo.get(Number(id));

  const [name, setName] = useState(existing?.name ?? '');
  const [birthYear, setBirthYear] = useState(
    existing?.birthYear ? String(existing.birthYear) : '',
  );
  const [groupName, setGroupName] = useState(existing?.groupName ?? '');
  const [notes, setNotes] = useState(existing?.notes ?? '');

  if (!isNew && !existing) {
    return (
      <Screen>
        <Text>Spieler nicht gefunden.</Text>
      </Screen>
    );
  }

  const save = () => {
    if (!name.trim()) {
      Alert.alert('Name fehlt', 'Bitte gib den Namen des Spielers ein.');
      return;
    }
    const birthYearNum = birthYear.trim() ? Number(birthYear.trim()) : null;
    playersRepo.save({
      id: existing?.id ?? null,
      name: name.trim(),
      birthYear:
        birthYearNum && Number.isFinite(birthYearNum) ? birthYearNum : null,
      groupName: groupName.trim() || null,
      notes: notes.trim() || null,
    });
    router.back();
  };

  const remove = () => {
    Alert.alert(
      'Spieler löschen',
      `${name} und alle zugeordneten Trainingsübungen werden entfernt. Fortfahren?`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: () => {
            if (existing) playersRepo.remove(existing.id);
            router.back();
          },
        },
      ],
    );
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Field label="Name">
          <TextField
            value={name}
            onChangeText={setName}
            placeholder="z. B. Lena Müller"
          />
        </Field>
        <Field label="Jahrgang">
          <TextField
            value={birthYear}
            onChangeText={setBirthYear}
            placeholder="z. B. 2015"
            keyboardType="number-pad"
          />
        </Field>
        <Field label="Trainingsgruppe">
          <TextField
            value={groupName}
            onChangeText={setGroupName}
            placeholder="z. B. U11 Offensive"
          />
        </Field>
        <Field label="Notizen (Stärken, Ziele, Anmerkungen)">
          <TextField
            value={notes}
            onChangeText={setNotes}
            placeholder="z. B. sehr gute Ballneugier, arbeitet an Rückhand-Topspin"
            multiline
            style={{ minHeight: 100, textAlignVertical: 'top' }}
          />
        </Field>

        <PrimaryButton title={isNew ? 'Spieler anlegen' : 'Änderungen speichern'} onPress={save} />
        {existing ? (
          <SecondaryButton title="Spieler löschen" danger onPress={remove} />
        ) : null}
      </ScrollView>
    </Screen>
  );
}
