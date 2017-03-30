/**
 * lib/db/queries.js - sous-chef
 * 
 * Licensed under Apache 2.0.
 */

/**
 * User queries.
 */
export const findUserByLogin = `
  SELECT *
  FROM AppUser
  WHERE
    email = $1::text AND
    password = $2::text
`

/**
 * Item queries.
 */
const PAGE_SIZE = 8

export const getNumberOfPagesOfItems = `
  SELECT
    CEIL((COUNT(*) / ${PAGE_SIZE}.0)) AS pages
  FROM Item
  WHERE
    owner = $1::integer
`

export const getPageOfItems = `
  SELECT
    name,
    category,
    available,
    threshold,
    amountNew,
    price
  FROM Item
  WHERE
    owner = $1::integer
  LIMIT ${PAGE_SIZE}
  OFFSET ${PAGE_SIZE} * $2::integer
`

export const getPhotoTag = `
  SELECT
    etag
  FROM Item
  WHERE
    owner = $1::integer
      AND
    name = $2::text
`

export const getItemPhoto = `
  SELECT
    photo,
    etag
  FROM Item
  WHERE
    owner = $1::integer
      AND
    name = $2::text
`

export const updateItemPhoto = `
  UPDATE Item
  SET
    photo = $1::text,
    etag = $2::text
  WHERE
    owner = $3::integer
      AND
    name = $4::text
`

export const updateItem = `
  UPDATE Item
  SET
    name      = $3::text,
    category  = $4::text,
    available = $5::numeric(2),
    threshold = $6::numeric(2),
    amountNew = $7::numeric(2),
    price     = $8::numeric(2)
  WHERE
    owner = $1::integer
      AND
    name = $2::text
`