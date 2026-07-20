export const formatDate = (value: string | null | undefined): string => {
  if (!value) return '—';
  return value;
};

const AVATAR_BG = [
  '#1565c0',
  '#2e7d32',
  '#e65100',
  '#6a1b9a',
  '#c62828',
  '#00695c',
  '#4527a0',
  '#0277bd'
];

export const getPatientAvatarColor = (name: string): string =>
  AVATAR_BG[name.charCodeAt(0) % AVATAR_BG.length];

export const getPatientInitials = (name: string): string =>
  name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
