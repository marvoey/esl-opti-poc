# Architectural Decision Record & Justification (ADR)

> **Document Type**: Architecture Decision Record & Rationale  
> **Status**: Accepted & Implemented  
> **Core Principle**: CONCEPTS > CODE • SOLID FOUNDATIONS • MEASURED TRADE-OFFS

---

## 1. Executive Summary

When building modern web applications, teams frequently fall into one of two extremes:
1. **The "Move Fast and Break Things" Trap**: Coupling UI components directly to third-party CMS SDKs and relying on class-heavy utility CSS with scattered media queries. This works for 2 weeks, then stagnates into technical debt, vendor lock-in, and fragile styling.
2. **The "Enterprise Over-Engineering" Trap**: Applying Java-style tactical DDD (Aggregates, Entity Classes, Domain Events, Repositories with factories) to a frontend application, resulting in hundreds of lines of boilerplate for a simple read model.

We selected a **Pragmatic Hexagonal Architecture** paired with **Modular Component Colocation** and an **Intrinsic Design Token System**. 

Below is the technical justification, alternative evaluation, and trade-off analysis for every architectural decision.

---

## 2. Decision 1: Pragmatic Hexagonal (ACL) vs. Direct CMS vs. Full DDD

### Alternatives Considered:
* **Option A: Direct CMS Coupling (Anti-Pattern)**  
  * *Implementation*: Calling a CMS SDK directly inside React components (`<Component data={entry.fields} />`).
  * *Why Rejected*: High coupling. If the CMS changes its AST or schema, or if the business migrates to another CMS, **every single React component and CSS file must be rewritten**. Vendor types pollute the entire codebase.
* **Option B: Full Tactical DDD (Enterprise Bloat)**  
  * *Implementation*: Java-style classes (`class NavigationItem extends Entity`), domain events, value object classes with private properties and getters.
  * *Why Rejected*: Next.js Server Components serialize data across server/client boundaries. Classes lose their prototypes during serialization. It creates massive boilerplate without offering value for read-heavy content delivery.
* **Option C: Pragmatic Hexagonal with Anti-Corruption Layer (CHOSEN)**  
  * *Implementation*: Pure TypeScript models validated by Zod at the boundary. Repository interfaces (Ports) implemented by CMS Adapters.

### Why Option C is Superior:
1. **Zero Vendor Lock-in**: Switching from `MockCMSAdapter` to a production `CMSAdapter` requires writing **one file** in `src/infrastructure/cms/`. UI components and use cases remain 100% untouched.
2. **Runtime Contract Safety**: Third-party CMS APIs are external network boundaries. TypeScript only checks types at compile time. Zod parses and guarantees that CMS responses match the contract at runtime, preventing silent `undefined` rendering crashes.
3. **Instant Testability**: Domain and UI layers can be tested with pure in-memory data with zero network mocking libraries.

---

## 3. Decision 2: Pure CSS Modules + Tokens vs. Tailwind CSS

### Alternatives Considered:
* **Option A: Tailwind CSS**  
  * *Drawbacks*: 
    * Utility-first defaults train developers to think in rigid viewport breakpoints (`sm:`, `md:`, `lg:`).
    * Writing container queries (`@container`) with arbitrary values and mathematical curves in HTML class strings produces unmaintainable, unreadable markup:
      ```html
      <!-- Unreadable Tailwind container query soup -->
      <div class="@container/main p-4 @[480px]/main:grid @[480px]/main:grid-cols-[120px_1fr] @[768px]/main:p-8">
      ```
    * Tightly couples styling to a proprietary build-time framework.
* **Option B: CSS Modules + Intrinsic Tokens + Modern Reset (CHOSEN)**  
  * *Implementation*: Colocated `.module.css` files scoped per component, consuming single-source-of-truth CSS custom properties (`tokens.css`).

