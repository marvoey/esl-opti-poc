# Architecture Guide: Next.js Enterprise Specification

> **Target Audience**: Human Software Engineers & AI Agents  
> **Core Philosophy**: SOLID FOUNDATIONS • CONCEPTS > CODE • ZERO CMS VENDOR LOCK-IN

---

## 1. Architectural Overview

This application adheres to a **Pragmatic Hexagonal Architecture (Ports & Adapters)** combined with **Modular Component Colocation**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Presentation Layer (Next.js App Router)              │
│  - React Server Components (RSC) default                               │
│  - Modular Component Colocation (.tsx + .module.css + .test.tsx)       │
│  - Intrinsic Design System (CSS Tokens + @container queries)           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ consumes
┌───────────────────────────────────▼────────────────────────────────────┐
│                    Application Layer (Use Cases & Queries)             │
│  - Pure asynchronous query functions                                   │
│  - Immutability & functional data pipelines                            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ depends on
┌───────────────────────────────────▼────────────────────────────────────┐
│                  Domain Layer (Entities & Repository Ports)            │
│  - Pure TypeScript interfaces & Zod validation schemas                 │
│  - ZERO dependencies on Next.js, React, or CMS vendor SDKs             │
└───────────────────────────────────▲────────────────────────────────────┘
                                    │ implements (Anti-Corruption Layer)
┌───────────────────────────────────┴────────────────────────────────────┐
│                Infrastructure Layer (CMS Adapters & Mappers)           │
│  - Active: Mock CMS Adapter (Local JSON + simulated latency)           │
│  - Future: Production CMS Adapters                                     │
│  - Translates vendor ASTs / payloads into Pure Domain Models           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure & Module Boundaries

```
src/
├── app/                               # Next.js App Router (Routing, Layouts, Streaming)
│   ├── layout.tsx                     # Root layout injecting tokens and fonts
│   ├── page.tsx                       # Home page (Server Component)
│   └── globals.css                    # Minimal reset + tokens import
│
├── components/                        # Colocated Component Architecture
│   └── [feature-or-component]/        # e.g., header, hero, card-grid
│       ├── [Name].tsx                 # Component implementation (RSC default)
│       ├── [Name].module.css          # Scoped CSS (Grid/Flexbox, max 3 nesting levels)
│       ├── [Name].test.tsx            # Unit/Behavioral spec (Vitest + Testing Library)
│       └── [sub-component]/           # Nested child components (if only used here)
│           ├── [Sub].tsx
│           └── [Sub].module.css
│
├── domain/                            # Enterprise Domain Core (Pure TypeScript)
│   ├── models/                        # Business entities (e.g., Navigation.ts, Page.ts)
│   └── repositories/                  # Port interfaces (e.g., NavigationRepository.ts)
│
├── application/                       # Use Cases & Application Queries
│   └── queries/                       # e.g., getNavigationQuery.ts, getPageContentQuery.ts
│
├── infrastructure/                    # Adapters & External Systems (Anti-Corruption Layer)
│   └── cms/
│       ├── cms-factory.ts             # Instantiates active adapter based on env config
│       ├── mock/                      # Mock Adapter (Active for prototype)
│       │   ├── mock-cms.adapter.ts    # Implements domain repository interfaces
│       │   └── data/                  # Simulated JSON responses
│       └── cms/                       # (Future) Production CMS Adapter + Mappers
│
├── styles/                            # Global Design System Tokens
│   ├── tokens.css                     # CSS Custom Properties (Colors, Clamp Spacing, Typography)
│   └── reset.css                      # Modern CSS reset (box-sizing, baseline margin/padding)
│
└── openspec/                          # Spec-Driven Development Artifacts
    └── changes/                       # Validated proposals, specs, designs, and task DAGs
```

---

## 3. The Anti-Corruption Layer (CMS Decoupling)

**Rule:** Vendor-specific schemas (e.g., CMS `sys.id`, `fields`, vendor schema structures) must **NEVER** leak past the `infrastructure/` directory.

### Port Definition (Domain Layer)
```typescript
// src/domain/repositories/NavigationRepository.ts
import { NavigationModel } from "../models/Navigation";

export interface NavigationRepository {
  getNavigation(): Promise<NavigationModel>;
}
```

