# Detailed Design Document

## Project

**RISHAV RAJ | SOFTWARE DEVELOPER**

A one-page personal portfolio website with a monochrome retro-arcade visual language. The experience starts behind an arcade boot screen, then reveals a full portfolio with a WebGL grid background, CRT scanlines, terminal-inspired content, staged portfolio sections, and a collapsible command terminal.

---

## Product Overview

### Purpose

The page presents Rishav Raj as a software developer focused on AI, backend systems, and full-stack applications. It highlights biography, education, experience, projects, technical skills, certificates, and contact routes while keeping the interaction model playful and terminal-native.

### Source Content

The portfolio content is aligned with `assets/Rishav's Resume.pdf`.

Key resume-aligned details:

- Name: Rishav Raj
- Website: `rishavraj.net`
- Email: `rishav08092005@gmail.com`
- GitHub: `github.com/Rishav-bot895`
- LinkedIn: `linkedin.com/in/rishav-raj`
- Education: B.Tech in Computer Science & Communication Engineering, KIIT, 2023-Present
- CGPA: 9.30/10.00
- Current experience: SWE Intern, Starvox Labs Private Ltd., March 2026-June 2026

---

## Information Architecture

### Entry Flow

Before the portfolio is shown, users see a full-screen arcade boot overlay:

```text
Rishav Raj OS
> INSERT COIN TO START
[ PRESS ENTER ]
```

The overlay can be dismissed by clicking `INSERT COIN` or pressing `Enter`. During dismissal, the button text changes:

```text
INSERT COIN -> BOOTING... -> PLAYER 1 READY
```

A small generated coin sound and coin animation run unless reduced-motion preferences apply.

### Page Sections

1. **Hero / Start** (`#hero`)
   - Player-ready status
   - Name
   - Software developer role
   - Project/contact/resume actions

2. **Bio** (`#about`)
   - Terminal-style biography card
   - Current education and build style summary

3. **Stages** (`#education`, then `#experience`, then `#projects`)
   - Stage 1: Knowledge Base
   - Stage 2: Career Mode
   - Stage 3: Cabinets
   - The top navigation `STAGES` link targets `#education`, so it starts at Stage 1.

4. **Inventory** (`#skills`)
   - Tech Stack
   - Badges: Certificates
   - Certificates are part of Inventory, not a separate top-level navigation item.

5. **Contact** (`#contact`)
   - Contact cards for email, LinkedIn, GitHub, and location
   - Contact remains accessible through hero actions, terminal commands, and page scroll, but not as a top navigation CTA.

6. **Footer**
   - Terminal-style copyright text only
   - No GitHub, LinkedIn, or Terminal links in the footer.

### Top Navigation

The fixed top bar contains only:

| Label | Target | Purpose |
|---|---|---|
| START | `#hero` | Return to hero |
| BIO | `#about` | Open biography |
| STAGES | `#education` | Start staged content at Stage 1 |
| INVENTORY | `#skills` | Open tech stack and certificates |

Removed from top navigation:

- `CABINETS`, because projects are Stage 3 inside the staged flow.
- `INSERT COIN`, because it duplicated contact navigation and conflicted with the start overlay metaphor.

---

## Visual Design System

### Palette

The site uses a strict black-and-white arcade/terminal palette:

| Token | Hex | Usage |
|---|---:|---|
| `background` | `#000000` | Page, overlays, canvas backdrop |
| `primary` | `#ffffff` | Text, borders, buttons, grid lines |
| `on-background` | `#e2e2e2` | Secondary text |
| `surface` | `#121414` | Cards and terminal surfaces |
| `surface-container` | `#1e2020` | Elevated surfaces |
| `surface-container-high` | `#282a2b` | High-emphasis dark surfaces |
| `surface-variant` | `#333535` | Secondary borders |
| `outline` | `#8e9192` | Tags and muted outlines |

The design avoids saturated accents. Visual personality comes from typography, borders, scanlines, grid motion, and command-line copy.

### Typography

