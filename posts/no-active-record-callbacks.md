---
title: No ActiveRecord Callbacks
date: '2022-09-27'
published: true
tags: ["code", "rails"]
thumbnail: { url: "/images/computer-thumbnail.jpg", width: 1350, height: 900 }
summary: "You probably don't need them."
---
In Ruby on Rails, an ActiveRecord callback is a piece of code that is executed during an object's lifecycle, and could be skipped easily. A complete list can be found at the corresponding [official Ruby on Rails page](https://guides.rubyonrails.org/active_record_callbacks.html
).

Callbacks seem to be really useful, so let's put them to use in an imaginary scenario. The company wants an `OrderForm` with multiple `Sections`. In the last product meeting it appears that these `Sections` are permanent and will not change at all. It looks pretty straightforward!

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
  before_create :build_sections, unless: -> { snapshotting? || importing? }
  # rest of the code..
end
```

"Could we allow customers to make a copy of these `OrderForms` so that they could make the same orders?"

"Could we make `OrderForm` only shoot lasers when it is sentient? Could we..?"
<br/><br/><br/>
Looking at this somewhat-relatable-to-me scenario.. If we could realise what happens in the future and turn back time, we probably wouldn't have gone for callbacks for a few good reasons.

1. Engineers need to remember that "nosy" default callbacks may be hiding somewhere.
2. There will be workarounds with methods like `skip_build`,
3. which will affect how test factories are written,
4. and would subsequently cause unexpected side-effects.
5. Deep-seated callbacks will get tougher to realise and refactor out as the application increases in size. It will easily blow out of proportion if we had models that had callbacks, which could call other model callbacks.
6. And finally, engineers would often reach out for patterns that are already existing in the system, making the issue in point 5. much harder to resolve.

Before reaching for a default callback, we should determine if it will **always** be called for the **entire future** of the application. And the answer is almost always no - only a Sith deals in absolutes! 

We should realise that using default callbacks is a huge committment, and perhaps reach for other design patterns. The interactor pattern is a good alternative.

Say no to ActiveRecord callbacks!
