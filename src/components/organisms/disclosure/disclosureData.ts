import { DisclosureProps } from "./Disclosure";

export const DEFAULT_DISCLOSURE_PROPS: DisclosureProps = {
  heading: "DISCLOSURES:",
  items: [
    {
      id: "disclosure-mobile-banking",
      boldText:
        "Members must agree to the ESL web agreement to use mobile banking.",
      regularText:
        "*Qualification for the Owners' Dividend is subject to eligibility requirements. Payment of a Dividend is not guaranteed.",
    },
    {
      id: "disclosure-mobile-deposit",
      boldText:
        "Members must agree to the ESL web agreement to use ESL Mobile Deposit.",
      regularText:
        "*Fee of up to $5.00 is charged. The overdraft fee can be imposed on checks, ACH and Bill Pay transactions that exceed the balance in your checking account, and ESL Visa Debit Card transactions, if you have registered. You must bring your account to a positive end-of-day available balance at least once every 10 days. ESL will not pay an overdraft if you do not meet the eligibility requirements.",
    },
  ],
};
