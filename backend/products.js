const pool = require("./db");

const PRODUCT_COLUMNS = `
  id,
  name,
  description,
  price,
  category,
  status,
  image_path,
  created_at,
  updated_at
`;

async function getProducts() {
  const result = await pool.query(`
    SELECT ${PRODUCT_COLUMNS}
    FROM products
    ORDER BY created_at DESC
  `);

  return result.rows;
}

async function getProduct(id) {
  const result = await pool.query(
    `
      SELECT ${PRODUCT_COLUMNS}
      FROM products
      WHERE id = $1
    `,
    [id],
  );

  return result.rows[0] || null;
}

async function createProduct(product) {
  const { name, description, price, category, status, image_path } = product;

  const result = await pool.query(
    `
      INSERT INTO products (
        name,
        description,
        price,
        category,
        status,
        image_path
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING ${PRODUCT_COLUMNS}
    `,
    [name, description, price, category, status, image_path],
  );

  return result.rows[0];
}

async function updateProduct(id, product) {
  const { name, description, price, category, status, image_path } = product;

  const result = await pool.query(
    `
      UPDATE products
      SET
        name = $1,
        description = $2,
        price = $3,
        category = $4,
        status = $5,
        image_path = $6,
        updated_at = NOW()
      WHERE id = $7
      RETURNING ${PRODUCT_COLUMNS}
    `,
    [name, description, price, category, status, image_path, id],
  );

  return result.rows[0] || null;
}

async function deleteProduct(id) {
  const result = await pool.query(
    "DELETE FROM products WHERE id = $1",
    [id],
  );

  return result.rowCount > 0;
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
