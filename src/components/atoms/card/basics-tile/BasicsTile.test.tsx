import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { BasicsTile, BasicsTileGrid } from "./index";

describe("BasicsTile Component", () => {
  it("renders callout, value, and description in default order", () => {
    const { container } = render(
      <BasicsTile
        callout="Lorem callout"
        value="XX"
        description="Descriptive quick content"
      />
    );

    expect(screen.getByText("Lorem callout")).toBeDefined();
    expect(screen.getByText("XX")).toBeDefined();
    expect(screen.getByText("Descriptive quick content")).toBeDefined();

    // Verify order: callout appears before value in DOM
    const tile = container.firstChild as HTMLElement;
    const children = Array.from(tile.children);
    expect(children[0].textContent).toBe("Lorem callout");
    expect(children[1].textContent).toBe("XX");
    expect(children[2].textContent).toBe("Descriptive quick content");
  });

  it("renders with value-first order when requested", () => {
    const { container } = render(
      <BasicsTile
        callout="Lorem callout"
        value="XX"
        description="Descriptive quick content"
        order="value-first"
      />
    );

    const tile = container.firstChild as HTMLElement;
    const children = Array.from(tile.children);
    expect(children[0].textContent).toBe("XX");
    expect(children[1].textContent).toBe("Lorem callout");
    expect(children[2].textContent).toBe("Descriptive quick content");
  });

  it("applies valueSize classes accurately", () => {
    const { container: containerMd } = render(
      <BasicsTile
        callout="Fee rate"
        value="0.00"
        description="No maintenance fees"
        valueSize="md"
      />
    );
    expect((containerMd.firstChild as HTMLElement).className).toContain("valueMd");

    const { container: containerLg } = render(
      <BasicsTile
        callout="APY"
        value="4.50%"
        description="High yield"
        valueSize="lg"
      />
    );
    expect((containerLg.firstChild as HTMLElement).className).toContain("valueLg");

    const { container: containerBody } = render(
      <BasicsTile
        callout="Fee rate"
        value="0.00"
        description="No maintenance fees"
        valueSize="body"
      />
    );
    expect((containerBody.firstChild as HTMLElement).className).toContain("valueMd");

    const { container: containerBodyLg } = render(
      <BasicsTile
        callout="APY"
        value="4.50%"
        description="High yield"
        valueSize="body-lg"
      />
    );
    expect((containerBodyLg.firstChild as HTMLElement).className).toContain("valueLg");
  });

  it("uses caption description variant for body-lg and micro for body", () => {
    render(
      <BasicsTile
        callout="Callout 1"
        value="XX"
        description="Caption description"
        valueSize="lg"
        descriptionVariant="caption"
      />
    );
    const descLg = screen.getByText("Caption description");
    expect(descLg.className).toContain("caption");

    render(
      <BasicsTile
        callout="Callout 2"
        value="XX"
        description="Micro description"
        valueSize="md"
      />
    );
    const descMd = screen.getByText("Micro description");
    expect(descMd.className).toContain("micro");
  });

  it("applies standalone divider class when showDivider is true", () => {
    const { container } = render(
      <BasicsTile
        callout="Callout"
        value="XX"
        description="Content"
        showDivider
      />
    );
    expect((container.firstChild as HTMLElement).className).toContain("hasDivider");
  });
});

describe("BasicsTileGrid Component", () => {
  it("renders title, subtitle, and child tiles", () => {
    render(
      <BasicsTileGrid
        title="The basics, at a glance"
        subtitle="Applies to every savings account"
      >
        <BasicsTile callout="Callout 1" value="XX" description="Content 1" />
        <BasicsTile callout="Callout 2" value="XX" description="Content 2" />
      </BasicsTileGrid>
    );

    expect(screen.getByText("The basics, at a glance")).toBeDefined();
    expect(screen.getByText("Applies to every savings account")).toBeDefined();
    expect(screen.getByText("Callout 1")).toBeDefined();
    expect(screen.getByText("Callout 2")).toBeDefined();
  });

  it("applies specific layout classes for row and grid2 modes", () => {
    const { container: containerRow } = render(
      <BasicsTileGrid layout="row">
        <BasicsTile callout="C1" value="XX" description="D1" />
      </BasicsTileGrid>
    );
    expect(containerRow.querySelector('[class*="layoutRow"]')).toBeDefined();

    const { container: containerGrid2 } = render(
      <BasicsTileGrid layout="grid2">
        <BasicsTile callout="C1" value="XX" description="D1" />
      </BasicsTileGrid>
    );
    expect(containerGrid2.querySelector('[class*="layoutGrid2"]')).toBeDefined();
  });
});
