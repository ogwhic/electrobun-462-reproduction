import { Electroview } from "electrobun/view";

type WindowAction = "minimize" | "toggleMaximize" | "close";
type ReproRPC = {
  bun: {
    requests: {
      windowAction: {
        params: { action: WindowAction };
        response: { ok: true };
      };
    };
    messages: Record<never, never>;
  };
  webview: {
    requests: Record<never, never>;
    messages: Record<never, never>;
  };
};

const rpc = Electroview.defineRPC<ReproRPC>({ handlers: {} });
const electroview = new Electroview({ rpc });

type ReportedDimensions = {
  label: string;
  at: string;
  innerWidth: number;
  innerHeight: number;
  outerWidth: number;
  outerHeight: number;
  documentClientWidth: number;
  documentClientHeight: number;
  bodyClientWidth: number;
  bodyClientHeight: number;
  bodyOffsetWidth: number;
  bodyOffsetHeight: number;
  visualViewportWidth: number | null;
  visualViewportHeight: number | null;
  devicePixelRatio: number;
};

function collectDimensions(label: string): ReportedDimensions {
  return {
    label,
    at: new Date().toISOString(),
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    outerWidth: window.outerWidth,
    outerHeight: window.outerHeight,
    documentClientWidth: document.documentElement.clientWidth,
    documentClientHeight: document.documentElement.clientHeight,
    bodyClientWidth: document.body.clientWidth,
    bodyClientHeight: document.body.clientHeight,
    bodyOffsetWidth: document.body.offsetWidth,
    bodyOffsetHeight: document.body.offsetHeight,
    visualViewportWidth: window.visualViewport?.width ?? null,
    visualViewportHeight: window.visualViewport?.height ?? null,
    devicePixelRatio: window.devicePixelRatio,
  };
}

function formatDimensions(dimensions: ReportedDimensions): string {
  return JSON.stringify(dimensions, null, 2);
}

function setText(id: string, text: string): void {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = text;
  }
}

function sendWindowAction(action: WindowAction): void {
  void electroview.rpc?.request.windowAction({ action });
}

function init(): void {
  setText("initial", formatDimensions(collectDimensions("initial render")));
  setText("first-resize", "Waiting for first window resize event...");
  setText("live", formatDimensions(collectDimensions("current")));

  document.getElementById("minimize")?.addEventListener("click", () => sendWindowAction("minimize"));
  document.getElementById("maximize")?.addEventListener("click", () => sendWindowAction("toggleMaximize"));
  document.getElementById("close")?.addEventListener("click", () => sendWindowAction("close"));

  let capturedFirstResize = false;
  window.addEventListener("resize", () => {
    const current = collectDimensions(capturedFirstResize ? "current" : "first resize");
    setText("live", formatDimensions(current));

    if (!capturedFirstResize) {
      capturedFirstResize = true;
      document.documentElement.classList.add("saw-resize");
      setText("first-resize", formatDimensions(current));
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
