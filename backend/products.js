const db = require("./db");

function getProducts() {
  return db
    .prepare(
      `
      SELECT
        id,
        name,
        description,
        price,
        category,
        status,
        image_path,
        created_at,
        updated_at
      FROM products
      ORDER BY created_at DESC
    `,
    )
    .all();
}

function getProduct(id) {
  return db
    .prepare(
      `
      SELECT
        id,
        name,
        description,
        price,
        category,
        status,
        image_path,
        created_at,
        updated_at
      FROM products
      WHERE id = ?
    `,
    )
    .get(id);
}

function createProduct(product) {
  const { name, description, price, category, status, image_path } = product;

  const result = db
    .prepare(
      `
      INSERT INTO products (
        name,
        description,
        price,
        category,
        status,
        image_path
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    )
    .run(name, description, price, category, status, image_path);

  return getProduct(result.lastInsertRowid);
}

function updateProduct(id, product) {
  const { name, description, price, category, status, image_path } = product;

  const result = db
    .prepare(
      `
      UPDATE products
      SET
        name = ?,
        description = ?,
        price = ?,
        category = ?,
        status = ?,
        image_path = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    )
    .run(
      name,
      description,
      price,
      category,
      status,
      image_path,
      id,
    );

  if (result.changes === 0) {
    return null;
  }

  return getProduct(id);
}

function deleteProduct(id) {
  const result = db
    .prepare("DELETE FROM products WHERE id = ?")
    .run(id);

  return result.changes > 0;
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};