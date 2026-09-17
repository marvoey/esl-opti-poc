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

    // jsdom doesn't implement <dialog>'s imperative showModal()/close(), or the
    // browser's native Escape-to-close behavior for an open modal dialog.
    if (
      typeof window.HTMLDialogElement !== "undefined" &&
      !window.HTMLDialogElement.prototype.showModal
    ) {
      window.HTMLDialogElement.prototype.showModal = function (
        this: HTMLDialogElement
      ) {
        this.setAttribute("open", "");
      };

      window.HTMLDialogElement.prototype.close = function (
        this: HTMLDialogElement
      ) {
        if (!this.hasAttribute("open")) return;
        this.removeAttribute("open");
        this.dispatchEvent(new Event("close"));
      };

      window.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        const openDialog = window.document.querySelector("dialog[open]");
        if (openDialog) {
          (openDialog as HTMLDialogElement).close();
        }
      });
    }
  }
});
