
---

## Design System.md

```markdown
# Design System

## Overview
The UI is built with **Tailwind CSS**, ensuring a consistent, accessible, and responsive design across all screens. The design follows a clean, professional aesthetic suitable for an enterprise KPI management tool.

## Colors

| Purpose        | Tailwind Class | Hex       |
|----------------|----------------|-----------|
| Primary        | `blue-600`     | #2563EB   |
| Primary Dark   | `blue-800`     | #1E40AF   |
| Primary Light  | `blue-100`     | #DBEAFE   |
| Secondary      | `slate-700`    | #334155   |
| Background     | `gray-50`      | #F9FAFB   |
| Surface        | `white`        | #FFFFFF   |
| Success        | `emerald-600`  | #059669   |
| Warning        | `amber-500`    | #F59E0B   |
| Error          | `rose-600`     | #E11D48   |
| Info           | `cyan-500`     | #06B6D4   |
| Text Primary   | `gray-900`     | #111827   |
| Text Secondary | `gray-600`     | #4B5563   |
| Border         | `gray-200`     | #E5E7EB   |

## Typography
- **Font Family**: Inter (sans‑serif) – loaded from Google Fonts.
- **Scale**:
  - `h1`: 2.5rem / 3rem (40px)
  - `h2`: 2rem / 2.5rem (32px)
  - `h3`: 1.5rem / 2rem (24px)
  - `h4`: 1.25rem / 1.75rem (20px)
  - `body`: 1rem / 1.5rem (16px)
  - `small`: 0.875rem / 1.25rem (14px)
  - `xs`: 0.75rem / 1rem (12px)

## Spacing
- Base spacing unit: `4px` (1rem = 16px).
- Common gaps: `2`, `4`, `6`, `8` (0.5rem, 1rem, 1.5rem, 2rem).

## Components

### Buttons
- Primary: solid blue, hover darken, rounded-md, px-4 py-2.
- Secondary: outlined, ghost, danger variants.
- Disabled: opacity-50, pointer-events-none.

### Cards
- White background, rounded-lg, shadow-sm, p-6, border border-gray-200.

### Tables
- Full width, striped rows, hover highlight, sortable headers, responsive overflow-x-auto.

### Forms
- Inputs: border rounded-md, focus ring blue, label above.
- Select: styled dropdown.
- Checkbox/Radio: custom styled with Tailwind.

### Modals
- Centered overlay with backdrop blur, max-w-lg, rounded-lg, shadow-xl.

### Navigation
- **Sidebar** for authenticated users (admin/employee) – collapsible on mobile.
- **Top navbar** with user avatar, logout, and system title.

### Charts (Recharts)
- Bar chart for section performance, line chart for trend, pie for distribution.

## Responsive Breakpoints

| Breakpoint | Tailwind Prefix | Min Width |
|------------|-----------------|-----------|
| Mobile     | `sm`            | 640px     |
| Tablet     | `md`            | 768px     |
| Desktop    | `lg`            | 1024px    |
| Wide       | `xl`            | 1280px    |

- Layout adapts: sidebar hidden on mobile (hamburger menu), tables horizontally scrollable, cards stack vertically.

## Accessibility
- All interactive elements have focus states.
- ARIA labels on icons.
- Color contrast ratio meets WCAG AA.
- Keyboard navigation fully supported.

## Icons
- **Heroicons** (outline and solid) – used extensively.

## Loading States
- Skeleton placeholders for tables and cards.
- Spinner (SVG) for buttons during async operations.

## Notifications
- Toast messages (success/error/warning/info) appear at top‑right, auto‑dismiss after 5 seconds.

## Dark Mode (Optional)
- Prepared with Tailwind dark: variants; can be toggled via context if required in future.