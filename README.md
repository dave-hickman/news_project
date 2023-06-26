# News API

## Overview

This app is a concept news website created to test the front and back end skills I have learnt and put them into practice.

Live Version:

[Dave's News](https://daves-news.vercel.app)

You can find my front end repo [here](https://github.com/dave-hickman/news-frontend)

## Features

* Select from a range of news topics.
* Sort articles by date, comment counts or number of votes, both ascending and descending.
* Add or delete comments to articles.
* Upvote or downvote articles.


## Running this project locally


To run this project locally, you will need to fork this repo or fork as follows:
```
git clone https://github.com/dave-hickman/news_project
cd be-nc-news
```

## Setup

You will need to create two .env files to run this project locally: .env.test and .env.development. Into each, add :

```
PGDATABASE=<database_name_here>
```

with the correct database name for that environment (see /db/setup.sql for the database names).

## Dependencies

* Husky
* Jest
* Jest-extended
* Jest-sorted
* Cors
* Dotenv
* Express
* Pg
* Pg-format
* Supertest
