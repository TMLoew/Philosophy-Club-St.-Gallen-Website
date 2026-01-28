# Floating Design System

A premium, animated design system inspired by luxury web experiences that creates a sense of depth, elegance, and guided narrative.

## Design Philosophy

The floating aesthetic is built on four core principles inspired by reference sites like Omaya Yachts, IWC Global, Meridian, Joe Garner Design, and Brant Paints:

### 1. **One-Liner Clarity**
Users immediately understand what the Philosophy Club is about through clear, prominent typography and focused messaging.

### 2. **Guided Narrative**
The site doesn't just present pages—it stages an experience through scroll-triggered animations, progressive revelation, and visual hierarchy.

### 3. **Trust Through Specifics**
Concrete details about events, board members, and club activities build credibility. Real photos, specific dates, and tangible actions create authenticity.

### 4. **Conversion Always Available**
CTAs are prominent and accessible throughout the journey with enhanced hover states and visual prominence.

---

## Visual Components

### Floating Cards

All card elements appear to float above the page with elevation shadows and smooth hover animations.

**Implementation:**
```css
.feature-card, .event-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
}

.feature-card:hover, .event-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.06);
}
```

**Characteristics:**
- **Resting shadow**: Subtle 2-layer shadow for depth
- **Hover lift**: 6-8px vertical translation
- **Enhanced shadow**: Stronger shadow on hover for elevation
- **Smooth easing**: Cubic-bezier(0.4, 0, 0.2, 1) for natural motion

**Where used:**
- Feature cards ([docs/css/style.css](docs/css/style.css:306))
- Event cards ([docs/css/style.css](docs/css/style.css:706))
- Board member cards ([docs/css/style.css](docs/css/style.css:438))

---

### Glass-morphism Effects

Frosted glass effects with backdrop blur create modern, layered interfaces.

**Implementation:**
```css
.site-header {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(229, 231, 235, 0.8);
}
```

**Characteristics:**
- **Semi-transparent background**: 92% opacity
- **Backdrop blur**: 12px blur for frosted effect
- **Border transparency**: 80% opacity for subtle separation
- **Dynamic enhancement**: Additional shadow when scrolled

**Where used:**
- Site header ([docs/css/style.css](docs/css/style.css:158))
- Hero section overlay ([docs/css/style.css](docs/css/style.css:282))

---

### Scroll-Triggered Animations

Elements fade in and slide up as they enter the viewport, creating a guided narrative flow.

**Implementation:**
```javascript
// Intersection Observer for fade-in animations
const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-visible');
      fadeInObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});
```

```css
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-in-visible {
  opacity: 1;
  transform: translateY(0);
}
```

**Characteristics:**
- **Initial state**: Invisible and 30px below final position
- **Trigger point**: 10% of element visible
- **Animation duration**: 800ms for smooth reveal
- **Staggered timing**: Grid items animate sequentially (100-320ms delays)

**Stagger delays:**
- Feature cards: 100ms increments
- Event cards: 80ms increments
- Creates cascading reveal effect

**Where used:**
- All `.feature-card`, `.event-card`, `.board-card` elements
- Section headings ([docs/js/site.js](docs/js/site.js:495))

---

### Enhanced Typography

Large, scalable headings with optimal spacing create clear hierarchy and reading flow.

**Implementation:**
```css
h1 {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  line-height: 1.2;
  letter-spacing: -0.02em;
  font-weight: 600;
}

h2 {
  font-size: clamp(2rem, 4vw, 2.8rem);
  line-height: 1.25;
}

h3 {
  font-size: clamp(1.4rem, 3vw, 1.8rem);
}
```

**Characteristics:**
- **Fluid scaling**: clamp() for responsive sizing
- **Tight line-height**: 1.2-1.3 for impact
- **Negative letter-spacing**: -0.02em on h1 for luxury feel
- **Consistent weight**: 600 across all headings

**Font stack:**
- Headings: "Cormorant Garamond" (serif) for elegance
- Body: "Roboto" (sans-serif) for readability

---

### Micro-interactions

Subtle hover and active states provide tactile feedback for all interactive elements.

**Buttons:**
```css
.btn {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}
```

**Board member cards:**
```css
.board-card:hover {
  transform: translateY(-6px);
}

.board-card:hover .board-photo {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}
```

**Characteristics:**
- **Subtle movement**: 2-6px vertical translation
- **Shadow enhancement**: Stronger shadows on hover
- **Active feedback**: Returns to resting state when pressed
- **Smooth transitions**: 300-400ms duration

---

## Animation Curves

All animations use carefully selected easing functions for natural, premium motion.

### Primary Curve: `cubic-bezier(0.4, 0, 0.2, 1)`

This is the Material Design "standard" curve, providing smooth acceleration and deceleration.

**Usage:**
- Card hover effects
- Scroll animations
- Fade-in transitions
- Header state changes

**Characteristics:**
- Starts slowly (eases in)
- Ends slowly (eases out)
- Natural, organic feel
- 300-800ms duration

