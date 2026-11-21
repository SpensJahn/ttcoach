export const colors = {
  primary: '#1B2A4A',
  primaryLight: '#2E4470',
  accent: '#FF6B35',
  accentSoft: '#FFE8DF',
  background: '#F5F6FA',
  card: '#FFFFFF',
  border: '#E2E5EE',
  text: '#1C2333',
  textMuted: '#6B7280',
  danger: '#D64545',
  success: '#2E9E5B',
  successSoft: '#E2F5E9',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
};

export const typography = {
  title: { fontSize: 24, fontWeight: '700' as const, color: colors.text },
  heading: { fontSize: 17, fontWeight: '700' as const, color: colors.text },
  body: { fontSize: 15, color: colors.text },
  muted: { fontSize: 13, color: colors.textMuted },
};
