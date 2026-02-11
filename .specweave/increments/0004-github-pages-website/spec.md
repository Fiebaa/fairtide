# GitHub Pages Landing Page - Specification

## Overview

Create a clean, modern landing page for Fairify hosted on GitHub Pages. The site explains what Fairify does, how the revenue-neutral pricing algorithm works, and how businesses can get started. Built with plain HTML/CSS — no build step, no JavaScript framework.

## User Stories

### US-001: Visitor Understands the Product

**As a** potential business customer visiting the site,
**I want to** quickly understand what Fairify does and why it matters,
**So that** I can decide if it's relevant for my business.

**Acceptance Criteria:**

- [x] AC-US1-01: Hero section with clear tagline explaining fair pricing
- [x] AC-US1-02: "How it works" section explaining the 3-step flow (set base price, customer provides income, API returns fair price)
- [x] AC-US1-03: Revenue-neutral explanation — business owners don't lose money
- [x] AC-US1-04: Page loads in under 2 seconds on mobile (no JS framework overhead)

### US-002: Visitor Sees the API in Action

**As a** developer evaluating Fairify,
**I want to** see example API requests and responses,
**So that** I understand the integration effort.

**Acceptance Criteria:**

- [x] AC-US2-01: Code example section showing a POST /v1/calculate request and response
- [x] AC-US2-02: Code examples use syntax highlighting (CSS-only or minimal inline styles)
- [x] AC-US2-03: Link to live Swagger docs (/v1/docs) for full API reference

### US-003: Site is Deployed on GitHub Pages

**As the** Fairify maintainer,
**I want** the site deployed automatically via GitHub Pages,
**So that** it's always up-to-date with the main branch.

**Acceptance Criteria:**

- [x] AC-US3-01: Site files live in a `docs/` folder in the repo root
- [x] AC-US3-02: GitHub Pages configured to serve from `docs/` on main branch
- [x] AC-US3-03: Site is responsive (works on mobile and desktop)
- [x] AC-US3-04: Site has proper meta tags (title, description, Open Graph)

## Out of Scope

- JavaScript interactivity (keep it static)
- Blog / changelog section (future increment)
- Custom domain setup (future — use default github.io URL for now)
- Contact form or signup flow
- Analytics / tracking scripts

## Technical Constraints

- Plain HTML + CSS only, no build step
- Files in `docs/` folder (GitHub Pages convention)
- Must not interfere with the API source code in `src/`
- Responsive design using CSS Grid/Flexbox (no CSS framework)
