# Rebranding & Launch Page - Plan

## Phase 1: Name Selection

Present name candidates to the user for selection. Criteria:
- Short (1-2 words, max 10 characters)
- Available as a .com or .dev domain (check but don't buy)
- Communicates fair/adaptive pricing
- Works as a brand and as a GitHub repo name
- Not already taken as an npm package

## Phase 2: Apply Name

Update across the codebase:
- `package.json` name field
- OpenAPI spec title in `src/index.ts`
- Health endpoint version info
- `README.md` header and description
- `docs/index.html` landing page
- `docs/styles.css` if any brand-specific classes
- Test assertions that reference "Fairify"

## Phase 3: Revamp Landing Page

Rebuild `docs/index.html` with launch-quality content:

### Structure
1. **Hero**: New brand name, compelling tagline, CTA button
2. **Problem/Solution**: Why fair pricing matters, what this solves
3. **How It Works**: Visual 3-step flow (same concept, better design)
4. **Use Cases**: Cafe, event ticketing, SaaS pricing — show versatility
5. **Revenue-Neutral**: Expanded explanation with visual metaphor
6. **API Example**: Clean code blocks showing request/response
7. **Get Started**: Steps to begin (create realm → get key → call API)
8. **Footer**: GitHub, docs, license

### Design Improvements
- Better typography hierarchy (larger hero, tighter line heights)
- More whitespace between sections
- Subtle background patterns or gradients for visual interest
- Refined color palette (keep dark theme, adjust accent)
- Better mobile layout (test at 375px and 768px)
