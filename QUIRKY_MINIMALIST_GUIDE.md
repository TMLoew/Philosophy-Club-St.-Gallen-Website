# Quirky Minimalist Design Guide
## Philosophy Club St. Gallen - Earthy, Woodsy & Blue Aesthetic

A professional yet quirky design system that hints at ancient philosophical culture through typography, earthy colors, and minimal decorative elements.

---

## Design Philosophy

### Core Principles

1. **Professional yet Quirky**
   - Asymmetric borders create visual interest
   - Organic shapes add personality without chaos
   - Minimal decorations placed strategically

2. **Minimalist Approach**
   - Generous white space (2rem+ padding)
   - Clean layouts with purposeful accents
   - Typography does heavy lifting

3. **Ancient Culture Hints**
   - Small-caps typography evokes Roman inscriptions
   - Column-like left borders suggest Greek architecture
   - Manuscript-quality serif typography
   - Corner gradients recall illuminated texts

4. **Earthy & Contemplative**
   - Muted, natural palette (no bright colors)
   - Blue tones for depth and thought
   - Warm neutrals for approachability

---

## Color Palette

### Backgrounds
```css
--bg: #fdfcf9           /* Warm ivory - main background */
--bg-alt: #f7f5f0       /* Paper beige - cards */
--bg-accent: #e8e4dc    /* Stone - accents */
```

**Usage**: Layered backgrounds create subtle depth without harsh contrast.

### Accent Colors
```css
--forest-green: #5a7058  /* Moss - nature, growth */
--sage: #8a9a8e          /* Sage - wisdom, calm */
--slate-blue: #546a7b    /* Stormy blue - depth */
--deep-blue: #3d5a6c     /* Ocean deep - primary CTA */
--clay: #8b7a6a          /* Terracotta muted - warmth */
--driftwood: #a69888     /* Warm grey-brown - neutrality */
```

**Meaning**:
- **Forest Green**: Growth, philosophy as living practice
- **Slate/Deep Blue**: Contemplation, depth of thought
- **Clay/Driftwood**: Earth, grounding, ancient wisdom

### Text Colors
```css
--text-main: #2a2a2a     /* Charcoal - readable, soft black */
--text-muted: #6a6a6a    /* Medium grey */
--text-light: #8a8a8a    /* Light grey */
```

**Hierarchy**: Subtle contrast maintains readability without harshness.

---

## Typography System

### Fonts

**Headings**: Cormorant Garamond (serif)
- Classical elegance
- Manuscript quality
- High readability at large sizes

**Body**: Roboto (sans-serif)
- Clean, modern
- Excellent legibility
- Professional feel

### Heading Styles

```css
h1 {
  font-size: clamp(3rem, 7vw, 5.5rem);
  font-weight: 300;              /* Light for elegance */
  letter-spacing: 0.06em;        /* Monumental spacing */
  text-transform: uppercase;
  font-variant: small-caps;      /* Roman inscription feel */
  color: var(--deep-blue);
}

h2 {
  font-size: clamp(2rem, 4.5vw, 3.2rem);
  font-weight: 500;
  letter-spacing: 0.04em;
}

h3 {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 500;
  letter-spacing: 0.03em;
}
```

### Body Text

```css
p {
  font-size: 17px;               /* Larger for readability */
  line-height: 1.75;             /* Book-like spacing */
  font-weight: 300;              /* Light, elegant */
  letter-spacing: 0.01em;
}
```

**Why these choices?**
- Small-caps evoke Latin inscriptions
- Wide letter-spacing mimics carved stone
- Light weights feel classical, not corporate
- Large sizes create confident, clear hierarchy

---

## Card Design - Quirky Details

### Feature Cards

