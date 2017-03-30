-- sample data for testing

-- the field "uid" is first, but is not mentioned in the INSERT
-- because it is auto incrementing
INSERT INTO AppUser(name, email, password, type) VALUES
  ('Admin', 'admin@gmail.com', 'test', 'admin'),
  ('Chef', 'chef@gmail.com', 'test', 'chef'),
  ('John Smith', 'user@gmail.com', 'test', 'user');

INSERT INTO Item(name, owner, category, available, threshold, amountNew, price) VALUES
  ('Apples', 3, 'Fruit', 5, 2, 5, 2),
  ('Bananas', 3, 'Fruit', 4, 3, 3, 1),
  ('Kiwi', 3, 'Fruit', 6, 2, 2, 1.5),
  ('Buns', 3, 'Grains', 4, 3, 4, 5),
  ('Burger Patties', 3, 'Meat', 5, 2, 5, 10);

-- the field "id" is first, but is not mentioned in the INSERT
-- because it is auto incrementing
INSERT INTO Recipe(name, description, category) VALUES
  ('Cheese Burger', 'Classic American burger, but with cheese.', 'Fast Food'),
  ('Chicken Souvlaki', 'Slow roasted chicken with garlic and stuff.', 'Greek'),
  ('Beef Souvlaki', 'BBQ lamb beef with garlic and stuff.', 'Greek'),
  ('Tacos', 'Mexican tacos filled with chicken, cheese, lettuce, and stuff.', 'Mexican');