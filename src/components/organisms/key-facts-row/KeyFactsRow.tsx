import React from "react";
import { BasicsTile } from "@/components/atoms/card/basics-tile/BasicsTile";
import { Text } from "@/components/atoms/text/Text";
import {
  DEFAULT_KEY_FACTS_TILES,
  type KeyFactsRowProps,
  type KeyFactsTileItem,
} from "./keyFactsData";
import styles from "./KeyFactsRow.module.css";

export { DEFAULT_KEY_FACTS_TILES, type KeyFactsRowProps, type KeyFactsTileItem };

export function KeyFactsRow({
  title = "Details at a glance",
  subtitle = "Applies to both checking accounts",
  tiles = DEFAULT_KEY_FACTS_TILES,
  headingLevel = "h2",
  id,
  className = "",
  ...rest
}: KeyFactsRowProps) {
  const headingId = id ? `${id}-heading` : "key-facts-heading";
  const HeadingTag = headingLevel;

  return (
    <section
      id={id}
      className={`${styles.section} ${className}`.trim()}
      aria-labelledby={headingId}
      {...rest}
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <HeadingTag id={headingId} className={styles.title}>
            {title}
          </HeadingTag>
          {subtitle && (
            <Text
              as="p"
              variant="body"
              color="secondary"
              className={styles.subtitle}
            >
              {subtitle}
            </Text>
          )}
        </header>

        <ul className={styles.tileTrack} role="list">
          {tiles.map((tile) => (
            <li key={tile.id || tile.callout} className={styles.tileItem}>
              <BasicsTile
                callout={tile.callout}
                value={tile.value}
                description={tile.description}
                order="value-first"
                valueSize="body"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
