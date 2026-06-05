# Electrobun `hiddenInset` initial bounds repro

This is a minimal reproduction for an Electrobun Windows `titleBarStyle: "hiddenInset"` initial layout issue.

## What it demonstrates

- The window is created with `titleBarStyle: "hiddenInset"` and a custom HTML title bar.
- On initial display, the renderer records and displays the browser-reported dimensions.
- After the first native/browser `resize` event, it separately records and displays the new browser-reported dimensions.
- The red/yellow `CLOSE` button is deliberately flush with the far right edge so the initial clipping is easy to see when the webview initially reports dimensions larger than the visible client area.

## Run

From this `tmp/` directory:

```sh
bun install
bun run dev
```

If `electrobun` is already installed in a parent directory, `bun run dev` may also work without a separate install because Bun can resolve parent `node_modules`.

## Expected affected behavior

1. On first display, the close button may be partially clipped on the right edge.
2. The "Initial reported dimensions" panel reports a viewport/client size that is larger than the post-resize value.
3. Manually resize the window once.
4. The close button snaps fully into view.
5. The "After first resize event" panel captures the corrected dimensions.

The core window setup is in `src/bun/index.ts`:

```ts
new BrowserWindow({
  title: "hiddenInset initial bounds repro",
  url: "views://mainview/index.html",
  titleBarStyle: "hiddenInset",
  frame: { x: 160, y: 120, width: 1180, height: 760 },
  rpc,
});
```
