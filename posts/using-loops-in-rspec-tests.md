---
title: Using loops in RSpec
date: '2022-07-14'
published: true
tags: ["code", "rspec", "rails"]
summary: "Here are some things to take note when using loops in RSpec to DRY"
---
Using loops in RSpec tests is a great way to DRY test cases, but it can result in false positive tests or curious results when done wrongly.. which is not as nice.

A few days ago, a colleague was extending a feature that had similar functionality across different object types.
As any good engineer would, they took the opportunity to refactor the test cases, demonstrating the shared behaviour in a clear fashion.

```ruby
let(:resource) { "pear" }
subject { do_something_with(resource) }
# some other tests..

context "with a certain scenario" do
  %w[apple pear].each do |resource| # reduced array size for brevity
    it { expect { do_something_with(resource) }.to eq(resource) }
  end
end
```

This seemed to work well, but they realised that there's a `subject` call earlier that could be used. The test case is then edited to be:

```ruby
it { expect { subject }.to eq(resource) }
```

This newly updated test fails for all object types, except for "pear" - which is a curious result!

In order to figure out what is actually going on, we need to look at how RSpec interprets test files.
There are two scopes in RSpec (at least with 3.11), namely:

- **Example Group** (`describe` or `context`) - these are *eagerly evaluated* when the file is loaded.
- **Example** (`it`, `before` etc) - these are evaluated in the context of an *instance* of the **Example Group** class to which the example belongs.

What does this mean for our tests above? As `context` is eagerly evaluated, the example would be like:<a href="#1"><sup>1</sup></a>

```ruby
context "with a certain scenario" do
  it { expect { do_something_with("apple") }.to eq("apple") }
  it { expect { do_something_with("pear") }.to eq("pear") }
end
```

...which runs as expected. Loops in Ruby are evaluated immediately when class definitions (**Example Groups** in our case) are loaded, generating the dynamic methods (**Examples**) along the way.

This is the reason why moving `subject` into the `context` will result in failing tests, as the resultant test suite would look like:

```ruby
let(:resource) { "pear" }
subject { do_something_with(resource) }

context "with a certain scenario" do
  it { expect { subject }.to eq("apple") }
  it { expect { subject }.to eq("pear") }
end
```

...which will evaluate `subject` with "pear" for both test cases!

Moving the loop out of `context` would be a good guess to solve the problem, but let's not forget that the base encapsulation is one huge `Example Group` 😉

With this new understanding, we can finally fix the issue with:

```ruby
%w[apple pear].each do |fruit| # renamed to avoid confusion
  context "with a certain #{fruit}" do # this is a good way to debug
    let(:resource) { fruit } # this is important!

    it { expect { subject }.to eq(resource) }
  end
end
```

Which would look like this on evaluation:

```ruby
context "with a certain apple" do
  let(:resource) { "apple" }

  it { expect { subject }.to eq("apple") }
end

context "with a certain pear" do
  let(:resource) { "pear" }

  it { expect { subject }.to eq("pear") }
end
```

and that is what we want to achieve 😃

<br/>
<sup id="1">1</sup><small>
<a href="https://rspec.info/documentation/3.11/rspec-core/" target="_blank" rel="noreferrer noopener">https://rspec.info/documentation/3.11/rspec-core/</a> has a better code snippet under "A Word on Scope".