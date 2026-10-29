# Collections Motion & Pinned Horizontal Scroll Architecture

Implement a pinned vertical-freeze viewport and horizontal-only scroll motion for the **Collections** page, complete with inertia physics, 3D card tilt micro-interactions, depth parallax layers, and synchronized radio tuner controls.

## User Review & Critical Decisions

> [!IMPORTANT]
> The user confirmed the following interaction and motion decisions in Phase 1:

- **Confirmed Interaction Behavior**:
  - **Page-Pinned Scroll**: When the user enters the Collections page, vertical window scrolling is absorbed into pure horizontal runway movement (`x: 0 -> -maxTranslate`). The viewport remains vertically stationary until the entire runway is traversed.
  - **Dual Input Methods**: Supports both standard vertical mouse wheel / touch trackpad scroll AND direct click-and-drag mouse dragging across the runway.
- **Confirmed Motion & Visual Enhancements**:
  - **Inertia Momentum**: Smooth spring-based physics using Framer Motion `useSpring` for weighted, luxury fluid motion.
  - **Parallax Depth Layering**: Background lookbook items, floating category accents, and numerical frequency marks shift at different velocity ratios ($\Delta x_1, \Delta x_2$).
  - **3D Card Hover Tilt**: Subtle 3D perspective tilt (`rotateX`, `rotateY`, `scale(1.03)`) on lookbook cards following cursor position.

---

## 1. Overview & Core Concept

- **What It Does**: Transforms the Collections view into a full-bleed, vertically pinned horizontal editorial runway. As the buyer scrolls down or drags across the screen, the entire lookbook glides laterally to reveal editorial outfits (Look 01 through Look 08) and ends at the Kuona Trust Studio 18 contact module.
- **Target Audience**: Fashion connoisseurs, collectors, and streetwear enthusiasts exploring Nairobi Apparel District's high-end art-cycled collections.
- **Key Value**: Provides a high-impact, immersive runway feel mimicking high-fashion physical lookbooks, directly benchmarked against the official site's `qodef-portfolio-horizontal-scroll` architecture.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Page Entry & Anchor**: User navigates to `/collection`. The top header displays editorial breadcrumbs and a rotating SCROLL stamp badge.
  2. **Vertical Wheel / Touch Drag Input**: Scrolling down converts $100\%$ of vertical delta into horizontal rightwards translation (`-x`). Scrolling up translates back leftwards (`+x`).
  3. **Direct Dragging**: Mouse drag or touch swipe allows intuitive manual dragging with elastomeric boundary bounce.
  4. **3D Card Perspective**: Hovering over any lookbook card calculates cursor offset relative to card center, applying subtle 3D rotational tilt and image depth reveal.
  5. **Synchronized Frequency Tuner**: The bottom radio frequency tuner needle (350 MHz – 1050 MHz) smoothly tracks the horizontal position in real-time.

- **Visual Identity & Theme**:
  - **Color Tokens**: Cream background (`#EFEBE3`), Nairobi Red accents (`#C9473B`), dark Studio 18 green (`#1B2215`), and soft hairline borders (`#DCD5C9`).
  - **Typography**: Expressive heavy display headers (`Syne 800` / `font-serif-heavy`) paired with clean geometric body text (`Satoshi`) and monospaced frequency markers (`font-mono`).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Scroll Pinning Strategy (Container Height vs. Direct Event Interception)**
  - *Chosen Approach*: Extended vertical scroll height container (`h-[350vh]`) with a `sticky top-0 h-screen` viewport stage, combined with Framer Motion `useScroll` and `useSpring`.
  - *Why*: Native sticky positioning avoids breaking window scrolling or breaking touch accessibility while guaranteeing zero unwanted vertical page drift during horizontal translation.
  - *Alternatives Considered*: CSS `overflow-x: scroll` only (requires manual horizontal scrolling, lacking vertical scroll integration) or `e.preventDefault()` wheel hijacking (can feel brittle on mobile).

- **Decision 2: 3D Hover Tilt Performance**
  - *Chosen Approach*: Hardware-accelerated Framer Motion CSS transforms (`rotateX`, `rotateY`, `transform-style: preserve-3d`).
  - *Why*: Smooth 60fps rendering without re-triggering layout reflows or DOM recalculations.

---

## 4. Technical Architecture & Data Strategy

### System & Motion Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        COLLECTIONS VIEWPORT                            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ TOP HEADER ZONE (Breadcrumbs + Title + Rotating Stamp)          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ PINNED HORIZONTAL RUNWAY (sticky top-0, overflow-hidden)        │  │
│  │                                                                  │  │
│  │  motion.div [x: springX] (Drag + Vertical Scroll Delta)          │  │
│  │  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐           │  │
│  │  │ Look 01 Card  │ │ Look 02 Card  │ │ Studio 18     │           │  │
│  │  │ [3D Tilt]     │ │ [3D Tilt]     │ │ Slide         │           │  │
│  │  └───────────────┘ └───────────────┘ └───────────────┘           │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ RADIO FREQUENCY TUNER BAR (350 MHz – 1050 MHz Synced Needle)    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Component & State Mapping

- **`src/views/CollectionView.tsx`**:
  - `useScroll({ target: sectionRef, offset: ['start start', 'end end'] })`: Binds vertical scroll position to normalized `scrollYProgress` (0 to 1).
  - `useSpring(rawX, { stiffness: 90, damping: 20 })`: Smoothes scroll motion with realistic inertia momentum.
  - `3D Hover Card Component`: Computes mouse $X, Y$ delta on `onMouseMove`, setting `rotateX` and `rotateY` via CSS variables or motion values.
  - `Radio Tuner Needles`: Derives current frequency integer (`Math.round(350 + progress * 700)`) and updates indicator bar width.
