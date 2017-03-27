/**
 * lib/db/query.js - sous-chef
 * 
 * Licensed under Apache 2.0.
 */

import pg from 'pg'

const client = new pg.Client(require('../../pg.json'))
const state = {
  connected: false
}

// try connect
client.connect(err => {
  if (err) throw err
  else state.connected = true
})

// await database connection
function ready(fn) {
  if (state.connected) fn()
  else ready(fn)
}

// executes query
export default (query, data) => new Promise((resolve, reject) =>
  ready(() => {
    client.query(query, data, (err, res) => {
      if (err) reject(err)
      else resolve(res.rows)
    })
  })
)