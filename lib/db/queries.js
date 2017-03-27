/**
 * lib/db/queries.js - sous-chef
 * 
 * Licensed under Apache 2.0.
 */

export const findUserByLogin = `
  SELECT *
  FROM AppUser
  WHERE
    email = $1::text AND
    password = $2::text
`