### Why This Curve?

Reference sites use similar curves to create:
1. **Premium feel**: Luxury brands avoid abrupt motion
2. **Natural physics**: Mimics real-world object movement
3. **Attention focus**: Smooth motion is less jarring
4. **Brand consistency**: Same curve across all interactions

---

## Depth & Layering

Multiple shadow layers create realistic depth perception.

### Shadow System

**Level 1: Resting**
```css
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06);
```
- Two-layer shadow
- Subtle presence
- 4-6% opacity

**Level 2: Hover**
```css
box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.06);
```
- Increased elevation
- Stronger shadows
- 6-8% opacity

**Level 3: Deep (Board photos)**
```css
box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
```
- Maximum elevation
- Pronounced depth
- 10-15% opacity

### Z-Index Hierarchy

```
100 - Header scroll shadow
 50 - Site header (sticky)
  1 - Hero content overlay
  0 - Base layer
```

---

## Performance Optimizations

### Intersection Observer

Instead of scroll event listeners, we use Intersection Observer for better performance:

```javascript
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-visible');
      fadeInObserver.unobserve(entry.target); // Unobserve after animation
    }
  });
}, observerOptions);
```

**Benefits:**
- Native browser API (no polyfill needed)
- Better performance than scroll listeners
- Automatic cleanup (unobserve)
- Works with lazy loading

### GPU Acceleration

Transform and opacity animations use GPU acceleration:

```css
/* GPU-accelerated properties */
transform: translateY(-8px);
opacity: 1;

/* Avoid these (trigger layout reflow) */
/* top: -8px; */
/* margin-top: -8px; */
```

**Why:**
- `transform` and `opacity` are composited properties
- Run on GPU, not main thread
- Smooth 60fps animations
- No layout recalculation

### Passive Scroll Listeners

```javascript
window.addEventListener('scroll', () => {
  // Scroll handler
}, { passive: true });
```

**Benefits:**
- Tells browser we won't call `preventDefault()`
- Improves scroll performance
- Reduces jank on mobile

---

## Accessibility

### Reduced Motion Support

All animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }

  .fade-in {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

**Effect:**
- Users with motion sensitivity see instant transitions
- No fade-ins or floating effects
- Content remains fully accessible
- Meets WCAG 2.1 Level AA

### Focus States

All interactive elements have visible focus states for keyboard navigation:

```css
button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

---

## Responsive Behavior

### Breakpoints

```css
/* Desktop: Full floating effects */
/* 1024px+ */

/* Tablet: Reduced padding, same effects */
@media (max-width: 1024px) {
  .section { padding: 4rem 0; }
}

/* Mobile: Compact spacing, full effects maintained */
@media (max-width: 768px) {
  .section { padding: 3.5rem 0; }
}

/* Small mobile: Further reduced spacing */
@media (max-width: 640px) {
  .hero { min-height: 50vh; }
}
```

### Fluid Typography

All headings scale fluidly using `clamp()`:

```css
h1 { font-size: clamp(2.5rem, 5vw, 3.5rem); }
/*              min      pref   max */
```

**Benefits:**
- Smooth scaling across all screen sizes
- No abrupt changes at breakpoints
- Optimal readability at any viewport
- Single declaration (no media queries needed)

---

## Browser Support

### Core Features

| Feature | Support | Fallback |
|---------|---------|----------|
| `backdrop-filter` | 94% | Solid background |
| `clamp()` | 92% | Fixed font-size |
| Intersection Observer | 96% | No animations |
| `transform` | 99%+ | No hover effects |
| CSS Grid | 96%+ | Flexbox fallback |

### Progressive Enhancement

The site works perfectly without modern features:

**Without backdrop-filter:**
- Header uses solid white background
- Still functional, slightly less premium

**Without Intersection Observer:**
- Cards appear immediately
- No fade-in animations
- Content fully accessible

**Without CSS Grid:**
- Fallback to flexbox layouts
- Same visual result

---

## Design Tokens

### Colors

```css
--accent: #0b2f5e;          /* Deep navy - primary brand */
--accent-soft: #f3f4f6;     /* Light grey - backgrounds */
--text-main: #12284a;       /* Dark blue - headings */
--text-muted: #2b3a4f;      /* Medium blue - body text */
--border-subtle: #d6dbe4;   /* Light border */
```

### Shadows

```css
--shadow-soft: 0 10px 24px rgba(0, 0, 0, 0.08);
--shadow-card-rest: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06);
--shadow-card-hover: 0 12px 24px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.06);
--shadow-photo-hover: 0 12px 32px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
```

### Border Radius

```css
--radius-large: 1.5rem;     /* 24px - hero sections */
--radius-med: 1rem;         /* 16px - cards */
--radius-small: 0.5rem;     /* 8px - buttons */
```

### Spacing Scale

```css
/* Section padding */
5rem    /* Desktop sections */
3.5rem  /* Mobile sections */

