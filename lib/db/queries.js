/**
 * lib/db/queries.js - sous-chef
 * 
 * Licensed under Apache 2.0.
 */

const PAGE_SIZE = 3

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

export const findUserByName = `
  SELECT
    uid
  FROM AppUser
  WHERE
    name = $1::text
`

/**
 * Item queries.
 */
export const getNumberOfPagesOfItems = `
  SELECT
    CEIL((COUNT(*) / ${PAGE_SIZE}.0)) AS pages
  FROM Item
  WHERE
    owner = $1::integer
`

export const getAllItems = `
  SELECT
    name
  FROM Item
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
  FROM MealSummary
`

export const getPageOfMeals = `
  SELECT
    *
  FROM MealSummary
  LIMIT ${PAGE_SIZE}
  OFFSET ${PAGE_SIZE} * $1::integer
`

export const getMealPhotoTag = `
  SELECT
    etag
  FROM Meal
  WHERE
    name = $1::text
`

export const getMealPhoto = `
  SELECT
    photo,
    etag
  FROM Meal
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

export const getSteps = `
  SELECT
    step,
    duration
  FROM MealStep
  WHERE
    MealStep.meal = $1::text
`

export const getIngredients = `
  SELECT
    item,
    quantity
  FROM MealRequirement
  WHERE
    MealRequirement.meal = $1::text
`

export const placeOrder = `
  INSERT INTO
    MealOrder(
      owner,
      meal,
      servings
    )
  VALUES(
    $1::integer,
    $2::text,
    $3::integer
  )
`

export const createMeal = `
  INSERT INTO
    Meal(
      name,
      description,
      category
    )
  VALUES(
    $1::text,
    $2::text,
    $3::text
  )
`

export const createMealStep = `
  INSERT INTO
    MealStep
  VALUES(
    $1::text,
    $3::numeric(10,2),
    $2::text
  )
`

export const createMealRequirement = `
  INSERT INTO
    MealRequirement
  VALUES(
    $1::text,
    $2::text,
    $3::numeric(10,2)
  )
`

/**
 * Orders.
 */
export const getNumberOfPagesOfOrdersOfAdmin = `
  SELECT
    CEIL((COUNT(*) / ${PAGE_SIZE}.0)) AS pages
  FROM MealOrderSummary
  WHERE
    status = 'Pending'
`

export const getPageOfOrdersOfAdmin = `
  SELECT
    *
  FROM MealOrderSummary
  WHERE
    status = 'Pending'
  LIMIT ${PAGE_SIZE}
  OFFSET ${PAGE_SIZE} * $1::integer
`

export const getNumberOfPagesOfOrdersOfChef = `
  SELECT
    CEIL((COUNT(*) / ${PAGE_SIZE}.0)) AS pages
  FROM MealOrderSummary
  WHERE
    status = 'Approved'
`

export const getPageOfOrdersOfChef = `
  SELECT
    *
  FROM MealOrderSummary
  WHERE
    status = 'Approved'
  LIMIT ${PAGE_SIZE}
  OFFSET ${PAGE_SIZE} * $1::integer
`

export const rejectOrder = `
  UPDATE MealOrder
  SET
    status = 'Rejected'
  WHERE
    owner = $1::integer
      AND
    meal = $2::text
`

export const approveOrder = `
  UPDATE MealOrder
  SET
    status = 'Approved'
  WHERE
    owner = $1::integer
      AND
    meal = $2::text
`

export const completeOrder = `
  UPDATE MealOrder
  SET
    status = 'Fulfilled'
  WHERE
    owner = $1::integer
      AND
    meal = $2::text
`