import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useStore } from '../../store/useStore';
import { CAFES, GAMES, GAME_MAP } from '../../mockData';
import { colors, radius, fontSize, spacing } from '../../theme';
import { PrimaryButton } from '../../components/PrimaryButton';
import { DifficultyPill } from '../../components/DifficultyPill';
import { VibeTag } from '../../components/VibeTag';
import { Chip } from '../../components/Chip';
import { Vibe } from '../../types';

const STEPS = ['Cafe', 'Table & Time', 'Games', 'Players & Deposit', 'Vibe & Details', 'Publish'];

const HOURS = ['11:00 am', '12:00 pm', '1:00 pm', '2:00 pm', '3:00 pm', '4:00 pm', '5:00 pm', '6:00 pm', '7:00 pm', '8:00 pm', '9:00 pm'];

export function HostModal() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { currentUser, cafes, games, hostMeetup } = useStore();

  const [step, setStep] = useState(0);
  const [selectedCafeId, setSelectedCafeId] = useState<string>(route.params?.cafeId ?? '');
  const [selectedTableId, setSelectedTableId] = useState('');
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [selectedGameIds, setSelectedGameIds] = useState<string[]>(route.params?.gameId ? [route.params.gameId] : []);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [deposit, setDeposit] = useState('150');
  const [vibes, setVibes] = useState<Vibe[]>([]);
  const [beginnersWelcome, setBeginnersWelcome] = useState(false);
  const [note, setNote] = useState('');

  const cafe = cafes.find(c => c.id === selectedCafeId);
  const table = cafe?.tables.find(t => t.id === selectedTableId);
  const selectedGames = selectedGameIds.map(id => GAME_MAP[id]).filter(Boolean);

  const toggleSlot = (hour: string) => {
    setSelectedSlots(prev =>
      prev.includes(hour) ? prev.filter(s => s !== hour) : [...prev, hour].sort((a, b) => HOURS.indexOf(a) - HOURS.indexOf(b))
    );
  };

  const toggleVibe = (v: Vibe) => {
    setVibes(prev => {
      if (prev.includes(v)) return prev.filter(x => x !== v);
      if (prev.length >= 2) return prev;
      return [...prev, v];
    });
  };

  const toggleGame = (id: string) => {
    setSelectedGameIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const canNext = () => {
    if (step === 0) return !!selectedCafeId;
    if (step === 1) return !!selectedTableId && selectedSlots.length > 0;
    if (step === 2) return selectedGameIds.length > 0;
    if (step === 3) return Number(deposit) > 0;
    if (step === 4) return vibes.length > 0;
    return true;
  };

  const handlePublish = () => {
    if (!cafe || !table) return;
    const totalMin = selectedGames.reduce((acc, g) => acc + g.teachTimeMin + g.playTimeMin, 0);
    const slots = selectedSlots.map((s, i) => {
      const idx = HOURS.indexOf(s);
      return { startTime: s, endTime: HOURS[idx + 1] ?? s };
    });

    hostMeetup({
      host: currentUser,
      cafe,
      tableId: selectedTableId,
      gameIds: selectedGameIds,
      date: 'Today',
      slots,
      estimatedTotalMin: totalMin,
      seatsTotal: maxPlayers,
      depositAmount: Number(deposit),
      cancelCutoffHours: 2,
      vibes,
      beginnersWelcome,
      note: note.trim() || undefined,
    });

    Alert.alert('Meetup Published! 🎲', 'Your meetup is live and a group chat has been created.', [
      { text: 'View Meetup', onPress: () => navigation.navigate('MeetupsTab') },
    ]);
    navigation.goBack();
  };

  const cafeGames = cafe ? cafe.gameLibraryIds.map(id => GAME_MAP[id]).filter(Boolean) : [];

  return (
    <View style={styles.container}>
      {/* Progress */}
      <View style={styles.progressBar}>
        {STEPS.map((s, i) => (
          <View key={s} style={[styles.progressStep, i <= step && styles.progressStepActive]} />
        ))}
      </View>
      <Text style={styles.stepLabel}>Step {step + 1} of {STEPS.length}: {STEPS[step]}</Text>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Step 0: Cafe */}
        {step === 0 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Pick a Cafe</Text>
            {cafes.map(c => (
              <TouchableOpacity
                key={c.id}
                style={[styles.optionCard, selectedCafeId === c.id && styles.optionCardActive]}
                onPress={() => { setSelectedCafeId(c.id); setSelectedTableId(''); setSelectedSlots([]); setSelectedGameIds([]); }}
              >
                <Text style={[styles.optionName, selectedCafeId === c.id && styles.optionNameActive]}>{c.name}</Text>
                <Text style={styles.optionSub}>{c.area} · {c.distanceKm} km · ₹{c.pricePerHour}/hr</Text>
                {c.offer && <Text style={styles.offer}>🎁 {c.offer.text}</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Step 1: Table & Time */}
        {step === 1 && cafe && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Pick a Table</Text>
            {cafe.tables.map(t => (
              <TouchableOpacity
                key={t.id}
                style={[styles.optionCard, selectedTableId === t.id && styles.optionCardActive]}
                onPress={() => { setSelectedTableId(t.id); setMaxPlayers(Math.min(maxPlayers, t.seats)); }}
              >
                <Text style={[styles.optionName, selectedTableId === t.id && styles.optionNameActive]}>{t.label}</Text>
                <Text style={styles.optionSub}>Seats up to {t.seats} players</Text>
              </TouchableOpacity>
            ))}

            {selectedTableId && (
              <>
                <Text style={[styles.stepTitle, { marginTop: spacing.xl }]}>Pick Time Slots</Text>
                <Text style={styles.stepSub}>Select consecutive hours for multi-hour meetups</Text>
                <View style={styles.slotsGrid}>
                  {HOURS.map(h => (
                    <TouchableOpacity
                      key={h}
                      style={[styles.slotChip, selectedSlots.includes(h) && styles.slotChipActive]}
                      onPress={() => toggleSlot(h)}
                    >
                      <Text style={[styles.slotText, selectedSlots.includes(h) && styles.slotTextActive]}>{h}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {selectedSlots.length > 0 && (
                  <Text style={styles.slotSummary}>
                    {selectedSlots[0]} – {HOURS[HOURS.indexOf(selectedSlots[selectedSlots.length - 1]) + 1] ?? selectedSlots[selectedSlots.length - 1]} ({selectedSlots.length}h)
                  </Text>
                )}
              </>
            )}
          </View>
        )}

        {/* Step 2: Games */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Pick Games</Text>
            <Text style={styles.stepSub}>Select one or more games from this cafe's library</Text>
            {cafeGames.map(g => (
              <TouchableOpacity
                key={g.id}
                style={[styles.optionCard, selectedGameIds.includes(g.id) && styles.optionCardActive]}
                onPress={() => toggleGame(g.id)}
              >
                <View style={styles.gameRowInner}>
                  <Text style={[styles.optionName, selectedGameIds.includes(g.id) && styles.optionNameActive]}>{g.name}</Text>
                  <DifficultyPill difficulty={g.difficulty} size="sm" />
                </View>
                <Text style={styles.optionSub}>≈ {g.teachTimeMin} min teach · {g.playTimeMin} min play · {g.minPlayers}–{g.maxPlayers} players</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Step 3: Players & Deposit */}
        {step === 3 && table && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Players & Deposit</Text>
            <Text style={styles.fieldLabel}>Max players (table seats {table.seats})</Text>
            <View style={styles.stepper}>
              <TouchableOpacity style={styles.stepperBtn} onPress={() => setMaxPlayers(Math.max(2, maxPlayers - 1))}>
                <Text style={styles.stepperBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{maxPlayers}</Text>
              <TouchableOpacity style={styles.stepperBtn} onPress={() => setMaxPlayers(Math.min(table.seats, maxPlayers + 1))}>
                <Text style={styles.stepperBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.fieldLabel, { marginTop: spacing.xl }]}>Deposit amount (₹)</Text>
            <Text style={styles.fieldSub}>Holds the seat and reduces last-minute dropouts</Text>
            <TextInput
              style={styles.textInput}
              value={deposit}
              onChangeText={setDeposit}
              keyboardType="numeric"
              placeholder="150"
              placeholderTextColor={colors.textMuted}
            />
            <View style={styles.depositHints}>
              {['100', '150', '200', '250'].map(d => (
                <Chip key={d} label={`₹${d}`} active={deposit === d} onPress={() => setDeposit(d)} />
              ))}
            </View>
          </View>
        )}

        {/* Step 4: Vibe & Details */}
        {step === 4 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Vibe & Details</Text>
            <Text style={styles.fieldLabel}>Pick 1–2 vibes</Text>
            <View style={styles.vibeGrid}>
              {(['casual', 'competitive', 'social', 'marathon'] as Vibe[]).map(v => (
                <TouchableOpacity
                  key={v}
                  style={[styles.vibeBtn, vibes.includes(v) && styles.vibeBtnActive]}
                  onPress={() => toggleVibe(v)}
                >
                  <VibeTag vibe={v} />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.toggleRow} onPress={() => setBeginnersWelcome(!beginnersWelcome)}>
              <View style={[styles.toggle, beginnersWelcome && styles.toggleOn]}>
                <View style={[styles.toggleThumb, beginnersWelcome && styles.toggleThumbOn]} />
              </View>
              <Text style={styles.toggleLabel}>Beginners welcome</Text>
            </TouchableOpacity>

            <Text style={[styles.fieldLabel, { marginTop: spacing.lg }]}>Note (optional)</Text>
            <TextInput
              style={[styles.textInput, { height: 80 }]}
              value={note}
              onChangeText={setNote}
              placeholder="Any special instructions for players..."
              placeholderTextColor={colors.textMuted}
              multiline
            />
          </View>
        )}

        {/* Step 5: Review & Publish */}
        {step === 5 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Review & Publish</Text>
            <View style={styles.reviewCard}>
              <ReviewRow label="Cafe" value={cafe?.name ?? '—'} />
              <ReviewRow label="Table" value={table?.label ?? '—'} />
              <ReviewRow label="Time" value={selectedSlots.length ? `${selectedSlots[0]} – ${HOURS[HOURS.indexOf(selectedSlots[selectedSlots.length - 1]) + 1] ?? ''}` : '—'} />
              <ReviewRow label="Games" value={selectedGames.map(g => g.name).join(', ') || '—'} />
              <ReviewRow label="Max players" value={String(maxPlayers)} />
              <ReviewRow label="Deposit" value={`₹${deposit} per person`} />
              <ReviewRow label="Vibes" value={vibes.join(', ') || '—'} />
              <ReviewRow label="Beginners" value={beginnersWelcome ? 'Welcome' : 'Not specified'} />
              {note ? <ReviewRow label="Note" value={note} /> : null}
            </View>
            <View style={styles.publishInfo}>
              <Text style={styles.publishInfoText}>
                Publishing will make this meetup visible in all feeds and create a group chat for coordination.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Nav */}
      <View style={styles.navRow}>
        {step > 0 && (
          <PrimaryButton label="← Back" variant="outline" onPress={() => setStep(step - 1)} style={{ flex: 1 }} />
        )}
        {step < STEPS.length - 1 ? (
          <PrimaryButton
            label="Next →"
            onPress={() => setStep(step + 1)}
            disabled={!canNext()}
            style={{ flex: 1 }}
          />
        ) : (
          <PrimaryButton label="Publish Meetup 🎲" onPress={handlePublish} style={{ flex: 1 }} />
        )}
      </View>
    </View>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={reviewStyles.row}>
      <Text style={reviewStyles.label}>{label}</Text>
      <Text style={reviewStyles.value}>{value}</Text>
    </View>
  );
}

const reviewStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: 'Poppins_400Regular' },
  value: { fontSize: fontSize.sm, color: colors.textPrimary, fontFamily: 'Poppins_600SemiBold', flex: 1, textAlign: 'right' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  progressBar: { flexDirection: 'row', gap: 4, padding: spacing.lg, paddingBottom: 0 },
  progressStep: { flex: 1, height: 3, backgroundColor: colors.surfaceAlt, borderRadius: 2 },
  progressStepActive: { backgroundColor: colors.brand },
  stepLabel: { fontSize: fontSize.xs, color: colors.textMuted, fontFamily: 'Poppins_500Medium', paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: 20 },
  stepContent: { gap: spacing.md },
  stepTitle: { fontSize: fontSize.xl, color: colors.textPrimary, fontFamily: 'Poppins_700Bold' },
  stepSub: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: 'Poppins_400Regular' },
  optionCard: {
    backgroundColor: colors.surface, borderRadius: radius.card,
    padding: spacing.md, gap: spacing.xs,
    borderWidth: 1.5, borderColor: colors.border,
  },
  optionCardActive: { borderColor: colors.brand, backgroundColor: colors.brand + '18' },
  optionName: { fontSize: fontSize.md, color: colors.textPrimary, fontFamily: 'Poppins_600SemiBold' },
  optionNameActive: { color: colors.brand },
  optionSub: { fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: 'Poppins_400Regular' },
  offer: { fontSize: fontSize.xs, color: colors.brand, fontFamily: 'Poppins_500Medium' },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  slotChip: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  slotChipActive: { borderColor: colors.brand, backgroundColor: colors.brand + '22' },
  slotText: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: 'Poppins_500Medium' },
  slotTextActive: { color: colors.brand },
  slotSummary: { fontSize: fontSize.sm, color: colors.accentSuccess, fontFamily: 'Poppins_600SemiBold', marginTop: spacing.sm },
  gameRowInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  fieldLabel: { fontSize: fontSize.md, color: colors.textPrimary, fontFamily: 'Poppins_700Bold' },
  fieldSub: { fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: 'Poppins_400Regular', marginTop: -spacing.sm + 2 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  stepperBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  stepperBtnText: { fontSize: fontSize.xl, color: colors.textPrimary, fontFamily: 'Poppins_700Bold' },
  stepperValue: { fontSize: fontSize.xxxl, color: colors.textPrimary, fontFamily: 'Poppins_700Bold', minWidth: 40, textAlign: 'center' },
  textInput: {
    backgroundColor: colors.surfaceAlt, borderRadius: radius.sm,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    fontSize: fontSize.md, color: colors.textPrimary, fontFamily: 'Poppins_400Regular',
    borderWidth: 1, borderColor: colors.border,
  },
  depositHints: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  vibeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  vibeBtn: { opacity: 0.6 },
  vibeBtnActive: { opacity: 1 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  toggle: { width: 48, height: 26, borderRadius: 13, backgroundColor: colors.surfaceAlt, padding: 3, borderWidth: 1, borderColor: colors.border },
  toggleOn: { backgroundColor: colors.brand + '44', borderColor: colors.brand },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.textMuted },
  toggleThumbOn: { backgroundColor: colors.brand, transform: [{ translateX: 22 }] },
  toggleLabel: { fontSize: fontSize.md, color: colors.textPrimary, fontFamily: 'Poppins_500Medium' },
  reviewCard: { backgroundColor: colors.surface, borderRadius: radius.card, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  publishInfo: {
    backgroundColor: colors.brand + '18', borderRadius: radius.card,
    padding: spacing.md, borderWidth: 1, borderColor: colors.brand + '44',
  },
  publishInfoText: { fontSize: fontSize.sm, color: colors.brandLight, fontFamily: 'Poppins_400Regular', lineHeight: 20 },
  navRow: { flexDirection: 'row', gap: spacing.md, padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
});
