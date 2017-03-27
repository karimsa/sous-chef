-- Destroys all data.

DROP TRIGGER afterRecipeDeleteTrigger ON Recipe;
DROP TRIGGER afterItemUpdateTrigger ON Item;

DROP TABLE IF EXISTS RecipeStep;
DROP TABLE IF EXISTS Recipe;
DROP TABLE IF EXISTS ItemOrder;
DROP TABLE IF EXISTS Item;
DROP TABLE IF EXISTS AppUser;

DROP FUNCTION afterRecipeDelete();
DROP FUNCTION afterItemUpdate();
DROP FUNCTION verifyItemOwner(INTEGER);

DROP TYPE IF EXISTS UserType;