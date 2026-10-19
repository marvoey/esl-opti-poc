# Next.js Cookie Configuration for Optimizely Audiences

This guide outlines how to set and manage cookies in a Next.js application to trigger audience conditions in **Optimizely Web Experimentation**.

---

## 1. Core Requirements

Optimizely Web Experimentation evaluates cookie-based audience conditions directly in the visitor's browser using JavaScript (`document.cookie`). For the Optimizely snippet to detect and evaluate your cookie, adhere to the following criteria:

* **`httpOnly: false` (Mandatory):** Cookies with `httpOnly: true` cannot be read by browser-level JavaScript (`document.cookie`), preventing Optimizely from evaluating the audience.
* **`path: '/'`:** Ensures the cookie is available across the entire site hierarchy and across all tested routes.
* **Exact Case Sensitivity:** Optimizely cookie name and value conditions are strictly case-sensitive.
* **SameSite & Secure Flags:** Use `sameSite: 'lax'` (or `'strict'`) and set `secure: true` in production environments.

---

## 2. Implementation Methods in Next.js

### Method A: Next.js Middleware (Recommended)
Middleware executes on the edge before the page response is sent to the client. This guarantees the cookie is already in the browser header when the page and Optimizely `<head>` script load, avoiding execution delays or visual flickering.

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Example: assign segment based on query params, geo, headers, or session
  response.cookies.set({
    name: 'user_segment',
    value: 'vip',
    path: '/',
    httpOnly: false, // MUST be false for Optimizely client-side evaluation
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

---

### Method B: Server Action / Route Handler (App Router)
Use this approach if the audience cookie needs to be assigned during a server-side action (e.g., login, checkout, account update).

```typescript
// app/actions/set-segment.ts
'use server';

import { cookies } from 'next/headers';

export async function setAudienceCookie(segmentValue: string) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: 'user_segment',
    value: segmentValue,
    path: '/',
    httpOnly: false, // MUST be false
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
  });
}
```

---

### Method C: Client-Side Component (Dynamic Updates)
When a cookie is set directly in the browser after user interaction (e.g., clicking a button or modal option), trigger Optimizely activation so the snippet re-evaluates audiences without requiring a page refresh.

```typescript
'use client';

import Cookies from 'js-cookie';

export function AudienceSwitcher() {
  const handleSelectSegment = (segment: string) => {
    // 1. Set the cookie client-side
    Cookies.set('user_segment', segment, {
      path: '/',
      expires: 30,
      sameSite: 'lax',
    });

    // 2. Trigger Optimizely audience re-evaluation immediately
    if (typeof window !== 'undefined' && (window as any).optimizely) {
      (window as any).optimizely.push({
        type: 'activate',
      });
    }
  };

  return (
    <button onClick={() => handleSelectSegment('vip')}>
      Set VIP Audience
    </button>
  );
}
```

---

## 3. Optimizely UI Configuration

1. In Optimizely Web Experimentation, navigate to **Audiences** > **Create New Audience**.
2. Select **Standard** > **Cookie** and drag it into the conditions area.
3. In the cookie name field, enter the exact cookie name (e.g., `user_segment`).
4. Select the matching operator:
   * **`equals`**: Exact string match (e.g., `vip`).
   * **`contains`**: Substring match.
   * **`has any value`**: Activates if the cookie is present regardless of value.
   * **`matches`**: Regular expression match.
5. Save the audience and attach it to your experiment or campaign.