/* Card gaps */
1.7rem  /* Feature grid */
1.5rem  /* Event grid */
0.75rem /* Mobile board grid */
```

---

## Implementation Guide

### Adding New Floating Cards

1. **HTML Structure:**
```html
<div class="my-card fade-in">
  <h3>Card Title</h3>
  <p>Card content...</p>
</div>
```

2. **CSS Styles:**
```css
.my-card {
  background: #fff;
  border-radius: var(--radius-med);
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
}

.my-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.06);
}
```

3. **JavaScript (Optional):**
```javascript
// Add to fade-in observer
const fadeElements = document.querySelectorAll('.my-card');
fadeElements.forEach(el => {
  el.classList.add('fade-in');
  fadeInObserver.observe(el);
});
```

### Customizing Animation Timing

**Faster animations (snappier feel):**
```css
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
```

**Slower animations (more dramatic):**
```css
transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
```

**Different easing:**
```css
/* Bounce */
transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Ease-out (fast start, slow end) */
transition: all 0.4s cubic-bezier(0, 0, 0.2, 1);

/* Ease-in (slow start, fast end) */
transition: all 0.4s cubic-bezier(0.4, 0, 1, 1);
```

---

## Inspiration Breakdown

### Omaya Yachts Influence
- **Luxury depth**: Multi-layer shadows
- **Premium spacing**: Generous whitespace
- **Subtle animations**: Nothing jarring

### IWC Global Influence
- **Precision timing**: 300-400ms durations
- **Glass effects**: Backdrop blur
- **Typography hierarchy**: Large, clear headings

### Meridian Influence
- **Floating cards**: Elevation on hover
- **Clean layouts**: Grid-based structure
- **Smooth scrolling**: Guided narrative

### Joe Garner Design Influence
- **Scroll triggers**: Progressive revelation
- **Staggered animations**: Cascading effects
- **Attention to detail**: Micro-interactions

### Brant Paints Influence
- **Glass-morphism**: Frosted effects
- **Modern aesthetic**: Contemporary feel
- **Color confidence**: Bold use of brand colors

---

## Testing Checklist

### Visual Testing

- [ ] Cards float smoothly on hover
- [ ] Shadows appear correctly (multi-layer)
- [ ] Fade-in animations trigger at 10% visibility
- [ ] Staggered delays create cascade effect
- [ ] Header becomes glass-morphic
- [ ] Header gains shadow on scroll
- [ ] Typography scales smoothly across viewports
- [ ] All transitions use correct easing curve

### Performance Testing

- [ ] Animations run at 60fps
- [ ] No layout shifts during animations
- [ ] Intersection Observer fires correctly
- [ ] Scroll performance is smooth
- [ ] No memory leaks (observers unregister)

### Accessibility Testing

- [ ] Reduced motion disables all animations
- [ ] Focus states are visible
- [ ] Keyboard navigation works
- [ ] Content accessible without animations
- [ ] Screen readers work correctly

### Browser Testing

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS and iOS)
- [ ] Samsung Internet
- [ ] Fallbacks work without modern features

---

## Maintenance

### Common Adjustments

**Increase hover lift:**
```css
.card:hover {
  transform: translateY(-12px); /* Was -8px */
}
```

**Adjust animation speed:**
```css
transition: all 0.3s ...; /* Was 0.4s */
```

**Change shadow intensity:**
```css
box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12); /* Was 0.08 */
```

**Modify stagger timing:**
```css
.card:nth-child(2) { transition-delay: 150ms; } /* Was 100ms */
```

---

## Future Enhancements

### Potential Additions

1. **Parallax scrolling**: Different scroll speeds for layers
2. **Magnetic cursor**: Elements attract cursor on hover
3. **Scroll-linked animations**: Progress-based transitions
4. **3D transforms**: Tilt effects on hover
5. **Lottie animations**: Micro-animations for icons
6. **Page transitions**: Smooth navigation between pages
7. **Cursor trails**: Premium cursor effects
8. **Video backgrounds**: Subtle motion in hero

### Advanced Techniques

```css
/* 3D hover tilt */
.card {
  transform-style: preserve-3d;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: rotateX(5deg) rotateY(-5deg) translateY(-8px);
}
```

---

## Resources

- [Cubic Bezier Generator](https://cubic-bezier.com)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Can I Use - backdrop-filter](https://caniuse.com/css-backdrop-filter)
- [Web Animations Performance Guide](https://web.dev/animations-guide/)
- [Material Design Motion](https://m3.material.io/styles/motion/overview)

---

## Credits

Design system inspired by:
- [Omaya Yachts](https://www.omaya-yachts.com/)
- [IWC Global](https://www.iwcglobal.net/)
- [Meridian](https://trymeridian.com/)
- [Joe Garner Design](https://www.joegarnerdesign.com/)
- [Brant Paints](https://brant-paints.webflow.io/)

Implementation techniques:
- Intersection Observer for scroll triggers
- CSS transforms for GPU acceleration
- Cubic-bezier easing for premium motion
- Glass-morphism with backdrop-filter
- Progressive enhancement for accessibility

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Last updated: 2026-01-28
