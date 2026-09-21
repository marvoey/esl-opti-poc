import React from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/button/Button";
import { Icon, ArrowRightIcon } from "@/components/atoms/icons";
import type { MegaMenuData } from "../megaMenuData";
import styles from "./MegaMenu.module.css";

export interface MegaMenuProps {
  id: string;
  data: MegaMenuData;
}

export function MegaMenu({ id, data }: MegaMenuProps) {
  return (
    <div id={id} className={styles.panel} role="region">
      <div className={styles.inner}>
        <div className={styles.columns}>
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

        <div className={styles.promo}>
          <p className={styles.promoEyebrow}>{data.promo.eyebrow}</p>
          <p className={styles.promoHeading}>{data.promo.heading}</p>
          <p className={styles.promoDescription}>{data.promo.description}</p>
          <Link href={data.promo.ctaHref} className={styles.promoCta}>
            {data.promo.ctaLabel}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
