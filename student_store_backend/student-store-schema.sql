CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  password    TEXT NOT NULL,
  username    TEXT NOT NULL UNIQUE,
  name        TEXT,
  email       TEXT NOT NULL UNIQUE CHECK (POSITION('@' IN email) > 1),
  is_admin    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
  id            SERIAL PRIMARY KEY, 
  name          TEXT NOT NULL, 
  category      TEXT NOT NULL, 
  image         TEXT NOT NULL, 
  description   TEXT NOT NULL, 
  price         BIGINT NOT NULL
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE order_details (
  order_id INTEGER NOT NULL, 
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  discount INTEGER,
  PRIMARY KEY(order_id, product_id),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
