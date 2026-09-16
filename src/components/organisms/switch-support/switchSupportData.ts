import { SwitchSupportProps } from "./SwitchSupport";

export const DEFAULT_SWITCH_SUPPORT_PROPS: SwitchSupportProps = {
  title: "Switching is simpler than it sounds.",
  description: "Easy Lorem ipsum / what you need:",
  steps: [
    {
      id: "step-photo-id",
      step: 1,
      title: "A photo ID",
      description: "A driver's license, state ID, or passport.",
    },
    {
      id: "step-ssn",
      step: 2,
      title: "Your SSN",
      description: "And your date of birth and contact info.",
    },
    {
      id: "step-dollar",
      step: 3,
      title: "$1 to open",
      description: "Your opening deposit and membership share.",
    },
  ],
  ctaLabel: "Open a Premier Checking account",
  ctaHref: "/personal/checking/open",
  linkLabel: "Lorem ipsum if needed",
  linkHref: "/help",
};
