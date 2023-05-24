# INP workshop

A interactive demo and workshop for learning about [Interaction to Next Paint (INP)](https://web.deb/inp)

## Getting started

Clone this repository, or, [open it in a cloud editor such as CloudSandbox](htttps://codesandbox.io/p/github/mmocny/inp-workshop).

Follow the instructions in this Readme

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

## Experiment: Rage Clicks

What happens if you click multiple times, quickly?

This is sometimes called “rage clicking”.

When your site has slow responsiveness, we know from data that it increases rage clicks– and more rage clicks can further degrade responsiveness!

For the few steps, let's not focus on rage clicks.  We’ll come back to these.  For now, let’s focus on fixing the performance of a single discrete interaction.

## Experiment: Update UI first

What happens if you swap the order of js calls -- updateUI() first, then block()?

Did you notice the UI appear earlier?  Does the order affect INP scores?

<details>
<summary>Answer</summary>

```js
button.addEventListener("click", () => {
  score.incrementAndUpdateUI();
  blockFor(1000);
});
```
</details>

## Experiment: Separate handlers

What if you move the work to a separate Event Handler?  Update the UI in one Event Handler, and block the page from a separate handler.

<details>
<summary>Answer</summary>

```js
button.addEventListener("click", () => {
  score.incrementAndUpdateUI();
});
  
button.addEventListener("click", () => {
  blockFor(1000);
});
```
</details>

## Experiment: Different event types

What if we change the event types for the Event Handlers?  For example, replace one of the `click` event handlers with `pointerup` or `mouseup`?

Most interactions will fire many types of events, from pointer or key events, to hover, focus/blur, and synthetic events like beforechange and beforeinput.

Many real pages have handlers for many different events.

<details>
<summary>Answer</summary>

```js
button.addEventListener("click", () => {
  score.incrementAndUpdateUI();
});

button.addEventListener("pointerup", () => {
  blockFor(1000);
});
```

</details>

## Experiment: Bubble/Capture phases

What if about bubbles and captures phases of event handlers? You can add the option `{ capture: true }` to `addEventListener`.

<details>
<summary>Answer</summary>

```js
button.addEventListener("click", () => {
  score.incrementAndUpdateUI();
}, { capture: true });

button.addEventListener("click", () => {
  blockFor(1000);
}, { capture: false });
```
</details>

## Conclusion 1

*Any* code running in *any* event handlers will delay the interaction.

* That includes handlers registered from different scripts...
* Not only your own code, but also all third party scripts.  It's common!

## Experiment: No UI update?

What if we remove the call to update UI from the event handler?

* Score does not update -- but the page still does!
* Animations, CSS effects, default web component actions (form input), text entry, text highlightling...

## Experiment: Input Delay

What about long running code outside of Event Handlers?

For example, if you had a late-loading `<script>` that randomly blocked the page during load.

Or, an api, such as `setInterval`, that periodically blocks the page?

<details>
<summary>Answer</summary>

```js
setInterval(() => {
  blockFor(1000);
});


button.addEventListener("click", () => {
  score.incrementAndUpdateUI();
});
```
</details>

These long-running periods are often called Long Tasks.

Notice, it doesn’t *always* affect my interactions!  If I’m not clicking when the task is running, I may get lucky.  Such "random" sneezes can be a nightmare to debug when they only sometimes cause issues.

One way to track these down is through measuring Long Tasks (or Long Animation Frames), and Total Blocking Time, as well as just interactions.

## Experiment: What about non-visual updates?

Try to add a `console.log` to your event handler.  Does it show in console, or is it delayed just like Next Paint?  Does it matter if it is called before or after the call to `blockFor`?

<details>
<summary>Answer</summary>

```js
button.addEventListener("click", () => {
  score.incrementAndUpdateUI();
  console.log("Hello!");
  blockFor(1000);
});
```
</details>

INP measures delays in visual updates (paint) after interactions... but not everything is visual.

Console logs, network requests, local storage… these don’t have to wait for browser rendering, and INP does not measure them -- unless they *also* affect next paint.

The web has a simple, but unique system for task scheduling and rendering.

* [Interaction diagram](https://web-dev.imgix.net/image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/Ng0j5yaGYZX9Bm3VQ70c.svg).
* [web.dev/inp](https://web.dev/inp)
* [web.dev/optimize-inp](https://web.dev/optimize-inp)

## Discuss: Presentation Delays

So far, we’ve looked at the performance of JavaScript, via input delay or event handlers directly, but what else affects rendering Next Paint?

Well, updating the page with expensive effects!

Even if the page update comes quickly, the browser may still have to work hard to render them!

* On the main thread:
  * UI frameworks that need to render updates after state changes
  * DOM changes, or toggling many expensive CSS query selectors can trigger lots of Style, Layout, Paint.
* Off the main thread:
  * Using CSS to power GPU effects
  * Adding very large high-resolution images
  * Using SVG/Canvas to draw complex scenes

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
  })
});
```
</details>

## Look at Tooling

On this page, responsiveness is super visual, with the scores and timers and the counter UI... but when testing the average page its more subtle.

Also, when interactions do run long, its not always clear what the culprit is.  Is it:

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

## Experiment: Async effects

Since you can start non-visual effects inside interactions, such as making network requests, starting timers, or just updating global state… What happens when those *eventually* update the page?

Let's wrap the contents of our event handler with a `setTimeout`.

What if it does/doesn't call updates UI?
What if it does/doesn't blockFor?

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

## If you cannot remove it, at least move it

Let's change to update the UI from the click handler, but run the blocking work from the timeout.

But, can we do better than a 1000ms timeout?

We likely still want the code to run as quickly as possible... otherwise we should have just removed it!

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

If you get stuck – you can read [web.dev/optimize-inp/#optimize-interactions](web.dev/optimize-inp/#optimize-interactions)

What worked, what did not?

* Trick: `requestAnimationFrame` + `setTimeout`
  * simple polyfill for `requestPostAnimationFrame`

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

## Conclusion

Breaking up *all* long tasks, allows a site to be responsive to new Interactions.  That let's you provide initial feedabck quickly, and lets you make decisions-- such as aborting in-progress work, such as expensive computations or network requests.

Caution: Yielding is good for responsiveness, because it allows scheduling Initial feedback and allows rendering… but doing it too much can affect overall CPU thoughput.  You don't want to yield between every since line of code!

## Next Demo: Taking lessons to ReactJS site

* Repo: [mmocny/inp-codesandbox-nextjs](https://github.com/mmocny/inp-codesandbox-nextjs)
* [CodeSandbox](https://codesandbox.io/p/github/mmocny/inp-codesandbox-nextjs)