// ─── SIXDX DESIGN TOKENS ─────────────────────────────────────────────────────
// Single source of truth for all typography, colour, and spacing values.
//
// HOW TO USE
//   import { fonts, colors, textStyles } from '@/styles/tokens'
//   style={{ ...textStyles.sectionDisplay, color: colors.ink }}
//
// HOW TO EDIT
//   • Fonts     → change the string in `fonts`
//   • Colours   → change the hex / rgba in `colors`
//   • Type scale → change values inside `textStyles`
//   All consuming components pick up the change automatically — no search-replace needed.
//
// Figma source file: ZY9szUlXcExFPsFmCtPfQU
// Extracted 2025 — matches local Figma text + colour styles exactly.
// ─────────────────────────────────────────────────────────────────────────────

import type { CSSProperties } from 'react'

// ═══════════════════════════════════════════════════════════════════════════════
// ── 1. FONT FAMILIES
// ═══════════════════════════════════════════════════════════════════════════════

export const fonts = {
  /** Display / heading typeface — Marund */
  marund: 'Marund, sans-serif',
  /** Body / UI typeface — Helvetica Neue */
  hn: 'HelveticaNeue, "Helvetica Neue", Helvetica, Arial, sans-serif',
  /** Alias for Helvetica Neue, used by display tokens when matching Figma naming. */
  helvetica: 'HelveticaNeue, "Helvetica Neue", Helvetica, Arial, sans-serif',
} as const

// ═══════════════════════════════════════════════════════════════════════════════
// ── 2. COLOUR PALETTE
// ═══════════════════════════════════════════════════════════════════════════════

export const colors = {
  // ── Brand ──────────────────────────────────────────────────────────────────
  /** Primary orange — Figma: Brand 1 */
  brand1:   '#CC4D22',
  /** Gold accent — Figma: Brand 2 */
  brand2:   '#E1A853',
  /** Warm tint — Figma: Brand/Sec */
  brandSec: '#FCF4F2',

  // ── Content ────────────────────────────────────────────────────────────────
  /** Primary text / dark — Figma: Content/Primary */
  ink:   '#0A0402',
  /** Inverted / white — Figma: Inverted */
  white: '#FFFFFF',
  /** Near-black site background */
  bgDark: '#0A0402',

  // ── Alpha variants (ink) ───────────────────────────────────────────────────
  /** ink at 50% — feature body text */
  ink50:  'rgba(28,11,5,0.50)',
  /** ink at 60% — secondary descriptions */
  ink60:  'rgba(28,11,5,0.60)',
  /** ink at 5%  — badge backgrounds */
  ink05:  'rgba(28,11,5,0.05)',
  /** ink at 10% — subtle borders */
  ink10:  'rgba(28,11,5,0.10)',

  // ── Alpha variants (white) ─────────────────────────────────────────────────
  /** white at 70% — dimmed text on dark bg */
  white70: 'rgba(255,255,255,0.70)',
  /** white at 60% — secondary on dark */
  white60: 'rgba(255,255,255,0.60)',
  /** white at 50% — muted on dark */
  white50: 'rgba(255,255,255,0.50)',
  /** white at 30% — placeholder text */
  white30: 'rgba(255,255,255,0.30)',
  /** white at 25% — dividers / track backgrounds */
  white25: 'rgba(255,255,255,0.25)',
  /** white at 8%  — glass input backgrounds + borders */
  white08: 'rgba(255,255,255,0.08)',

  // ── Overlays ───────────────────────────────────────────────────────────────
  /** Black 40% — contact section bg overlay */
  overlay40: 'rgba(0,0,0,0.40)',
  /** Black 50% — WhatWeCreate / Hero image overlays */
  overlay50: 'rgba(0,0,0,0.50)',
} as const

// ═══════════════════════════════════════════════════════════════════════════════
// ── 3. TYPOGRAPHY SPACING PRIMITIVES
// ═══════════════════════════════════════════════════════════════════════════════
// Edit values here — textStyles below references them, so one change
// propagates to every component that spreads a textStyle.
//
// lineHeights   — controls how tall each line of text is (unitless multiplier)
// letterSpacing — tightness / looseness between individual characters
// wordSpacing   — extra gap added between each word (on top of the font default)
// paragraphGap  — vertical space between consecutive text blocks / paragraphs
// ─────────────────────────────────────────────────────────────────────────────

export const lineHeights = {
  /** Hero / display — very tight, for big impactful numbers */
  display:  0.8,
  /** Section headings — snug */
  heading:  1.0,
  /** h2 tight variant (slightly compressed) */
  headingTight: 0.9,
  /** Subtitles, feature titles — comfortable mid-line */
  subhead:  1.32,
  /** Body paragraphs — relaxed for readability */
  body:     1.4,
  /** Labels / captions — compact */
  label:    1.28,
} as const

