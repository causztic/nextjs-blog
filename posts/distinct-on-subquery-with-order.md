---
title: DISTINCT ON subquery with correct ordering
date: '2020-10-14'
type: post
published: true
status: publish
categories: []
tags: ["code", "rails"]
---
I needed to write an API for **direct_messages#index**, which returns the latest **direct_message** per sender, and it has to be paginated.

The first idea was to approach this with a DISTINCT ON clause, something like:
~~~ruby
DirectMessage.select('DISTINCT ON (sender_id) sender_id', :id, :sender_id, :message, :created_at)
              .where(recipient: current_profile)
              .order(:sender_id, created_at: :desc)
              .page(params[:page])
~~~

While this returns one latest message per sender, the results were not ordered *across* senders based on **created_at**. This meant that I needed to do a second order - this is because Postgres
[requires the leftmost **ORDER** clause](https://www.postgresql.org/docs/9.5/sql-select.html#SQL-DISTINCT) to be the one we are performing **DISTINCT ON** with.


So, I tried something like:

~~~ruby
dms = DirectMessage.select('DISTINCT ON (sender_id) sender_id', :id, :sender_id, :message, :created_at)
                  .where(recipient: current_profile)
                  .order(:sender_id, created_at: :desc)
                  .page(params[:page])

DirectMessage.where(ids: dms.ids).order(created_at: :desc).page(params[:page])
~~~

However, this posed two issues:

* The pagination will not work as intended as the first query will be paginated and then the second result will always be one page (since **dms** will always only have one page's worth of **ids**.
* The queries are executed twice - ideally we should only have one sql execution here. If you were to run **explain** on the second query, you'll see that the ids have already been populated.

To solve this, I used a **FROM** clause to make it a subquery, and paginate on the outer query:

~~~ruby
dms = DirectMessage.select('DISTINCT ON (sender_id) sender_id', :id, :sender_id, :message, :created_at)
                  .where(recipient: current_profile)
                  .order(:sender_id, created_at: :desc)

DirectMessage.select('*')
            .from(dms, :dms)
            .order("dms.created_at DESC")
            .page(params[:page])
~~~

To check that the query is expected, lets run **explain** on it:
~~~ruby
      DirectMessage.select('*')
                  .from(dms, :dms)
                  .order("dms.created_at DESC")
                  .page(params[:page])
                  .explain
~~~

~~~sql
"EXPLAIN for: SELECT * FROM (SELECT DISTINCT ON (sender_id) sender_id, \"direct_messages\".\"id\", \"direct_messages\".\"sender_id\", \"direct_messages\".\"message\", \"direct_messages\".\"created_at\" FROM \"direct_messages\" WHERE \"direct_messages\".\"recipient_id\" = $1 ORDER BY \"direct_messages\".\"sender_id\" ASC, \"direct_messages\".\"created_at\" DESC) dms ORDER BY dms.created_at DESC LIMIT $3 OFFSET $4 [[\"recipient_id\", \"f5a3a717-a81a-48e8-9f10-31c825c52fb9\"], [\"LIMIT\", 10], [\"OFFSET\", 0]]\n" +
"                                                              QUERY PLAN\n" +
"---------------------------------------------------------------------------------------------------------------------------------------\n" +
" Limit  (cost=9.56..9.57 rows=2 width=88)\n" +
"   ->  Sort  (cost=9.56..9.57 rows=2 width=88)\n" +
"         Sort Key: direct_messages.created_at DESC\n" +
"         ->  Unique  (cost=9.52..9.53 rows=2 width=88)\n" +
"               ->  Sort  (cost=9.52..9.53 rows=2 width=88)\n" +
"                     Sort Key: direct_messages.sender_id, direct_messages.created_at DESC\n" +
"                     ->  Bitmap Heap Scan on direct_messages  (cost=4.17..9.51 rows=2 width=88)\n" +
"                           Recheck Cond: (recipient_id = 'f5a3a717-a81a-48e8-9f10-31c825c52fb9'::uuid)\n" +
"                           ->  Bitmap Index Scan on index_direct_messages_on_recipient_id (cost=0.00..4.17 rows=2 width=0)\n" +
"                                 Index Cond: (recipient_id = 'f5a3a717-a81a-48e8-9f10-31c825c52fb9'::uuid)\n" +
"(11 rows)\n"
~~~

This shows that the query will indeed only run once, while also preserving the pagination.

The query return was what I wanted: one latest message per sender, sorted by the messages' created_at.