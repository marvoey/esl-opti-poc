# Spec: Foundation Setup & Architecture Verification

## Objective

Establish a clean, standalone Next.js application with Pragmatic Hexagonal Architecture, an Anti-Corruption Layer for CMS integration, and an Intrinsic CSS Design Token system.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Language**: TypeScript (Strict Mode)
- **Styling**: CSS Modules + Global Design Tokens (`src/styles/tokens.css`)
- **Validation**: Zod 3.x (Runtime boundary validation)
- **Testing**: Vitest 5.x + React Testing Library + JSDOM

## Commands

- `Build`: `npm run build`
- `Test`: `npm test`
- `Lint`: `npm run lint`
- `Dev`: `npm run dev`

## Project Structure

```
src/
├── app/                  Next.js App Router (Layouts, Pages, Routes)
├── components/           Modular Colocated Components (.tsx, .module.css, .test.tsx)
├── domain/               Pure business models and repository ports (Zero dependencies)
├── application/          Use cases and queries
├── infrastructure/       CMS Adapters
└── styles/               Design tokens (tokens.css) & reset
```

## Testing Strategy

- **Unit & Contract**: Vitest verifies all domain Zod schemas and query ports.
- **Component Specs**: Colocated `.test.tsx` files verify accessibility, rendering, and contract adherence.

## Boundaries

- **Always**: Colocate component files; use CSS variables for colors and spacing; validate CMS payloads with Zod.
- **Ask First**: Adding external dependencies; changing domain interfaces.
- **Never**: Import from `infrastructure/` directly in UI components; exceed 3 levels of CSS selector nesting; animate layout properties (`top`, `left`, `width`, `height`).

## Success Criteria

- [x] Next.js 16 project builds statically with zero errors.
- [x] Vitest suite passes all component and domain contract tests.
- [x] Simulated CMS adapter validates payloads with Zod before reaching UI.
- [x] Architecture guide documented in [ARCHITECTURE.md](file:///c:/Oshyn/ESL-OK/esl-opti-poc/ARCHITECTURE.md).
