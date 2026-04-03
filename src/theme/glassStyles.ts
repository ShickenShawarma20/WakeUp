// ============================================================
// Ethereal Horizon — Refractive Layering Glass Styles
// Depth through surface tiers, NOT heavy shadows.
// ============================================================

import type { CircadianPalette } from './colors';

export const getGlassStyles = (_isDark: boolean, colors?: CircadianPalette) => {
  const glassBase       = colors?.glassBase       ?? 'rgba(255,255,255,0.08)';
  const glassHighlight  = colors?.glassHighlight  ?? 'rgba(255,255,255,0.15)';
  const glassOnSurface  = colors?.glassOnSurface  ?? 'rgba(255,255,255,0.20)';
  const ambientGlow     = colors?.ambientGlow     ?? 'rgba(103,102,241,0.12)';
  const surfaceDim      = colors?.surfaceDim      ?? '#050411';

  return {
    // Level 1 — Section panels (light glass, minimal)
    section: {
      background:              colors?.surfaceContainerLow ?? 'rgba(30,27,75,0.5)',
      backdropFilter:          'blur(16px) saturate(110%)',
      WebkitBackdropFilter:    'blur(16px) saturate(110%)',
      // Inner border highlight (glass edge) — No outer border
      boxShadow:               `inset 0 1px 0 ${glassHighlight}, inset 0 -1px 0 rgba(0,0,0,0.1)`,
      borderRadius:            '24px',
      border:                  'none',
    },

    // Level 2 — Cards / interactives (deeper glass)
    standard: {
      background:              colors?.surfaceContainerHigh ?? 'rgba(49,46,106,0.45)',
      backdropFilter:          'blur(20px) saturate(110%)',
      WebkitBackdropFilter:    'blur(20px) saturate(110%)',
      boxShadow:               `inset 0 1px 0 ${glassHighlight}, inset 0 0 0 1px ${glassOnSurface}`,
      borderRadius:            '24px',
      border:                  'none',
    },

    // Level 2+ — Elevated glass (modals, sheets)
    elevated: {
      background:              colors?.surfaceContainerHighest ?? 'rgba(67,64,135,0.4)',
      backdropFilter:          'blur(24px) saturate(115%)',
      WebkitBackdropFilter:    'blur(24px) saturate(115%)',
      // Ambient shadow — 4% surface_tint at 3rem blur
      boxShadow:               `inset 0 1px 0 ${glassHighlight}, 0 0 3rem ${ambientGlow}`,
      borderRadius:            '24px',
      border:                  'none',
    },

    // Nav Bar — floating pill
    navBar: {
      background:              `${surfaceDim}e6`,    // surfaceDim at ~90%
      backdropFilter:          'blur(24px) saturate(120%)',
      WebkitBackdropFilter:    'blur(24px) saturate(120%)',
      boxShadow:               `inset 0 1px 0 ${glassHighlight}, 0 0 3rem ${ambientGlow}`,
      borderRadius:            '999px',
      border:                  'none',
    },

    // Ghost border used when accessibility requires a container boundary
    ghost: {
      background:              glassBase,
      backdropFilter:          'blur(12px)',
      WebkitBackdropFilter:    'blur(12px)',
      boxShadow:               `inset 0 0 0 1px ${colors?.outlineVariant ?? 'rgba(255,255,255,0.10)'}`,
      borderRadius:            '24px',
      border:                  'none',
    },

    // Recessed — inner elements (toggles, inputs)
    recessed: {
      background:              'rgba(0,0,0,0.15)',
      backdropFilter:          'blur(8px)',
      WebkitBackdropFilter:    'blur(8px)',
      boxShadow:               'inset 0 2px 6px rgba(0,0,0,0.2)',
      borderRadius:            '16px',
      border:                  'none',
    },

    // Legacy card alias
    card: {
      background:              colors?.surfaceContainerHigh ?? 'rgba(49,46,106,0.45)',
      backdropFilter:          'blur(16px)',
      WebkitBackdropFilter:    'blur(16px)',
      boxShadow:               `inset 0 1px 0 ${glassHighlight}`,
      borderRadius:            '24px',
      border:                  'none',
    },
  };
};