export const letterSpacings = {
  /** Hero display — very wide pull-in */
  display:  '-0.07em',
  /** Primary headings */
  h1:       '-0.04em',
  /** Secondary headings */
  h2:       '-0.06em',
  /** Large body / callouts + subtitles */
  subhead:  '-0.03em',
  /** Body text — no adjustment */
  body:     '0em',
  /** UI elements (nav, buttons, labels) — slight pull-in */
  ui:       '-0.01em',
} as const

export const wordSpacings = {
  /** Default — same as browser normal */
  normal: 'normal',
  /** Slightly open — good for large display text */
  wide:   '0.04em',
} as const

// Vertical gap between paragraphs / stacked text blocks (in px)
export const paragraphGap = {
  /** 4 px — between a label and the element it describes */
  xs:  4,
  /** 12 px — between two tightly related lines */
  sm:  12,
  /** 20 px — body paragraph spacing */
  md:  20,
  /** 32 px — between a heading and its body copy */
  lg:  32,
  /** 48 px — between major content blocks */
  xl:  48,
} as const

// ═══════════════════════════════════════════════════════════════════════════════
// ── 4. RESPONSIVE TYPOGRAPHY TOKENS
// ═══════════════════════════════════════════════════════════════════════════════
// Edit typography here. Use rem for font sizes so the scale respects browser
// zoom/user accessibility settings.
//
// Breakpoints:
//   desktop — default, 1200px and above
//   tablet  — 810px to 1199px
//   mobile  — 809px and below
//
// Components should use textStyles below. textStyles points to CSS variables
// generated from this object, so edits here cascade across the whole site.
// ─────────────────────────────────────────────────────────────────────────────

type TypographyToken = {
  family: string
  weight: CSSProperties['fontWeight']
  size: {
    desktop: string
    tablet: string
    mobile: string
  }
  lineHeight: {
    desktop: string | number
    tablet: string | number
    mobile: string | number
  }
  letterSpacing: {
    desktop: string
    tablet: string
    mobile: string
  }
}

