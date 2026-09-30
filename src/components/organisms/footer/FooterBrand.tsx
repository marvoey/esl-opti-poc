import React from "react";
import Link from "next/link";
import { CmsImage } from "@/components/atoms/image/CmsImage";
import { Text } from "@/components/atoms/text/Text";
import { Button } from "@/components/atoms/button/Button";
import type { FooterBrandSection } from "./Footer";
import styles from "./Footer.module.css";

interface FooterBrandProps {
  brand: FooterBrandSection;
}

export function FooterBrand({ brand }: FooterBrandProps) {
  const hasLogo = Boolean(brand.logo || brand.logoUrl);

  return (
    <div className={styles.brandCol}>
      {hasLogo && (
        <Link
          href={brand.wordmarkHref || "/"}
          className={styles.brandLogo}
          aria-label={brand.wordmark || "ESL"}
        >
          {brand.logo ? (
            brand.logo
          ) : (
            <CmsImage
              src={brand.logoUrl as string}
              alt={brand.logoAlt || brand.wordmark || "ESL"}
              width={83}
              height={50}
              optimizeWidth={166}
              className={styles.logoImage}
            />
          )}
        </Link>
      )}
      {brand.text && (
        <Text
          as="p"
          variant="body-sm"
          color="inverted"
          className={styles.brandText}
        >
          {brand.text}
        </Text>
      )}
      {brand.button && (
        <Button
          href={brand.button.href}
          variant={brand.button.variant || "secondary"}
          shape="pill"
          className={styles.brandButton}
          {...(brand.button.external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {brand.button.label}
        </Button>
      )}
    </div>
  );
}
