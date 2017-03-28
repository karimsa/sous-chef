-- Creates initial database.

CREATE TYPE UserType AS ENUM('user', 'chef', 'admin');

CREATE TABLE AppUser(
  uid SERIAL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  type USERTYPE NOT NULL,

  PRIMARY KEY (uid)
);

-- START FUNCTION
-- Verifies that insertion of item is valid.
CREATE FUNCTION verifyItemOwner(owner INTEGER)
  RETURNS BOOLEAN AS $$
DECLARE
  nUsers INTEGER;
BEGIN
  SELECT COUNT(*) INTO nUsers FROM AppUser WHERE uid = owner AND type = 'user';
  RETURN nUsers = 1;
END;
$$ LANGUAGE 'plpgsql';
-- END FUNCTION

CREATE TABLE Item(
  name TEXT UNIQUE NOT NULL,
  owner INTEGER UNIQUE NOT NULL CHECK (verifyItemOwner(owner)),
  category TEXT NOT NULL,
  available NUMERIC(2) NOT NULL CHECK (available >= 0),
  threshold NUMERIC(2) NOT NULL CHECK (threshold >= 0),
  amountNew NUMERIC(2) NOT NULL CHECK (amountNew >= threshold),
  price NUMERIC(2) NOT NULL CHECK (price >= 0),

  PRIMARY KEY (name),
  FOREIGN KEY (owner) REFERENCES AppUser
);

CREATE TABLE ItemOrder(
  item TEXT NOT NULL,
  amount NUMERIC(2) NOT NULL CHECK (amount > 0),
  owner INTEGER UNIQUE NOT NULL,

  FOREIGN KEY (item) REFERENCES Item,
  FOREIGN KEY (owner) REFERENCES AppUser
);

-- START TRIGGER
CREATE FUNCTION afterItemUpdate()
  RETURNS trigger AS $$
BEGIN
  IF NEW.available <= NEW.threshold THEN
    INSERT INTO ItemOrder VALUES(NEW.name, NEW.amountNew, NEW.owner);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER afterItemUpdateTrigger
  AFTER DELETE
ON Item
  FOR EACH ROW
EXECUTE PROCEDURE afterItemUpdate();
-- END TRIGGER

CREATE TABLE Recipe(
  id SERIAL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,

  PRIMARY KEY (id)
);

-- START FUNCTION
-- Verify "UNIQUE" constraint on combination
-- of recipe and item to make a recipe requirement
CREATE FUNCTION uniqRecipeRequirement(recipe INTEGER, item TEXT)
  RETURNS BOOLEAN AS $$
DECLARE
  rows INTEGER;
BEGIN
  SELECT
    COUNT(*) INTO rows
  FROM RecipeRequirement
  WHERE
    recipe = recipe
      AND
    item = item;
  
  RETURN rows = 1;
END;
$$ LANGUAGE 'plpgsql';
-- END FUNCTION

CREATE TABLE RecipeRequirement(
  recipe INTEGER,
  item TEXT,

  PRIMARY KEY (recipe, item),
  FOREIGN KEY (recipe) REFERENCES Recipe,
  FOREIGN KEY (item) REFERENCES Item,

  CHECK (uniqRecipeRequirement(recipe, item))
);

CREATE TABLE RecipeStep(
  recipe INTEGER,
  duration NUMERIC(1) NOT NULL CHECK (duration > 0),
  step TEXT NOT NULL,

  FOREIGN KEY (recipe) REFERENCES Recipe
);

-- START TRIGGER
-- "ON DELETE CASCADE" to delete all recipe
-- steps associated with a recipe
CREATE FUNCTION afterRecipeDelete()
  RETURNS trigger AS $$
DECLARE
  nSteps INTEGER;
BEGIN
  DELETE FROM RecipeStep WHERE recipe = OLD.id;
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER afterRecipeDeleteTrigger
  AFTER DELETE
ON Recipe
  FOR EACH ROW
EXECUTE PROCEDURE afterRecipeDelete();
-- END TRIGGER