---
title: Ruby on Rails Gotcha - Object#with_options
date: '2022-03-30'
published: true
tags: ["code", "rails"]
thumbnail: ["/images/computer-thumbnail.jpg", 1350, 900]
---

OK so quick context: there was data required to be copied over from a different source. Empty fields were to be handled due to the legacy nature of the data, so we needed to skip the presence check of some fields while saving them in this business flow.

The existing (obfuscated) piece of validation looks like this:

~~~ruby
# there is one mistake here, can you spot it?

with_options unless: -> { some_scenario } do
  validates :nickname, presence: true, if: :nickname_required?
  validates :real_name, presence: true, unless: :nickname_required?
end
~~~

`Object#with_options` is an elegant method that accepts a block, and factors out duplicate options passed to a series of other method calls. This is great for grouping methods under similar business rules, without repeating the same options everywhere.

In my head, it read to me like:
1.  Unless `some_scenario`,
2. `nickname` is validated if nickname is required, and
3. `real_name` is validated if nickname is *not* required.

I wrote several behavioural tests for the migration scenario, and then subsequently extended `some_scenario`, giving it a more generic name in the process. During the code review, a colleague graciously pointed out the double negatives in my new code, so I promptly changed it:

~~~ruby
with_options if: -> { require_presence_validation } do
  validates :nickname, presence: true, if: :nickname_required?
  validates :real_name, presence: true, unless: :nickname_required?
end

def require_presence_validation
  normal_case || copying_from_legacy_data
end
~~~

It was at this point the tests started failing. I checked the state machine, verified my tests, and ran through the stack trace. *Surely*, it can't be due to the change from `unless` to `if`.. right? I thought I had a sound grasp on logic gates!

After an hour, I finally found out the cause of this seemingly weird interaction (and rescuing me from an existential crisis) - it turns out that for `with_options`,

<figure>
  <img src="/images/with-options-screenshot.png" />
<figcaption>
  <a href="https://www.rubydoc.info/docs/rails/Object:with_options">https://www.rubydoc.info/docs/rails/Object:with_options</a>
</figcaption>
</figure>

In hindsight, this made a lot of sense - the options are merely passed down into method calls in the block *as defaults*, and children would override the defaults if any equivalent option was given. This realisation also revealed a bug in the previous implementation, where `some_scenario = true` and `nickname_required? = true` would not have the intended effect due to how options were overridden.

I promptly added regression tests for the past scenario, and refactored the block to work for all cases.

<br />

# TL;DR
<br />

1. `Object#with_options` is great, but be aware of overriding clauses.
2.  Wherever possible, ensure that unit tests are written to cover *all* plausible permutations, pertaining to the appropriate business cases (look, an alliteration!)
3. When in doubt, RTFM!