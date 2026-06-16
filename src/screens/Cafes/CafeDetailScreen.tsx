import React, { useState } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useStore } from '../../store/useStore';
import { GAME_MAP } from '../../mockData';
import { colors, radius, fontSize, spacing } from '../../theme';
import { RatingStars } from '../../components/RatingStars';
import { ReviewItem } from '../../components/ReviewItem';
import { DifficultyPill } from '../../components/DifficultyPill';
import { TableSlotGrid } from '../../components/TableSlotGrid';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Chip } from '../../components/Chip';

export function CafeDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { cafeId } = route.params;
  const { cafes } = useStore();
  const cafe = cafes.find(c => c.id === cafeId);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [gameSearch, setGameSearch] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string | undefined>();

  if (!cafe) return null;

  const cafeGames = cafe.gameLibraryIds.map(id => GAME_MAP[id]).filter(Boolean);
  const filteredGames = cafeGames.filter(g => g.name.toLowerCase().includes(gameSearch.toLowerCase()));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Photo Gallery */}
      <View style={styles.gallery}>
        <Image source={{ uri: cafe.photos[photoIdx] }} style={styles.mainPhoto} />
        <View style={styles.thumbRow}>
          {cafe.photos.map((p, i) => (
            <TouchableOpacity key={i} onPress={() => setPhotoIdx(i)}>
              <Image source={{ uri: p }} style={[styles.thumb, photoIdx === i && styles.thumbActive]} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.body}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{cafe.name}</Text>
            <Text style={styles.area}>{cafe.area}, {cafe.city}</Text>
          </View>
          <RatingStars rating={cafe.rating} />
        </View>

        {/* Info row */}
        <View style={styles.infoRow}>
          <InfoPill icon="🕐" text={cafe.hours} />
          <InfoPill icon="📍" text={`${cafe.distanceKm} km`} />
          <InfoPill icon="💰" text={`₹${cafe.pricePerHour}/hr${cafe.perPerson ? '/person' : ''}`} />
        </View>

        {cafe.offer && (
          <View style={styles.offerBanner}>
            <Text style={styles.offerText}>🎁 {cafe.offer.text}</Text>
            <Text style={styles.offerWindow}>{cafe.offer.window}</Text>
          </View>
        )}

        {/* Tables */}
        <Section title="Tables">
          {cafe.tables.map(t => (
            <View key={t.id} style={styles.tableRow}>
              <Text style={styles.tableLabel}>{t.label}</Text>
              <Text style={styles.tableSeats}>seats {t.seats} players</Text>
              <View style={[styles.freeTag, { backgroundColor: colors.accentSuccess + '22' }]}>
                <Text style={styles.freeTagText}>Free</Text>
              </View>
            </View>
          ))}
        </Section>

        {/* Availability Grid */}
        <Section title="Table Availability">
          <Text style={styles.subLabel}>Today — tap a slot to reserve</Text>
          <TableSlotGrid tables={cafe.tables} selectedSlot={selectedSlot} onSelectSlot={setSelectedSlot} />
        </Section>

        {/* Game Library */}
        <Section title={`Game Library (${cafeGames.length} games)`}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search games..."
            placeholderTextColor={colors.textMuted}
            value={gameSearch}
            onChangeText={setGameSearch}
          />
          {filteredGames.map(g => (
            <TouchableOpacity
              key={g.id}
              style={styles.gameRow}
              onPress={() => navigation.navigate('GameDetail', { gameId: g.id })}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.gameName}>{g.name}</Text>
                <Text style={styles.gameTime}>≈ {g.teachTimeMin} min teach · {g.playTimeMin} min play</Text>
              </View>
              <DifficultyPill difficulty={g.difficulty} size="sm" />
            </TouchableOpacity>
          ))}
        </Section>

        {/* Amenities */}
        <Section title="Amenities">
          <View style={styles.amenitiesRow}>
            {cafe.amenities.map(a => (
              <Chip key={a} label={a} active />
            ))}
          </View>
        </Section>

        {/* Reviews */}
        {cafe.reviews.length > 0 && (
          <Section title={`Reviews (${cafe.reviews.length})`}>
            {cafe.reviews.map(r => <ReviewItem key={r.id} review={r} />)}
          </Section>
        )}

        {/* CTA */}
        <PrimaryButton
          label="Host a Meetup Here →"
          onPress={() => navigation.navigate('HostModal', { cafeId })}
          style={{ marginTop: spacing.sm }}
        />
      </View>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.wrap}>
      <Text style={sectionStyles.title}>{title}</Text>
      <View style={sectionStyles.content}>{children}</View>
    </View>
  );
}

function InfoPill({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={pillStyles.pill}>
      <Text style={pillStyles.icon}>{icon}</Text>
      <Text style={pillStyles.text}>{text}</Text>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  wrap: { marginTop: spacing.xl },
  title: { fontSize: fontSize.lg, color: colors.textPrimary, fontFamily: 'Poppins_700Bold', marginBottom: spacing.md },
  content: { gap: spacing.sm },
});

const pillStyles = StyleSheet.create({
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.surfaceAlt, borderRadius: radius.pill,
    paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1, borderColor: colors.border,
  },
  icon: { fontSize: 12 },
  text: { fontSize: fontSize.xs, color: colors.textSecondary, fontFamily: 'Poppins_500Medium' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  gallery: { backgroundColor: colors.surface },
  mainPhoto: { width: '100%', height: 220 },
  thumbRow: { flexDirection: 'row', gap: spacing.sm, padding: spacing.sm },
  thumb: { width: 60, height: 60, borderRadius: radius.sm, opacity: 0.6 },
  thumbActive: { opacity: 1, borderWidth: 2, borderColor: colors.brand },
  body: { padding: spacing.lg, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md },
  name: { fontSize: fontSize.xxl, color: colors.textPrimary, fontFamily: 'Poppins_700Bold' },
  area: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: 'Poppins_400Regular' },
  infoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  offerBanner: {
    backgroundColor: colors.brand + '22', borderRadius: radius.card,
    borderWidth: 1, borderColor: colors.brand,
    padding: spacing.md, marginBottom: spacing.md,
  },
  offerText: { fontSize: fontSize.sm, color: colors.brand, fontFamily: 'Poppins_700Bold' },
  offerWindow: { fontSize: fontSize.xs, color: colors.brandLight, fontFamily: 'Poppins_400Regular' },
  tableRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  tableLabel: { flex: 1, fontSize: fontSize.sm, color: colors.textPrimary, fontFamily: 'Poppins_600SemiBold' },
  tableSeats: { fontSize: fontSize.sm, color: colors.textSecondary, fontFamily: 'Poppins_400Regular', marginRight: spacing.sm },
  freeTag: {
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill,
    borderWidth: 1, borderColor: colors.accentSuccess + '44',
  },
  freeTagText: { fontSize: fontSize.xs, color: colors.accentSuccess, fontFamily: 'Poppins_600SemiBold' },
  subLabel: { fontSize: fontSize.xs, color: colors.textMuted, fontFamily: 'Poppins_400Regular', marginBottom: spacing.sm },
  searchInput: {
    backgroundColor: colors.surfaceAlt, borderRadius: radius.sm,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    fontSize: fontSize.sm, color: colors.textPrimary, fontFamily: 'Poppins_400Regular',
    borderWidth: 1, borderColor: colors.border,
  },
  gameRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  gameName: { fontSize: fontSize.sm, color: colors.textPrimary, fontFamily: 'Poppins_600SemiBold' },
  gameTime: { fontSize: fontSize.xs, color: colors.textMuted, fontFamily: 'Poppins_400Regular' },
  amenitiesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
