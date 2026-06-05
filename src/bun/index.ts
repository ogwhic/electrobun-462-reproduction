import { BrowserView, BrowserWindow } from "electrobun/bun";

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

const frame = {
  x: 160,
  y: 120,
  width: 1180,
  height: 760,
};

let mainWindow: BrowserWindow<ReproRPC>;

const rpc = BrowserView.defineRPC<ReproRPC>({
  handlers: {
    requests: {
      windowAction({ action }) {
        if (action === "minimize") {
          mainWindow.minimize();
        } else if (action === "toggleMaximize") {
          if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
          } else {
            mainWindow.maximize();
          }
        } else {
          mainWindow.close();
        }

        return { ok: true };
      },
    },
  },
});

mainWindow = new BrowserWindow<ReproRPC>({
  title: "hiddenInset initial bounds repro",
  url: "views://mainview/index.html",
  titleBarStyle: "hiddenInset",
  frame,
  rpc,
});

mainWindow.on("resize", () => {
  console.log("native resize event", mainWindow.getFrame());
});

console.log("Created hiddenInset repro window", frame);
