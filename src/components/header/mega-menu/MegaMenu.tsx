import React from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/button/Button";
import { Icon, ArrowRightIcon } from "@/components/atoms/icons";
import type { MegaMenuData } from "../megaMenuData";
import styles from "./MegaMenu.module.css";

export interface MegaMenuProps {
  id: string;
  /** Names the panel's region landmark; without it the role is not exposed. */
  label?: string;
  data: MegaMenuData;
}

export function MegaMenu({ id, label, data }: MegaMenuProps) {
  const hasPromo = Boolean(
    data.promo &&
      (data.promo.heading?.trim() ||
        data.promo.description?.trim() ||
        data.promo.ctaLabel?.trim() ||
        data.promo.eyebrow?.trim())
  );

  return (
    <div id={id} className={styles.panel} role="region" aria-label={label}>
      <div className={`${styles.inner} ${!hasPromo ? styles.innerNoPromo : ""}`}>
        <div className={styles.columns}>
          {data.viewAllLabel && data.viewAllHref && (
            <Button
              variant="secondary"
              size="sm"
              shape="pill"
              href={data.viewAllHref}
              rightIcon={<ArrowRightIcon size={16} />}
              className={styles.viewAllLink}
            >
              {data.viewAllLabel}
            </Button>
          )}

          <div className={styles.columnGrid}>
            {data.columns.map((column) => (
              <div key={column.heading} className={styles.column}>
                <p className={styles.columnHeading}>{column.heading}</p>
                <ul className={styles.columnList}>
                  {column.items.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className={styles.columnLink}>
                        <Icon
                          name={item.icon}
                          size={18}
                          className={styles.columnIcon}
                        />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {hasPromo && data.promo && (
          <div className={styles.promo}>
            {data.promo.eyebrow && (
              <p className={styles.promoEyebrow}>{data.promo.eyebrow}</p>
            )}
            {data.promo.heading && (
              <p className={styles.promoHeading}>{data.promo.heading}</p>
            )}
            {data.promo.description && (
              <p className={styles.promoDescription}>{data.promo.description}</p>
            )}
            {data.promo.ctaLabel && data.promo.ctaHref && (
              <Link href={data.promo.ctaHref} className={styles.promoCta}>
                {data.promo.ctaLabel}
                <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