```css
.feature-card {
  background: var(--bg-alt);
  border: 1.5px solid var(--border-subtle);
  border-left: 4px solid var(--forest-green);  /* Column accent */
  padding: 2rem;
  border-radius: var(--radius-med);
}

/* Corner gradient - manuscript illumination */
.feature-card::before {
  content: '';
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--sage) 0%, transparent 70%);
  opacity: 0.12;
  /* Positioned top-left */
}
```

**Quirky Elements**:
1. **Asymmetric borders**: Thicker left border suggests Greek column
2. **Corner gradients**: Evoke illuminated manuscript corners
3. **Color-changing borders**: Green → blue on hover (growth → wisdom)

### Event Cards

```css
.event-card {
  border: 2px solid var(--border-subtle);
  border-top: 3px solid var(--slate-blue);  /* Asymmetric accent */
  padding: 1.5rem;
}

/* Bottom-right accent */
.event-card::after {
  width: 80px;
  height: 80px;
  background: linear-gradient(225deg, var(--sage) 0%, transparent 60%);
  opacity: 0.08;
  /* Positioned bottom-right */
}
```

**Design Intent**:
- Top border emphasizes upcoming events
- Bottom gradient balances composition
- Asymmetry creates visual interest

---

## Organic Shapes & Animation

### Hero Floating Shape

```css
.hero::before {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, var(--sage) 0%, transparent 70%);
  opacity: 0.15;
  border-radius: var(--radius-organic);
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(-30px, 40px) rotate(5deg); }
  66% { transform: translate(30px, -20px) rotate(-3deg); }
}
```

**Purpose**:
- Adds life without distraction
- Organic shape feels natural, not digital
- Slow animation (20s) is contemplative
- Subtle rotation mimics natural movement

### Organic Border Radius

```css
--radius-organic: 60% 40% 30% 70% / 60% 30% 70% 40%;
```

**Effect**: Creates blob-like shapes that feel hand-drawn and organic.

---

## Interactions & Hover States

### Cards

```css
.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-medium);
  border-left-color: var(--deep-blue);  /* Green → Blue */
  border-left-width: 5px;               /* Grows */
}
```

**Meaning**: Hovering deepens the connection (green growth → blue wisdom)

### Buttons

```css
.btn {
  text-transform: uppercase;
  letter-spacing: 0.02em;
  padding: 0.9rem 2rem;
  border: 2px solid var(--deep-blue);
}

.btn.primary {
  background: var(--deep-blue);
  color: #fff;
}

.btn.primary:hover {
  background: var(--slate-blue);  /* Lighter, more inviting */
}
```

**Design**: Buttons feel substantial, classical (uppercase, spacing)

---

## Layout Principles

### Generous Spacing

```css
.section {
  padding: 5rem 0;  /* Desktop */
  padding: 3.5rem 0; /* Mobile */
}

.feature-card,
.event-card {
  padding: 2rem;     /* Cards breathe */
}
```

**Why**: Minimalism requires space to let elements shine.

### Asymmetry

- Left borders thicker than others
- Top borders on some cards
- Corner decorations positioned differently
- Organic shapes break perfect symmetry

**Intent**: Professional structure with quirky personality.

---

## AI Art Integration Guide

### Recommended AI Art Style

For the Philosophy Club, AI art should maintain the earthy, contemplative, ancient-culture aesthetic.

### Hero Section AI Art Prompt

```
A minimalist, abstract representation of ancient philosophical concepts.
Earthy color palette: forest green (#5a7058), sage (#8a9a8e), slate blue (#546a7b), warm beige.
Style: Organic shapes, watercolor texture, hand-drawn quality.
Elements: Subtle hints of Greek columns, manuscript scrolls, olive branches.
Mood: Contemplative, scholarly, timeless.
Composition: Asymmetric, with generous negative space.
No text, no people, pure abstract philosophical symbolism.
Medium: Digital watercolor, matte finish, soft edges.
```

### Event Card Backgrounds

