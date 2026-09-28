import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { TestimonialCard } from "./TestimonialCard";
import { parseVideoSource } from "./parseVideoSource";

describe("TestimonialCard Component & parseVideoSource helper", () => {
  it("parses YouTube, Vimeo, and local video sources accurately", () => {
    expect(parseVideoSource("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toEqual({
      type: "youtube",
      src: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0",
    });

    expect(parseVideoSource("https://vimeo.com/76979871")).toEqual({
      type: "vimeo",
      src: "https://player.vimeo.com/video/76979871?autoplay=1",
    });

    expect(parseVideoSource("/videos/sample-testimonial.mp4")).toEqual({
      type: "local",
      src: "/videos/sample-testimonial.mp4",
    });
  });

  it("renders static card with thumbnail, title, quote, and author when videoUrl is omitted", () => {
    render(
      <TestimonialCard
        imageSrc="/images/testimonials/marcia.png"
        imageAlt="Marcia at her café"
        title="Expanded her business"
        quote="Their business banking solutions helped me grow my company."
        author={{ name: "Marcia", role: "café owner", location: "Finger Lakes" }}
      />
    );

    expect(screen.getByRole("img", { name: "Marcia at her café" })).toBeDefined();
    expect(screen.getByText("Expanded her business")).toBeDefined();
    expect(
      screen.getByText('"Their business banking solutions helped me grow my company."')
    ).toBeDefined();
    expect(screen.getByText("Marcia, café owner")).toBeDefined();
    expect(screen.getByText("· Finger Lakes")).toBeDefined();
    expect(screen.queryByLabelText(/Play video/i)).toBeNull();
  });

  it("renders play overlay when videoUrl is present and opens lightbox on click", () => {
    render(
      <TestimonialCard
        imageSrc="/images/testimonials/marcia.png"
        videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        videoTitle="Marcia's Story"
        title="Expanded her business"
        quote="Exceptional service and competitive rates."
        author="Marcia, café owner · Finger Lakes"
      />
    );

    const playTrigger = screen.getByRole("button", { name: "Play video: Marcia's Story" });
    expect(playTrigger).toBeDefined();

    // Lightbox should not be in DOM initially
    expect(screen.queryByRole("dialog")).toBeNull();

    // Click to open lightbox
    fireEvent.click(playTrigger);

    const dialog = screen.getByRole("dialog", { name: "Marcia's Story" });
    expect(dialog).toBeDefined();

    const iframe = screen.getByTitle("Marcia's Story");
    expect(iframe.getAttribute("src")).toContain("youtube-nocookie.com/embed/dQw4w9WgXcQ");

    // Close on close button click
    const closeBtn = screen.getByRole("button", { name: "Close video player" });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders HTML5 video inside lightbox for local video source and closes on Escape", () => {
    render(
      <TestimonialCard
        imageSrc="/images/testimonials/marcia.png"
        videoUrl="/videos/marcia.mp4"
        title="Expanded her business"
        quote="Exceptional service and competitive rates."
        author="Marcia, café owner · Finger Lakes"
      />
    );

    const playTrigger = screen.getByRole("button", { name: "Play testimonial video" });
    fireEvent.click(playTrigger);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeDefined();

    const videoEl = dialog.querySelector("video");
    expect(videoEl).toBeDefined();
    expect(videoEl?.getAttribute("src")).toBe("/videos/marcia.mp4");

    // Press Escape to close
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders the default header icon at 24x24", () => {
    const { container } = render(
      <TestimonialCard
        imageSrc="/images/testimonials/marcia.png"
        imageAlt="Marcia at her café"
        title="Expanded her business"
        quote="Their business banking solutions helped me grow my company."
        author={{ name: "Marcia", role: "café owner", location: "Finger Lakes" }}
      />
    );

    const icon = container.querySelector("[class*='iconWrapper'] svg");
    expect(icon?.getAttribute("width")).toBe("24");
    expect(icon?.getAttribute("height")).toBe("24");
  });

  it("wraps the author name and meta in a single paragraph", () => {
    render(
      <TestimonialCard
        imageSrc="/images/testimonials/marcia.png"
        imageAlt="Marcia at her café"
        title="Expanded her business"
        quote="Their business banking solutions helped me grow my company."
        author={{ name: "Marcia", role: "café owner", location: "Finger Lakes" }}
      />
    );

    const authorRow = screen.getByText("Marcia, café owner").parentElement;
    expect(authorRow?.tagName).toBe("P");
    expect(authorRow?.textContent).toContain("Finger Lakes");
    authorRow?.querySelectorAll("span").forEach((span) => {
      expect(span.className).toContain("weightBold");
    });
  });
});
