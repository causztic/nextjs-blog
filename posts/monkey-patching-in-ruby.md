---
title: Monkey Patching in Ruby
date: '2022-10-25'
published: true
thumbnail: { url: "/images/monke.webp", width: 987, height: 1480 }
tags: ["code", "ruby"]
summary: "Sometimes, you'd have to monkey-patch a library to extend it with specific functionality, and there are a few ways to go about doing it in ruby."
---
Sometimes, you'd have to monkey-patch a library to extend it with specific functionality, and there are a few ways to go about doing it in ruby.

The most straightforward way of monkey-patching is to re-open the object definition, and add or update the method directly:

```ruby
class OriginalClass
  def method_to_patch
    some_new_functionality
  end
end
```

I found some success with this while doing live-debugging on a remote environment, but I generally don't recommend this for permanent monkey-patches as there is no access to the original method, and it may get overridden if the load order changes / new re-opening occurs down the load path.

Another way to monkey patch would be via the use of `include`:

```ruby
module MonkeyPatch
  def method_to_patch
  end
end

OriginalClass.include(MonkeyPatch)

# OriginalClass.ancestors => [OriginalClass, MonkeyPatch, Object..]
```

As seen in the ancestry chain, the `MonkeyPatch` appears in between `OriginalClass` and its original superclass `Object`. As `MonkeyPatch` is an ancestor of the `OriginalClass`, it is not possible to monkey-patch an existing method (without some shenanigans). Later `includes` would be called first, so in the unlikely event of having multiple includes overriding the same method, the latest one wins.

```ruby
# OriginalClass.ancestors => [OriginalClass, MonkeyPatch1, MonkeyPatch2, Object..]
# MonkeyPatch2 cannot use "super", and that is a hidden indirection.

# super cannot be used reliably in the event of multiple included modules.
```

The method which I use the most is via `prepend`:

```ruby
module MonkeyPatch
  def method_to_patch
  end
end

OriginalClass.prepend(MonkeyPatch)

# OriginalClass.ancestors => [MonkeyPatch, OriginalClass, Object..]
```

Unlike `include`, `prepend` adds the `MonkeyPatch` _in front_ of the `OriginalClass`, meaning that it acts like an "around" hook. We can call `super` in any patched method with a superclass definition, which is really convenient if we want to still call the original method, but augment the result before returning. We could also define new methods to use. Subsequent `prepend`s, though unlikely, would be able to chain to each other nicely.

```ruby
# OriginalClass.ancestors => [MonkeyPatch1, MonkeyPatch2, OriginalClass, Object..]
# super will work in both MonkeyPatch1 and MonkeyPatch2, regardless of order!
```
