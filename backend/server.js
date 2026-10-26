require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const supabase = require("./supabase");

const pgSession = require("connect-pg-simple")(session);
const pool = require("./db");

const { login } = require("./auth");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("./products");

const app = express();
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  session({
    store: new pgSession({
      pool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

function requireAdmin(req, res, next) {
  if (req.session.isAdmin !== true) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  next();
}

async function deleteImage(imagePath) {
  if (!imagePath || imagePath.startsWith("/")) {
    return;
  }

  const { error } = await supabase.storage
    .from("product-images")
    .remove([imagePath]);

  if (error) {
    console.error("Could not delete image from Supabase:", error);
  }
}

app.get("/api/test", (_req, res) => {
  res.json({
    message: "Backend is working!",
  });
});

app.post("/api/uploads/sign", requireAdmin, async (req, res) => {
  try {
    const { filename, contentType } = req.body;

    const allowedTypes = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
    };

    if (!filename || !allowedTypes[contentType]) {
      return res.status(400).json({
        message: "A valid JPEG, PNG, or WebP image is required",
      });
    }

    const crypto = require("crypto");
    const imagePath = `${crypto.randomUUID()}${allowedTypes[contentType]}`;

    const { data, error } = await supabase.storage
      .from("product-images")
      .createSignedUploadUrl(imagePath);

    if (error) {
      console.error("Supabase upload URL error:", error);

      return res.status(500).json({
        message: "Could not prepare image upload",
      });
    }

    res.json({
      signedUrl: data.signedUrl,
      token: data.token,
      imagePath,
    });
  } catch (error) {
    console.error("Upload signing error:", error);

    res.status(500).json({
      message: "Could not prepare image upload",
    });
  }
});


app.post("/api/auth/login", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const valid = await login(password);

    if (!valid) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    req.session.regenerate((error) => {
      if (error) {
        console.error("Session regeneration error:", error);

        return res.status(500).json({
          message: "Could not log in",
        });
      }

      req.session.isAdmin = true;

      req.session.save((error) => {
        if (error) {
          console.error("Session save error:", error);

          return res.status(500).json({
            message: "Could not log in",
          });
        }

        res.json({
          success: true,
        });
      });
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Could not log in",
    });
  }
});


app.get("/api/auth/me", (req, res) => {
  res.json({
    authenticated: req.session.isAdmin === true,
  });
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        message: "Could not log out",
      });
    }

    res.clearCookie("connect.sid");

    res.json({
      success: true,
    });
  });
});

function validateProduct(product) {
  const { name, price, category, status } = product;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof category !== "string" ||
    !category.trim() ||
    price === undefined ||
    price === "" ||
    !status
  ) {
    return "Name, price, category, and status are required";
  }

  if (!["Available", "Limited", "Unavailable"].includes(status)) {
    return "Invalid product status";
  }

  if (!Number.isFinite(Number(price)) || Number(price) < 0) {
    return "Price must be a valid non-negative number";
  }

  if (
    product.image_path !== null &&
    product.image_path !== undefined &&
    typeof product.image_path !== "string"
  ) {
    return "Invalid image path";
  }

  return null;
}

app.get("/api/products", async (_req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({
      message: "Could not fetch products",
    });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await getProduct(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);

    res.status(500).json({
      message: "Could not fetch product",
    });
  }
});

app.post("/api/products", requireAdmin, async (req, res) => {
  try {
    const error = validateProduct(req.body);

    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    const product = await createProduct({
      ...req.body,
      image_path: req.body.image_path || null,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);

    res.status(500).json({
      message: "Could not create product",
    });
  }
});

app.put("/api/products/:id", requireAdmin, async (req, res) => {
  try {
    const existingProduct = await getProduct(req.params.id);

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const error = validateProduct(req.body);

    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    const imagePath =
      req.body.image_path === undefined
        ? existingProduct.image_path
        : req.body.image_path || null;

    const product = await updateProduct(req.params.id, {
      ...req.body,
      image_path: imagePath,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (
      existingProduct.image_path &&
      existingProduct.image_path !== product.image_path
    ) {
      await deleteImage(existingProduct.image_path);
    }

    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);

    res.status(500).json({
      message: "Could not update product",
    });
  }
});

app.delete("/api/products/:id", requireAdmin, async (req, res) => {
  try {
    const product = await getProduct(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const deleted = await deleteProduct(req.params.id);

    if (!deleted) {
      return res.status(500).json({
        message: "Could not delete product",
      });
    }

    await deleteImage(product.image_path);

    res.json({
      success: true,
    });
  } catch (error) {
    console.error("Error deleting product:", error);

    res.status(500).json({
      message: "Could not delete product",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
