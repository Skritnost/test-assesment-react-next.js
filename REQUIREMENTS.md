# Test Assignment: Frontend Developer (React + Next.js)

## Format & Goal

A short test assignment estimated at 2–3 hours.
Evaluates engineering thinking in a critical UI flow: resilience, security, and architectural clarity.

## Context

Implement a **Withdraw** page that interacts with a withdrawal API.

---

## Core (Required, 2–3 hours)

### 1. Withdraw Page

**Fields:**

- `amount` (must be > 0)
- `destination`
- `confirm` (checkbox)

**Requirements:**

- Submit button is enabled only when the form is valid
- Submit button is disabled while the request is in progress

### 2. API Integration

**Endpoints:**

- `POST /v1/withdrawals`
- `GET /v1/withdrawals/{id}`

**Behavior:**

- Send an `idempotency_key` with each request
- `409 Conflict` is displayed as a user-friendly message
- On network error, allow retry without losing entered data
- On success, display the created withdrawal request and its status

### 3. UI Resilience

- Protection against double submit
- State machine: `idle` → `loading` → `success` / `error`

### 4. Architecture & Security Minimum

- Next.js App Router + TypeScript
- Zustand (or equivalent) for state management
- No unsafe HTML rendering (e.g. `dangerouslySetInnerHTML`)
- Do not store access tokens in `localStorage` (if auth is mocked, describe the production approach in README)

### 5. Deliverables

- Source code
- `README.md` — how to run + key decisions
- Tests

### 6. Minimum Tests

- 1 test: happy-path submit
- 1 test: API error handling
- 1 test: double-submit protection

---

## Optional (+1–2 hours)

- Restore the last withdrawal request after page reload (e.g. within 5 minutes)
- Performance optimizations (memoization / reducing unnecessary re-renders)
- Additional E2E test

---

## Technical Constraints

- Next.js 14+
- TypeScript
- Real Web3 integration is **not** required (mocks are acceptable)

## Allowed Simplifications

- Single user
- Single currency (USDT)
- No full authentication system
