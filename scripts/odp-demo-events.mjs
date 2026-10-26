#!/usr/bin/env node
/**
 * Sends the demo guide's curl requests to ODP.
 *   yarn odp:act2   Act 2: anonymous pageview + $32,000 loan calculation for a vuid
 *   yarn odp:act3   Act 3: login event stitching that vuid to the member's email
 *
 * Reads ODP_PRIVATE_API_KEY and ODP_REGION from .env (loaded by the package.json script).
 * Override the visitor or member with DEMO_VUID and DEMO_STITCH_EMAIL.
 */
import { monthlyPayment } from "./monthlyPayment.mjs";

const apiKey = process.env.ODP_PRIVATE_API_KEY;
const region = process.env.ODP_REGION || "us1";
const vuid = process.env.DEMO_VUID || "vuid_esl_live_demo_100";
const email =
  process.env.DEMO_STITCH_EMAIL || "demo.esl.patricia.chen.2003@example.com";

if (!apiKey) {
  console.error("ODP_PRIVATE_API_KEY is not set (add it to .env).");
  process.exit(1);
}

const now = Math.floor(Date.now() / 1000);

const acts = {
  act2: [
    {
      type: "navigation",
      action: "pageview",
      identifiers: { vuid },
      data: {
        ts: now - 120,
        page_path: "/personal/auto-loans",
        page_title: "ESL - Auto Loans & Refinancing",
      },
    },
    {
      type: "loan_calculator",
      action: "calculate",
      identifiers: { vuid },
      data: {
        ts: now - 60,
        loan_type: "auto_loan",
        borrow_amount: 32000,
        loan_term_months: 60,
        interest_rate: 5.49,
        calculated_monthly_payment: monthlyPayment(32000, 5.49, 60),
      },
    },
  ],
  act3: [
    {
      type: "customer",
      action: "login",
      identifiers: { vuid, email },
      data: { ts: now, channel: "online_banking" },
    },
  ],
};

const act = process.argv[2];
if (!acts[act]) {
  console.error(`Usage: odp-demo-events.mjs <${Object.keys(acts).join("|")}>`);
  process.exit(1);
}

const response = await fetch(
  `https://api.${region}.odp.optimizely.com/v3/events`,
  {
    method: "POST",
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify(acts[act]),
  },
);

console.log(`${act} -> ${response.status} ${response.statusText}`);
console.log(`vuid:  ${vuid}`);
if (act === "act3") console.log(`email: ${email}`);
if (!response.ok) {
  console.error(await response.text());
  process.exit(1);
}