### Adapter & Mapper (Infrastructure Layer)
```typescript
// src/infrastructure/cms/mock/mock-cms.adapter.ts
import { NavigationRepository } from "@/domain/repositories/NavigationRepository";
import { NavigationModel, NavigationSchema } from "@/domain/models/Navigation";
import mockNavData from "./data/navigation.json";

export class MockCMSAdapter implements NavigationRepository {
  async getNavigation(): Promise<NavigationModel> {
    // 1. Simulate network/CMS latency
    await new Promise((resolve) => setTimeout(resolve, 50));

    // 2. Validate payload at the boundary via Zod
    return NavigationSchema.parse(mockNavData);
  }
}
```

When switching to a production CMS:
1. Create `src/infrastructure/cms/production-cms.adapter.ts`.
2. Map the raw CMS response into `NavigationModel`.
3. Update `cms-factory.ts`.
4. **Zero changes to UI components or Application use cases.**

---

## 4. CSS & Styling Discipline

### 1. Intrinsic Design Tokens (`tokens.css`)
* Colors, spacing, and font sizes MUST be expressed as CSS custom properties (`var(--...)`).
* Fluid typography and spacing MUST use mathematical curves (`clamp()`) to avoid rigid breakpoint jumps:
  ```css
  --font-size-h1: clamp(2rem, 1.5rem + 2vw, 3.5rem);
  --space-gutter: clamp(1rem, 0.75rem + 1vw, 2.5rem);
  ```

### 2. CSS Grid & Flexbox Exclusively
* **CSS Grid**: Reserved for 2D structural layouts (page grids, responsive card arrays using `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`).
* **Flexbox**: Reserved for 1D linear alignment (navigation bars, button groups, icon-text pairs).

### 3. Maximum 3 Levels of Nesting
Deep selector nesting causes specificity escalation and increases browser style recalculation times. Keep rules flat:
```css
/* Good - Flat and direct */
.header {
  display: flex;
  justify-content: space-between;
}

.menu {
  display: flex;
  gap: var(--space-md);
}

.menuItem {
  color: var(--color-text-primary);
}

/* Forbidden - 4+ levels of deep nesting */
.header .nav .menu .menuItem a span { ... }
```

### 4. Container Query Driven (`@container`)
Components must be responsive to their **parent container**, not the device viewport:
```css
.cardContainer {
  container-type: inline-size;
}

@container (min-width: 480px) {
  .card {
    display: grid;
    grid-template-columns: 120px 1fr;
  }
}
```

---

## 5. JavaScript & Performance Discipline

### 1. Functional & Declarative Paradigm
* **Pure Components**: `UI = f(data)`. Components receive data via props and render deterministically.
* **Immutability**: Never mutate objects, arrays, or state directly. Use pure transformations (`.map()`, `.filter()`, object spread).
* **Pure Queries**: Application queries take parameters and return domain data without global side effects.

### 2. Zero Reflows & Repaints (Compositor First)
* **Never animate layout properties**: Animating `width`, `height`, `top`, `left`, `margin`, or `padding` forces main-thread layout recalculation (reflow).
* **Animate only composite properties**: `transform` and `opacity`. These are computed by the GPU compositor with zero reflow and zero repaint.
* **No Layout Thrashing**: Never interleave reading layout measurements (`offsetHeight`, `getBoundingClientRect`) with DOM style updates.

### 3. Zero Memory Leaks (React Server Components First)
* **Default to RSC**: Components in `app/` and `components/` are Server Components by default. They ship 0 KB of JavaScript to the browser and cannot leak memory.
* **Leaf-Only Client Components**: Add `"use client"` **only** to interactive leaf nodes (e.g., mobile hamburger toggle, theme switch).
* **Mandatory Cleanup**: Every `useEffect` listener, observer, or interval must return a cleanup function:
  ```typescript
  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener("resize", onResize, { signal: controller.signal });
    return () => controller.abort();
  }, []);
  ```

---

## 6. Spec-Driven Development (SDD) Workflow

Every feature follows the gated progression:

```
SPECIFY ──→ PLAN ──→ TASKS ──→ IMPLEMENT
   │          │        │          │
   ▼          ▼        ▼          ▼
 Human      Human    Human      Human
 Approval   Approval Approval   Approval
```