### Why Option B is Superior:
1. **True Intrinsic Web Design**: Using mathematical curves (`clamp()`) for spacing and typography means the UI scales fluidly across all screen sizes without abrupt breakpoint jumps.
2. **Container Agility**: Components are styled relative to their **parent container width** using native `@container`, not the device screen. A `<Card>` component automatically formats itself whether placed in a 300px sidebar or a 1200px hero grid.
3. **Clean, Semantic JSX**: JSX remains semantic (`<header className={styles.header}>`), separating structure from presentation.
4. **Low Specificity Discipline**: Enforcing a strict rule of **maximum 3 levels of nesting** guarantees flat selectors, fast browser style recalculations, and zero specificity wars.

---

## 4. Decision 3: React Server Components (RSC) First vs. Client SPA

### Alternatives Considered:
* **Option A: Client-Side React SPA (`"use client"` everywhere)**  
  * *Drawbacks*: Ships megabytes of JavaScript to the browser; slower Time to First Byte (TTFB); hydration mismatches; event listener leaks and memory overhead on mobile devices.
* **Option B: React Server Components (RSC) First (CHOSEN)**  
  * *Implementation*: All layouts, pages, and presentation components are Server Components by default. `"use client"` is restricted strictly to interactive leaf nodes (toggles, modals, forms).

### Why Option B is Superior:
1. **Zero Client Bundle for Layout & Content**: Server Components ship **0 KB of JavaScript** to the browser.
2. **Zero Memory Leaks**: Server Components execute once on the server. They have no DOM event listeners or timers that can leak memory on client devices.
3. **Zero Layout Thrashing / Reflows**: Content arrives pre-rendered in HTML. CSS transitions are restricted to GPU-composited properties (`transform`, `opacity`), ensuring smooth 60fps rendering without main-thread jank.

---

## 5. Decision 4: On-Demand Revalidation (Cache Tags) vs. Rebuilds vs. Dynamic SSR

| Metric | Static Site Generation (SSG) | Pure Dynamic (SSR) | Modern ISR (Cache Tags) [CHOSEN] |
| :--- | :--- | :--- | :--- |
| **Delivery Speed (TTFB)** | Instant (Edge CDN) | Slow (Computes on every hit) | **Instant (Edge CDN)** |
| **Publish Freshness** | Delayed (10-20 min build) | Instant | **Instant (< 300ms via Webhook)** |
| **Server / CMS Load** | High on build | Very High (Every visitor hits CMS) | **Near Zero (Cached at Edge)** |
| **Cost** | Low | High | **Extremely Low** |

### Why Cache Tag Revalidation is Superior:
When an editor publishes content in the CMS:
1. The CMS fires a webhook to `/api/revalidate`.
2. Next.js calls `revalidateTag('cms:pages')`.
3. The Edge CDN cache for that specific page is purged in milliseconds.
4. The next visitor triggers a background static re-render.
5. **No full site rebuilds; zero CMS overload; instant global delivery.**

---

## 6. Decision 5: Spec-Driven Development (SDD) & Strict TDD

### The Reality Check:
"Vibe coding" or writing code before defining requirements leads to:
* Re-implementing features 3 times because edge cases were never identified.
* Scope creep and vague definitions of "done".
* Brittle tests written after the fact to artificially bump coverage numbers.

### Why SDD + TDD was Chosen:
* **The Gated Contract**: `SPECIFY ➔ PLAN ➔ TASKS ➔ IMPLEMENT`.
* Specifications in `openspec/` define acceptance criteria (Given/When/Then), explicit commands, and hard boundaries (Always / Ask First / Never) before a single line of application code is touched.
* Colocated `.test.tsx` files guarantee that every component is an executable verification of its specification.

---

## 7. Architectural Scorecard

| Goal | Chosen Architecture | Result |
| :--- | :--- | :--- |
| **CMS Portability** | Anti-Corruption Layer + Zod | **10/10**: Swap CMS in 1 file with zero UI changes |
| **CSS Maintainability** | Colocation + Tokens + Native `@container` | **10/10**: No class bloat, no media-query spaghetti |
| **Runtime Performance** | RSC + Compositor-Only GPU Animations | **10/10**: 0 KB JS for content, zero reflows |
| **Reliability & Quality**| SDD + Vitest Contract Specs | **10/10**: Every feature verified against approved spec |
| **Developer / AI Clarity**| `ARCHITECTURE.md` + Living Contracts | **10/10**: Unambiguous rules, zero guessing |
