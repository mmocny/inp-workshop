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

## Try it out!

Try to interact with the `Increment` button and watch the score increase.

INP measures the time it takes-- from the moment the user interacts, until the page actually shows the rendered update to the user.

## Long running Event Handlers

Open the `index.js` file, and comment out the `blockFor` function inside the event handler.

```
button.addEventListener("click", () => {
  //blockFor(1000);
  score.incrementAndUpdateUI();
```

Try interacting with the page again.

## Next

[Check Answer](./answers/all.js)