# inp-workshop

A interactive demo and workshop for learning about [Interaction to Next Paint (INP)](https://web.deb/inp)

## Getting started

Clone this repository, or, [open it in a cloud editor such as CloudSandbox](htttps://codesandbox.io/p/github/mmocny/inp-workshop)).

Follow the instructions in this Readme

## Understanding the UI

* Score UI and "Increment" button
* INP: the current INP score, which is ~worst Interaction
* Interaction: the score of the most recent Interaction
* FPS: the main thread frames-per-second of the page
* Timer: a running timer animation to help visualize jank.

The FPS and Timer are not at all necessary for measuring Interactions.  They are added just to make visualizing responsiveness a little easier.

## Try it out

Try to interact with the `Increment` button and watch the score increase.

INP measures the time it takes-- from the moment the user interacts, until the page actually shows the rendered update to the user.

## Experiment: Long running Event Handlers

Open the `index.js` file, and comment out the `blockFor` function inside the event handler.

<details>
<summary>Answer</summary>

```js
button.addEventListener("click", () => {
  //blockFor(1000);
  score.incrementAndUpdateUI();
});
```
</details>

Try interacting with the page again.

## Look at Tooling

* INP scores in console
  * JS already added by default to this demo…
  * You can install the web-vitals extension on Chrome Desktop
  * You can add this JavaScript yourself to pages, including just using the console.
* Performance Panel
  * Record trace
  * Interactions lane, main thread activity, screenshots.

"On this page, responsiveness is super visual, with the scores and timers and the counter UI... but when testing the average page its more subtle.  Any time you want, you can use devtools to help measure responsiveness.

This page already uses console.logs() to report every interaction.
You can get such logs yourself with the Web Vitals chrome extension -- on desktop -- or you can just paste the snippet.
You can also record a perf trace and see interactions.

## Experiment: What happens if you click multiple times, quickly?

This is sometimes called “rage clicking”.
When your site has slow responsiveness, we know from data that it increases rage clicks– and more rage clicks can further degrade responsiveness!
For the next 30 minutes or so, I will not focus on rage clicks, we’ll come back to these.  
For now, let’s focus on fixing the performance of a single discrete interactions.

## Experiment: What happens if you swap the order of js calls -- updateUI() first, then block()?

Did you notice the UI appear earlier?
Did the swap affect INP scores?

## Experiment: What if you move the work to a separate Event Handler?

* Create a separate `click` handler
  * Answer

## Experiment: What if we change the type of Event Handler, from ‘click’ to something else?

* Replace one of the `click` events with `pointerup`, or `mouseup`…
  * Answer

## Experiment: What if about bubbles and captures phases of event handlers?

* Replace one of the handlers with capture phase `{ capture: true }`
  * Answer

## Conclusion 1

* Any code running in event handlers delays the visual update – the paint – of the page.  That means all interaction event handlers affect responsiveness, and thus INP.
  * Multiple handlers all run.
* That also means handlers registered from different scripts will all run!
* Not only your own code, but also all third party scripts added, if they register event listeners, will affect responsiveness.  It’s common!

## Experiment: What if we remove updateUI() call from the event handler?

* Remove `updateUI()` call
* Score does not update -- but the page still does
  * Even if we remove the all the metrics
  * Default handlers, buttons, text entry, highlight text, form components

## Experiment: What about code outside Event Handlers?

* Add setInterval()
  * Answer

There long-running periods are often called Long Tasks
Notice, it doesn’t always affect my interaction!  If I’m not clicking when the task is running
So, if you page has Long Tasks occasionally– maybe early during load– or a bit later when some late resources finally arrive…
It’s like having a page that sneezes
If you do interact during a sneeze, that causes Input Delay

## Conclusion 2

Any code running in event handlers delays visual update of the page – and any code already running on the page when an interaction happens delays event handlers.

## Experiment: What about non-visual updates?

* Add console.log();
  * Try adding before and after the blocking call.

INP measures delays in visual updates (paint) after interactions... but not everything is visual.
Console logs, network requests, local storage… these don’t have to wait for browser rendering, and INP does not measure them -- unless they *also* affect next paint.

The web has a simple, but unique system for task scheduling and rendering.

## So, what is special about visual updates?

* [Interaction diagram](https://web-dev.imgix.net/image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/Ng0j5yaGYZX9Bm3VQ70c.svg).
* [web.dev/inp](https://web.dev/inp)
* [web.dev/optimize-inp](https://web.dev/optimize-inp)

## Presentation Delays

Follow: So far, we’ve looked at the performance of input delay and event handlers directly, but what else affects this whole pipeline of visual updates, from Interaction to Next Paint?
Of course, updating the page using expensive effects!
Even if the update comes quickly, the browser may still have to work hard to render them!
Lots of DOM changes, or toggling lots of expensive CSS selectors: Style, Layout
Adding very large high-resolution images, or SVG/Canvas effects…

Example: SPA transition rebuilds the whole DOM after click, without any initiql feedback.
Example: Re-building the page with dynamic UI, like search results with filters
Example: Dark mode toggle

## Experiment: requestAnimationFrame

* Wrap the blocking with `requestAnimationFrame()`
  * Answer

## Experiment: Async effects

Since you can start non-visual effects inside interactions, such as making network requests, starting timers, or just updating global state… What happens when those *(eventually* update the page?

* Wrap our handler with a `setTimeout(() => { ... }, 1000)`
  * What if it does/doesn't call updates UI?
  * What if it does/doesn't blockFor?
  * Answer

## Conclusion 3

If you cannot remove it, at least move it!

* Let's update the UI from the click handler, and run the blocking work from the timeout.

Later, we’ll take a look at some strategies for improving it…

## Experiment: Can we do better?

Timed delay works in this case, but can we do better?
Is 100ms too much?  Is it guarenteed to be enough?

Here are some ideas:

* `Promise.then()` (Answer)
* `requestAnimationFrame` (Answer)
* `requestIdleCallback` (Answer)
* `scheduler.postTask()` (Answer)
* Anything else?
* Challenge: Web Worker

If you get stuck – you can read [web.dev/optimize-inp/#optimize-interactions](web.dev/optimize-inp/#optimize-interactions)

## Discuss Results

What worked, what did not?

* Trick: requestAnimationFrame + setTimeout
  * simple polyfill for `requestPostAnimationFrame`

## Mid-point summary

We are about to move into more complicated topics, but the most important lessons you just learned:

* INP measures all interactions
* Each Interaction is measured from Input to Next Paint -- the way the user *sees* responsiveness.
* Input Delay, (Event) Processing Times, and then Presentation Delay’s, all affect Interaction responsiveness.

Therefore:

* Don’t have long running code (long tasks),
* Move needless code out of event handlers and after next paint
* Make sure the Paint update is efficient enough for browser

## Multiple Interactions (aand Rage Clicks)

Delaying blocking work, still blocks future interactions, as well as other animations.

Strategies:

* Remove unnecessary code altogether
* Optimize to not be needlessly long-running
* Abort staale work when a new interactions arrive.

How can we do that?

* Cancel delayed work from starting
* Abort the work after it starts

## Option 1: Debounce

A classic strategy… whenever interactions arrive in quick succession, and the processing or network effects are expensive… delay *starting* work on purpose so you can cancel and restart.

Useful for: autocomplete

* Use `setTimeout` to delay starting expensive work, with a timer-- perhaps 500-1000ms
* save the timerid when you do so
* if a new interaction arrives, `clearTimeout` the previous

```js
let timer = null;
button.addEventListener("click", () => {
  score.incrementAndUpdateUI();

  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(async () => {
    blockFor(1000);
  }, 1000);
});
```

## Option 2: Abort work after it starts

Here’s what we want… even if we’re in the middle of work, we want to *pause our busy work* to start handling any new interactions, right away.

Challenge: How can we do that?

There are some apis like `isInputPending`, but I think it's better to split long tasks up into chunks.
First attempt: let's do something simple.  Replace this:

```js
button.addEventListener("click", () => {
  score.incrementAndUpdateUI();

  requestAnimationFrame(() => {
    setTimeout(() => blockFor(1000), 0);
  });
```

With this:

```js
button.addEventListener("click", () => {
  score.incrementAndUpdateUI();

  requestAnimationFrame(() => {
    setTimeout(() => blockFor(100), 0);
    setTimeout(() => blockFor(100), 0);
    setTimeout(() => blockFor(100), 0);
    // ... 10x times total
  });
```

This works by allowing the browser to schedule each task individually, and input can take higher priority!

This strategy works especially well when scheduling entry points -- like if you have a bunch of independant features you need to call at application load time.  Just loading scripts and running everything at script eval time may run everything in a giant long task by default.

However, this strategy doesn't work as well for breaking apart tightly coupled code -- like a for-loop that uses shared state.

## Option 2: now with yield()

However, we can leverage modern JS access to `async` and `await` in order to easily add "yield points" to any JS function.

For example:

```js
async function blockInPiecesYieldy(ms) {
  const ms_per_part = 10;
  const parts = ms / ms_per_part;
  for (let i = 0; i < parts; i++) {
    await schedulerDotYield(); // Polyfill for scheduler.yield()
    blockFor(ms_per_part);
  }
}
```

Which you can now call directly from your event handlers:

```js
button.addEventListener("click", async () => {
  score.incrementAndUpdateUI();
  await blockInPiecesYieldy(1000);
});
```

## Option 2: now with AbortContoller()

That worked... but it scheduled more work with each new interaction.

With Option 1: `debounce()`, we cancelled the previous timeout with each new interaction.  Can we do something similar here?

One easy way is to use an `AbortController()`:

```js
let abortController = new AbortController();

button.addEventListener("click", async () => {
  score.incrementAndUpdateUI();

  abortController.abort();
  abortController = new AbortController();

  await blockInPiecesYieldyAborty(1000, abortController.signal);
});
```

## Conclusion 4

Breaking up *all* long tasks, allows a site to be responsive to new Interactions.  That let's you provide initial feedabck quickly, and lets you make decisions-- such as aborting in-progress work, such as expensive computations or network requests.

Caution: Yielding is good for responsiveness, because it allows scheduling Initial feedback and allows rendering… but doing it too much can affect overall CPU thoughput.  You don't want to yield between every since line of code!

## Next Demo: Taking lessons to ReactJS site

* Repo: [mmocny/inp-codesandbox-nextjs](https://github.com/mmocny/inp-codesandbox-nextjs)
* [CodeSandbox](https://codesandbox.io/p/github/mmocny/inp-codesandbox-nextjs)