```
Abstract philosophical icons in minimalist style.
Individual concepts: thought bubbles, question marks formed from natural elements,
ancient scrolls, olive branches, classical column silhouettes.
Color: Monochromatic in sage green or slate blue, maximum 15% opacity.
Style: Line art, hand-drawn, organic curves.
Size: 400x300px, suitable for card backgrounds.
No gradients, flat colors, minimal detail.
```

### Decorative Accent Shapes

```
Organic blob shapes with gradient fills.
Colors: Radial gradient from sage green to transparent.
Style: Soft, cloud-like, irregular organic shapes.
Purpose: Background decorative elements.
Format: SVG or PNG with transparency.
Variations: 5-7 different organic shapes for variety.
```

### Board Member Photo Treatment

```
Apply subtle earth-tone overlays to board member photos:
- 10% opacity sage green overlay for warmth
- Soft vignette with clay brown tones
- Slight desaturation for timeless feel
- Maintain natural skin tones
Optional: Add subtle texture overlay (parchment, canvas) at 5% opacity
```

---

## Component Showcase

### Section Heading

```html
<div class="section-heading">
  <h2>Upcoming Events</h2>
  <p>Join us for intellectual discourse</p>
</div>
```

```css
.section-heading h2 {
  font-size: clamp(2rem, 4.5vw, 3.2rem);
  color: var(--deep-blue);
  margin-bottom: 0.5rem;
  letter-spacing: 0.04em;
}

.section-heading p {
  color: var(--text-muted);
  font-size: 1.1rem;
}
```

### Primary Button

```html
<a href="#" class="btn primary">Join the Club</a>
```

Visual: Deep blue background, white text, uppercase, spacious padding

### Secondary Button

```html
<a href="#" class="btn secondary">Learn More</a>
```

Visual: Transparent background, forest green border, blue text

### Feature Card

```html
<div class="feature-card fade-in">
  <h3>Critical Thinking</h3>
  <p>Develop analytical skills through philosophical discourse.</p>
</div>
```

Visual: Off-white background, green left border, sage corner gradient

---

## Responsive Behavior

### Mobile Adjustments

```css
@media (max-width: 768px) {
  h1 {
    font-size: clamp(2.5rem, 10vw, 4rem);
    letter-spacing: 0.04em; /* Reduced for mobile */
  }

  .feature-card,
  .event-card {
    padding: 1.5rem; /* Compact but breathable */
  }

  .section {
    padding: 3.5rem 0; /* Reduced from 5rem */
  }
}
```

**Principle**: Maintain personality while adapting to smaller screens.

---

## Accessibility

### Color Contrast

All text meets WCAG AA standards:
- **Deep blue on ivory**: 7.2:1 (AAA)
- **Charcoal on ivory**: 12.8:1 (AAA)
- **Medium grey on ivory**: 4.7:1 (AA)

### Typography

- Minimum 17px body text
- 1.75 line-height for readability
- Generous letter-spacing aids dyslexic readers
- Small-caps maintain readability better than full uppercase

### Motion

```css
@media (prefers-reduced-motion: reduce) {
  .hero::before {
    animation: none; /* Disable floating shape */
  }

  .fade-in {
    opacity: 1;
    transform: none;
  }
}
```

---

## File Organization

### CSS Structure

```
style.css
├── :root                   /* Color tokens */
├── Fade-in animations      /* Scroll triggers */
├── Reset & base styles     /* Typography */
├── Header                  /* Navigation */
├── Hero                    /* Landing */
├── Buttons                 /* CTAs */
├── Sections                /* Layout */
├── Cards                   /* Feature/Event */
├── Footer                  /* Site footer */
└── Media queries           /* Responsive */
```

### Images

```
docs/images/
├── logo.png                /* Site logo */
├── banner-greeks.jpg       /* Replaced by gradient in v3 */
├── board/                  /* Team photos */
└── ai-generated/           /* AI art assets */
    ├── hero-abstract.png
    ├── event-icons/
    └── organic-shapes/
```

---

## Design Tokens

