/**
 * lib/db/index.js - sous-chef
 * 
 * Licensed under Apache 2.0.
 */

import sql from 'sql'

export const User = sql.define({
  name: 'User',
  columns: [
    'uid',
    'name',
    'email',
    'password',
    'type'
  ]
})