export const typography = {
  displayHero: {
    family: fonts.helvetica,
    weight: 400,
    size: { desktop: '9.703rem', tablet: '6rem', mobile: '3.5rem' },
    lineHeight: { desktop: 0.8, tablet: 0.84, mobile: 0.9 },
    letterSpacing: { desktop: '-0.07em', tablet: '-0.06em', mobile: '-0.05em' },
  },
  metricNumber: {
    family: fonts.helvetica,
    weight: 200,
    size: { desktop: 'clamp(3.75rem, 5vw, 3.575rem)', tablet: 'clamp(2.25rem, 7vw, 3.25rem)', mobile: '2.5rem' },
    lineHeight: { desktop: 1, tablet: 1, mobile: 1 },
    letterSpacing: { desktop: '-0.03em', tablet: '-0.03em', mobile: '-0.03em' },
  },
  heroTitle: {
    family: fonts.helvetica,
    weight: 400,  
    size: { desktop: '3.75rem', tablet: '4rem', mobile: '3rem' },
    lineHeight: { desktop: 1, tablet: 1, mobile: 1.05 },
    letterSpacing: { desktop: '-0.04em', tablet: '-0.04em', mobile: '-0.035em' },
  },
  sectionDisplay: {
    family: fonts.helvetica,
    weight: 400,
    size: { desktop: '8.75rem', tablet: '3rem', mobile: '2rem' },
    lineHeight: { desktop: 0.9, tablet: 0.95, mobile: 1 },
    letterSpacing: { desktop: '-0.06em', tablet: '-0.05em', mobile: '-0.04em' },
  },
  statement: {
    family: fonts.hn,
    weight: 400,
    // About / editorial statement. Edit tablet and mobile values here for responsive About heading control.
    size: { desktop: '4.5rem', tablet: '3.5rem', mobile: '2rem' },
    lineHeight: { desktop: 1, tablet: 1, mobile: 1.04 },
    letterSpacing: { desktop: '-0.04em', tablet: '-0.04em', mobile: '-0.04em' },
  },
  projectTitle: {
    family: fonts.hn,
    weight: 400,
    size: { desktop: '3.75rem', tablet: '3rem', mobile: '2rem' },
    lineHeight: { desktop: 0.95, tablet: 1, mobile: 1.05 },
    letterSpacing: { desktop: '-0.03em', tablet: '-0.03em', mobile: '-0.025em' },
  },
  contactHeading: {
    family: fonts.hn,
    weight: 400,
    size: { desktop: '3.75rem', tablet: '3rem', mobile: '2rem' },
    lineHeight: { desktop: 0.95, tablet: 1, mobile: 1.05 },
    letterSpacing: { desktop: '-0.03em', tablet: '-0.03em', mobile: '-0.025em' },
  },
  sectionHeading: {
    family: fonts.hn,
    weight: 400,
    size: { desktop: '2.25rem', tablet: '2rem', mobile: '1.5rem' },
    lineHeight: { desktop: 1, tablet: 1.05, mobile: 1.1 },
    letterSpacing: { desktop: '-0.03em', tablet: '-0.03em', mobile: '-0.025em' },
  },
  featureTitle: {
    family: fonts.hn,
    weight: 400,
    size: { desktop: '1.416rem', tablet: '1.25rem', mobile: '1.125rem' },
    lineHeight: { desktop: 1.32, tablet: 1.32, mobile: 1.35 },
    letterSpacing: { desktop: '-0.03em', tablet: '-0.025em', mobile: '-0.02em' },
  },
  body: {
    family: fonts.hn,
    weight: 400,
    size: { desktop: '0.875rem', tablet: '0.875rem', mobile: '0.875rem' },
    lineHeight: { desktop: 1.4, tablet: 1.4, mobile: 1.4 },
    letterSpacing: { desktop: '0em', tablet: '0em', mobile: '0em' },
  },
  bodyMedium: {
    family: fonts.hn,
    weight: 500,
    size: { desktop: '0.875rem', tablet: '0.875rem', mobile: '0.875rem' },
    lineHeight: { desktop: 1.4, tablet: 1.4, mobile: 1.4 },
    letterSpacing: { desktop: '-0.01em', tablet: '-0.01em', mobile: '-0.01em' },
  },
  bodyLarge: {
    family: fonts.hn,
    weight: 400,
    size: { desktop: '1rem', tablet: '1rem', mobile: '0.9375rem' },
    lineHeight: { desktop: 1.5, tablet: 1.5, mobile: 1.45 },
    letterSpacing: { desktop: '-0.03em', tablet: '-0.025em', mobile: '-0.02em' },
  },
  eyebrow: {
    family: fonts.hn,
    weight: 400,
    size: { desktop: '1rem', tablet: '0.9375rem', mobile: '0.875rem' },
    lineHeight: { desktop: 1.1, tablet: 1.1, mobile: 1.15 },
    letterSpacing: { desktop: '-0.03em', tablet: '-0.025em', mobile: '-0.02em' },
  },
  label: {
    family: fonts.hn,
    weight: 400,
    size: { desktop: '0.875rem', tablet: '0.8125rem', mobile: '0.75rem' },
    lineHeight: { desktop: 1.28, tablet: 1.28, mobile: 1.3 },
    letterSpacing: { desktop: '-0.01em', tablet: '-0.01em', mobile: '-0.005em' },
  },
  bodySmall: {
    family: fonts.hn,
    weight: 400,
    size: { desktop: '0.875rem', tablet: '0.875rem', mobile: '0.875rem' },
    lineHeight: { desktop: 1.4, tablet: 1.4, mobile: 1.4 },
    letterSpacing: { desktop: '0em', tablet: '0em', mobile: '0em' },
  },
} satisfies Record<string, TypographyToken>

type ViewportName = 'desktop' | 'tablet' | 'mobile'
type TypeTokenName = keyof typeof typography

const typographyVarName = (tokenName: TypeTokenName, prop: 'size' | 'line-height' | 'letter-spacing') =>
  `--type-${tokenName}-${prop}`

const typographyVarsFor = (viewport: ViewportName) =>
  Object.entries(typography)
    .flatMap(([tokenName, token]) => [
      `  ${typographyVarName(tokenName as TypeTokenName, 'size')}: ${token.size[viewport]};`,
      `  ${typographyVarName(tokenName as TypeTokenName, 'line-height')}: ${token.lineHeight[viewport]};`,
      `  ${typographyVarName(tokenName as TypeTokenName, 'letter-spacing')}: ${token.letterSpacing[viewport]};`,
    ])
    .join('\n')

export const typographyTokenCss = `
:root {
${typographyVarsFor('desktop')}
}

@media (max-width: 1199px) {
  :root {
${typographyVarsFor('tablet')}
  }
}

@media (max-width: 809px) {
  :root {
${typographyVarsFor('mobile')}
  }
}
`

const responsiveType = (tokenName: TypeTokenName): Pick<CSSProperties, 'fontFamily' | 'fontSize' | 'fontWeight' | 'letterSpacing' | 'lineHeight'> => ({
  fontFamily: typography[tokenName].family,
  fontSize: `var(${typographyVarName(tokenName, 'size')})`,
  fontWeight: typography[tokenName].weight,
  lineHeight: `var(${typographyVarName(tokenName, 'line-height')})`,
  letterSpacing: `var(${typographyVarName(tokenName, 'letter-spacing')})`,
})

