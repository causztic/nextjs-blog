---
title: New Design with Next.js - from development to deployment
date: '2021-05-02'
type: post
published: true
status: publish
categories: []
tags: ["code", "nextjs", "tailwindcss"]
---
It's high time for a blog update so I spent the weekend fiddling around with several new technologies..
I couldn't get the Aleph.js demo application to work the latest Deno version, and since it is not production-ready yet, I decided to go ahead and experiment with [Next.js](https://nextjs.org).

So here's an article about my experience with deploying my first, simple Next.js application. That being said, I feel like I need to preface this with the acknowledgement that it's a *simple* application - there are probably shortfalls or difficulties I could not discover within a day of experimentation.

Also, I haven't really written a casual "technical-review-ish" article like this one before, and I'll greatly appreciate any feedback via [LinkedIn](https://www.linkedin.com/in/limyaojie/)! (no comment section yet.. I'll build one during the next free weekend, I promise)

&nbsp;

**TL;DR** It feels intuitive, fun to use, but with some *minor* kinks along the way.

&nbsp;

**So what is Next.js?** It is a React framework. It manages code-splitting, static rendering, HMR and many more out of the box - which meant that I could start implementing the components right off the bat with minimum hassle.

## Development

I started development work by following their [official tutorial](https://nextjs.org/learn/basics/create-nextjs-app) for building a blog application, adding in typescript, tailwindcss and sass along the way.

## What I like
It's clean. Like `create-react-app` before ejection, I only see things that matters in the grand scheme of things.

What's cool is that with the latest version, Next.js provides an [Image component](https://nextjs.org/docs/basic-features/image-optimization) that handles image optimisation and lazy-loading automatically. This was used with the profile picture and social media links you see on the top and on the bottom of this page, respectively.

The next feature I really liked was the intrinsic routing syntax for files - it allows a great at-a-glance look at how the routing is structured in the project without consulting a routing file; I can easily understand that `[id].tsx` under the `posts` folder will be the component for individual posts.
## What I didn't really like

The first hurdle I hit was with the pages getting [stuck in loading](https://github.com/vercel/next.js/issues/10061) after an indeterminate amount of time, which forced me to manually refresh the process every minute or so, until I got frustrated enough to seek help from the forums.

Another issue I had with Next.js was with their Link component, particularly [this behaviour](https://github.com/vercel/next.js/issues/7915). Basically, for every custom component you had to put as a Link child, you need to manually wrap with something like:
```javascript
const CustomComponent = React.forwardRef((props, ref) => (
  <a ref={ref} {...props}>
    Click
  </a>
))
```
which I thought would be better built in to the component itself.

## Deployment and Hosting

Deployment was generally a breeze with [Vercel](https://vercel.com/), which provides first-class support to Next.js (naturally!). They have a free hobby plan with a single deployment track, which is great for small projects like this one. The only issue I faced was that the initial deployment queued for an hour before it actually ran, even though I had no prior deployments.

Vercel also provides preview links for builds that are non-production, which is great for testing builds before they go live.

You could also use other options to host Nextjs as well, and if your project allows it, Nextjs also has an `export` function which generates all pages beforehand, allowing it to be served statically on something like Amazon S3.

## Final thoughts

It feels great to use Next.js,especially after spending so much time on previous projects trudging through webpack documentation, writing routes, or finding basic components that feel right. Oh, and the code for this application can be found at [https://github.com/causztic/nextjs-blog](https://github.com/causztic/nextjs-blog)!
