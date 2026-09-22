import { SplitContentStepListProps } from "./SplitContentStepList";

export const DEFAULT_SPLIT_CONTENT_STEP_LIST_PROPS: SplitContentStepListProps = {
  eyebrow: "ALREADY SAVE SOMEWHERE ELSE?",
  title: "Moving your savings is simpler than it sounds.",
  description:
    "We'll help you move your automatic transfers and direct deposit split, and close your old account when you're ready — in a branch, by phone, or over chat.",
  cta: {
    label: "How to switch",
    href: "/how-to-switch",
  },
  steps: [
    {
      id: "open-new-account",
      step: 1,
      title: "Open your new account",
      description: "Start online or in a branch — about 10 minutes.",
    },
    {
      id: "move-automatic-transfers",
      step: 2,
      title: "Move your automatic transfers",
      description: "Point recurring savings transfers at your new account.",
    },
    {
      id: "redirect-deposit-split",
      step: 3,
      title: "Redirect your deposit split",
      description: "Send part of each paycheck straight into savings.",
    },
    {
      id: "close-old-account",
      step: 4,
      title: "Close your old account",
      description: "Once everything's moved, close the old one with our help.",
    },
  ],
};
