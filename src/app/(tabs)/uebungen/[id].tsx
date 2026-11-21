import { useState } from 'react';
import { Alert, ScrollView, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Select } from '@/components/Select';
import { Field, PrimaryButton, Screen, SecondaryButton, TextField } from '@/components/ui';
import { EXERCISE_CATEGORIES, exercisesRepo } from '@/lib/db';
import { spacing } from '@/lib/theme';

const difficultyOptions = [
  { value: 1, label: '★☆☆ – Einsteiger' },
  { value: 2, label: '★★☆ – Aufbau' },
  { value: 3, label: '★★★ – Wettkampf' },
];

export default function ExerciseForm() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'neu';
  const existing = isNew ? null : exercisesRepo.get(Number(id));

  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [category, setCategory] = useState<string>(existing?.category ?? EXERCISE_CATEGORIES[0]);
  const [difficulty, setDifficulty] = useState<number>(existing?.difficulty ?? 2);
  const [materials, setMaterials] = useState(existing?.materials ?? '');

  if (!isNew && !existing) {
    return (
      <Screen>
        <Text>Übung nicht gefunden.</Text>
      </Screen>
    );
  }

  const save = () => {
    if (!title.trim()) {
      Alert.alert('Titel fehlt', 'Bitte gib einen Übungstitel ein.');
      return;
    }
    exercisesRepo.save({
      id: existing?.id ?? null,
      title: title.trim(),
      description: description.trim() || null,
      category,
      difficulty,
      materials: materials.trim() || null,
    });
    router.back();
  };

  const remove = () => {
    Alert.alert('Übung löschen', `"${title}" aus der Bibliothek entfernen?`, [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Löschen',
        style: 'destructive',
        onPress: () => {
          if (existing) exercisesRepo.remove(existing.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Field label="Titel">
          <TextField
            value={title}
            onChangeText={setTitle}
            placeholder="z. B. Aufschlag mit Zielflächen"
          />
        </Field>
        <Field label="Beschreibung / Ablauf">
          <TextField
            value={description}
            onChangeText={setDescription}
            placeholder="Was wird wie trainiert? Worauf achten?"
            multiline
            style={{ minHeight: 110, textAlignVertical: 'top' }}
          />
        </Field>
        <Field label="Kategorie">
          <Select
            label="Kategorie"
            options={EXERCISE_CATEGORIES.map((c) => ({ value: c, label: c }))}
            value={category}
            onChange={setCategory}
          />
        </Field>
        <Field label="Schwierigkeitsgrad">
          <Select
            label="Schwierigkeit"
            options={difficultyOptions}
            value={difficulty}
            onChange={setDifficulty}
          />
        </Field>
        <Field label="Material">
          <TextField
            value={materials}
            onChangeText={setMaterials}
            placeholder="z. B. Bälle, Markierungen, Roboter"
          />
        </Field>

        <PrimaryButton title={isNew ? 'Übung anlegen' : 'Änderungen speichern'} onPress={save} />
        {existing ? (
          <SecondaryButton title="Übung löschen" danger onPress={remove} />
        ) : null}
      </ScrollView>
    </Screen>
  );
}