- Display headings: `Space Grotesk`
- Body, labels, terminal input: `JetBrains Mono`
- Headings and controls use uppercase copy.
- Large headings use responsive clamp sizing and avoid viewport-width-only font scaling.

### Border And Shape

- Core cards, buttons, nav, terminal, modal: 2px white borders.
- Border radius remains small, generally 8px or less.
- Project cards use arcade cabinet labels.

---

## Interaction Design

### Insert Coin Start Screen

The site starts locked behind the overlay. The page content is hidden and non-interactive until `body.game-started` is applied.

Keyboard behavior:

- `Enter` starts the game when the overlay is visible.
- `Escape` closes open menus or the resume modal.

### Command Terminal

A fake command terminal sits fixed at the bottom-right of the viewport. It is collapsed by default into a small terminal logo button:

```text
>_
```

Clicking the button expands the translucent terminal panel. Clicking it again collapses the panel back to the logo. The panel uses a semi-transparent black background and blur so it does not fully block content.

Available commands:

| Command | Behavior |
|---|---|
| `help` | Lists available commands |
| `bio` | Scrolls to `#about` |
| `stages` | Scrolls to `#education` |
| `skills` | Scrolls to `#skills` |
| `badges` | Scrolls to `#skills` |
| `projects` | Scrolls to `#projects` |
| `experience` | Scrolls to `#experience` |
| `contact` | Scrolls to `#contact` |
| `resume` | Opens the resume modal |

Example responses:

```text
> bio
Opening player_bio.exe...

> projects
Loading project cabinets...

> contact
Opening transmission channel...
```

### Motion

Motion includes:

- Coin drop animation on boot
- WebGL grid crawl
- Scroll reveal animations
- Blinking terminal prompt

When `prefers-reduced-motion: reduce` is active, non-essential animation duration is minimized and the shader renders once instead of looping.

---

## Content Model

### Stages

`STAGES` is a navigation concept, not a single experience-only section.

- Stage 1: Knowledge Base
- Stage 2: Career Mode
- Stage 3: Cabinets

Because `CABINETS` is part of Stages, it is not shown as a top-level nav item.

### Inventory

Inventory is divided into two subsections:

1. **Tech Stack**
   - Languages
   - Frameworks & Tools

2. **Badges: Certificates**
   - Meta Front-End Developer Specialization
   - IBM Machine Learning Specialization
   - AWS Academy Cloud Foundation
   - AI/ML with Projects Using Python (KIIT)

### Footer

Footer content is intentionally minimal:

```text
© 2026 RISHAV_RAJ TERMINAL_OS. ALL RIGHTS RESERVED.
```

Footer social links are removed.

---

## Assets

### Logo And Favicon

The navigation logo and browser favicon both use the same black-and-white logo asset:

```text
assets/favicon-bw.png
```

This file is generated from the original `assets/favicon.png` and converted to a high-contrast monochrome treatment so the favicon matches the top-left nav identity.

### Resume

The resume modal loads:

```text
assets/Rishav's Resume.pdf
```

---

## QA Checklist

- [ ] Start overlay appears before portfolio content.
- [ ] Clicking `INSERT COIN` reveals the site.
- [ ] Pressing `Enter` reveals the site.
- [ ] `STAGES` top-nav link scrolls to `STAGE 1: KNOWLEDGE BASE`.
- [ ] Top nav contains only `START`, `BIO`, `STAGES`, and `INVENTORY`.
- [ ] `CABINETS` remains visible as Stage 3 content but not as a top-nav item.
- [ ] Inventory contains both Tech Stack and Badges.
- [ ] Footer has no social links.
- [ ] Command terminal is collapsed by default.
- [ ] Terminal toggle expands and collapses the translucent terminal.
- [ ] Terminal commands scroll to the correct sections.
- [ ] `resume` terminal command opens the resume modal.
- [ ] Favicon and nav logo both use `assets/favicon-bw.png`.
- [ ] Reduced-motion users are not forced through continuous animation.
