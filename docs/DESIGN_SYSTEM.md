# IPMC Design System

## Why these specific choices

IPMC's actual business is measurement \u2014 project monitoring, QA/QC
inspection, audits, ESG ratings. A generic corporate-blue template says
nothing true about that. Every choice below is drawn from the literal
tools of inspection work, not decoration layered on top.

## Palette

| Token | Hex | Use |
|---|---|---|
| Ink (`primary-950`) | `#0B1830` | Primary dark \u2014 headers, footer, hero |
| Signal (`primary-500`) | `#2451C4` | Primary action \u2014 buttons, links |
| Brass (`accent-500`) | `#C8862B` | Warm accent \u2014 CTAs, stamp mark, highlights |
| Verified (`verified-500`) | `#15803D` | Compliance/certified marks **only** \u2014 never a general accent |
| Mist (`light`) | `#F4F6F9` | Cool paper background \u2014 deliberately not the warm cream+terracotta combination that reads as a generic AI-generated default |
| Graphite | `#4B5565` | Secondary text |

Full 50\u2013950 scales are in `client/tailwind.config.cjs` under `theme.extend.colors`.

## Type

- **Fraunces** (`font-display`) \u2014 an engraved editorial serif, headlines only
- **IBM Plex Sans** (`font-sans`) \u2014 body copy and UI labels; an
  engineering-house grotesk, not a generic startup sans
- **IBM Plex Mono** (`font-mono`) \u2014 every stat, metric, and data figure on
  the site. This is the load-bearing signature choice: a number in mono
  reads as measured, not marketing copy. Applied via the `.stat-figure`
  utility class in `globals.css`.

## Signature elements

- **The Tick-Rule** (`.tick-rule` / `.tick-rule--dark` in `globals.css`) \u2014
  a section divider made of small measurement ticks instead of a plain
  hairline, drawn from an actual measuring instrument. Currently applied
  at the hero/content boundary and the footer top edge.
- **The Stamp Mark** (`.stamp-mark` in `globals.css`) \u2014 a circular dashed
  verification seal, reserved for places the site asserts a real
  certification, tenure claim, or audit result \u2014 never decorative.

## Where this is and isn't applied yet

Applied (via the Tailwind token remap, so it's live everywhere `primary-*`/
`accent-*` classes are used): navbar, footer, hero, stats section, buttons,
cards, forms, all existing component color references.

Not yet done: individual page layout redesigns (hero imagery direction,
illustration style, dark-mode component variants). The foundations are
wired in as tokens; rebuilding each page's specific layout around them is
a separate follow-up task \u2014 see `docs/IMPROVEMENTS.md`.

## Reference build

An interactive component library demonstrating every token/state
(buttons, forms, cards, nav, toasts, the Tick-Rule and Stamp Mark side by
side) was delivered separately as `IPMC-Design-System.jsx` during this
engagement \u2014 open it directly to see live, interactive examples of
everything described above.
