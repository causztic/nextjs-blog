---
layout: post
title: Devise JWT with Sessions Hybrid
date: '2019-09-20'
type: post
published: true
status: publish
categories: []
tags: ["code", "ruby"]
---
So here's the deal: we wanted to create a shared authentication platform with Devise for both API and non-API (vanilla website) usage.
For the API, we needed a jwt implementation, so:

```ruby
gem install devise-jwt
```
Update **devise.rb** for devise-jwt. Basically just follow their README and update accordingly.

```ruby
config.jwt do |jwt|
  jwt.secret = Rails.application.credentials.jwt_key_base
  jwt.expiration_time = 1.hour.to_i
  jwt.request_formats = { user: [:json] }

  jwt.dispatch_requests = [
    ['POST', %r{^/api/v1/auth/sign_in$}]
  ]
  jwt.revocation_requests = [
    ['DELETE', %r{^/api/v1/auth/sign_out$}]
  ]
end
```

Update routes..

```ruby
namespace :api do
  namespace :v1 do
    devise_scope :user do
      post 'auth/sign_in', to: 'sessions#create'
      delete 'auth/sign_out', to: 'sessions#destroy'
    end
  end
end
```


Update **Api::V1::SessionsController**. We needed to return extra information on successful login, so we overrode the **respond_with** method as well.
```ruby
class Api::V1::SessionsController < Devise::SessionsController
  protect_from_forgery prepend: true
  skip_before_action :verify_authenticity_token
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    if resource.email && resource.type
      render json: { data: { email: resource.email, type: resource.type.downcase } }
    else
      head :unauthorized
    end
  end

  def respond_to_on_destroy
    head :ok
  end
end
```


Here comes the ceveat!

[https://github.com/waiting-for-dev/devise-jwt#session-storage-caveat](https://github.com/waiting-for-dev/devise-jwt#session-storage-caveat)

We had to either disable **session_storage** or **database_authenticatable**, which were not very feasible options if we were to also allow session-based logins for the website.

1. Disabling **session_storage** would allow JWT to not persist sessions even when no Authorization headers are passed, but would also remove the probability of sessions altogether.
2. Disabling **database_authenticatable** would make the Users not have a email/password login functionality, which defeats the purpose.</li>

(BTW the code mentioned in [this medium article](https://medium.com/@brentkearney/json-web-token-jwt-and-html-logins-with-devise-and-ruby-on-rails-5-9d5e8195193d) does not actually work if your session happens to persist from the same origin as the author did not disable session_storage.)

After spending a few hours scouring the source code (sparing you the trial-and-error details), I managed to have a hybrid authentication system by monkeypatching Warden's Proxy class:

```ruby
module Warden
  class Proxy
    def user(argument = {})
      ...
      user = request.original_fullpath.starts_with?("/api/v1") ? nil : session_serializer.fetch(scope)
      ...
      end
    end
  end
end
```

Doing this allowed Warden to bypass the session searching for API requests, therefore honoring the Authorization: Bearer tokens,
while also retaining the use of CookieStore for session management on the website!
