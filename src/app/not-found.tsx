import React from "react";
import { Heading } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { Button } from "@/components/atoms/button/Button";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="container"
      style={{
        padding: "120px 24px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Heading level="h1">Page Not Found</Heading>
      <Text
        as="p"
        variant="body-lg"
        style={{ marginTop: "16px", marginBottom: "32px", maxWidth: "480px" }}
      >
        The page you are looking for does not exist or has been moved.
      </Text>
      <Button href="/">
        Return Home
      </Button>
    </main>
  );
}
