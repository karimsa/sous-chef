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
  name TEXT NOT NULL,
  owner INTEGER NOT NULL CHECK (verifyItemOwner(owner)),
  photo TEXT,
  etag TEXT, -- this is for photo caching reasons
  category TEXT NOT NULL,
  available NUMERIC(10, 2) NOT NULL CHECK (available >= 0),
  threshold NUMERIC(10, 2) NOT NULL CHECK (threshold >= 0),
  amountNew NUMERIC(10, 2) NOT NULL CHECK (amountNew >= threshold),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),

  PRIMARY KEY (name),
  FOREIGN KEY (owner) REFERENCES AppUser
);

CREATE TABLE ItemOrder(
  item TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
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

CREATE TABLE Meal(
  name TEXT UNIQUE NOT NULL,
  photo TEXT,
  etag TEXT, -- this is for photo caching reasons
  description TEXT,
  category TEXT NOT NULL,

  PRIMARY KEY (name)
);

-- START FUNCTION
-- Verify "UNIQUE" constraint on combination
-- of Meal and item to make a Meal requirement
CREATE FUNCTION uniqMealRequirement(givenMeal TEXT, givenItem TEXT)
  RETURNS BOOLEAN AS $$
DECLARE
  rows INTEGER;
BEGIN
  SELECT
    COUNT(*) INTO rows
  FROM MealRequirement
  WHERE
    MealRequirement.meal = givenMeal
      AND
    MealRequirement.item = givenItem;
  
  RETURN rows = 0;
END;
$$ LANGUAGE 'plpgsql';
-- END FUNCTION

CREATE TABLE MealRequirement(
  meal TEXT,
  item TEXT,
  quantity NUMERIC(10,2) NOT NULL CHECK (quantity > 0),

  PRIMARY KEY (meal, item),
  FOREIGN KEY (meal) REFERENCES Meal,
  FOREIGN KEY (item) REFERENCES Item,

  CHECK (uniqMealRequirement(meal, item))
);

CREATE TABLE MealStep(
  meal TEXT,
  duration NUMERIC(10, 1) NOT NULL CHECK (duration > 0),
  step TEXT NOT NULL,

  FOREIGN KEY (meal) REFERENCES Meal
);

CREATE VIEW MealSummary AS
SELECT
  name,
  description,
  category,
  (
    SELECT
      SUM(duration)
    FROM MealStep
    WHERE
      MealStep.meal = name
  ) AS duration,
  (
    SELECT
      COUNT(*)
    FROM MealStep
    WHERE
      MealStep.meal = name
  ) AS steps
FROM Meal;

-- START TRIGGER
-- "ON DELETE CASCADE" to delete all Meal
-- steps associated with a Meal
CREATE FUNCTION afterMealDelete()
  RETURNS trigger AS $$
DECLARE
  nSteps INTEGER;
BEGIN
  DELETE FROM MealStep WHERE Meal = OLD.name;
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER afterMealDeleteTrigger
  AFTER DELETE
ON Meal
  FOR EACH ROW
EXECUTE PROCEDURE afterMealDelete();
-- END TRIGGER

CREATE TYPE StatusType AS ENUM(
  'Pending',
  'Rejected',
  'Approved',
  'Fulfilled'
);

CREATE TABLE MealOrder(
  owner INTEGER,
  meal TEXT,
  status StatusType DEFAULT 'Pending',
  servings INTEGER NOT NULL CHECK (servings > 0),
 
  PRIMARY KEY (owner, meal),
  FOREIGN KEY (owner) REFERENCES AppUser,
  FOREIGN KEY (meal) REFERENCES Meal
);

CREATE VIEW MealOrderSummary AS
SELECT
  (
    SELECT
      name
    FROM AppUser
    WHERE
      AppUser.uid = MealOrder.owner
  ) AS owner,
  meal,
  status,
  servings,
  MealSummary.*
FROM MealOrder
INNER JOIN MealSummary ON MealSummary.name = MealOrder.meal;