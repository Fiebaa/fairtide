---
total_tasks: 6
completed_tasks: 6
---

# Tasks

### T-001: Add countryCode to realms schema
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01 | **Status**: [x] completed
**Test**: Given schema.ts → When countryCode column added → Then realm type includes countryCode

### T-002: Update realm creation and retrieval
**User Story**: US-001 | **Satisfies ACs**: AC-US1-02, AC-US1-03, AC-US1-04 | **Status**: [x] completed
**Test**: Given POST /v1/realms with countryCode → When valid → Then realm created with countryCode; When invalid → Then 404

### T-003: Implement relative PPP formula
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-02, AC-US2-04 | **Status**: [x] completed
**Test**: Given buyer HR at seller DE → When calculate → Then pppIncome = income × (0.95/1.25); Given same country → Then ratio = 1.0

### T-004: Add PPP factors to response breakdown
**User Story**: US-002 | **Satisfies ACs**: AC-US2-03 | **Status**: [x] completed
**Test**: Given calculate request → When response → Then breakdown includes buyerPppFactor and sellerPppFactor

### T-005: Add zero-guard for PPP factor
**User Story**: US-002 | **Satisfies ACs**: AC-US2-05 | **Status**: [x] completed
**Test**: Given buyerFactor = 0 → When convertToPppIncome → Then throws error

### T-006: Add edge case tests for extreme PPP ratios
**User Story**: US-002 | **Satisfies ACs**: AC-US2-06 | **Status**: [x] completed
**Test**: Given CH buyer at IN seller → When calculate → Then valid finite result; Given invalid seller country → Then throws
