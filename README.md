# INP workshop

A interactive demo and workshop for learning about [Interaction to Next Paint (INP)](https://web.deb/inp)

![Optimize Interaction To Next Paint](https://web.dev/static/articles/inp/image/inp-desktop-v2.svg)

## Getting started

### Option 1

1. Clone [this repository](https://github.com/mmocny/inp-workshop)
2. `npm install`
3. `npm run start`

### Option 2

Use a cloud editor, such as [CodeSandbox.io](https://codesandbox.io)

1. [Open this repo in CodeSandbox.io](https://codesandbox.io/p/github/mmocny/inp-workshop).
2. Create a branch so you can make edits

### Option 3

Just follow along with a static version: [mmocny.com/inp-workshop/](https://mmocny.com/inp-workshop/)


## Overview of the App

At the top of the page is a simple "Score" counter and "Increment" button.  A classic demo of reactivity and responsiveness!

Below are 4 metrics:

* INP: the current INP score, which is ~worst Interaction
* Interaction: the score of the most recent Interaction
* FPS: the main thread frames-per-second of the page
* Timer: a running timer animation to help visualize jank.

The FPS and Timer are not at all necessary for measuring Interactions.  They are added just to make visualizing responsiveness a little easier.

## Try it out

Try to interact with the `Increment` button and watch the score increase.

INP measures how long it takes-- from the moment the user interacts, until the page actually shows the rendered update to the user.




# Workshop

## Step 0: Try it out, without any changes.

Just try the app, first!


## Experiment: Long Tasks and Input Delay

What if you have some `<script>` that randomly blocked the page some time after load?

```js
// Block the page once every 3 seconds
setInterval(() => {
  blockFor(1000);
}, 3000);

button.addEventListener("click", () => {
  score.incrementAndUpdateUI();
});
```

- These long-running periods are often called Long Tasks.
  - Notice, it doesn’t *always* affect interactions!
  - If I'm lucky, I may not click while the long task is running.
  - Such "random" sneezes can be a nightmare to debug when they only sometimes cause issues.

First Input Delay (FID) would measure such issues, only for the first interaction.  Basically: How often is the page "sneezing" during load, for long enough to affect responsiveness?

This was a major problem on the web a few years ago-- and concepts such as Time to Interactive (TTI), Total Blocking Time (TBT), and First Input Delay (FID) were important to track.  But some things have changed:

- Cookie prompts
- SSR + Lazy Hydration... until first interaction
- Expensive Client Side rendering, after interactions
- JS bloat: Analytics, 1p and 3p scripts hooking onto interactions


## Experiment. Add some long running work to the event handler

Open the `index.js` file, and comment out the `blockFor` function inside the event handler.

```js
button.addEventListener("click", () => {
  blockFor(1000);
  score.incrementAndUpdateUI();
});
```

- Now what happens?
- What happens if you click multiple times, quickly?
  - Slow responsiveness can motivate rage clicks-– and more rage clicks can further degrade responsiveness!

## Let's try to Update the UI first, then do the work.

What happens if you swap the order of js calls -- `incrementAndUpdateUI()` first?

Did you notice the UI appear earlier?  Does the order affect INP scores?

```js
button.addEventListener("click", () => {
  score.incrementAndUpdateUI();
  blockFor(1000);
});
```

## What if the work was split up, into separate event handlers

What if you move the work to a separate Event Handlers?

```js
button.addEventListener("click", () => {
  score.incrementAndUpdateUI();
});
  
button.addEventListener("click", () => {
  blockFor(1000);
});
```

## What if the event triggered for different reasons?

What if we change the event types for the Event Handlers?

```js
button.addEventListener("click", () => {
  score.incrementAndUpdateUI();
});

button.addEventListener("focusin", () => {
  blockFor(1000);
});
```

# Lesson

Most pages have many event handlers for many different event types, many of which block nexp paint and affect responsiveness.

- Most interactions will fire many types of events:
  - touch, mouse, pointer, key, click events
  - hover, focus, blur events
  - select, beforechange, beforeinput, form submit, invalid, document beforeunload...

*Any* code running in *any* event handlers will delay the interaction.

- That includes handlers registered from different scripts...
- That includes framework or library code that runs in handlers.
  - For example: a state update that triggers a component render.
- Not only your own code, but also all third party scripts.


So what can you do about it?

1. Optimize it
2. Remove it
3. ...move it




## Experiment: What about non-visual updates?

Try to add a `console.log` to your event handler.

When does it show in console?  Is it delayed just like Next Paint?  Does it matter if it is called before or after the call to `blockFor`?

```js
button.addEventListener("click", () => {
  score.incrementAndUpdateUI();
  console.log("Hello!");
  blockFor(1000);
});
```

INP measures delays in visual updates (paint) after interactions... but not everything is visual.

- Console logs
- network requests
- local storage…

The web has a simple, but unique system for task scheduling and rendering.

![Optimize Interaction To Next Paint](https://web.dev/static/articles/inp/image/a-diagram-depicting-inte-d2bec16a5952.svg)

* [web.dev/inp](https://web.dev/inp)
* [web.dev/optimize-inp](https://web.dev/optimize-inp)



## Discuss: Presentation Delays

So far, we’ve looked at the performance of JavaScript, via input delay or event handlers, but what else affects rendering Next Paint?

Well, updating the page with expensive effects!

Even if the page update comes quickly, the browser may still have to work hard to render them!

* On the main thread:
  * UI frameworks that need to render updates after state changes
  * DOM changes, or toggling many expensive CSS query selectors can trigger lots of Style, Layout, Paint.
* Off the main thread:
  * Using CSS to power GPU effects
  * Adding very large high-resolution images
  * Using SVG/Canvas to draw complex scenes

![Rendering diagram](https://developer.chrome.com/static/docs/chromium/renderingng-architecture/image/diagram-the-rendering-pi-093c8ed755a54_1920.jpeg)

* [RenderingNG](https://developer.chrome.com/articles/renderingng/)

Some Examples, commonly found on the web

* An SPA site rebuilds the whole page DOM after link click, without pausing to provide an initial visual feedback.
* A search page offers complex search filters with dynamic UI, but runs expensive handlers to do so.
* One Dark mode toggle triggers style/layout for the whole page

## Experiment: requestAnimationFrame

Let's simulate a long presentation delay using the `requestAnimationFrame()` API.

<details>
<summary>Answer</summary>

```js
button.addEventListener("click", () => {
  score.incrementAndUpdateUI();
  requestAnimationFrame(() => {
    blockFor(1000);
  });
});
```
</details>

## Look at Tooling

On this page, responsiveness is super visual, with the scores and timers and the counter UI... but when testing the average page its more subtle.

When interactions do run long, its not always clear what the culprit is.  Is it:

* Input Delay
* Event Processing Times
* Presentation Delay

On any page you want, you can use devtools to help measure responsiveness.

* INP scores in console
  * JS already added by default to this demo…
  * Expand details to see breakdowns
  * You can install the web-vitals extension on Chrome Desktop
  * You can add this JavaScript yourself to any page

* Performance Panel
  * Record trace
  * Interactions lane, main thread activity, screenshots.

Try adding a bit of all these problems to the page:

<details>
<summary>Answer</summary>

```js
setInterval(() => {
  blockFor(1000);
}, 3000);

button.addEventListener("click", () => {
  blockFor(1000);
  score.incrementAndUpdateUI();

  requestAnimationFrame(() => {
    blockFor(1000);
  });
});
```
</details>

...Then use the console and performance panel to diagnose the issue(s).

## Tooling Flow

This is a flow I find useful, every day:

1. Navigate the web, as I normally do
2. Leave DevTools console open, with the Web Vitals extension logging interactions
3. If I see a poorly performing interaction, I try to repeat
  * If I can't repeat, I use the console logs to get insights
  * If I can repeat, I record in performance panel

## Experiment: Async effects

Since you can start non-visual effects inside interactions, such as making network requests, starting timers, or just updating global state… What happens when those *eventually* update the page?

Let's wrap the contents of our event handler with a `setTimeout`.

What if it does/doesn't update UI?
What if it does/doesn't block?

<details>
<summary>Answer</summary>

```js
button.addEventListener("click", () => {
  setTimeout(() => {
    blockFor(1000);
    score.incrementAndUpdateUI();
  }, 1000);
});
```
</details>

However-- what if I interact *again* after the async call resolves?

## Take away

As long as the *Next Paint* after Interaction is allowed to render, even if the browser decides it doesn't actually need a new rendering update, Interaction measurement stops.

Asynchronous effects, such as updates that come after timers or network response will *not* affect INP.  Unless, of course, they actually block Next Paint, or the *next* Interaction (as input delay).

Another example: a `fetch()` or resource attached to dom elements, which is already prefetched may actually be available before the next rendering opportunity.

## Lesson: if you cannot remove it, at least move it!

If async effects aren't measured-- that's a great place to put our long-running code!

Let's change to update the UI from the click handler, but run the blocking work from the timeout.

<details>
<summary>Answer</summary>

```js
button.addEventListener("click", () => {
  score.incrementAndUpdateUI();

  setTimeout(() => {
    blockFor(1000);
  }, 100);
});
```
</details>

Can we do better than a fixed 100ms timeout?

We likely still want the code to run as quickly as possible... otherwise we should have just removed it!

Goal:
- Interaction will UpdateUI
- BlockFor will run as soon as possible, but not block next paint
- Predictable behaviour without "magic timeouts"

Here are some ideas:

* `setTimeout(0)`
* `Promise.then()`
* `requestAnimationFrame`
* `requestIdleCallback`
* `scheduler.postTask()`
* Anything else?
* Challenge: Web Worker

<details>
<summary>Answer</summary>

```js
button.addEventListener("click", () => {
  score.incrementAndUpdateUI();

  // Test one at a time!

  setTimeout(() => {
    blockFor(1000);
  }, 0);
  
  Promise.resolve().then(() => {
    blockFor(1000);
  });
  
  requestAnimationFrame(() => {
    blockFor(1000);
  });
  
  requestIdleCallback(() => {
    blockFor(1000);
  });
  
  scheduler.postTask(() => {
    blockFor(1000);
  }, { priority: "background", delay: 0 }); // "user-visible", "background"
});
```
</details>

## What worked, what did not?

Trick: `requestAnimationFrame` + `setTimeout`, a simple polyfill for `requestPostAnimationFrame`.

<details>
<summary>Answer</summary>

```js
function afterNextPaint(callback) {
  requestAnimationFrame(() => {
    setTimeout(callback, 0);
  });
}

button.addEventListener("click", () => {
  score.incrementAndUpdateUI();

  afterNextPaint(() => {
    blockFor(1000);
  });
});
```
</details>

Alternatively:

<details>
<summary>Answer</summary>

```js
function afterNextPaint(callback) {
  requestAnimationFrame(() => {
    setTimeout(callback, 0);
  });
}

async function nextPaint() {
  return new Promise(resolve => afterNextPaint(resolve));
}

button.addEventListener("click", async () => {
  score.incrementAndUpdateUI();

  await nextPaint();
  blockFor(1000);
});
```
</details>

## Mid-point summary

We are about to move into more complicated topics, but the most important lessons you just learned:

* INP measures all Interactions
* Each Interaction is measured from Input to Next Paint -- the way the user *sees* responsiveness.
* Input Delay, (Event) Processing Times, and then Presentation Delay’s, all affect Interaction responsiveness.
* You can measure INP, and Interaction breakdowns, easily!

Lessons:

* Don’t have long running code (long tasks) on your pages
* Move needless code out of event handlers until after next paint
* Make sure the Rendering update itself is efficient for browser

## Multiple Interactions (and Rage Clicks)

Moving long blocking work around can help -- but it still blocks the page -- affecting future interactions as well as many other page updates, such as (certain) animations.

Ideally, we want to remove Long Tasks completely!

Strategies:

* Remove unnecessary code altogether (especially scripts)
* Optimize code to not be needlessly long-running
* Abort stale work when a new interactions arrive.

## Strategy 1: Debounce

A classic strategy… whenever interactions arrive in quick succession, and the processing or network effects are expensive… delay *starting* work on purpose so you can cancel and restart.

Useful for: autocomplete

* Use `setTimeout` to delay starting expensive work, with a timer-- perhaps 500-1000ms
* save the timerid when you do so
* if a new interaction arrives, `clearTimeout` the previous

<details>
<summary>Answer</summary>

```js
let timer;
button.addEventListener("click", () => {
  score.incrementAndUpdateUI();

  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    blockFor(1000);
  }, 1000);
});
```
</details>

## Strategy 2: Interrupt long running work

Here’s what we want… even if we’re in the middle of work, we want to *pause our busy work* to start handling any new interactions, right away.

Challenge: How can we do that?

There are some apis like `isInputPending`, but I think it's better to split long tasks up into chunks.

First attempt: let's do something simple.  Replace this:

<details>
<summary>Answer</summary>

```js
button.addEventListener("click", () => {
  score.incrementAndUpdateUI();

  requestAnimationFrame(() => {
    setTimeout(() => blockFor(1000), 0);
  });
```
</details>

With this:

<details>
<summary>Answer</summary>

```js
button.addEventListener("click", () => {
  score.incrementAndUpdateUI();

  requestAnimationFrame(() => {
    setTimeout(() => blockFor(100), 0);
    setTimeout(() => blockFor(100), 0);
    setTimeout(() => blockFor(100), 0);
    // ... 10x times total
  });
});
```
</details>

This works by allowing the browser to schedule each task individually, and input can take higher priority!

This strategy works especially well when scheduling entry points -- like if you have a bunch of independant features you need to call at application load time.  Just loading scripts and running everything at script eval time may run everything in a giant long task by default.

However, this strategy doesn't work as well for breaking apart tightly coupled code -- like a for-loop that uses shared state.

## Strategy 2: now with yield()

However, we can leverage modern JS access to `async` and `await` in order to easily add "yield points" to any JS function.

For example:

<details>
<summary>Answer</summary>

```js
import { schedulerDotYield } from "./workshop/utils/schedulerDotYield.js";

async function blockInPiecesYieldy(ms) {
  const ms_per_part = 10;
  const parts = ms / ms_per_part;
  for (let i = 0; i < parts; i++) {
    // Polyfill for scheduler.yield()
    await schedulerDotYield(); 

    blockFor(ms_per_part);
  }
}

button.addEventListener("click", async () => {
  score.incrementAndUpdateUI();
  await blockInPiecesYieldy(1000);
});
```
</details>

## Strategy 2: now with AbortContoller()

That worked... but it scheduled more work with each new interaction.

With Option 1: `debounce()`, we cancelled the previous timeout with each new interaction.  Can we do something similar here?

One easy way is to use an `AbortController()`:

<details>
<summary>Answer</summary>

```js
import { schedulerDotYield } from "./workshop/utils/schedulerDotYield.js";

async function blockInPiecesYieldyAborty(ms, signal) {
  const parts = ms / 10;
  for (let i = 0; i < parts; i++) {
    if (signal.aborted) return;
    
    // Polyfill for scheduler.yield()
    await schedulerDotYield(); 

    blockFor(10);
  }
}

let abortController = new AbortController();

button.addEventListener("click", async () => {
  score.incrementAndUpdateUI();

  abortController.abort();
  abortController = new AbortController();

  await blockInPiecesYieldyAborty(1000, abortController.signal);
});
```
</details>

* Caution: Yielding is good for responsiveness, because it allows scheduling Initial feedback and allows rendering… but doing it too much can affect overall CPU thoughput.  You don't want to yield between every since line of code!

## Conclusion

Breaking up *all* long tasks, allows a site to be responsive to new Interactions.  That let's you provide initial feedabck quickly, and  also lets you make decisions-- such as aborting in-progress work.

Sometimes that means scheduleding entry points as separate Tasks.
Sometimes that means adding "yield" points where convenient.

And, review from earlier lessons:

* Don’t have long running code (long tasks) on your pages
* Move needless code out of event handlers until after next paint
* Make sure the Rendering update itself is efficient for browser

## Next Demo: Taking lessons to ReactJS site

* Repo: [mmocny/inp-workshop-nextjs](https://github.com/mmocny/inp-workshop-nextjs)
