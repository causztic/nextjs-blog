---
title: No ActiveRecord Callbacks
date: '2022-09-27'
published: true
tags: ["code"", "rails"]
summary: "You probably don't need them."
---
In Ruby on Rails, an ActiveRecord callback is a piece of code that is executed during an object's lifecycle, and could be skipped easily. A complete list can be found at the corresponding [official Ruby on Rails page](https://guides.rubyonrails.org/active_record_callbacks.html
).

Callbacks seem to be really useful, so let's put them to use in an imaginary scenario. The company wants an `OrderForm` with multiple `Sections`. During the product meetings it appears that these `Sections` are permanent and will not change at all. It looks pretty straightforward!

```ruby
class OrderForm < ApplicationRecord
  before_create :build_sections

  private
  def build_sections
    build_first_section
    build_second_section
    build_third_section
  end
end
```

A few months later, the Product Owner comes with another request:

"Customers would often update their `OrderForms`, but would like to look at what they have set before making the changes. Could there be `snapshots`?"

This should be a simple-enough request:

```ruby
class OrderForm < ApplicationRecord
  attribute :snapshotting, boolean: false
  before_create :build_sections, unless: :snapshotting
  # rest of the code..
end
```

"There is this old set of orders that we would like to import from our Wordpress. Could you `import` them in?"

Your eyebrow twitched a little, as if sensing some kind of disturbance in the force (or your code complexity):

```ruby
class OrderForm < ApplicationRecord
  before_create :build_sections, unless: -> { snapshotting? || seeding? }
  # rest of the code..
end
```

"Could we allow customers to make a copy of these `OrderForms` so that they could make the same orders?"

"Could we make `OrderForm` only shoot lasers when it is sentient? Could we..?"

Looking at this somewhat-relatable-to-me scenario.. If we could realise what happens in the future and turn back time, we probably wouldn't have gone for callbacks for a few reasons.

1. Engineers need to remember that "nosy" default callbacks may be hiding somewhere
2. There will be workarounds with methods like `skip_build`..
3. .. which will affect how test factories are written
4. .. and would subsequently cause unexpected side-effects
5. Engineers are more than likely to reuse existing patterns, especially when it is widespread
6. Deep-seated callbacks will get tougher to realise and refactor out as the application increases in size.

Before reaching for a default callback, we should determine if it will **always** be called for the **entire future** of the application. And the answer is almost always no - only a Sith deals with absolutes! 

We should realise that using default callbacks is a huge committment, and perhaps reach for other design patterns. The interactor pattern a good alternative.

Say no to ActiveRecord callbacks!
