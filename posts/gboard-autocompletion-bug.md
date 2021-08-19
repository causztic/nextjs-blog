---
title: Fixing a weird Gboard autocompletion bug on React components
date: '2021-08-20'
published: true
tags: ["code", "react"]
---

In one of our projects, we have a CurrencyField class component that does several things:

- IE compatibility
- onChange, adds in a comma to separate the thousands
- onBlur, fills in missing decimal places

Recently, a quality engineer raised a very interesting issue - while using our CurrencyField component on Android, it will automatically duplicate any input with a pattern of "100n" to "10,0n1,00n".

## Triage

To isolate the bug's origin, we attempted to replicate this on different mobile phones and browsers. The engineering team was unable to replicate it on our Android devices, and only two people from QA managed to replicate it successfully. It was only after reviewing their screen recordings that I realised a commonality - both had autosuggestions for the 💯 emoji on their keyboard (specifically the Gboard) before the bug triggered. 

## Preparation

To isolate the bug, I have created a [sample repo]() with minimum moving parts, and debugged it on my device with [chrome://inspect/#devices](chrome://inspect/#devices) - it provides easy port forwarding and allows inspection, which is unavailable on the phone.

## Approach

The most straightforward way to prevent this bug from occcuring would be to disable emoji suggestions. While this would be the fastest way to fix this, we cannot expect every user to know and disable this functionality, specifically for our application.

We could have replaced the text input with a numeric one, but vanilla html numeric inputs do not support comma separators, which is a UX requirement for our project as we frequently deal with large numbers.

The next thing that came to my mind was "Oh, I could just set autocomplete and that'll be fixed!". But apparently, the emoji suggestions appear regardless of what `autocomplete` is being set as. It looks like I have to dig into the component lifecycle.

I discovered that `handleChange` was called twice - once on the input of the fourth character, and another when 💯 is attempted to be added. The [SyntheticEvent](https://reactjs.org/docs/events.html) looked the same for both inputs, which stumped me. There *has* to be something in the [W3C standards](https://www.w3.org/standards/) that differentiates a manual input and an autocompleted input, right?

(TODO: add SyntheticEvent screenshot)

I dug deeper into the `SyntheticEvent` and examined the `NativeEvent` itself. There were two `NativeEvent`s of different `inputType` that fired simultaenously:

- insertCompositionText with data of `1000`
- insertText with data of `1000`

If we could prevent one of them from triggering, it should fix the bug (and it did!):

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

## Using inputmode for a better fix

After fixing this bug with the snippet above, I discovered the existence of the global attribute [inputmode](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode) (thanks Eileen!). It provides a hint to browsers for devices with onscreen keyboards to decide which keyboard to display, and it looks to be fully supported by major mobile browsers. While there is no support for several browsers on desktop, it fallbacks to the normal on-screen keyboard, which is the status quo for desktop but a UX improvement on mobile.

I updated `render` while also removing the previous `handleChange` catch:

```jsx
render() {
  const { value } = this.state;

  return (
    <input type="text" inputMode="decimal" onChange={this.handleChange} value={value} />
  )
}
```

Doing this improves the UX on mobile as a numeric keyboard will appear, allows us to maintain the comma separator for readability, and also prevents the Gboard emoji bug from happening as the keyboard is not a text one anymore! Talk about killing two birds with one stone :)