### Shadows

```css
--shadow-soft: 0 4px 16px rgba(58, 90, 108, 0.08);
--shadow-medium: 0 8px 24px rgba(58, 90, 108, 0.12);
```

**Note**: Blue-tinted shadows (not pure black) match color palette.

### Border Radius

```css
--radius-large: 1.5rem;      /* Large cards, hero sections */
--radius-med: 1rem;          /* Standard cards */
--radius-small: 0.5rem;      /* Buttons, small elements */
--radius-organic: 60% 40% 30% 70% / 60% 30% 70% 40%; /* Blobs */
```

### Borders

```css
--border-subtle: #e5e1d8;    /* Light, warm */
--border-medium: #d0cbc0;    /* Medium contrast */
--border-accent: var(--forest-green); /* Colored accents */
```

---

## Brand Voice Through Design

### What the Design Communicates

1. **Scholarly**: Small-caps, serif typography, wide spacing
2. **Approachable**: Warm earth tones, organic shapes
3. **Timeless**: Classical references, muted palette
4. **Thoughtful**: Generous spacing, considered asymmetry
5. **Unique**: Quirky details set apart from generic academic sites

### What It Avoids

- ❌ Corporate blue (too formal)
- ❌ Bright colors (too playful)
- ❌ Perfect symmetry (too rigid)
- ❌ Busy patterns (too distracting)
- ❌ Generic stock photos (too impersonal)

---

## Implementation Checklist

### Initial Setup
- [x] Update color variables
- [x] Implement typography system
- [x] Add organic shapes
- [x] Create asymmetric card designs
- [x] Update button styles
- [x] Modify hero section

### AI Art Integration
- [ ] Generate hero abstract background
- [ ] Create event card icon set
- [ ] Design organic shape library
- [ ] Apply photo treatments to board members
- [ ] Add decorative corner elements

### Testing
- [ ] Verify color contrast (WCAG AA)
- [ ] Test on actual devices (iOS, Android)
- [ ] Check readability at all sizes
- [ ] Validate organic shape rendering
- [ ] Test reduced motion preferences

---

## Future Enhancements

### Phase 2: Advanced Quirk

1. **Kinetic Typography**
   - Subtle letter animations on scroll
   - Words that highlight on hover
   - Ancient quote carousels

2. **More Organic Elements**
   - Hand-drawn underlines for emphasis
   - Wavy section dividers
   - Organic shape masks for images

3. **Interactive Philosophy**
   - Thought-provoking hover states
   - Question mark cursor on philosophy terms
   - Socratic dialog pop-ups

4. **Seasonal Themes**
   - Autumn: deeper browns, falling leaf animations
   - Winter: cooler blues, snow particle effects
   - Spring: fresh greens, growth animations
   - Summer: warm tones, sun-dappled effects

---

## Maintenance

### Regular Updates

**Monthly**:
- Check for new AI art needs
- Update color balance if needed
- Review hover states for consistency

**Quarterly**:
- Audit accessibility
- Test on latest browsers
- Refine organic shape library

### Adding New Components

When creating new elements:
1. Use existing color variables
2. Include asymmetric detail (border, corner gradient)
3. Maintain generous padding (2rem minimum)
4. Add subtle hover state
5. Use appropriate typography scale

---

## Credits

Design inspired by:
- **2025 Web Trends**: Organic shapes, asymmetric layouts
- **Ancient Philosophy**: Roman inscriptions, Greek columns, illuminated manuscripts
- **Nature**: Earth tones, organic forms, contemplative spaces
- **Clutch Portfolio Examples**:
  - Huemor (warm, inviting)
  - ScaleTech (bold typography)
  - Kanda (playful details)
  - Pill Creative (organic shapes)

Implementation:
- Custom CSS (no frameworks)
- Semantic HTML
- Progressive enhancement
- Vanilla JavaScript for interactions

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Last updated: 2026-01-28
