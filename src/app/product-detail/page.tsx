import type { Metadata } from "next";
import React from "react";
import { Heading } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";

export const metadata: Metadata = {
  title: "Product Detail | ESL Federal Credit Union",
  description: "Product detail page",
};

export default function ProductDetailPage() {
  return (
    <main className="container" style={{ paddingBlock: "4rem", minHeight: "60vh" }}>
      <Heading level="h1">product-detail</Heading>
      <Text as="p" variant="body-lg" color="secondary" style={{ marginTop: "1rem" }}>
        product-detail
      </Text>
    </main>
  );
}