// ═══════════════════════════════════════════════════════════════════════════════
// ── 5. TEXT STYLES  (assembled from responsive typography tokens above)
// ═══════════════════════════════════════════════════════════════════════════════
// Rules:
//   • Semantic HTML tags stay in components: h1, h2, p, button, etc.
//   • Visual roles live here: heroTitle, sectionDisplay, bodySmall, etc.
//   • No `color` here — set at call-site so styles work on dark + light sections.
//   • `margin: 0` resets browser defaults; override at call-site only if needed.
//
// Visual type scale:
//   displayHero    — oversized display / numbers
//   metricNumber   — circular metric values
//   heroTitle      — main hero visual title
//   sectionDisplay — large section statement
//   statement      — editorial / About-style statement
//   projectTitle   — selected-work / case-study titles
//   contactHeading — contact section heading
//   sectionHeading — medium section heading / callout
//   featureTitle   — card title / feature title
//   body           — standard body text
// ─────────────────────────────────────────────────────────────────────────────

export const textStyles = {

  /** displayHero — Oversized display / full-screen numbers. */
  displayHero: {
    ...responsiveType('displayHero'),
    wordSpacing:   wordSpacings.normal,
    fontStyle:     'normal',
    margin:        0,
  } satisfies CSSProperties,

  /** metricNumber — Large values inside circular metric meters. */
  metricNumber: {
    ...responsiveType('metricNumber'),
    wordSpacing:   wordSpacings.normal,
    fontStyle:     'normal',
    margin:        0,
  } satisfies CSSProperties,

  /** heroTitle — Main hero visual title. Can be applied to a semantic h1. */
  heroTitle: {
    ...responsiveType('heroTitle'),
    wordSpacing:   wordSpacings.normal,
    fontStyle:     'normal',
    margin:        0,
  } satisfies CSSProperties,

  /** sectionDisplay — Large section statement. Can be applied to h2, p, or div as needed. */
  sectionDisplay: {
    ...responsiveType('sectionDisplay'),
    wordSpacing:   wordSpacings.normal,
    fontStyle:     'normal',
    margin:        0,
  } satisfies CSSProperties,

  /** statement — Editorial / About-style large statement. */
  statement: {
    ...responsiveType('statement'),
    wordSpacing:   wordSpacings.normal,
    fontStyle:     'normal',
    margin:        0,
  } satisfies CSSProperties,

  /** projectTitle — Selected-work / case-study titles. */
  projectTitle: {
    ...responsiveType('projectTitle'),
    wordSpacing:   wordSpacings.normal,
    fontStyle:     'normal',
    margin:        0,
  } satisfies CSSProperties,

  /** contactHeading — Contact section title. */
  contactHeading: {
    ...responsiveType('contactHeading'),
    wordSpacing:   wordSpacings.normal,
    fontStyle:     'normal',
    margin:        0,
  } satisfies CSSProperties,

  /** sectionHeading — Medium section heading / callout. */
  sectionHeading: {
    ...responsiveType('sectionHeading'),
    wordSpacing:   wordSpacings.normal,
    margin:        0,
  } satisfies CSSProperties,

  /** featureTitle — Medium subtitle / feature title. */
  featureTitle: {
    ...responsiveType('featureTitle'),
    wordSpacing:   wordSpacings.normal,
    margin:        0,
  } satisfies CSSProperties,

  /** body — Standard body / UI text. Fixed 14px */
  body: {
    ...responsiveType('body'),
    wordSpacing:   wordSpacings.normal,
    margin:        0,
  } satisfies CSSProperties,

  /** bodyMedium — Body weight 500 (nav items, button labels) */
  bodyMedium: {
    ...responsiveType('bodyMedium'),
    wordSpacing:   wordSpacings.normal,
    margin:        0,
  } satisfies CSSProperties,

  /** bodyLarge — Larger supporting body copy. */
  bodyLarge: {
    ...responsiveType('bodyLarge'),
    wordSpacing:   wordSpacings.normal,
    margin:        0,
  } satisfies CSSProperties,

  /** eyebrow — Small section label / overline. */
  eyebrow: {
    ...responsiveType('eyebrow'),
    wordSpacing:   wordSpacings.normal,
    margin:        0,
  } satisfies CSSProperties,

  /** label — Small label / caption. HN 14px */
  label: {
    ...responsiveType('label'),
    wordSpacing:   wordSpacings.normal,
    margin:        0,
  } satisfies CSSProperties,

  /** bodySmall — Small supporting copy. Responsive 14px → 12px */
  bodySmall: {
    ...responsiveType('bodySmall'),
    wordSpacing:   wordSpacings.normal,
    margin:        0,
  } satisfies CSSProperties,

} as const
