Job hunting tool
================

This project uses data from Google Place Search to collect information about software companies in a particular locality, for job hunting. You can mark a company as interesting, not interesting, or irrelevant (i.e., a search miss - not a software company).

It runs against a local mongodb instance. Create a collection called `jobs`:

    $ mongo
    > db.createCollection('jobs')

Collect some source data using fetch.js with your coordinates (this is a manual process for now):

    node fetch.js 52.406817,-1.519718 > jobs.json

Then import into MongoDB:

    mongoimport --db test --jsonArray --collection jobs --file jobs.json

You can import as much data as you like (from different coordinates), and it should merge with no duplicates.

Start the server:

    node server.js

Then browse to [http://localhost:8080](http://localhost:8080).