1. **Specify**: Define the domain model, acceptance criteria (Given/When/Then), and boundary rules in `openspec/`.
2. **Plan**: Architectural breakdown mapping files to create/modify, dependency order, and risks.
3. **Tasks**: Discrete, bite-sized tasks with explicit verification commands (`npm test`, `playwright`).
4. **Implement**: Execute tasks one by one with Strict TDD (Red-Green-Refactor).

---

## 7. Rendering, Caching & CMS Webhook Lifecycle

The application achieves instant edge delivery (0ms TTFB) with real-time editorial updates by combining React Server Components (RSC), Cache Tagging, and Streaming.

```
[ CMS Editor Publishes ] ──(Webhook)──► [ Next.js /api/revalidate?tag=page:home ]
                                                   │
                                                   ▼ calls revalidateTag()
                                       [ Edge CDN Cache Purged ]
                                                   │
                                                   ▼ Next Visitor
                                       [ Fresh RSC Statically Generated & Cached ]
```

### 1. Static by Default (Prerendered at the Edge)
* App Router routes are statically generated at build time by default.
* HTML and RSC payloads are delivered via globally distributed Edge CDNs with near-zero latency.

### 2. On-Demand Revalidation (Modern ISR via Cache Tags)
* The Infrastructure Adapter assigns fine-grained semantic cache tags to every data fetch:
  ```typescript
  const res = await fetch("https://api.cms.com/v1/pages/home", {
    next: { tags: ["cms:pages", "cms:page:home"] },
  });
  ```
* When an editor publishes in the CMS, a CMS webhook fires to a Next.js route handler (`/api/revalidate`):
  ```typescript
  // src/app/api/revalidate/route.ts
  import { revalidateTag } from "next/cache";
  import { NextRequest, NextResponse } from "next/server";

  export async function POST(req: NextRequest) {
    const { tag, secret } = await req.json();
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    revalidateTag(tag);
    return NextResponse.json({ revalidated: true, now: Date.now() });
  }
  ```

### 3. Streaming SSR with React Suspense
* Heavy or personalized CMS components never block initial page load (TTFB).
* Wrap asynchronous data-fetching components in `<Suspense>`:
  ```tsx
  <Header navigation={navData} />
  <main>
    <Hero title={page.title} />
    <Suspense fallback={<ProductGridSkeleton />}>
      <AsyncProductRecommendations categoryId={page.categoryId} />
    </Suspense>
  </main>
  <Footer />
  ```
* The page shell and critical CSS render immediately; secondary CMS data streams over HTTP as soon as it resolves.

### 4. Headless CMS Preview & Draft Mode
* Next.js `draftMode()` is handled entirely within the Infrastructure Adapter:
  ```typescript
  import { draftMode } from "next/headers";

  export class CMSAdapter implements PageRepository {
    async getPage(slug: string): Promise<PageModel> {
      const isDraft = (await draftMode()).isEnabled;
      const endpoint = isDraft ? CMS_PREVIEW_ENDPOINT : CMS_DELIVERY_ENDPOINT;
      
      // Fetch fresh, uncached draft data when preview cookies are present
      const res = await fetch(`${endpoint}/entries?slug=${slug}`, {
        cache: isDraft ? "no-store" : "default",
        next: isDraft ? undefined : { tags: [`cms:page:${slug}`] },
      });
      // ...
    }
  }
  ```

---

## 8. Operational Boundaries for Humans & AI Agents

### Always Do:
* Colocate `.tsx`, `.module.css`, and `.test.tsx` inside the component's folder.
* Validate all incoming data from the Infrastructure layer using Zod schemas.
* Use design tokens (`var(--token)`) for spacing, colors, and typography.
* Run automated tests and linting before marking any task complete.
* Tag every external fetch with a semantic cache tag for on-demand revalidation.

### Ask First:
* Introducing any external npm package.
* Changing domain entities or public repository interfaces.
* Adding client-side state management libraries.

### Never Do:
* **Never** import anything from `infrastructure/` directly into UI components (use the Application layer / Factory).
* **Never** nest CSS selectors more than 3 levels deep.
* **Never** animate `width`, `height`, `margin`, `padding`, `top`, `left`.
* **Never** leak CMS-specific IDs or payload types into UI props.
* **Never** use uncached, blocking `fetch` inside high-level layouts without `<Suspense>`.

