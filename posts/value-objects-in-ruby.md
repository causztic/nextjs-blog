---
title: Value Objects in Ruby
date: '2022-08-28'
published: true
tags: ["code", "ruby"]
summary: "Value Objects are finally getting first-class representation in Ruby."
---
[Value Objects](https://martinfowler.com/bliki/ValueObject.html) may be coming to [core Ruby soon](https://bugs.ruby-lang.org/issues/16122), so I'd like to share my thoughts and experiences with them.

I think of Value Objects as a kind of higher-level Java data primitive - they are immutable, but they also possess explicit, contextual meaning. They differ from Reference Objects in that their equality is evaluated by *value* and not by *identity*.

```ruby
assert_equal(ValueObject.new(code: 123456), ValueObject.new(code: 123456))
assert_not_equal(RefObject.new(code: 123456), RefObject.new(code: 123456))
```

I'll illustrate the merits of Value Objects with a simple scenario of an API call.

### Value Objects are immutable

When calling an API, the response from the server is *final* and does not change after the connection is terminated. The client assesses the response object and decides what to do with it - it could compare the status code with expected ones, it could raise an error, or it could make subsequent API calls.. but it would make little sense to mutate the response once it is received, for the server response is final.

### Value Objects possess explicit contextual meaning

Unlike primitives however, implementing Value Objects lends to explicit, context-specific validations and sensibilities. If an imaginary REST client returns only returns the `status_code` as an integer, this could be represented as a `Response` Value Object instead:

```ruby
Response = ValueObject.define(status_code:, success?: -> { status_code < 400 })
OK_RESPONSE = Response.new(status_code: 200)
...

# call the API
response = Response.new(status_code: status_code)
response.success?
```

This allows `Response` to define its own validations (i.e. `success?`) and possibly even some logic (e.g. `status_code` cannot be < 200).

## Using Structs as a Value Object-like

A common practice to replicate Value Objects in ruby is to use a `Struct`, but it has its flaws. While a `Struct` is compared by value, it is not immutable, and it interacts in an unexpected way when used with arrays:

```ruby
Response = Struct.new(:status_code)
response = Response.new(status_code: 200)
response.status_code = 100 # Structs are mutable

Array(response) # => [100] instead of [<struct Response status_code=100>]
```

This can lead to subtle bugs if users are using `Struct`s in the context of Value Objects.

## Value Objects in Ruby in the future

Discussions are still ongoing, but at the time of writing, It would look something like:

```ruby
Response = Data.define(:status_code)
```

Looking forward to first-class support for something that is widely used!