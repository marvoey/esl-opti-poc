export interface FinalCtaProps {
  id?: string;
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  eligibilityNote?: string;
  className?: string;
}

export const DEFAULT_FINAL_CTA_PROPS: FinalCtaProps = {
  id: "final-cta",
  heading: "Ready to open your ESL savings account?",
  description:
    "Pick the account that fits what you’re saving for. It takes about 10 minutes and $1 to open — and we’re here if you’d like a hand choosing.",
  buttonText: "Open a savings account",
  buttonHref: "#",
  eligibilityNote:
    "Open to anyone who lives, works, or worships in our community.",
};
