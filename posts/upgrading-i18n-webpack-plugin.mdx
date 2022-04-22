---
title: How I upgraded a Webpack 4 plugin to Webpack 5
date: '2021-10-13'
published: true
tags: ["code", "webpack"]
summary: "Recently, one of our Rails applications wanted an upgrade to Webpack 5, for faster compilation times and to deliver smaller asset bundles."
---
Recently, one of our Rails applications wanted an upgrade to Webpack 5, for faster compilation times and to deliver smaller asset bundles.

We were using a *fairly* [magical but old](https://github.com/chrome/Webpack-rails-i18n-js-plugin) plugin to help us manage localisation. Throughout the lifespan of the application, no one understood how the plugin *really* worked - it was added in a few years back during the days of Webpack 3, patched for Webpack 4 in 2019, and left alone ever since. I took upon the task of upgrading the plugin, and spent some extra time trying to understand how it worked behind the scenes.

## Structure

The plugin structure is fairly straightforward, consisting of:

- **plugin**
  - index.js, which contains compiler hooks
  - loader.js, which reads all locales and injects them into files
- **i18n**
  - index.js, which initialises the locale and translations for [i18n-js](https://github.com/fnando/i18n-js)

## How the plugin works in Webpack 4

Half the battle was discovering how the plugin worked in the first place. Due to my unfamiliarity with Webpack plugins, the order of how the hooks were declared tripped me up pretty bad. The hook that was declared first *actually ran after* the one declared later!

> Even though the hooks can be declared out-of-order, it'll be best if lifecycle hooks were written as if they will be run in-order, as humans read code top-down.

Here's how the plugin actually works:

1. The compiler resolver checks for modules with a module name of `i18n` in the files. Afterwards, it replaces the path to a relative one, targeting `../i18n/index.js`, which is one of the files mentioned earlier. This step basically replaces all references of `i18n` to that specific file. The resultant import looks something like `import i18n from 'directory-of-plugin/i18n/index.js'`.

2. After resolving the modules in the source files, `NormalModuleFactory`'s `after-resolve` is tapped into, checking for matching initial requests of `i18n`, and appending a relative loader of `plugin/loader.js` with the specified options. This means that all `i18n/index.js` imports from the previous step will be preprocessed by `plugin/loader.js`.

3. This is the cool part. When the loader is used in one of the stages in Webpack, it reads all localisation files in a specific folder and merges them into a single object. The raw code of `i18n/index.js` is passed into the loader, and the comment-placeholders of `//OPTIONS//` and `//TRANSLATIONS//` were replaced with options and localisation data respectively.

4. The remaining stages of the Webpack bundling lifecycle happens as per normal. Now we have all localisation data loaded in the bundled script!

## Approach

To ensure that the changes were correct, I had to fix the tests, which weren't runnable in the first place. If the plugin does not have any tests, **write them before upgrading**! Providing a test harness for the current code ensures that the upgrade won't break anything. You can take reference from the repository to have a rough idea on how the plugin is tested.

> The first step to upgrading or refactoring *anything* is to ensure that the current business logic does not change, and that can be achieved by having tests.

After verifying the tests, I upgraded the Webpack version and ran them again, updating the test Webpack configuration along the way.

Naturally, the plugin stopped working after the version upgrade. I identified the LOCs that were affected and spent some time reading through the Webpack documentation and forum posts.

Some of the internal attributes and method calls used that made the plugin work was either removed or moved without mention, as some were deprecated in the previous version.

The hooks were matched and the missing attributes were found quickly with strategic placements of the good ol' `console.log`. The tests were re-run to verify that there were no regressions. You can view the [updated plugin here](https://github.com/causztic/Webpack-rails-i18n-js-plugin).

## Thoughts

Webpack... is powerful and very extensible, and therein lies the difficulty.

It is more or less an open canvas for module bundling; the entire lifecycle can be tapped into at every step, with many variable and extensible components.

I'm not one who'd meddle with Webpack other than simple optimisation and consumer-level plugin usage; this was my first time trying to understand how a Webpack plugin worked, and actually upgrading one. The sheer number of extensible options was overwhelming, but after doing some code discovery, I was able to narrow down the surface to a more manageable one.
