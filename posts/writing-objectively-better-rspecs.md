---
title: Writing Objectively Better RSpecs
date: '2021-05-10'
published: false
tags: ["code", "rspec", "rails"]
---

People write code differently - that is a fact. Guards vs if-else statements function equally well, and using `describe` over `context` in certain specs is mostly a linguistic decision rather than a technical one. However, some techniques and codes work better than others in an objective sense. A yield of faster test suites, lesser potential pitfalls, and tests that lean towards the business are my definition of specs that are "objectively better". So how do we start writing these?

## Write request specs, not controller specs

## No leaky constants

## Using let clauses over instance variables

## Avoid receive_message_chain

## Understanding Be vs Eql vs Eq

## Avoid (:all) hooks

## Avoid freezing time unless you have to


## Friends of RSpec
1. Try `instance_double` first
2. Use `build_stubbed` whenever you can over `build` if you can't use doubles
3. Use `create` when we are testing callbacks* or when we have database queries to test
4. Never use `double`
instance_double, double, create, build, build_stubbed
1. `create`, `build`, `build_stubbed`

## Further Reading
- https://outsidein.dev/about-this-guide.html