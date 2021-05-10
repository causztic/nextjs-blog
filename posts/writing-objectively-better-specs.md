---
title: Writing Objectively Better Specs
date: '2021-05-10'
published: true
tags: ["code", "rspec", "rails"]
---

People write code differently - that is a fact. Using guards over if-else statements, or using `describe` over `context` is more of a linguistic decision than a technical one. However, some techniques and codes work better than others in an objective sense. What is, in my opinion(!), an objectively better test suite?

1. A faster suite, but without making compromises to test integrity
2. Lesser potential pitfalls
3. No flakiness and no dependencies on test order
4. Unit tests should test implementation, while outer tests should test business logic

So how do we start writing objectively better specs?

## Write request specs, not controller specs

There have been [multiple](http://rspec.info/blog/2016/07/rspec-3-5-has-been-released/) [articles](https://medium.com/just-tech/rspec-controller-or-request-specs-d93ef563ef11) shared online about this particular topic. Basically, request specs allow us to test endpoints in a more realistic setting compared to controller specs, as it involves the entire middleware stack and routing.

While there is a minor performance penalty when testing with request specs over controller specs, having your tests stick closer to real-life usage is objectively a better way to test endpoints. It is *much harder* to be writing isolated tests for request specs. This is a good thing! Focusing our efforts on all the probable endpoint states, rather than *how* they are being implemented, allows us to tackle refactoring better in the future without worrying about breaking business logic.

When we are testing outside-facing interactions, focus on the business logic, not the implementation!

## No leaky constants

```ruby
describe SomeTest do
  class Car
    def name
      'potato' # this re-opens the class if it exists in the codebase
    end
  end
end

describe AnotherTest do
  it 'should still have the Car class defined from the other example' do
    expect(Car).to be_a(Class)
  end
end
```

In RSpec, constants, classes and modules are defined in the global namespace when declared in the block scope. This can lead to unexpected results as the classes will persist *across* test examples - test suites should be run in isolation.

## Use let clauses, not instance variables
```ruby
let(:post) { Post.new } # this gets lazily evaluated only when called
let!(:post) { Post.new } # similar to before block instance variables

before do
  # this gets run in every example, which may slow down tests
  @post = Post.new
end

before(:context) do
  # with before(:context), instance variables can leak across examples
  @post = Post.new
end

# this passes even though foo2 is undefined
it { expect(@foo2).to be_nil }
```

While both implementations work similarly, the scenarios listed above give us more reason to use `let` over instance variables, so why not use the former all the time anyway?

This [article](https://tomdebruijn.com/posts/ruby-rspec-instance-variables/) explains succintly about the different cases of instance variables with `before(:context)`, so give that a read if you are curious!

## Don't use receive_message_chain

From [https://relishapp.com/rspec/rspec-mocks/docs/working-with-legacy-code/message-chains](https://relishapp.com/rspec/rspec-mocks/docs/working-with-legacy-code/message-chains):

> Chains can be arbitrarily long, which makes it quite painless to violate the Law of Demeter
in violent ways, so you should consider any use of receive_message_chain a code smell.
Even though not all code smells indicate real problems (think fluent interfaces),
receive_message_chain still results in brittle examples.

Implementation code shouldn't be fixated on a chain of subsequent calls, and it implicitly imposes a certain way of design to the application itself - which shouldn't be the responsibility of the tests.

Furthermore, `receive_message_chain` does not fully validate the calling chain, see:

```ruby
class TestClass
  def abc
    true
  end
end

describe 'receive_message_chain does not test the actual implementation' do
  let(:item) { TestClass.new }

  before do
    allow(item).to receive_message_chain('foo.bar') { 'a' }
  end

  it { expect(item.foo.bar).to eq('a') } # this passes, but boolean does not have bar defined
end
```

This can result in events where the test will not catch issues with new implementations. While it is indeed convenient, developers should not reach for `receive_message_chain` as a crutch to make complicated tests pass, and rather look into refactoring the method itself, or use verifying doubles (`instance_double`) in the test instead.

```ruby
describe 'a better way - using receive, assuming foo returns an object with bar' do
  let(:item) { TestClass.new }

  before do
    allow(item).to receive('abc') { instance_double(ClassWithBar, bar: 'a') }
  end

  it { expect(item.abc.bar).to eq('a') } # this passes, but boolean does not have bar defined
end
```

## Avoid (:all) hooks (a not-so-objective tip)
This brings forth another case against the use of instance variables - objects created in `before(:all)` hooks persist *across* examples, which shouldn't be the way you write tests - each spec should test a certain scenario independently.

```ruby
describe 'before(:all) preserves the changes across examples' do
  before(:all) do
    @user = User.new
  end

  it 'should have a name' do
    @user.name = 'test'
    expect(@user.name).to eq('test')
  end

  it 'persists the value across examples' do
    expect(@user.name).to eq('test') # this test passes
  end
end
```

While `before(:all)` allows potential time saves by setting a common scenario, I find it to be too much of a potential pitfall when writing tests. The base scenario can also feel detached from the actual tests themselves as `before(:all)` is usually set at the start of the test suite - this will be hard to reference if the test suite is large.

## Pick the best instantiation method

There are many ways to instantiate an object in tests - which one should we use? I decide on the type of instantation by going down this list, which is sorted by the number of dependencies and consequently the runtimes.

1. Use `build_stubbed` first.

This does not call the database at all, nor does it trigger any validations itself. `build_stubbed` is perfect for unit tests that depend on the data itself without caring about any sort of database query. Most object interactions can be tested without persistence if they are coded right.

1. Use `build` if associations need to be validated in the database.

The difference between this and `build_stubbed` is that associations in the factory will still be created in the database, and associated objects will be validated. This *could* be good for situations where you are testing a certain model's logic that depends on the associations' database persistence / validation, but I rarely found situations where I would use this over `build_stubbed`.

3. Use `create` when the abovementioned methods don't support your use cases.

This is most prevalent in the more "outer" specs, where database queries are ran for specific states of an object, or when ActiveRecord callbacks<sup>1</sup> are required to be executed.

<sup><sup>1</sup> Callbacks kinda suck for large systems, but this is a story for another time.</sup>