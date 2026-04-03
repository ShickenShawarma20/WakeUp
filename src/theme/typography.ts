// ============================================================
// Ethereal Horizon — Typography
// Space Grotesk (technical authority) + Manrope (humanistic warmth)
// ============================================================

const SPACE_GROTESK = "'Space Grotesk', sans-serif";
const MANROPE = "'Manrope', sans-serif";

export const typography = {
  // ── Hero — reserved exclusively for the current time ──────
  displayLg: {
    fontFamily: SPACE_GROTESK,
    fontWeight: 700 as const,
    fontSize: '3.5rem',           // 56px
    lineHeight: 1.0,
    letterSpacing: '-0.02em',     // Tight like a bespoke logotype
  },

  // ── Narrative — alarm names, greeting text ────────────────
  headlineMd: {
    fontFamily: SPACE_GROTESK,
    fontWeight: 700 as const,
    fontSize: '1.75rem',          // 28px
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
  },

  // ── Section titles, card headers ─────────────────────────
  headlineSm: {
    fontFamily: SPACE_GROTESK,
    fontWeight: 600 as const,
    fontSize: '1.25rem',          // 20px
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },

  // ── Secondary information ─────────────────────────────────
  bodyLg: {
    fontFamily: MANROPE,
    fontWeight: 400 as const,
    fontSize: '1rem',             // 16px
    lineHeight: 1.5,
    letterSpacing: '0',
  },

  bodyMd: {
    fontFamily: MANROPE,
    fontWeight: 400 as const,
    fontSize: '0.9375rem',        // 15px
    lineHeight: 1.5,
    letterSpacing: '0',
  },

  // ── AM/PM indicators, status tags — ALL CAPS ──────────────
  labelMd: {
    fontFamily: MANROPE,
    fontWeight: 600 as const,
    fontSize: '0.75rem',          // 12px
    lineHeight: 1.4,
    letterSpacing: '0.05em',      // 5% tracking
    textTransform: 'uppercase' as const,
  },

  labelSm: {
    fontFamily: MANROPE,
    fontWeight: 500 as const,
    fontSize: '0.6875rem',        // 11px
    lineHeight: 1.4,
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
  },

  // ── Buttons ────────────────────────────────────────────────
  buttonLg: {
    fontFamily: SPACE_GROTESK,
    fontWeight: 600 as const,
    fontSize: '1.0625rem',        // 17px
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
  },

  buttonMd: {
    fontFamily: SPACE_GROTESK,
    fontWeight: 600 as const,
    fontSize: '0.9375rem',        // 15px
    lineHeight: 1.2,
    letterSpacing: '-0.005em',
  },

  // ── Legacy aliases — for components not yet migrated ──────
  heroTitle:      { fontFamily: SPACE_GROTESK, fontWeight: 700 as const, fontSize: '1.75rem', letterSpacing: '-0.02em' },
  alarmTime:      { fontFamily: SPACE_GROTESK, fontWeight: 700 as const, fontSize: '3.5rem',  letterSpacing: '-0.02em' },
  alarmTimeSmall: { fontFamily: SPACE_GROTESK, fontWeight: 700 as const, fontSize: '2.5rem',  letterSpacing: '-0.02em' },
  cardTitle:      { fontFamily: SPACE_GROTESK, fontWeight: 600 as const, fontSize: '1.25rem', letterSpacing: '-0.01em' },
  bodyText:       { fontFamily: MANROPE,        fontWeight: 400 as const, fontSize: '1rem'     },
  labelText:      { fontFamily: MANROPE,        fontWeight: 600 as const, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' as const },
  badgeText:      { fontFamily: MANROPE,        fontWeight: 600 as const, fontSize: '0.8125rem' },
  unitText:       { fontFamily: MANROPE,        fontWeight: 400 as const, fontSize: '1rem'     },
};