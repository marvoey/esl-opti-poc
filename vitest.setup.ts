import { beforeAll } from "vitest";

beforeAll(() => {
  if (typeof window !== "undefined") {
    if (!window.matchMedia) {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: (query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }),
      });
    }

    if (!global.IntersectionObserver) {
      class MockIntersectionObserver {
        observe = () => {};
        unobserve = () => {};
        disconnect = () => {};
      }
      Object.defineProperty(global, "IntersectionObserver", {
        writable: true,
        configurable: true,
        value: MockIntersectionObserver,
      });
    }

    if (!global.ResizeObserver) {
      class MockResizeObserver {
        observe = () => {};
        unobserve = () => {};
        disconnect = () => {};
      }
      Object.defineProperty(global, "ResizeObserver", {
        writable: true,
        configurable: true,
        value: MockResizeObserver,
      });
    }
  }
});
