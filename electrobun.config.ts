import type { ElectrobunConfig } from "electrobun";

export default {
  app: {
    name: "HiddenInsetBoundsRepro",
    identifier: "dev.example.hidden-inset-bounds-repro",
    version: "0.0.0",
  },
  build: {
    bun: {
      entrypoint: "src/bun/index.ts",
    },
    views: {
      mainview: {
        entrypoint: "src/mainview/index.ts",
      },
    },
    copy: {
      "src/mainview/index.html": "views/mainview/index.html",
      "src/mainview/styles.css": "views/mainview/styles.css",
    },
    win: {
      bundleCEF: false,
    },
  },
} satisfies ElectrobunConfig;
