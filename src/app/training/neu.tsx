import { useState } from 'react';
import { Alert, ScrollView, Text } from 'react-native';
import { router } from 'expo-router';
import { Field, PrimaryButton, Screen, TextField } from '@/components/ui';
import { sessionsRepo, toIsoDate } from '@/lib/db';
import { spacing } from '@/lib/theme';

export default function NewSession() {
  const [date, setDate] = useState(toIsoDate(new Date()));
  const [duration, setDuration] = useState('90');
  const [theme, setTheme] = useState('');
  const [groupName, setGroupName] = useState('');

  const create = () => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
      Alert.alert('Datum prüfen', 'Bitte Datum als JJJJ-MM-TT eingeben, z. B. 2025-03-14.');
      return;
    }
    const durationNum = duration.trim() ? Number(duration.trim()) : null;
    const sessionId = sessionsRepo.create({
      date: date.trim(),
      durationMin: durationNum && Number.isFinite(durationNum) ? durationNum : null,
      theme: theme.trim() || null,
      groupName: groupName.trim() || null,
    });
    router.replace(`/training/${sessionId}`);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Field label="Datum (JJJJ-MM-TT)">
          <TextField value={date} onChangeText={setDate} placeholder="2025-03-14" keyboardType="numbers-and-punctuation" />
        </Field>
        <Field label="Dauer in Minuten">
          <TextField value={duration} onChangeText={setDuration} placeholder="90" keyboardType="number-pad" />
        </Field>
        <Field label="Schwerpunkt / Thema">
          <TextField
            value={theme}
            onChangeText={setTheme}
            placeholder="z. B. Thema der Woche: Aufschlag + 3. Ball"
          />
        </Field>
        <Field label="Gruppe (optional)">
          <TextField value={groupName} onChangeText={setGroupName} placeholder="z. B. U11 Offensive" />
        </Field>

        <PrimaryButton title="Training anlegen" onPress={create} />
        <Text style={{ marginTop: spacing.lg, fontSize: 13, color: '#6B7280' }}>
          Danach ordnest du auf der nächsten Seite jedem Spieler konkrete Übungen zu.
        </Text>
      </ScrollView>
    </Screen>
  );
}
