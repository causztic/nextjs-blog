---
title: Upgrading a webpack 4 plugin to webpack 5
date: '2021-10-13'
published: true
tags: ["code", "webpack"]
---

Recently, one of our Rails applications wanted an upgrade to Webpack 5, for faster compilation times and to deliver smaller asset bundles. We were using a *fairly* [magical but old](https://github.com/chrome/webpack-rails-i18n-js-plugin) plugin to help us manage localisation. Throughout the lifespan of the application, no one understood how the plugin *really* worked - it was added in a few years back during the days of webpack 3, patched for webpack 4 in 2019, and left alone ever since. I took upon the task of upgrading the plugin, and spent some extra time trying to understand how it worked behind the scenes.

## Structure

The plugin structure is fairly straightfoward, consisting of:

- plugin
  - index.js, which contains compiler hooks
  - loader.js, which reads all locales and injects them into files
- i18n
  - index.js, which initialises the correct locale and translations for the `i18n-js` library

## How the plugin works in Webpack 4

I spent some time reading through the webpack documentation and visualising the code flow.

1. The compiler resolver checks for modules with a module name of `i18n` in the files to be compiled. Afterwards, it replaces the path to a relative one, targetting `../i18n/index.js`, which is one of the files mentioned earlier. This step basically replaces all references of `i18n` to that specific file. The resultant import looks something like `import i18n from 'directory-of-plugin/i18n/index.js'`.

2. After all of the modules in the source files are resolved, the `NormalModuleFactory`'s `after-resolve` is tapped into, checking for matching initial requests of `i18n`, and appending a relative loader of `plugin/loader.js` with the specified options. This means that all `i18n/index.js` imports from the previous step will be preprocessed by `plugin/loader.js`.

3. This is the cool part. When the loader is consumed in one of the many webpack stages, it reads all localisation files in a specific folder and merges them into a single object. The raw code of `i18n/index.js` is passed into the loader and has special comments of `//OPTIONS//` and `//TRANSLATIONS//` replaced with options and localisation data respectively.

4. The remaining stages of the webpack bundling lifecycle happens as per normal. Now we have all localisation data loaded!

## Changes and Challenges

I've learnt that to make the upgrade, I only needed to match the old compiler hooks with the new ones, but for someone who hasn't done any plugin development, this wasn't a straightforward one. The changelog was *massive*! Some of the internal attributes used to make the plugin work was either removed, moved, or modified without mention. 

Perhaps, the plugin should be rewritten to take advantage of the new structure, but i'm not keen on spending too much time on a small plugin with minimal positives.

Changes made were: 

## Conclusion
I'm not one who meddles with webpack configurations that much, so this was my first time trying to understand how a plugin actually worked, and upgrading one.

Webpack... is powerful. 

It is more or less an open canvas for module bundling, with the entire lifecycle exposed for tapping into. That allows generation of derived assets, transpilation,  