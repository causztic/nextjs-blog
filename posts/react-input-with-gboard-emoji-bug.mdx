---
title: Fixing a weird React input bug with Gboard emoji suggestions
date: '2021-08-20'
published: true
tags: ["code", "react"]
thumbnail: { url: "/images/mobile-phone-thumbnail.jpeg", width: 1350, height: 900 }
summary: "In one of our projects, we have a CurrencyField class component that formats user input, by adding commas to separate the thousands for readability."
---
In one of our projects, we have a `CurrencyField` class component that formats user input, by adding commas to separate the thousands for readability i.e. formatting "1000" to "1,000".

Recently, a quality engineer raised a very interesting ticket - while using the app on Android, it will automatically duplicate any input with a pattern of "100n" to "10,0n1,00n".

<figure>
  <video autoplay="true" muted loop>
    <source src="/videos/react-input-with-gboard-emoji-bug.mp4" />
  </video>
  <figcaption>
    <a href="https://github.com/causztic/react-testbed/tree/gboard-autocompletion-bug" rel='nofollow noreferrer noopener' target='_blank'>Sample repo</a>. Notice that there is an extra input as the emoji appears and the next key is pressed.
  </figcaption>
</figure>

## Triage

To isolate the bug's origin, we attempted to replicate this on different mobile phones and browsers. The engineering team was unable to replicate it on our Android devices, and only two people from QA managed to replicate it successfully. It was only after reviewing their screen recordings that I realised a commonality - both had autosuggestions for the 💯 emoji on their keyboard (specifically the Gboard) before the bug triggered.

## Preparation

To isolate the bug, I created a [sample repo](https://github.com/causztic/react-testbed/tree/gboard-autocompletion-bug) with minimum moving parts. I used **edge://inspect/#devices** to debug it on my device - it provides easy port forwarding and allows inspection, which is unavailable on the phone.

## Approach

The most straightforward way to prevent this bug from occurring would be to disable emoji suggestions. While this would be the fastest way to fix this, we cannot expect every user to know and disable this functionality, specifically for our application.

We could have replaced the text input with a numeric one, but vanilla HTML numeric inputs do not support comma separators, which is a UX requirement for our project as we frequently deal with large numbers.

The next thing that came to my mind was, "Oh, I could just set autocomplete and that'll be fixed!". But apparently, the emoji suggestions appear regardless of what `autocomplete` is being set as. It looks like I have to dig into the component lifecycle.

I discovered that `handleChange` was called twice - once on the input of the fourth character, and another when 💯 is attempted to be added. The [SyntheticEvent](https://reactjs.org/docs/events.html) looked the same for both inputs at a glance, but upon closer inspection I noticed that two NativeEvents of different inputTypes were fired simultaneously:

![Screenshot of SyntheticEvent](/images/react-input-with-gboard-emoji-bug.png)

If we could prevent the second event from triggering, it should fix the bug (and it did!):

```js
handleChange(e) {
  if (e.nativeEvent?.inputType === 'insertText' && e.nativeEvent?.data?.length > 1) {
    // insertText *should* only have data length of 1 when typing normally
    // cut uses deleteByCut
    // paste uses InsertFromPaste
    // backspacing uses deleteContentBackward
    return;
  }

  // ... handle setting value accordingly
}
```

After additional testing and going through the InputEvent specs in [W3C](https://www.w3.org/TR/input-events-1/) and [MDN](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/inputType), I concluded that the fix is acceptable for our current userbase.

## Using inputmode for a better fix

After fixing this bug with the snippet above, I discovered the existence of the global attribute [inputmode](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode) (thanks Eileen!). It provides a hint to browsers for devices with onscreen keyboards to decide which keyboard to display, and it is fully supported by major mobile browsers. While there is no support for several browsers on desktop, they'd fallback to the normal onscreen keyboard and that is okay for us.

I updated `render` while also removing the previous `handleChange` catch:

```js
render() {
  const { value } = this.state;

  return (
    <input type="text" inputMode="decimal" onChange={this.handleChange} value={value} />
  )
}
```

Doing this improves the UX on mobile as a numeric keyboard will appear, allows us to maintain the comma separator for readability, while also preventing the Gboard emoji bug from happening with the keyboard change! Talk about killing two birds with one stone :)

## Some unrelated rambling

While sleuthing around to fix this bug, I also managed to refactor the component from a weird mix of uncontrolled and controlled to a fully controlled one. I will be going through this particular exercise in a future article. Thank you for reading!
