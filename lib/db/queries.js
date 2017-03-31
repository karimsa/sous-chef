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

export const getItemPhotoTag = `
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

/**
 * Meal queries.
 */
export const getNumberOfPagesOfMeals = `
  SELECT
    CEIL((COUNT(*) / ${PAGE_SIZE}.0)) AS pages
  FROM Recipe
`

export const getPageOfMeals = `
  SELECT
    name,
    description,
    category
  FROM Recipe
  LIMIT ${PAGE_SIZE}
  OFFSET ${PAGE_SIZE} * $1::integer
`

export const getMealPhotoTag = `
  SELECT
    etag
  FROM Recipe
  WHERE
    name = $1::text
`

export const getMealPhoto = `
  SELECT
    photo,
    etag
  FROM Recipe
  WHERE
    name = $1::text
`

export const updateMealPhoto = `
  UPDATE Meal
  SET
    photo = $1::text,
    etag = $2::text
  WHERE
    name = $3::text
`

export const updateMeal = `
  UPDATE Meal
  SET
    name         = $2::text,
    description  = $3::text,
    category     = $4::text
  WHERE
    name = $1::text
`