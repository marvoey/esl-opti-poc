import { FaqStatesProps } from "./FaqStates";

export const DEFAULT_FAQ_STATES_PROPS: FaqStatesProps = {
  eyebrow: "COMMON QUESTIONS",
  title: "Questions, answered simply.",
  description:
    "A few things people ask before opening — ask us anything else, anytime.",
  helpLinkLeadIn: "More questions?",
  helpLinkText: "Go to Help Center",
  helpLinkHref: "/help",
  items: [
    {
      id: "faq-who-can-open",
      question: "Who can open an ESL checking account?",
      answer:
        "If you live, work, worship, or attend school in our region, you're eligible to join – and opening takes just a $1 membership share.",
    },
    {
      id: "faq-fee",
      question: "Is there a monthly fee for Premier Checking?",
      answer:
        "No fee, as long as your average monthly balance stays at $1,000 or more. Dip below that and a $10 fee applies for the month.",
    },
    {
      id: "faq-dividend",
      question: "How does the dividend work?",
      answer:
        "Premier Checking earns a competitive, variable dividend, compounded monthly — plus the member-only Owners' Dividend in years ESL performs well.",
    },
    {
      id: "faq-overdraft",
      question: "What happens if I overdraft?",
      answer:
        "A few simple ways to cover the unexpected — Cash Reserve, CheckOK, and ESL Courtesy Pay†.",
    },
  ],
};
