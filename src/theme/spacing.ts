// ============================================================
// Ethereal Horizon — Spacing Scale
// ============================================================

export const spacing = {
  // Named scale (rem-based, as pixel values for inline styles)
  sp1:   4,   // 0.25rem
  sp2:   8,   // 0.5rem
  sp3:   12,  // 0.75rem
  sp4:   16,  // 1rem
  sp5:   20,  // 1.25rem
  sp6:   24,  // 1.5rem  ← content chunk separator within glass cards
  sp7:   28,  // 1.75rem
  sp8:   32,  // 2rem    ← "No-Line" separator (use gap instead of divider)
  sp10:  40,  // 2.5rem
  sp12:  48,  // 3rem
  sp14:  56,  // 3.5rem
  sp16:  88,  // 5.5rem  ← major functional group separator ("let the glass breathe")

  // Semantic aliases
  cardGap:            16,   // gap between alarm cards
  screenPadding:      24,   // horizontal screen padding
  cardPadding:        24,   // internal card padding
  sectionGap:         88,   // Spacing 16: between hero and alarm list
  groupGap:           32,   // Spacing 8: between settings groups (no dividers)

  // Geometry
  cardBorderRadius:   24,   // "md" glass cards
  pillBorderRadius:   999,  // "full" pill buttons
  chipBorderRadius:   999,  // selection chips
  navBarBorderRadius: 999,  // nav bar pill
  inputBorderRadius:  16,
  avatarSize:         52,
};