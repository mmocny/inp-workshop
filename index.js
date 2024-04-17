import { blockFor } from "./workshop/utils/blockFor.js";

const score = document.querySelector('score-keeper');
const button = score.button;


async function afterNextPaint() {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      setTimeout(resolve, 0);
    });
    // Fallback-- in case you are e.g. in a background tab
    setTimeout(resolve, 1000);
  });
}

async function blockInChunks(ms, chunks, signal) {
  for (let i = 0; i < chunks; i++) {
    if (signal.aborted) return;
    blockFor(ms / chunks);
    await scheduler.yield();
  }
}

let abortController;
button.addEventListener("click", async () => {
  abortController?.abort();
  abortController = new AbortController();
  score.incrementAndUpdateUI();
  await afterNextPaint();
  blockInChunks(1000, 10, abortController.signal);
});