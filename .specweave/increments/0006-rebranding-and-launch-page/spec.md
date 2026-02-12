# Rebranding & Launch Page - Specification

## Overview

Rename the project from "Fairify" to a new brand name and completely revamp the landing page for public launch. The new name should be memorable, communicate the value proposition clearly, and work as both a product name and a domain. The landing page should be polished enough to share publicly.

## User Stories

### US-001: New Brand Name

**As the** founder preparing for launch,
**I want** a new product name that's memorable and communicates what the API does,
**So that** potential customers immediately understand the value proposition.

**Acceptance Criteria:**

- [x] AC-US1-01: New name selected and approved by the user
- [x] AC-US1-02: Name applied to package.json, OpenAPI spec title, README, and landing page
- [x] AC-US1-03: API health endpoint returns the new name in the version/title field
- [x] AC-US1-04: All tests updated to reflect the new name

### US-002: Polished Landing Page

**As a** potential business customer visiting the site,
**I want** a professional, polished landing page,
**So that** I trust this is a real product worth integrating.

**Acceptance Criteria:**

- [x] AC-US2-01: Hero section with compelling headline and clear value proposition
- [x] AC-US2-02: Social proof section (use cases, target industries — cafes, events, SaaS)
- [x] AC-US2-03: Pricing/positioning section (free tier, API-first, developer-friendly)
- [x] AC-US2-04: Professional visual design (typography, spacing, color refinement)
- [x] AC-US2-05: Mobile-optimized responsive layout
- [x] AC-US2-06: Call-to-action that makes sense for launch (e.g., "Get your API key", link to docs)

### US-003: Consistent Branding Across Codebase

**As a** developer exploring the GitHub repo,
**I want** consistent branding throughout,
**So that** the project looks professional and maintained.

**Acceptance Criteria:**

- [x] AC-US3-01: README.md updated with new name, description, and branding
- [x] AC-US3-02: Swagger UI page title reflects the new brand
- [x] AC-US3-03: Error responses use the new brand name where applicable

## Out of Scope

- Custom domain purchase/setup (do after launch)
- Logo design (text-based brand name is sufficient for now)
- Blog or content marketing
- SEO optimization beyond basic meta tags
- Analytics or tracking

## Technical Constraints

- Keep plain HTML/CSS for the landing page (no build step)
- Name changes must not break existing API contracts (paths stay /v1/...)
- All tests must pass after renaming
