# Withdraw App

A USDT withdrawal page built with Next.js, TypeScript, Tailwind CSS, and Zustand.

## Getting Started

```bash
npm install
npm run dev       # http://localhost:3000
npm test          # run tests
npm run build     # production build
```

## Key Decisions

### State Management

Zustand was chosen for its simplicity — a single store manages form fields, submission status (`idle` → `loading` → `success` / `error`), and the withdrawal result. No providers or context wrappers needed.

### API Layer

The API client (`src/lib/api.ts`) is a mock that simulates real behavior:

- **Idempotency**: Each submission generates a `crypto.randomUUID()` key. The mock tracks used keys and returns `409` on duplicates.
- **Error handling**: Network errors preserve form data and allow retry. A `409` shows a user-friendly message and regenerates the key.
- **Double-submit protection**: The store guards against concurrent submissions by checking `status === "loading"` before proceeding.

### Authentication (Production Approach)

The app does not implement auth. In production, the access token should be stored in an **httpOnly, Secure, SameSite=Strict cookie** — never in `localStorage` or `sessionStorage`. This prevents XSS from accessing the token. The API client would send credentials via cookies automatically, and a server-side middleware (Next.js middleware or API route) would handle token refresh.

### Security

- No use of `dangerouslySetInnerHTML`
- All user-visible text is rendered through React's built-in escaping
- Form inputs are validated client-side before submission

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
├── components/
│   └── WithdrawForm.tsx  # Main form component
├── store/
│   └── withdrawStore.ts  # Zustand store
├── lib/
│   ├── api.ts            # Mock API client
│   └── types.ts          # Shared TypeScript types
└── __tests__/
    └── WithdrawForm.test.tsx
```

## Tests

- **Happy-path submit**: fills form → submits → verifies success state with withdrawal details
- **API error handling**: simulates network failure → verifies error message + form data preserved
- **Double-submit protection**: rapid clicks → verifies only one API call is made
