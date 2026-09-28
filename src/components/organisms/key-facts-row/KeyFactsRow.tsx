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
  id,
  className = "",
  ...rest
}: KeyFactsRowProps) {
  const headingId = id ? `${id}-heading` : "key-facts-heading";

  return (
    <section
      id={id}
      className={`${styles.section} ${className}`.trim()}
      aria-labelledby={headingId}
      {...rest}
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <h3 id={headingId} className={styles.title}>
            {title}
          </h3>
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

        <div className={styles.tileTrack}>
          {tiles.map((tile) => (
            <BasicsTile
              key={tile.id || tile.callout}
              callout={tile.callout}
              value={tile.value}
              description={tile.description}
              order="value-first"
              valueSize="body"
              className={styles.tileItem}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
