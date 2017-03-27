# SousChef

Smart refrigerator system for CSI2132.

## Requirements

 - node v7.x
 - npm v4.x
 - postgresql 9.6.x

### Setup

To install dependencies, run `npm install`.

### Config Files

`keys.json`: an array of "top secret" keys (used for signing cookies).

```json
[
  "top secret"
]
```

`pg.json`: info for connecting to pg server.

```json
{
  "user": "",
  "database": "",
  "password": "",
  "host": "web0.site.uottawa.ca",
  "port": 15432
}
```

## Scripts

 - [Create script](lib/db/scripts/create.sql): creates database.
 - [Drop script](lib/db/scripts/drop.sql): drops everything.
 - [Sample script](lib/db/scripts/sample.sql): some sample data for demos.
 - [Queries](lib/db/queries.js): all queries are saved here in variables.