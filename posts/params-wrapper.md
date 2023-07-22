---
title: ActionController::ParamsWrapper
date: '2023-07-22'
published: false
tags: ["code", "rails"]
thumbnail: { url: "/images/burrito.jpg", width: 512, height: 640 }
summary: "and a bug"
---

[ActionController::ParamsWrapper](https://edgeapi.rubyonrails.org/classes/ActionController/ParamsWrapper.html) is one of those enabled-by-default components in Rails that might leave some people scratching their heads. "The request payload clearly looks different from what's being received in `params`, what's going on here?"

## What is it?

`ActionController::ParamsWrapper`, by default, essentially wraps the parameter hash from JSON requests into a nested one. It determines the model that's being used in the current controller, but one could provide their own model name as well.

~~~ruby
class Fruit < ApplicationRecord; end
fruit = Fruit.new
fruit.attribute_names # => ['name']

class FruitsController < ApplicationController
    # Determine the wrapper model from the controller here:
    # https://github.com/rails/rails/blob/04c97aec8aa696165e98f46ecec2b13410629be0/actionpack/lib/action_controller/metal/params_wrapper.rb#L160C9-L184
    def create
        params.require(:fruits).permit(:name)
    end
end
~~~

Using `Fruits` as an example (again) - If the client sends a request with `{ name: 'banana' }`, the resultant `params` would be `{ fruit: { name: 'banana' }, name: 'banana' }`.

## A bug

Can you spot it?

~~~ruby
fruit.attribute_names # => ['name']
class FruitsController < ApplicationController
    def create
        Fruit.create(fruit_params)
        Country.create(country: fruit_params[:country])
    end

    private
    def fruit_params
        params.require(:fruit).permit(:name, :country)
    end
end 
~~~