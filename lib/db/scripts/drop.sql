-- Destroys all data.

DROP TRIGGER IF EXISTS afterMealDeleteTrigger ON Meal;
DROP TRIGGER IF EXISTS afterItemUpdateTrigger ON Item;

DROP VIEW IF EXISTS
  MealSummary,
  MealOrderSummary;

DROP TABLE IF EXISTS
  MealOrder,
  MealRequirement,
  MealStep,
  Meal,
  ItemOrder,
  Item,
  AppUser;

DROP FUNCTION IF EXISTS afterMealDelete();
DROP FUNCTION IF EXISTS afterItemUpdate();
DROP FUNCTION IF EXISTS verifyItemOwner(INTEGER);
DROP FUNCTION IF EXISTS uniqMealRequirement(TEXT, TEXT);

DROP TYPE IF EXISTS
  UserType,
  StatusType;