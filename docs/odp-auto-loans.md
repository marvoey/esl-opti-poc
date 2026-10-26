# ODP logic on the Auto Loans page (`/personal/auto-loans`)

Route: `src/app/sites/[site]/personal/auto-loans/`. The page is a demo of anonymous behavior capture and identity resolution in Optimizely Data Platform (ODP). It sends two kinds of events, both tagged with an anonymous `vuid` and never an email or other personal data.

## Overview

```
Browser                                   Next.js server                         ODP
-------                                   --------------                         ---
PageviewBeacon (on mount)  ─┐
                            ├─ trackEvents() ─ POST /api/odp/event ─ validate ─ stamp ts ─ POST /v3/events
AutoLoanCalculator button  ─┘   adds vuid        (zod, strict)                   adds API key
```

The browser never holds the ODP private API key. It posts to a same-origin proxy route, which validates the payload, adds the timestamp, and forwards it to ODP with the key.

## Files

| File | Role |
|---|---|
| `personal/auto-loans/page.tsx` | Renders `<PageviewBeacon>` and `<AutoLoanCalculator>`. Also declared as a real route so it isn't resolved as a CMS page. |
| `personal/auto-loans/PageviewBeacon.tsx` | Client component. Fires one pageview event in a `useEffect` and renders nothing. |
| `components/organisms/auto-loan-calculator/AutoLoanCalculator.tsx` | Fires the `loan_calculator` event when the visitor clicks "Recalculate & lock this rate". |
| `infrastructure/odp/client.ts` | Browser side. `trackEvents()` plus the `pageviewEvent()` and `loanCalculatorEvent()` builders. |
| `infrastructure/odp/vuid.ts` | Creates, reads and validates the anonymous visitor id cookie. |
| `infrastructure/odp/events.ts` | zod allowlist of the event shapes the proxy will accept. |
| `app/api/odp/event/route.ts` | Server proxy. Validates, stamps `ts`, forwards. |
| `infrastructure/odp/tracker.ts` | `sendOdpEvents()`: the only code that calls ODP, holding the private API key. |
| `infrastructure/odp/stitch.ts` | Server-side identity stitch at sign-in (not on this page, but it is what links this page's events to a member). |
| `sign-in/actions.ts` | `signIn`, `signInAs`, `signOut`. Sets session cookies and triggers the stitch. |
| `data/users.json` | Demo members, including the `email` sent to ODP on sign-in. |

## The visitor id (`vuid`)

- Stored in a first-party cookie named `vuid` (`path=/`, 1 year, `SameSite=Lax`, `Secure` on https).
- `getOrCreateClientVuid()` runs on every `trackEvents()` call and rewrites the cookie if it doesn't hold the current value.
- **Temporary demo behavior:** the id is `vuid_esl_live_demo_<month>_<day>_<hour>` in the browser's local time, e.g. `vuid_esl_live_demo_10_26_14`. Everyone browsing in the same hour shares one ODP profile, and a new hour starts a new one. This is flagged in code as something to replace with a random per-visitor id before real use.
- Valid format: `^[A-Za-z0-9_-]{8,32}$` (ODP stores vuid as `char(32)`).
- If an ODP tracker already set the cookie as `<id>|<extra>`, `normalizeVuid()` keeps only the part before `|`.

## Event 1: pageview

**Sent when:** `PageviewBeacon` mounts (once per page load, or again if `path` or `title` changes).

**Browser to proxy** (`POST /api/odp/event`, body is an array):

```json
[{
  "type": "navigation",
  "action": "pageview",
  "identifiers": { "vuid": "vuid_esl_live_demo_10_26_14" },
  "data": {
    "page_path": "/personal/auto-loans",
    "page_title": "ESL - Auto Loans & Refinancing"
  }
}]
```

`page_path` and `page_title` are passed as literals from `page.tsx`, so moving the route requires updating the `path` prop too.

## Event 2: loan calculator

**Sent when:** the visitor clicks "Recalculate & lock this rate". Moving the slider or term buttons only updates the screen and resets the status message. Nothing is sent until that click.

```json
[{
  "type": "loan_calculator",
  "action": "calculate",
  "identifiers": { "vuid": "vuid_esl_live_demo_10_26_14" },
  "data": {
    "loan_type": "auto_loan",
    "borrow_amount": 32000,
    "loan_term_months": 60,
    "interest_rate": 5.49,
    "calculated_monthly_payment": 610.8
  }
}]
```

| Field | Source | Server-enforced limits |
|---|---|---|
| `loan_type` | constant `auto_loan` | must equal `auto_loan` |
| `borrow_amount` | slider, $10,000 to $75,000 in $1,000 steps | number, 0 to 1,000,000 |
| `loan_term_months` | 36, 48, 60 or 72 | integer, 1 to 480 |
| `interest_rate` | hard-coded `APR = 5.49` | number, 0 to 100 |
| `calculated_monthly_payment` | `monthlyPayment(amount, APR, term)` | number, 0 to 1,000,000 |

The (illustrative) payment value above is just an example. The real value comes from `monthlyPayment.ts`. The button shows a loading state while sending, then "Calculation saved." on success or an error message on failure.

## What the proxy does (`/api/odp/event`)

1. Parses the JSON body, wrapping a single object into an array.
2. Validates against `ClientEventsSchema`: 1 to 5 events, each exactly one of the two shapes above. Schemas use `strictObject`, so any extra field is rejected. In particular it rejects `email`, any other identifier, and a client-supplied `ts`. Failure returns `400 {"error":"Invalid event"}`.
3. Adds `ts` (Unix seconds, server clock) into each event's `data`.
4. Calls `sendOdpEvents()`, which returns `200 {"success":true}` or `502 {"success":false}`.

## What goes to ODP (`sendOdpEvents`)

```
POST https://api.<ODP_REGION>.odp.optimizely.com/v3/events
x-api-key: <ODP_PRIVATE_API_KEY>
Content-Type: application/json
```

Body is the array of validated events, each with `data.ts` added. Configuration:

- `ODP_PRIVATE_API_KEY`: required. If missing, it logs a warning and returns `success: false`, so the proxy responds 502.
- `ODP_REGION`: optional, default `us1`.
- It never throws. Failures are logged and returned as `success: false`, so the demo keeps working if ODP is unreachable. The browser sees `false` and the calculator shows its error message. The pageview beacon ignores the result.

## Sign in and sign out

Sign-in is the one place an email reaches ODP, and it only happens server-side. Sign-out sends nothing to ODP.

### Sign in

**Entry points** (both in `app/sites/[site]/sign-in/actions.ts`, both end in `startSession()`):

- `signIn()`: the sign-in form. Only the username is read; the password field is for show and is never checked.
- `signInAs(username)`: one-click sign-in from the presenter HUD ("Act 3: stitch", `PresenterBar.tsx`, shown only when `NEXT_PUBLIC_DEMO_HUD=1`). It signs in as `maria.gonzalez`.

**Steps in `startSession(user)`:**

1. `findUser()` looks the username up (case-insensitive) in `data/users.json`. Each entry is `{ username, displayName, email }`. An unknown username returns an error and sends nothing to ODP.
2. Sets two cookies:
   - `esl_session` (`__Host-esl_session` in production): HttpOnly, holds the username, 8 hours. This is personalization only, not authentication.
   - `esl_signed_in=1`: readable by JavaScript, carries no identity, used by Optimizely Web Experimentation audiences.
3. Calls `stitchVisitorToMember(user)` (`infrastructure/odp/stitch.ts`), which:
   - returns `null` (sends nothing) if the user has no `email`, or the request has no valid `vuid` cookie;
   - otherwise sends one event through `sendOdpEvents()`, the same private-key path as above.

**What is sent to ODP:**

```json
[{
  "type": "customer",
  "action": "login",
  "identifiers": {
    "vuid": "vuid_esl_live_demo_10_26_14",
    "email": "<member email from data/users.json>"
  },
  "data": { "ts": 1700000000, "channel": "online_banking" }
}]
```

Because the event carries both identifiers, ODP resolves them to one customer, so the earlier anonymous pageview and `loan_calculator` events join the member profile.

**Where the data comes from:**

- `vuid`: read from the request's `vuid` cookie with `normalizeVuid()`, not from the client request body.
- `email`: from `data/users.json`, which is bundled at build time. It is never sent to the browser. `/api/auth/session` returns only the `displayName`.
- `ts`: server clock.

**Result handling:** the outcome is logged as a JSON line, `{"scope":"auth","event":"identity_stitch","odpStatus":...,"ok":0|1}`. A failed stitch does not fail the sign-in; the visitor is still signed in. The client then does a full page load to the `next` path, so the Optimizely snippet re-evaluates its cookie audiences.

### Sign out

`signOut()` (same file) expires both cookies (`esl_session` and `esl_signed_in`) and logs `{"scope":"auth","event":"sign_out"}` to the server console. **It sends no event to ODP.** ODP is never told the member signed out.

Callers:

- `AccountMenu.tsx` (header "Sign out" button): calls `signOut()`, then reloads the page. The `vuid` cookie is left alone, so the same browser keeps the same `vuid` and keeps sending anonymous events under it.
- `PresenterBar.tsx` ("Reset to anonymous"): calls `signOut()`, then `clearClientVuid()` (expires the `vuid` cookie), then reloads. The next `trackEvents()` call writes a fresh demo `vuid`. Note that the demo `vuid` depends only on the local date and hour, so within the same hour it comes back as the same value. A reset therefore does not produce a new ODP identity until the hour changes.

### Consequences

- The stitch is permanent in ODP: once `vuid` and email are linked, later anonymous events from that `vuid` land on the member's profile, even after sign-out in the UI. After a normal sign-out, further calculator use in the same browser is still attributed to that member.
- If you want ODP to record sign-outs, add a `customer` / `logout` event in `signOut()` (the event type would need to exist in your ODP schema). This does not exist today.

## Things to know

- **Zero PII in the browser:** the only identifier the browser sends is the `vuid`. The email appears only in the server-to-ODP login event (see "Sign in and sign out").
- **Pageview is fire and forget:** a failed pageview send is silent.
- **Demo vuid collisions:** because the vuid is derived from the hour, different people share a profile. Fine for a staged demo, wrong for real traffic.
- **Path changes affect segments:** pageviews recorded before the move to `/personal/auto-loans` carry `/loans/auto-loans` as `page_path`. Any ODP segment or filter on the old path needs updating.
- **Schema dependency:** the `loan_calculator` event and its `data` fields must exist in the ODP schema (event type `loan_calculator`, fields as in the table above) or ODP may reject or drop the event.
