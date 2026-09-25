import React from "react";
import {
  Heading,
  Text,
  Button,
  UserIcon,
  ArrowRightIcon,
  CoinsIcon,
  FilterChip,
  TabButton,
  Badge,
  QuickLink,
  TextLink,
} from "@/components/atoms";
import styles from "../page.module.css";

export function ButtonSpecimens() {
  return (
    <>
      {/* 1. Button Icon Primary */}
      <div className={styles.buttonCard}>
        <div className={styles.buttonCardHeader}>
          <Text variant="micro">FIGMA VARIANT 1</Text>
          <Heading level="h4">Button Icon Primary</Heading>
          <Text variant="caption">Primary Navy fill • Left User icon • Pill radius</Text>
        </div>
        <Button variant="primary" leftIcon={<UserIcon />}>
          Sign In
        </Button>
      </div>

      {/* 2. Pill button arrow primary */}
      <div className={styles.buttonCard}>
        <div className={styles.buttonCardHeader}>
          <Text variant="micro">FIGMA VARIANT 2</Text>
          <Heading level="h4">Pill button arrow primary</Heading>
          <Text variant="caption">Primary Navy fill • Right Arrow icon • Dynamic text hug</Text>
        </div>
        <Button variant="primary" rightIcon={<ArrowRightIcon />}>
          Learn more about joining ESL
        </Button>
      </div>

      {/* 3. Pill Button Secondary Icon */}
      <div className={styles.buttonCard}>
        <div className={styles.buttonCardHeader}>
          <Text variant="micro">FIGMA VARIANT 3</Text>
          <Heading level="h4">Pill Button Secondary Icon</Heading>
          <Text variant="caption">Secondary Mint Polar fill • Left User icon • 11.4:1 contrast</Text>
        </div>
        <Button variant="secondary" leftIcon={<UserIcon />}>
          Sign In
        </Button>
      </div>

      {/* 4. Form card button */}
      <div className={styles.buttonCard}>
        <div className={styles.buttonCardHeader}>
          <Text variant="micro">FIGMA VARIANT 4</Text>
          <Heading level="h4">Form card button</Heading>
          <Text variant="caption">Compact size (44px floor) • Right Arrow icon • Form rhythm</Text>
        </div>
        <Button variant="primary" size="sm" rightIcon={<ArrowRightIcon />}>
          Sign In
        </Button>
      </div>

      {/* 5. Pill Button tertiary Icon */}
      <div className={styles.buttonCard}>
        <div className={styles.buttonCardHeader}>
          <Text variant="micro">FIGMA VARIANT 5</Text>
          <Heading level="h4">Pill Button tertiary Icon</Heading>
          <Text variant="caption">White fill • Navy border • Left User icon • 12.4:1 contrast</Text>
        </div>
        <Button variant="tertiary" leftIcon={<UserIcon />}>
          Become a member
        </Button>
      </div>

      {/* 6. Pill button arrow secondary */}
      <div className={styles.buttonCard}>
        <div className={styles.buttonCardHeader}>
          <Text variant="micro">FIGMA VARIANT 6</Text>
          <Heading level="h4">Pill button arrow secondary</Heading>
          <Text variant="caption">Secondary Mint Polar fill • Right Arrow icon • Dynamic text hug</Text>
        </div>
        <Button variant="secondary" rightIcon={<ArrowRightIcon />}>
          Learn more about joining ESL
        </Button>
      </div>

      {/* 7. Secondary Button */}
      <div className={styles.buttonCard}>
        <div className={styles.buttonCardHeader}>
          <Text variant="micro">FIGMA VARIANT 7</Text>
          <Heading level="h4">Secondary Button</Heading>
          <Text variant="caption">Outline Navy border • Pill radius • Hover Turquoise fill</Text>
        </div>
        <Button variant="outline">View All Rates</Button>
      </div>

      {/* 8. Simple Link */}
      <div className={styles.buttonCard}>
        <div className={styles.buttonCardHeader}>
          <Text variant="micro">FIGMA VARIANT 8</Text>
          <Heading level="h4">Simple Link</Heading>
          <Text variant="caption">Zero-border text link • Right arrow glide on hover</Text>
        </div>
        <Button variant="link" rightIcon={<ArrowRightIcon />}>
          Sign In
        </Button>
      </div>

      {/* 9. Taxonomy Dark */}
      <div className={styles.buttonCard}>
        <div className={styles.buttonCardHeader}>
          <Text variant="micro">FIGMA VARIANT 9</Text>
          <Heading level="h4">Taxonomy Dark (Badges)</Heading>
          <Text variant="caption">Aqua tint and neutral metadata indicator pills</Text>
        </div>
        <div className={styles.componentRow}>
          <Badge variant="aqua">Limited Time</Badge>
          <Badge variant="neutral">Limited Time</Badge>
        </div>
      </div>

      {/* 10. Filter chip */}
      <div className={styles.buttonCard}>
        <div className={styles.buttonCardHeader}>
          <Text variant="micro">FIGMA VARIANT 10</Text>
          <Heading level="h4">Filter Chip</Heading>
          <Text variant="caption">Selectable pill control: Default vs Active Selected</Text>
        </div>
        <div className={styles.componentRow}>
          <FilterChip>Keeping it simple</FilterChip>
          <FilterChip selected>Keeping it simple</FilterChip>
        </div>
      </div>

      {/* 11. Tab Button Desktop */}
      <div className={styles.buttonCard}>
        <div className={styles.buttonCardHeader}>
          <Text variant="micro">FIGMA VARIANT 11</Text>
          <Heading level="h4">Tab Button Desktop</Heading>
          <Text variant="caption">Card tab: Default Inactive, Hover (2px Turquoise border), and Active</Text>
        </div>
        <div className={styles.componentStack}>
          <TabButton icon={<CoinsIcon />}>Just starting out</TabButton>
          <TabButton icon={<CoinsIcon />} variant="hover">
            Just starting out
          </TabButton>
          <TabButton icon={<CoinsIcon />} active>
            Just starting out
          </TabButton>
        </div>
      </div>

      {/* 12. Quick Link Aqua Mobile */}
      <div className={styles.buttonCard}>
        <div className={styles.buttonCardHeader}>
          <Text variant="micro">FIGMA VARIANT 12</Text>
          <Heading level="h4">Quick Link Aqua Mobile</Heading>
          <Text variant="caption">Row card with image placeholder, label, and trailing arrow</Text>
        </div>
        <div className={styles.componentStack}>
          <QuickLink title="Customer Service" href="/customer-service" />
        </div>
      </div>

      {/* 13. Text link dark */}
      <div className={styles.buttonCard}>
        <div className={styles.buttonCardHeader}>
          <Text variant="micro">FIGMA VARIANT 13</Text>
          <Heading level="h4">Text Link Dark</Heading>
          <Text variant="caption">Navy text on light surface • Smooth underline reveal on hover</Text>
        </div>
        <div className={styles.componentStack}>
          <TextLink href="/customer-service">Customer Service</TextLink>
        </div>
      </div>

      {/* 14. Text link light */}
      <div className={`${styles.buttonCard} ${styles.buttonCardDark}`}>
        <div className={styles.buttonCardHeader}>
          <Text variant="micro">FIGMA VARIANT 14</Text>
          <Heading level="h4">Text Link Light</Heading>
          <Text variant="caption">White text on dark surface • Transitions to turquoise on hover</Text>
        </div>
        <div className={styles.componentStack}>
          <TextLink href="/customer-service" variant="light">
            Customer Service
          </TextLink>
        </div>
      </div>
    </>
  );
}
