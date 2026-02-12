# Rebranding & Launch Page - Tasks

## T-001: Name Selection
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01 | **Status**: [x] completed
**Test**: Given name candidates → When user selects one → Then proceed with that name

- Research and present 5-8 name candidates with rationale
- Check domain availability (.com, .dev, .io)
- Check npm package name availability
- User selects final name

## T-002: Apply Name Across Codebase
**User Story**: US-001, US-003 | **Satisfies ACs**: AC-US1-02, AC-US1-03, AC-US1-04, AC-US3-01, AC-US3-02, AC-US3-03 | **Status**: [x] completed
**Test**: Given new name → When applied → Then all references updated and tests pass

- Update package.json name
- Update OpenAPI spec title in src/index.ts
- Update health endpoint response
- Update README.md
- Update Swagger UI page title
- Update error handler if it references old name
- Update all test assertions
- Verify all tests pass

## T-003: Revamp Landing Page
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04, AC-US2-05, AC-US2-06 | **Status**: [x] completed
**Test**: Given new landing page → When viewed on mobile and desktop → Then professional appearance with all sections

- Rewrite docs/index.html with new brand and launch-quality content
- Add use cases section (cafes, events, SaaS)
- Add positioning section (free, API-first, developer-friendly)
- Improve visual design (typography, spacing, gradients)
- Update docs/styles.css with refined design
- Test responsive layout at 375px and 768px
- Update favicon with new brand
