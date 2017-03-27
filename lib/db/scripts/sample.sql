-- sample data for testing

INSERT INTO AppUser(name, email, password, type) VALUES
  ('Admin', 'admin@gmail.com', 'test', 'admin'),
  ('Chef', 'chef@gmail.com', 'test', 'chef'),
  ('John Smith', 'user@gmail.com', 'test', 'user');

INSERT INTO Item VALUES
  ('Apples', 3, 'Fruit', 5, 2, 5, 2);

INSERT INTO Recipe(name, description, category) VALUES
  ('Cheese Burger', 'Classic American burger, but with cheese.', 'Fast Food'),
  ('Chicken Souvlaki', 'Slow roasted chicken with garlic and stuff.', 'Greek'),
  ('Beef Souvlaki', 'BBQ lamb beef with garlic and stuff.', 'Greek'),
  ('Tacos', 'Mexican tacos filled with chicken, cheese, lettuce, and stuff.', 'Mexican');