# Tasks — 0007 PPP Pricing

### T-001: Create PPP factors config
**User Story**: US-001 | **Satisfies ACs**: AC-US1-05 | **Status**: [x] completed
**Test**: Given a valid country code → When getPppFactor is called → Then the correct factor is returned

### T-002: Create PPP service
**User Story**: US-001 | **Satisfies ACs**: AC-US1-02, AC-US1-04 | **Status**: [x] completed
**Test**: Given income and country code → When convertToPppIncome is called → Then income × factor is returned; Given unknown code → Then NotFoundError is thrown

### T-003: Update pricing service
**User Story**: US-001 | **Satisfies ACs**: AC-US1-02, AC-US1-03 | **Status**: [x] completed
**Test**: Given base price, income, country → When calculateFairPrice is called → Then pppIncome is used for bracket lookup and included in breakdown

### T-004: Update calculate route
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-03 | **Status**: [x] completed
**Test**: Given POST with countryCode → When /calculate is called → Then response includes pppAdjustedIncome, no locationFactor

### T-005: Update tests
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01 through AC-US1-05 | **Status**: [x] completed
**Test**: All 35 tests pass with updated payloads and assertions

### T-006: Remove location infrastructure
**User Story**: US-001 | **Satisfies ACs**: AC-US1-06 | **Status**: [x] completed
**Test**: Given schema without locations → When db:generate runs → Then DROP TABLE migration is created
