// Midnight Purple — Token Palette (exact values from reference)
export const colors = {
  brand:        '#7C3AED',   // Brand
  brandLight:   '#C084FC',   // Brand lt
  accent:       '#A78BFA',   // Accent
  bg:           '#0F0A1A',   // BG
  surface:      '#1A1030',   // Surface
  surfaceAlt:   '#2D1B52',   // Surface+
  textPrimary:  '#F5F0FF',
  textSecondary:'#A899C4',
  textMuted:    '#6B5E88',

  // Semantic
  difficultyLight:  '#34D399',  // Success
  difficultyMedium: '#F59E0B',  // Gold
  difficultyHeavy:  '#FB7185',  // Heavy
  accentSuccess:    '#34D399',
  accentWarn:       '#F59E0B',
  accentStreak:     '#FF7A45',

  // Awards / gold
  gold:        '#F59E0B',
  goldLight:   '#FBB740',
  awardCard:   '#1C1005',
  awardBorder: 'rgba(245,158,11,0.22)',

  border:      'rgba(124,58,237,0.18)',
  overlay:     'rgba(0,0,0,0.6)',

  // Logo two-tone
  logoPurple: '#7C3AED',         // ON  → brand purple
  logoMuted:  '#D4CAEC',         // BOARD → muted near-white
};

export const gradient = {
  brand: ['#7C3AED', '#4C1D95'] as [string, string],
  gold:  ['#FBB740', '#D97706'] as [string, string],
  // Warm glow for home/award boxes (bottom-right corner radiating outward)
  warmGlow:  ['rgba(245,158,11,0.22)', 'transparent'] as [string, string],
  awardGlow: ['rgba(245,158,11,0.18)', 'transparent'] as [string, string],
};

export const difficultyColor = {
  light:  colors.difficultyLight,
  medium: colors.difficultyMedium,
  heavy:  colors.difficultyHeavy,
};

export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32,
};

export const radius = {
  pill: 999, card: 16, image: 16, sm: 8, md: 12,
};

export const fontSize = {
  xs: 11, sm: 12, md: 14, lg: 16, xl: 18, xxl: 22, xxxl: 28, display: 34,
};
